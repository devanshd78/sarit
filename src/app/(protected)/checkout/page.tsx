"use client";

import { FC, useEffect, useState } from "react";
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
import OrderSummary from "@/components/OrderSummary";
import { IndianRupeeIcon } from "lucide-react";

interface ShippingMethod { id: string; label: string; cost: number; }
interface State { _id: string; name: string }
interface City { _id: string; name: string }

type FormState = {
  email: string;
  subscribe: boolean;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;   // internal: stores selected city ID
  state: string;  // internal: stores selected state ID
  pin: string;
  phone: string;
  paymentMethod: string;
  billingSame: boolean;
};
type BillingState = Omit<FormState, keyof { email: string; subscribe: boolean; country: string; paymentMethod: string; billingSame: boolean }>;

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

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [loadingShipping, setLoadingShipping] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [form, setForm] = useState<FormState>({
    email: "",
    subscribe: false,
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
    paymentMethod: "gateway",
    billingSame: true,
  });
  const [billing, setBilling] = useState<BillingState>({
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    pin: "",
    phone: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Load states
  useEffect(() => {
    api.get<State[]>('/state/states')
      .then(res => setStates(res.data))
      .catch(err => console.error('Error loading states', err));
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!form.state) return setCities([]);
    api.get<City[]>(`/state/${form.state}/cities`)
      .then(res => setCities(res.data))
      .catch(err => console.error('Error loading cities', err));
  }, [form.state]);

  // Fetch shipping methods based on PIN
  useEffect(() => {
    if (!form.pin) return;
    setLoadingShipping(true);
    api.get("/shipping", { params: {pin: form.pin } })
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
  }, [form.pin, setShippingCost]);

  function handleChange<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }
  function handleBillingChange<K extends keyof BillingState>(field: K, value: BillingState[K]) {
    setBilling(prev => ({ ...prev, [field]: value }));
  }

  const validate = () => {
    const errs: string[] = [];
    if (!form.email) errs.push("Email is required");
    if (!form.lastName) errs.push("Last name is required");
    if (!form.address) errs.push("Address is required");
    if (!form.city) errs.push("City is required");
    if (!form.state) errs.push("State is required");
    if (!form.pin) errs.push("PIN code is required");
    //if (!selectedShipping) errs.push("Please select a shipping method");
    if (!form.billingSame) {
      if (!billing.address) errs.push("Billing address is required");
      if (!billing.city) errs.push("Billing city is required");
      if (!billing.state) errs.push("Billing state is required");
      if (!billing.pin) errs.push("Billing PIN code is required");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);

    // Build payload according to controller expectations
    const payloadForm = {
      email: form.email,
      subscribe: form.subscribe,
      firstName: form.firstName,
      lastName: form.lastName,
      address: form.address,
      apartment: form.apartment,
      stateId: form.state,
      cityId: form.city,
      pin: form.pin,
      phone: form.phone,
      paymentMethod: form.paymentMethod,
      billingSame: form.billingSame,
    };

    const payloadBilling = {
      firstName: billing.firstName,
      lastName: billing.lastName,
      address: billing.address,
      apartment: billing.apartment,
      stateId: billing.state,
      cityId: billing.city,
      pin: billing.pin,
      phone: billing.phone,
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
        billingAddress: form.billingSame ? undefined : payloadBilling,
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
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight">Checkout</h1>

          {errors.length > 0 && (
            <Card className="border-red-500 bg-red-100">
              <CardContent>
                <ul className="text-red-700 list-inside list-disc space-y-1">
                  {errors.map((e, i) => <li key={i}>{e}</li>)}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Contact */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle>1. Contact</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={e => handleChange("email", e.target.value)} />
              </div>
              <div className="flex items-center mt-6 md:mt-0">
                <Checkbox checked={form.subscribe} onCheckedChange={v => handleChange("subscribe", !!v)} />
                <Label className="ml-2">Subscribe to newsletter</Label>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle>2. Delivery Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="John" value={form.firstName} onChange={e => handleChange("firstName", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Doe" value={form.lastName} onChange={e => handleChange("lastName", e.target.value)} />
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" placeholder="123 Main St" value={form.address} onChange={e => handleChange("address", e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                  <Input id="apartment" placeholder="Apt 4B" value={form.apartment} onChange={e => handleChange("apartment", e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Select value={form.state} onValueChange={v => handleChange("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {states.map(s => <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select value={form.city} onValueChange={v => handleChange("city", v)} disabled={!cities.length}>
                    <SelectTrigger><SelectValue placeholder="Select city" /></SelectTrigger>
                    <SelectContent className="bg-white">
                      {cities.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pin">PIN code</Label>
                  <Input id="pin" placeholder="560001" value={form.pin} onChange={e => handleChange("pin", e.target.value)} />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+91 98765 43210" value={form.phone} onChange={e => handleChange("phone", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Method */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle>3. Shipping Method</CardTitle></CardHeader>
            <CardContent>
              {loadingShipping ? (
                <p className="text-gray-500">Fetching options…</p>
              ) : (
                <RadioGroup
                  onValueChange={v => {
                    setSelectedShipping(v);
                    const m = shippingMethods.find(x => x.id === v);
                    setShippingCost(m?.cost ?? 0);
                  }}
                  value={selectedShipping}
                  className="space-y-3"
                >
                  {shippingMethods.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value={m.id} className="mr-4" />
                      <span className="flex-1 font-medium">{m.label}</span>
                      <span className="flex items-center">
                        <IndianRupeeIcon className="mr-1" size={16} />
                        {m.cost.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle>4. Payment</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup onValueChange={v => handleChange("paymentMethod", v)} value={form.paymentMethod} className="space-y-3">
                <div className="flex items-start p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="gateway" className="mt-1 mr-4" />
                  <div>
                    <p className="font-medium">UPI / Cards</p>
                    <p className="text-sm text-gray-600">Secure payment gateway</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="cod" className="mr-4" />
                  <span className="font-medium">Cash on Delivery</span>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader><CardTitle>5. Billing Address</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Checkbox checked={form.billingSame} onCheckedChange={v => handleChange("billingSame", !!v)} />
                <Label>Same as delivery</Label>
              </div>
              {!form.billingSame && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billFirst">First name</Label>
                    <Input id="billFirst" placeholder="John" value={billing.firstName} onChange={e => handleBillingChange("firstName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="billLast">Last name</Label>
                    <Input id="billLast" placeholder="Doe" value={billing.lastName} onChange={e => handleBillingChange("lastName", e.target.value)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="billAddr">Address</Label>
                    <Input id="billAddr" placeholder="123 Main St" value={billing.address} onChange={e => handleBillingChange("address", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="billCity">City</Label>
                    <Input id="billCity" value={billing.city} onChange={e => handleBillingChange("city", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="billState">State</Label>
                    <Input id="billState" value={billing.state} onChange={e => handleBillingChange("state", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="billPin">PIN code</Label>
                    <Input id="billPin" value={billing.pin} onChange={e => handleBillingChange("pin", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="billPhone">Phone</Label>
                    <Input id="billPhone" placeholder="+91 98765 43210" value={billing.phone} onChange={e => handleBillingChange("phone", e.target.value)} />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full py-4 text-lg font-semibold">
            {submitting ? "Processing…" : "Place Order"}
          </Button>
        </div>

        <aside className="lg:sticky lg:top-24">
          <Card className="shadow-sm">
            <CardHeader><CardTitle>Your Order</CardTitle></CardHeader>
            <CardContent>
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
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
