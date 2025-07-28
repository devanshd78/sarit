"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { IndianRupeeIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CartItem } from "./context/CartContext";
import { toMoney } from "@/utils/money";

interface OrderSummaryProps {
  items?: CartItem[];
  subtotal?: number;
  shippingCost?: number;
  taxes?: number;
  discount?: number;
  onApplyCoupon?: (code: string) => Promise<void>;
  couponApplied?: boolean;
  error?: string | null;
  applying?: boolean;
  onCheckoutHref?: string; // if provided, render a CTA link
  total?: number;
  compactList?: boolean; // when used in Checkout sidebar
}

const OrderSummary: FC<OrderSummaryProps> = ({
  items = [],
  subtotal = 0,
  shippingCost = 0,
  taxes = 0,
  discount = 0,
  onApplyCoupon,
  couponApplied,
  error,
  applying,
  onCheckoutHref,
  total = 0,
  compactList = false,
}) => {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-6">
      {/* Items List */}
      <div className="space-y-4 max-h-64 overflow-auto">
        {items.map((i) => {
          const imgSrc = i.images?.[0] ?? "/placeholder.png";
          return (
            <div key={i._id} className="flex items-center">
              <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                <Image src={imgSrc} alt={i.bagName} fill className="object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800 truncate">{i.bagName}</p>
                {!compactList && <p className="text-sm text-gray-600">Qty: {i.quantity}</p>}
              </div>
              <p className="font-semibold text-gray-900 flex items-center">
                <IndianRupeeIcon className="inline-block mr-1" size={14} />
                {toMoney(Number(i.price) * Number(i.quantity))}
              </p>
            </div>
          );
        })}
      </div>

      {/* Coupon */}
      {onApplyCoupon && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Coupon Code</label>
          <div className="flex">
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="SUMMER10"
              disabled={applying || !!discount}
              className="rounded-r-none"
            />
            <Button
              onClick={() => onApplyCoupon(code.trim())}
              disabled={applying || !code.trim() || !!discount}
              className="rounded-l-none"
            >
              {applying ? "Applying…" : discount ? "Applied" : "Apply"}
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      <Separator />

      {/* Totals */}
      <div className="space-y-2 text-gray-700">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={14} />
            {toMoney(subtotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={14} />
            {toMoney(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span className="flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={14} />
            {toMoney(taxes)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-₹{toMoney(discount)}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-xl font-semibold text-gray-900">
        <span>Total</span>
        <span className="flex items-center">
          <IndianRupeeIcon className="inline-block mr-1" size={18} />
          {toMoney(total)}
        </span>
      </div>

      {onCheckoutHref && (
        <a
          href={onCheckoutHref}
          className="w-full block text-center bg-sareet-primary text-black py-3 rounded-md font-semibold hover:bg-sareet-primary-dark"
        >
          Proceed to Checkout
        </a>
      )}
    </div>
  );
};

export default OrderSummary;