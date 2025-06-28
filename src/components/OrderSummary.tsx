// src/components/OrderSummary.tsx
import { FC, useState } from "react";
import Image from "next/image";
import { IndianRupeeIcon } from "lucide-react";

export type CartItem = {
  _id: string;
  bagName: string;
  price: number;
  quantity: number;
  images: string[];
};

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  taxes: number;
  onApplyCoupon?: (code: string) => Promise<number>; // returns discount amount
}

const OrderSummary: FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingCost,
  taxes,
  onApplyCoupon,
}) => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applying, setApplying] = useState(false);
  const total = subtotal + shippingCost + taxes - discount;

  const handleApply = async () => {
    if (!onApplyCoupon) return;
    setApplying(true);
    try {
      const disc = await onApplyCoupon(coupon.trim());
      setDiscount(disc);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="sticky top-24 space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4 max-h-64 overflow-auto">
          {items.map((i) => (
            <div key={i._id} className="flex items-center">
              <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                <Image src={i.images[0]} alt={i.bagName} fill className="object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <p className="font-medium text-gray-800 truncate">{i.bagName}</p>
                <p className="text-sm text-gray-600">Qty: {i.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900 flex items-center">
                <IndianRupeeIcon className="inline-block mr-1" size={14} />
                {(i.price * i.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {onApplyCoupon && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Coupon code</label>
            <div className="flex mt-1">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. SUMMER10"
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:ring-2 focus:ring-sareet-primary"
              />
              <button
                onClick={handleApply}
                disabled={applying || !coupon.trim()}
                className="px-4 bg-sareet-primary text-white rounded-r-md hover:bg-sareet-primary-dark disabled:opacity-50"
              >
                {applying ? "Applying…" : "Apply"}
              </button>
            </div>
            {discount > 0 && (
              <p className="mt-2 text-sm text-green-600">
                Coupon applied! You saved ₹{discount.toFixed(2)}.
              </p>
            )}
          </div>
        )}

        <div className="border-t border-gray-200 mt-6 pt-4 space-y-2 text-gray-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center">
              <IndianRupeeIcon className="inline-block mr-1" size={14} />
              {subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="flex items-center">
              <IndianRupeeIcon className="inline-block mr-1" size={14} />
              {shippingCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Estimated taxes</span>
            <span className="flex items-center">
              <IndianRupeeIcon className="inline-block mr-1" size={14} />
              {taxes.toFixed(2)}
            </span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center text-xl font-semibold text-gray-900">
          <span>Total</span>
          <span className="flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={18} />
            {total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
