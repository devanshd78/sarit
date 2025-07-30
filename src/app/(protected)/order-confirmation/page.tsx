// src/app/order-confirmation/page.tsx
"use client";

import React, { FC, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { post } from "@/lib/api";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
} from "lucide-react";

interface OrderItem {
  _id: string;
  bagName: string;
  price: number;
  quantity: number;
}

interface AddressPart {
  id: string;
  name: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  apartment?: string;
  city: AddressPart;
  state: AddressPart;
  pin: string;
  phone: string;
}

interface Coupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface Order {
  orderId: string;
  items: OrderItem[];
  contact: { email: string; subscribe: boolean };
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  taxes: number;
  shippingCost: number;
  grossTotal: number;
  coupon?: Coupon;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
}

export const OrderConfirmationPage: FC = () => {
  const params = useSearchParams();
  const orderId = params.get("orderId") ?? "";

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return setError("No order ID provided.");
    setLoading(true);

    post<{ success: boolean; data: Order; message?: string }>(
      "/checkout/getbyId",
      { orderId }
    )
      .then((res) => {
        if (res.success) setOrder(res.data);
        else setError(res.message || "Failed to load order.");
      })
      .catch(() => setError("Server error loading order."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Progress className="w-48 h-1" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  if (!order) return null;

  // Map status to icon + colour
  const statusMap = {
    pending: { icon: <Clock className="text-orange-500"/>, color: "outline" },
    processing: { icon: <Package className="text-blue-500"/>, color: "secondary" },
    shipped: { icon: <Truck className="text-indigo-500"/>, color: "secondary" },
    delivered: { icon: <CheckCircle2 className="text-green-500"/>, color: "secondary" },
    cancelled: { icon: <Clock className="text-red-500"/>, color: "destructive" },
  } as const;

  const currentStatus = statusMap[order.status as keyof typeof statusMap] || statusMap.pending;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Success Alert */}
      <Alert className="bg-green-50">
        <AlertTitle className="flex items-center space-x-2">
          <CheckCircle2 /> <span>Order Confirmed!</span>
        </AlertTitle>
        <AlertDescription>
          Thank you for your purchase. Here’s the summary of your order.
        </AlertDescription>
      </Alert>

      {/* Order & Status */}
      <Card className="bg-white">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-xl">Order ID: #{order.orderId}</CardTitle>
          <div className="flex items-center space-x-2">
            {currentStatus.icon}
            <Badge variant={currentStatus.color} className="uppercase">
              {order.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Shipping Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>
              {order.shippingAddress.firstName}{" "}
              {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
            <p>
              {order.shippingAddress.city.name},{" "}
              {order.shippingAddress.state.name} – {order.shippingAddress.pin}
            </p>
            <p>{order.shippingAddress.phone}</p>
          </CardContent>
        </Card>

        {order.billingAddress && (
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p>
                {order.billingAddress.firstName}{" "}
                {order.billingAddress.lastName}
              </p>
              <p>{order.billingAddress.address}</p>
              {order.billingAddress.apartment && <p>{order.billingAddress.apartment}</p>}
              <p>
                {order.billingAddress.city.name},{" "}
                {order.billingAddress.state.name} – {order.billingAddress.pin}
              </p>
              <p>{order.billingAddress.phone}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Items & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items Table */}
        <Card className="lg:col-span-2 bg-white">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200">
              <TableHeader className="rounded-lg bg-black">
                <TableRow>
                  <TableHead className="px-4 py-2 text-left text-xs font-medium text-white uppercase">
                    Item
                  </TableHead>
                  <TableHead className="px-4 py-2 text-right text-xs font-medium text-white uppercase">
                    Qty
                  </TableHead>
                  <TableHead className="px-4 py-2 text-right text-xs font-medium text-white uppercase">
                    Price
                  </TableHead>
                  <TableHead className="px-4 py-2 text-right text-xs font-medium text-white uppercase">
                    Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-200">
                {order.items.map((it) => (
                  <TableRow key={it._id}>
                    <TableCell className="px-4 py-2 text-sm">{it.bagName}</TableCell>
                    <TableCell className="px-4 py-2 text-right text-sm">{it.quantity}</TableCell>
                    <TableCell className="px-4 py-2 text-right text-sm">₹{it.price.toFixed(2)}</TableCell>
                    <TableCell className="px-4 py-2 text-right font-semibold">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="space-y-4 p-6 bg-white">
          <CardTitle className="text-lg">Order Summary</CardTitle>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes (9%)</span>
              <span>₹{order.taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{order.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gross Total</span>
              <span>₹{order.grossTotal.toFixed(2)}</span>
            </div>
            {order.coupon && (
              <div className="flex justify-between text-green-600">
                <span>Coupon ({order.coupon.code})</span>
                <span>-₹{order.coupon.discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold border-t pt-2">
              <span>Total Paid</span>
              <span>₹{order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <CardFooter className="text-center">
        <p className="text-sm text-gray-500">
          Order placed on {format(new Date(order.createdAt), "PPPp")}
        </p>
        <Button asChild>
          <a href="/" className="mt-2">
            Continue Shopping
          </a>
        </Button>
      </CardFooter>
    </div>
  );
};

export default OrderConfirmationPage;
