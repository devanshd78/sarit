// src/pages/checkout.tsx
"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { IndianRupeeIcon, Edit3 } from "lucide-react";

type ShippingMethod = { id: string; label: string; cost: number };

export const CheckoutPage: FC = () => {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<string>("");
  const [shippingCost, setShippingCost] = useState(0);
  const [loadingShipping, setLoadingShipping] = useState(false);

  const [form, setForm] = useState({
    email: "",
    subscribe: false,
    country: "India",
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

  const [billing, setBilling] = useState({
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

  // Fetch shipping methods via api client
  useEffect(() => {
    if (!form.pin) return;

    setLoadingShipping(true);
    api
      .get("/shipping", { params: { country: form.country, pin: form.pin } })
      .then((res) => {
        if (res.data.success) {
          const methods = res.data.methods as ShippingMethod[];
          setShippingMethods(methods);
          setSelectedShipping(methods[0]?.id || "");
          setShippingCost(methods[0]?.cost || 0);
        }
      })
      .catch((err) => {
        console.error("Failed to load shipping methods:", err);
      })
      .finally(() => setLoadingShipping(false));
  }, [form.country, form.pin]);

  const totalTaxes = +(subtotal * 0.09).toFixed(2);
  const total = +(subtotal + totalTaxes + shippingCost).toFixed(2);
  const shippingLabel = shippingMethods.find(m => m.id === selectedShipping)?.label || "";

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBillingChange = (field: string, value: any) => {
    setBilling(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errs: string[] = [];
    if (!form.email) errs.push("Email is required");
    if (!form.lastName) errs.push("Last name is required");
    if (!form.address) errs.push("Address is required");
    if (!form.city) errs.push("City is required");
    if (!form.state) errs.push("State is required");
    if (!form.pin) errs.push("PIN code is required");
    if (!selectedShipping) errs.push("Please select a shipping method");
    if (!form.billingSame) {
      if (!billing.address) errs.push("Billing address is required");
      if (!billing.city) errs.push("Billing city is required");
      if (!billing.state) errs.push("Billing state is required");
      if (!billing.pin) errs.push("Billing PIN code is required");
    }
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const payload = {
      items: items.map(i => i._id), // pass IDs only
      form,
      shippingId: selectedShipping,
      shippingCost,
      billingAddress: form.billingSame ? undefined : billing,
    };

    try {
      const res = await api.post("/checkout", payload);
      if (res.data.success) {
        clearCart();
        router.push(`/order-confirmation?orderId=${res.data.orderId}`);
      } else {
        setErrors([res.data.message || "Payment failed"]);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setErrors(["Something went wrong. Please try again."]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 grid gap-8 lg:grid-cols-3">
      {/* Form Column */}
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-bold">Checkout</h1>

        {errors.length > 0 && (
          <Card className="border-red-400 bg-red-50">
            <CardContent>
              <ul className="text-red-700 list-disc pl-5">
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={e => handleChange("email", e.target.value)}
              />
            </div>
            <Checkbox
              checked={form.subscribe}
              onCheckedChange={v => handleChange("subscribe", v)}
            >
              Email me with news and offers
            </Checkbox>
          </CardContent>
        </Card>

        {/* Delivery */}
        <Card>
          <CardHeader>
            <CardTitle>Delivery Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="country">Country</Label>
              <Select
                onValueChange={v => handleChange("country", v)}
                value={form.country}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="India">India</SelectItem>
                  <SelectItem value="United States">United States</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name (optional)</Label>
                <Input
                  id="firstName"
                  value={form.firstName}
                  onChange={e => handleChange("firstName", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={form.lastName}
                  onChange={e => handleChange("lastName", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={e => handleChange("address", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="apartment">Apt, suite, etc. (opt)</Label>
                <Input
                  id="apartment"
                  value={form.apartment}
                  onChange={e => handleChange("apartment", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={e => handleChange("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select
                  onValueChange={v => handleChange("state", v)}
                  value={form.state}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Andaman and Nicobar">Andaman and Nicobar</SelectItem>
                    {/* … */}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pin">PIN code</Label>
                <Input
                  id="pin"
                  value={form.pin}
                  onChange={e => handleChange("pin", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={e => handleChange("phone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Shipping */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingShipping ? (
              <p className="text-gray-500">Loading methods…</p>
            ) : (
              <RadioGroup
                onValueChange={v => {
                  setSelectedShipping(v);
                  const m = shippingMethods.find(m => m.id === v);
                  setShippingCost(m?.cost ?? 0);
                }}
                value={selectedShipping}
                className="space-y-2"
              >
                {shippingMethods.map(m => (
                  <div key={m.id} className="flex items-center justify-between p-3 border rounded hover:shadow">
                    <RadioGroupItem value={m.id} className="mr-3" />
                    <span className="flex-1">{m.label}</span>
                    <span className="flex items-center">
                      <IndianRupeeIcon className="inline-block mr-1" size={14} />
                      {m.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
                {shippingMethods.length === 0 && !loadingShipping && (
                  <p className="text-gray-500">Enter a PIN to see methods.</p>
                )}
              </RadioGroup>
            )}
          </CardContent>
        </Card>

        {/* Payment */}
        <Card>
          <CardHeader>
            <CardTitle>Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-600">All transactions are secure.</p>
            <RadioGroup
              onValueChange={v => handleChange("paymentMethod", v)}
              value={form.paymentMethod}
              className="space-y-2"
            >
              <div className="flex items-start p-4 border rounded hover:shadow">
                <RadioGroupItem value="gateway" className="mt-1 mr-3" />
                <div>
                  <p className="font-medium">PhonePe Gateway (UPI, Cards)</p>
                  <p className="text-sm text-gray-600">You’ll be redirected after “Pay now”.</p>
                </div>
              </div>
              <div className="flex items-center p-4 border rounded hover:shadow">
                <RadioGroupItem value="cod" className="mr-3" />
                <span>Cash on Delivery</span>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Checkbox
                checked={form.billingSame}
                onCheckedChange={v => handleChange("billingSame", v)}
              >
                Same as shipping
              </Checkbox>
              <Checkbox
                checked={!form.billingSame}
                onCheckedChange={v => handleChange("billingSame", !v)}
              >
                Use different address
              </Checkbox>
            </div>
            {!form.billingSame && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="billFirst">First name (opt)</Label>
                    <Input
                      id="billFirst"
                      value={billing.firstName}
                      onChange={e => handleBillingChange("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billLast">Last name</Label>
                    <Input
                      id="billLast"
                      value={billing.lastName}
                      onChange={e => handleBillingChange("lastName", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="billAddr">Address</Label>
                  <Input
                    id="billAddr"
                    value={billing.address}
                    onChange={e => handleBillingChange("address", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="billCity">City</Label>
                    <Input
                      id="billCity"
                      value={billing.city}
                      onChange={e => handleBillingChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billState">State</Label>
                    <Input
                      id="billState"
                      value={billing.state}
                      onChange={e => handleBillingChange("state", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="billPin">PIN</Label>
                    <Input
                      id="billPin"
                      value={billing.pin}
                      onChange={e => handleBillingChange("pin", e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="billPhone">Phone</Label>
                  <Input
                    id="billPhone"
                    value={billing.phone}
                    onChange={e => handleBillingChange("phone", e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Processing…" : "Pay now"}
        </Button>
      </div>

      {/* Summary Column */}
      <aside className="space-y-6 lg:sticky lg:top-24">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Order Summary</CardTitle>
            <Button variant="link" onClick={() => router.push("/cart")}>
              <Edit3 className="mr-1" size={16} />
              Edit Cart
            </Button>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 space-y-3">
              {items.map(i => (
                <div key={i._id} className="flex items-center justify-between">
                  <div className="w-14 h-14 relative rounded overflow-hidden">
                    <Image src={i.images[0]} alt={i.bagName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 ml-3">
                    <p className="font-medium">{i.bagName}</p>
                    <p className="text-sm text-gray-500">Qty: {i.quantity}</p>
                  </div>
                  <p className="flex items-center font-semibold">
                    <IndianRupeeIcon className="mr-1" size={14} />
                    {(i.price * i.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </ScrollArea>

            <Separator />

            <dl className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="flex items-center">
                  <IndianRupeeIcon className="mr-1" size={14} />
                  {subtotal.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping{shippingLabel && ` (${shippingLabel})`}</dt>
                <dd className="flex items-center">
                  <IndianRupeeIcon className="mr-1" size={14} />
                  {shippingCost.toFixed(2)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Taxes (9%)</dt>
                <dd className="flex items-center">
                  <IndianRupeeIcon className="mr-1" size={14} />
                  {totalTaxes.toFixed(2)}
                </dd>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <dt>Total</dt>
                <dd className="flex items-center">
                  <IndianRupeeIcon className="mr-1" size={16} />
                  {total.toFixed(2)}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
};

export default CheckoutPage;
