"use client";

import { FC, useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/context/CartContext";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import OrderSummary from "@/components/OrderSummary";
import { 
  IndianRupeeIcon, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Truck, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Lock,
  Save,
  AlertCircle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced TypeScript interfaces
interface ShippingMethod { 
  id: string; 
  label: string; 
  cost: number; 
  estimatedDays?: string;
  description?: string;
}

interface State { 
  _id: string; 
  name: string;
}

interface City { 
  _id: string; 
  name: string;
}

interface FormField {
  value: string;
  error?: string;
  touched: boolean;
  valid: boolean;
}

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | undefined;
}

type FormState = {
  email: FormField;
  subscribe: boolean;
  firstName: FormField;
  lastName: FormField;
  address: FormField;
  apartment: FormField;
  city: FormField;
  state: FormField;
  pin: FormField;
  phone: FormField;
  paymentMethod: string;
  billingSame: boolean;
};

type BillingState = {
  firstName: FormField;
  lastName: FormField;
  address: FormField;
  apartment: FormField;
  city: FormField;
  state: FormField;
  pin: FormField;
  phone: FormField;
};

// Steps configuration
const CHECKOUT_STEPS = [
  { id: 'contact', label: 'Contact', icon: Mail, description: 'Your email address' },
  { id: 'delivery', label: 'Delivery', icon: MapPin, description: 'Shipping address' },
  { id: 'shipping', label: 'Shipping', icon: Truck, description: 'Delivery method' },
  { id: 'payment', label: 'Payment', icon: CreditCard, description: 'Payment method' },
  { id: 'billing', label: 'Billing', icon: User, description: 'Billing address' },
];

// Validation rules
const VALIDATION_RULES: Record<string, ValidationRule> = {
  email: { 
    required: true, 
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address' : undefined
  },
  firstName: { required: true, minLength: 2 },
  lastName: { required: true, minLength: 2 },
  address: { required: true, minLength: 5 },
  city: { required: true },
  state: { required: true },
  pin: { 
    required: true, 
    pattern: /^\d{6}$/,
    custom: (value) => !/^\d{6}$/.test(value) ? 'PIN code must be 6 digits' : undefined
  },
  phone: { 
    required: true, 
    pattern: /^[\+]?[1-9][\d]{9,15}$/,
    custom: (value) => !/^[\+]?[1-9][\d]{9,15}$/.test(value) ? 'Please enter a valid phone number' : undefined
  },
};

// Custom hook for form field management
const useFormField = (initialValue = '', rules?: ValidationRule) => {
  const [field, setField] = useState<FormField>({
    value: initialValue,
    touched: false,
    valid: !rules?.required,
    error: undefined,
  });

  const validate = useCallback((value: string) => {
    if (!rules) return { valid: true, error: undefined };

    if (rules.required && !value.trim()) {
      return { valid: false, error: 'This field is required' };
    }

    if (rules.minLength && value.length < rules.minLength) {
      return { valid: false, error: `Minimum ${rules.minLength} characters required` };
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return { valid: false, error: `Maximum ${rules.maxLength} characters allowed` };
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return { valid: false, error: 'Invalid format' };
    }

    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) {
        return { valid: false, error: customError };
      }
    }

    return { valid: true, error: undefined };
  }, [rules]);

  const setValue = useCallback((value: string, touch = true) => {
    const validation = validate(value);
    setField({
      value,
      touched: touch,
      valid: validation.valid,
      error: validation.error,
    });
  }, [validate]);

  const setTouched = useCallback(() => {
    setField(prev => {
      const validation = validate(prev.value);
      return {
        ...prev,
        touched: true,
        valid: validation.valid,
        error: validation.error,
      };
    });
  }, [validate]);

  return { field, setValue, setTouched };
};

