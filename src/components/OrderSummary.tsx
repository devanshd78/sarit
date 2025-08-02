"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IndianRupeeIcon, 
  Tag, 
  Check, 
  X, 
  Loader2, 
  ShoppingBag,
  Truck,
  Receipt,
  Percent
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  onCheckoutHref?: string;
  total?: number;
  compactList?: boolean;
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
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async () => {
    if (!onApplyCoupon || !code.trim()) return;
    await onApplyCoupon(code.trim());
    if (!error) {
      setCode("");
      setShowCouponInput(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 bg-white rounded-2xl border border-gray-100 shadow-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <ShoppingBag className="w-5 h-5 mr-2 text-blue-600" />
          Order Summary
        </h3>
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Badge>
      </div>

      {/* Items List */}
      <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <AnimatePresence>
          {items.map((item, index) => {
            const imgSrc = item.images?.[0] ?? "/placeholder.png";
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  <Image 
                    src={imgSrc} 
                    alt={item.bagName} 
                    fill 
                    className="object-cover" 
                    sizes="64px"
                  />
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate text-sm">
                    {item.bagName}
                  </p>
                  {!compactList && (
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-xs">
                        Qty: {item.quantity}
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 flex items-center text-sm">
                    <IndianRupeeIcon className="w-4 h-4 mr-1" />
                    {toMoney(Number(item.price) * Number(item.quantity))}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-gray-500">
                      ₹{toMoney(Number(item.price))} each
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Coupon Section */}
      {onApplyCoupon && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-3"
        >
          {!showCouponInput && !couponApplied ? (
            <Button
              variant="outline"
              onClick={() => setShowCouponInput(true)}
              className="w-full border-dashed border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
            >
              <Tag className="w-4 h-4 mr-2" />
              Add Coupon Code
            </Button>
          ) : (
            <AnimatePresence>
              {showCouponInput && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                >
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 flex items-center">
                      <Percent className="w-4 h-4 mr-1" />
                      Coupon Code
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCouponInput(false);
                        setCode("");
                      }}
                      className="h-6 w-6 p-0 hover:bg-red-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="SAVE20"
                      disabled={applying}
                      className="flex-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      disabled={applying || !code.trim()}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                    >
                      {applying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm text-red-600 bg-red-50 p-2 rounded-lg border border-red-200"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {couponApplied && discount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-semibold text-green-800">
                    Coupon Applied!
                  </span>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  -₹{toMoney(discount)}
                </Badge>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

      {/* Totals */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-gray-700">
          <span className="flex items-center">
            <Receipt className="w-4 h-4 mr-2 text-gray-500" />
            Subtotal
          </span>
          <span className="flex items-center font-semibold">
            <IndianRupeeIcon className="w-4 h-4 mr-1" />
            {toMoney(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-700">
          <span className="flex items-center">
            <Truck className="w-4 h-4 mr-2 text-gray-500" />
            Shipping
          </span>
          <span className="flex items-center font-semibold">
            {shippingCost === 0 ? (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                FREE
              </Badge>
            ) : (
              <>
                <IndianRupeeIcon className="w-4 h-4 mr-1" />
                {toMoney(shippingCost)}
              </>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center text-gray-700">
          <span>Taxes & Fees</span>
          <span className="flex items-center font-semibold">
            <IndianRupeeIcon className="w-4 h-4 mr-1" />
            {toMoney(taxes)}
          </span>
        </div>

        <AnimatePresence>
          {discount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg"
            >
              <span className="flex items-center font-semibold">
                <Percent className="w-4 h-4 mr-2" />
                Discount
              </span>
              <span className="flex items-center font-bold">
                -₹{toMoney(discount)}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-400 to-transparent" />

      {/* Total */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
      >
        <span className="text-xl font-bold text-gray-900">Total</span>
        <span className="flex items-center text-2xl font-bold text-gray-900">
          <IndianRupeeIcon className="w-6 h-6 mr-1" />
          {toMoney(total)}
        </span>
      </motion.div>

      {/* Checkout Button */}
      {onCheckoutHref && (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            asChild
            className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <a href={onCheckoutHref}>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </a>
          </Button>
        </motion.div>
      )}

      {/* Security Badge */}
      <div className="text-center">
        <Badge variant="outline" className="text-xs text-gray-500 border-gray-300">
          🔒 Secure Checkout
        </Badge>
      </div>
    </motion.div>
  );
};

export default OrderSummary;