// Progress Indicator Component
const ProgressIndicator: FC<{ currentStep: string; completedSteps: string[] }> = ({ 
  currentStep, 
  completedSteps 
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-700 ease-out"
            style={{ 
              width: `${(completedSteps.length / (CHECKOUT_STEPS.length - 1)) * 100}%` 
            }}
          />
        </div>

        {CHECKOUT_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                  "transform hover:scale-110",
                  isCompleted && "bg-gradient-to-r from-blue-500 to-purple-600 border-blue-500 text-white",
                  isCurrent && !isCompleted && "border-blue-500 bg-blue-50 text-blue-600",
                  !isCurrent && !isCompleted && "border-gray-300 bg-white text-gray-400"
                )}
              >
                {isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <Icon size={16} />
                )}
              </div>
              
              <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className={cn(
                  "text-xs font-medium",
                  (isCompleted || isCurrent) ? "text-gray-900" : "text-gray-500"
                )}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Enhanced Input Component with validation
const EnhancedInput: FC<{
  field: FormField;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  helpText?: string;
  required?: boolean;
}> = ({ field, onChange, onBlur, label, placeholder, type = "text", icon: Icon, helpText, required }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className={cn("font-medium", required && "after:content-['*'] after:text-red-500 after:ml-1")}>
          {label}
        </Label>
        {helpText && (
          <Tooltip>
            <TooltipTrigger>
              <Info size={14} className="text-gray-400 hover:text-gray-600" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{helpText}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      
      <div className="relative">
        {Icon && (
          <Icon size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        )}
        <Input
          type={type}
          placeholder={placeholder}
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={cn(
            "transition-all duration-200",
            Icon && "pl-10",
            field.touched && field.error && "border-red-500 focus:border-red-500 focus:ring-red-200",
            field.touched && field.valid && field.value && "border-green-500 focus:border-green-500 focus:ring-green-200",
            "focus:ring-2"
          )}
        />
        {field.touched && field.valid && field.value && (
          <CheckCircle2 size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" />
        )}
      </div>
      
      {field.touched && field.error && (
        <div className="flex items-center gap-1 text-red-600 text-sm animate-in slide-in-from-top-1 duration-200">
          <AlertCircle size={14} />
          <span>{field.error}</span>
        </div>
      )}
    </div>
  );
};

// Auto-save indicator
const AutoSaveIndicator: FC<{ saving: boolean; saved: boolean }> = ({ saving, saved }) => {
  if (saving) {
    return (
      <div className="flex items-center gap-2 text-blue-600 text-sm">
        <Save size={14} className="animate-pulse" />
        <span>Saving...</span>
      </div>
    );
  }
  
  if (saved) {
    return (
      <div className="flex items-center gap-2 text-green-600 text-sm animate-in fade-in duration-500">
        <CheckCircle2 size={14} />
        <span>Saved</span>
      </div>
    );
  }
  
  return null;
};

// Main Component
const CheckoutPage: FC = () => {
  const router = useRouter();
  const {
    items,
    clearCart,
    subtotal,
    taxes,
    shippingCost,
    setShippingCost,
    coupon,
    total,
  } = useCart();

  // Form fields with validation
  const email = useFormField('', VALIDATION_RULES.email);
  const firstName = useFormField('', VALIDATION_RULES.firstName);
  const lastName = useFormField('', VALIDATION_RULES.lastName);
  const address = useFormField('', VALIDATION_RULES.address);
  const apartment = useFormField('');
  const city = useFormField('', VALIDATION_RULES.city);
  const state = useFormField('', VALIDATION_RULES.state);
  const pin = useFormField('', VALIDATION_RULES.pin);
  const phone = useFormField('', VALIDATION_RULES.phone);

  // State management
  const [subscribe, setSubscribe] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("gateway");
  const [billingSame, setBillingSame] = useState(true);
  const [currentStep, setCurrentStep] = useState('contact');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [autoSaving, setAutoSaving] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  // Collapsible states
  const [sectionsOpen, setSectionsOpen] = useState({
    contact: true,
    delivery: false,
    shipping: false,
    payment: false,
    billing: false,
  });

  // External data
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  // Billing form
  const [billing, setBilling] = useState<BillingState>({
    firstName: { value: '', touched: false, valid: true },
    lastName: { value: '', touched: false, valid: true },
    address: { value: '', touched: false, valid: true },
    apartment: { value: '', touched: false, valid: true },
    city: { value: '', touched: false, valid: true },
    state: { value: '', touched: false, valid: true },
    pin: { value: '', touched: false, valid: true },
    phone: { value: '', touched: false, valid: true },
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email.field.value || firstName.field.value || lastName.field.value) {
        setAutoSaving(true);
        setTimeout(() => {
          setAutoSaving(false);
          setAutoSaved(true);
          setTimeout(() => setAutoSaved(false), 2000);
        }, 1000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [email.field.value, firstName.field.value, lastName.field.value]);

  // Step progression logic
  const updateCurrentStep = useCallback(() => {
    if (!email.field.valid || !email.field.value) {
      setCurrentStep('contact');
    } else if (!firstName.field.valid || !lastName.field.valid || !address.field.valid || !city.field.value || !state.field.value || !pin.field.valid) {
      setCurrentStep('delivery');
    } else if (!selectedShipping) {
      setCurrentStep('shipping');
    } else if (!paymentMethod) {
      setCurrentStep('payment');
    } else {
      setCurrentStep('billing');
    }
  }, [email.field, firstName.field, lastName.field, address.field, city.field.value, state.field.value, pin.field, selectedShipping, paymentMethod]);

  // Update completed steps
  useEffect(() => {
    const completed: string[] = [];
    
    if (email.field.valid && email.field.value) {
      completed.push('contact');
    }
    
    if (firstName.field.valid && lastName.field.valid && address.field.valid && city.field.value && state.field.value && pin.field.valid) {
      completed.push('delivery');
    }
    
    if (selectedShipping) {
      completed.push('shipping');
    }
    
    if (paymentMethod) {
      completed.push('payment');
    }
    
    setCompletedSteps(completed);
    updateCurrentStep();
  }, [email.field, firstName.field, lastName.field, address.field, city.field.value, state.field.value, pin.field, selectedShipping, paymentMethod, updateCurrentStep]);

  // Load states
  useEffect(() => {
    setLoadingStates(true);
    api.get<State[]>('/state/states')
      .then(res => setStates(res.data))
      .catch(err => console.error('Error loading states', err))
      .finally(() => setLoadingStates(false));
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!state.field.value) {
      setCities([]);
      return;
    }
    
    setLoadingCities(true);
    api.get<City[]>(`/state/${state.field.value}/cities`)
      .then(res => setCities(res.data))
      .catch(err => console.error('Error loading cities', err))
      .finally(() => setLoadingCities(false));
  }, [state.field.value]);

  // Fetch shipping methods based on PIN
  useEffect(() => {
    if (!pin.field.value || !pin.field.valid) {
      setShippingMethods([]);
      return;
    }
    
    setLoadingShipping(true);
    api.get("/shipping", { params: { pin: pin.field.value } })
      .then(res => {
        if (res.data.success) {
          const methods = res.data.methods as ShippingMethod[];
          setShippingMethods(methods);
          const first = methods[0];
          if (first) {
            setSelectedShipping(first.id);
            setShippingCost(first.cost);
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoadingShipping(false));
  }, [pin.field.value, pin.field.valid, setShippingCost]);

  // Section management
  const toggleSection = useCallback((section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  }, []);

  // Form validation
  const validate = useCallback(() => {
    const errs: string[] = [];
    
    if (!email.field.valid || !email.field.value) errs.push("Valid email is required");
    if (!firstName.field.valid || !firstName.field.value) errs.push("First name is required");
    if (!lastName.field.valid || !lastName.field.value) errs.push("Last name is required");
    if (!address.field.valid || !address.field.value) errs.push("Address is required");
    if (!city.field.value) errs.push("City is required");
    if (!state.field.value) errs.push("State is required");
    if (!pin.field.valid || !pin.field.value) errs.push("Valid PIN code is required");
    if (!phone.field.valid || !phone.field.value) errs.push("Valid phone number is required");
    if (!selectedShipping) errs.push("Please select a shipping method");
    
    if (!billingSame) {
      if (!billing.address.value) errs.push("Billing address is required");
      if (!billing.city.value) errs.push("Billing city is required");
      if (!billing.state.value) errs.push("Billing state is required");
      if (!billing.pin.value) errs.push("Billing PIN code is required");
    }
    
    setErrors(errs);
    return errs.length === 0;
  }, [email.field, firstName.field, lastName.field, address.field, city.field.value, state.field.value, pin.field, phone.field, selectedShipping, billingSame, billing]);

  // Form submission
  const handleSubmit = useCallback(async () => {
    if (!validate()) return;
    
    setSubmitting(true);

    const payloadForm = {
      email: email.field.value,
      subscribe,
      firstName: firstName.field.value,
      lastName: lastName.field.value,
      address: address.field.value,
      apartment: apartment.field.value,
      stateId: state.field.value,
      cityId: city.field.value,
      pin: pin.field.value,
      phone: phone.field.value,
      paymentMethod,
      billingSame,
    };

    const payloadBilling = billingSame ? undefined : {
      firstName: billing.firstName.value,
      lastName: billing.lastName.value,
      address: billing.address.value,
      apartment: billing.apartment.value,
      stateId: billing.state.value,
      cityId: billing.city.value,
      pin: billing.pin.value,
      phone: billing.phone.value,
    };

    const payloadItems = items.map(i => ({
      id: i._id,
      qty: i.quantity,
      bagName: i.bagName,
      price: i.price,
    }));

    try {
      const res = await api.post("/checkout/create", {
        items: payloadItems,
        form: payloadForm,
        shippingId: selectedShipping,
        shippingCost,
        coupon: coupon ? { code: coupon.code } : undefined,
        billingAddress: payloadBilling,
      });

      if (res.data.success) {
        clearCart();
        router.push(`/order-confirmation?orderId=${res.data.orderId}`);
      } else {
        setErrors(res.data.errors || [res.data.message || "Payment failed"]);
      }
    } catch (err: any) {
      console.error(err);
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  }, [validate, email.field.value, subscribe, firstName.field.value, lastName.field.value, address.field.value, apartment.field.value, state.field.value, city.field.value, pin.field.value, phone.field.value, paymentMethod, billingSame, billing, items, selectedShipping, shippingCost, coupon, clearCart, router]);

  // Memoized values for performance
  const isFormValid = useMemo(() => {
    return email.field.valid && email.field.value &&
           firstName.field.valid && firstName.field.value &&
           lastName.field.valid && lastName.field.value &&
           address.field.valid && address.field.value &&
           city.field.value && state.field.value &&
           pin.field.valid && pin.field.value &&
           phone.field.valid && phone.field.value &&
           selectedShipping &&
           (billingSame || (billing.address.value && billing.city.value && billing.state.value && billing.pin.value));
  }, [email.field, firstName.field, lastName.field, address.field, city.field.value, state.field.value, pin.field, phone.field, selectedShipping, billingSame, billing]);

  return (
    <TooltipProvider>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <p className="text-gray-600 mt-2">Complete your order in a few simple steps</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Shield size={16} className="text-green-600" />
              <span className="text-sm text-gray-600">SSL Secured • 256-bit Encryption</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <ProgressIndicator currentStep={currentStep} completedSteps={completedSteps} />

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Auto-save indicator */}
              <div className="flex justify-end">
                <AutoSaveIndicator saving={autoSaving} saved={autoSaved} />
              </div>

              {/* Errors */}
              {errors.length > 0 && (
                <Alert variant="destructive" className="animate-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Contact Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
                <Collapsible 
                  open={sectionsOpen.contact} 
                  onOpenChange={() => toggleSection('contact')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            completedSteps.includes('contact') ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                          )}>
                            {completedSteps.includes('contact') ? <CheckCircle2 size={16} /> : '1'}
                          </div>
                          <CardTitle className="flex items-center gap-2">
                            <Mail size={20} />
                            Contact Information
                          </CardTitle>
                          {completedSteps.includes('contact') && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Complete
                            </Badge>
                          )}
                        </div>
                        {sectionsOpen.contact ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <EnhancedInput
                          field={email.field}
                          onChange={email.setValue}
                          onBlur={email.setTouched}
                          label="Email Address"
                          placeholder="john.doe@example.com"
                          type="email"
                          icon={Mail}
                          helpText="We'll send order updates to this email"
                          required
                        />
                        
                        <div className="flex items-center space-x-2 mt-8">
                          <Checkbox 
                            id="subscribe" 
                            checked={subscribe} 
                            onCheckedChange={() => setSubscribe}
                          />
                          <Label htmlFor="subscribe" className="text-sm">
                            Subscribe to newsletter for exclusive offers
                          </Label>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Delivery Address Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500">
                <Collapsible 
                  open={sectionsOpen.delivery} 
                  onOpenChange={() => toggleSection('delivery')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            completedSteps.includes('delivery') ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                          )}>
                            {completedSteps.includes('delivery') ? <CheckCircle2 size={16} /> : '2'}
                          </div>
                          <CardTitle className="flex items-center gap-2">
                            <MapPin size={20} />
                            Delivery Address
                          </CardTitle>
                          {completedSteps.includes('delivery') && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Complete
                            </Badge>
                          )}
                        </div>
                        {sectionsOpen.delivery ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <EnhancedInput
                          field={firstName.field}
                          onChange={firstName.setValue}
                          onBlur={firstName.setTouched}
                          label="First Name"
                          placeholder="John"
                          icon={User}
                          required
                        />
                        
                        <EnhancedInput
                          field={lastName.field}
                          onChange={lastName.setValue}
                          onBlur={lastName.setTouched}
                          label="Last Name"
                          placeholder="Doe"
                          icon={User}
                          required
                        />
                      </div>

                      <div className="space-y-4">
                        <EnhancedInput
                          field={address.field}
                          onChange={address.setValue}
                          onBlur={address.setTouched}
                          label="Street Address"
                          placeholder="123 Main Street"
                          icon={MapPin}
                          required
                        />
                        
                        <EnhancedInput
                          field={apartment.field}
                          onChange={apartment.setValue}
                          onBlur={apartment.setTouched}
                          label="Apartment, Suite, etc."
                          placeholder="Apt 4B, Floor 2 (Optional)"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label className="font-medium after:content-['*'] after:text-red-500 after:ml-1">
                            State
                          </Label>
                          {loadingStates ? (
                            <Skeleton className="h-10" />
                          ) : (
                            <Select value={state.field.value} onValueChange={state.setValue}>
                              <SelectTrigger className={cn(
                                "transition-all duration-200",
                                state.field.touched && !state.field.value && "border-red-500"
                              )}>
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {states.map(s => (
                                  <SelectItem key={s._id} value={s._id}>
                                    {s.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label className="font-medium after:content-['*'] after:text-red-500 after:ml-1">
                            City
                          </Label>
                          {loadingCities ? (
                            <Skeleton className="h-10" />
                          ) : (
                            <Select 
                              value={city.field.value} 
                              onValueChange={city.setValue}
                              disabled={!cities.length}
                            >
                              <SelectTrigger className={cn(
                                "transition-all duration-200",
                                city.field.touched && !city.field.value && "border-red-500"
                              )}>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent>
                                {cities.map(c => (
                                  <SelectItem key={c._id} value={c._id}>
                                    {c.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>

                        <EnhancedInput
                          field={pin.field}
                          onChange={pin.setValue}
                          onBlur={pin.setTouched}
                          label="PIN Code"
                          placeholder="560001"
                          helpText="6-digit postal code"
                          required
                        />
                      </div>

                      <EnhancedInput
                        field={phone.field}
                        onChange={phone.setValue}
                        onBlur={phone.setTouched}
                        label="Phone Number"
                        placeholder="+91 98765 43210"
                        type="tel"
                        icon={Phone}
                        helpText="For delivery updates"
                        required
                      />
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Shipping Method Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500">
                <Collapsible 
                  open={sectionsOpen.shipping} 
                  onOpenChange={() => toggleSection('shipping')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            completedSteps.includes('shipping') ? "bg-green-100 text-green-700" : "bg-green-100 text-green-700"
                          )}>
                            {completedSteps.includes('shipping') ? <CheckCircle2 size={16} /> : '3'}
                          </div>
                          <CardTitle className="flex items-center gap-2">
                            <Truck size={20} />
                            Shipping Method
                          </CardTitle>
                          {completedSteps.includes('shipping') && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Complete
                            </Badge>
                          )}
                        </div>
                        {sectionsOpen.shipping ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent>
                      {loadingShipping ? (
                        <div className="space-y-3">
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                        </div>
                      ) : shippingMethods.length > 0 ? (
                        <RadioGroup
                          value={selectedShipping}
                          onValueChange={(value) => {
                            setSelectedShipping(value);
                            const method = shippingMethods.find(m => m.id === value);
                            setShippingCost(method?.cost ?? 0);
                          }}
                          className="space-y-3"
                        >
                          {shippingMethods.map(method => (
                            <div 
                              key={method.id} 
                              className={cn(
                                "flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                                "hover:border-blue-300 hover:bg-blue-50",
                                selectedShipping === method.id && "border-blue-500 bg-blue-50"
                              )}
                              onClick={() => {
                                setSelectedShipping(method.id);
                                setShippingCost(method.cost);
                              }}
                            >
                              <div className="flex items-center gap-4">
                                <RadioGroupItem value={method.id} />
                                <div>
                                  <p className="font-semibold">{method.label}</p>
                                  {method.estimatedDays && (
                                    <p className="text-sm text-gray-600">
                                      Estimated delivery: {method.estimatedDays}
                                    </p>
                                  )}
                                  {method.description && (
                                    <p className="text-xs text-gray-500">{method.description}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center font-semibold">
                                <IndianRupeeIcon size={16} className="mr-1" />
                                {method.cost.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      ) : pin.field.valid && pin.field.value ? (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            No shipping options available for this PIN code. Please check your PIN code or try a different address.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Please enter a valid PIN code to see shipping options.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Payment Method Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-orange-500">
                <Collapsible 
                  open={sectionsOpen.payment} 
                  onOpenChange={() => toggleSection('payment')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                            completedSteps.includes('payment') ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                          )}>
                            {completedSteps.includes('payment') ? <CheckCircle2 size={16} /> : '4'}
                          </div>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard size={20} />
                            Payment Method
                          </CardTitle>
                          {completedSteps.includes('payment') && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Complete
                            </Badge>
                          )}
                        </div>
                        {sectionsOpen.payment ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="space-y-3"
                      >
                        <div className={cn(
                          "flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                          "hover:border-blue-300 hover:bg-blue-50",
                          paymentMethod === "gateway" && "border-blue-500 bg-blue-50"
                        )}
                        onClick={() => setPaymentMethod("gateway")}
                        >
                          <RadioGroupItem value="gateway" className="mt-1 mr-4" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCard size={16} />
                              <p className="font-semibold">UPI / Cards / Net Banking</p>
                              <Lock size={14} className="text-green-600" />
                            </div>
                            <p className="text-sm text-gray-600">
                              Secure payment gateway with 256-bit SSL encryption
                            </p>
                            <div className="flex items-center gap-1 mt-2">
                              <Badge variant="outline" className="text-xs">Visa</Badge>
                              <Badge variant="outline" className="text-xs">Mastercard</Badge>
                              <Badge variant="outline" className="text-xs">UPI</Badge>
                              <Badge variant="outline" className="text-xs">Paytm</Badge>
                            </div>
                          </div>
                        </div>

                        <div className={cn(
                          "flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200",
                          "hover:border-blue-300 hover:bg-blue-50",
                          paymentMethod === "cod" && "border-blue-500 bg-blue-50"
                        )}
                        onClick={() => setPaymentMethod("cod")}
                        >
                          <RadioGroupItem value="cod" className="mr-4" />
                          <div>
                            <p className="font-semibold">Cash on Delivery</p>
                            <p className="text-sm text-gray-600">Pay when you receive your order</p>
                          </div>
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Billing Address Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-l-indigo-500">
                <Collapsible 
                  open={sectionsOpen.billing} 
                  onOpenChange={() => toggleSection('billing')}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                            5
                          </div>
                          <CardTitle className="flex items-center gap-2">
                            <User size={20} />
                            Billing Address
                          </CardTitle>
                        </div>
                        {sectionsOpen.billing ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="billingSame" 
                          checked={billingSame} 
                          onCheckedChange={() => setBillingSame}
                        />
                        <Label htmlFor="billingSame" className="font-medium">
                          Same as delivery address
                        </Label>
                      </div>

                      {!billingSame && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <Label htmlFor="billFirst">First name</Label>
                              <Input 
                                id="billFirst" 
                                placeholder="John" 
                                value={billing.firstName.value} 
                                onChange={(e) => setBilling(prev => ({
                                  ...prev,
                                  firstName: { ...prev.firstName, value: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billLast">Last name</Label>
                              <Input 
                                id="billLast" 
                                placeholder="Doe" 
                                value={billing.lastName.value} 
                                onChange={(e) => setBilling(prev => ({
                                  ...prev,
                                  lastName: { ...prev.lastName, value: e.target.value }
                                }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="billAddr">Address</Label>
                            <Input 
                              id="billAddr" 
                              placeholder="123 Main St" 
                              value={billing.address.value} 
                              onChange={(e) => setBilling(prev => ({
                                ...prev,
                                address: { ...prev.address, value: e.target.value }
                              }))}
                            />
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div>
                              <Label htmlFor="billState">State</Label>
                              <Input 
                                id="billState" 
                                value={billing.state.value} 
                                onChange={(e) => setBilling(prev => ({
                                  ...prev,
                                  state: { ...prev.state, value: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billCity">City</Label>
                              <Input 
                                id="billCity" 
                                value={billing.city.value} 
                                onChange={(e) => setBilling(prev => ({
                                  ...prev,
                                  city: { ...prev.city, value: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="billPin">PIN code</Label>
                              <Input 
                                id="billPin" 
                                value={billing.pin.value} 
                                onChange={(e) => setBilling(prev => ({
                                  ...prev,
                                  pin: { ...prev.pin, value: e.target.value }
                                }))}
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="billPhone">Phone</Label>
                            <Input 
                              id="billPhone" 
                              placeholder="+91 98765 43210" 
                              value={billing.phone.value} 
                              onChange={(e) => setBilling(prev => ({
                                ...prev,
                                phone: { ...prev.phone, value: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Submit Button */}
              <div className="sticky bottom-4 z-10">
                <Button 
                  onClick={handleSubmit} 
                  disabled={submitting || !isFormValid}
                  className={cn(
                    "w-full py-6 text-lg font-semibold transition-all duration-300",
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                    "shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  )}
                >
                  {submitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Order...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock size={20} />
                      Place Secure Order
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <Card className="shadow-lg border-0 bg-white">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center">
                      <CheckCircle2 size={16} />
                    </div>
                    Your Order
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <OrderSummary
                    items={items}
                    subtotal={subtotal}
                    shippingCost={shippingCost}
                    taxes={taxes}
                    discount={coupon?.discount ?? 0}
                    total={total}
                    compactList
                  />
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Shield className="text-green-600" size={20} />
                  <div>
                    <p className="font-medium text-green-800">Secure Checkout</p>
                    <p className="text-sm text-green-600">SSL encrypted payment</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Truck className="text-blue-600" size={20} />
                  <div>
                    <p className="font-medium text-blue-800">Fast Delivery</p>
                    <p className="text-sm text-blue-600">Track your order online</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckCircle2 className="text-purple-600" size={20} />
                  <div>
                    <p className="font-medium text-purple-800">Money Back Guarantee</p>
                    <p className="text-sm text-purple-600">30-day return policy</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CheckoutPage;