"use client";
import { FC, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import OrderSummary from "@/components/OrderSummary";
import CartItemRow from "@/components/CartItemRow";
import { useCart } from "@/components/context/CartContext";

const CartPage: FC = () => {
  const {
    items,
    removeItem,
    increaseQuantity,
    decreaseQuantity,
    totalCount,
    subtotal,
    taxes,
    shippingCost,
    coupon,
    applyCoupon,
    total,
  } = useCart();

  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async (code: string) => {
    if (!code) return;
    setApplying(true);
    setError(null);
    try {
      await applyCoupon(code, subtotal + shippingCost + taxes);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          "Failed to apply coupon."
      );
    } finally {
      setApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <Link href="/collections/all" className="text-sareet-primary hover:underline text-lg">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:grid lg:grid-cols-3 lg:gap-12">
      {/* Left */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-4xl font-extrabold mb-6">Shopping Cart</h1>
        {items.map((item) => (
          <CartItemRow
            key={item._id}
            item={item}
            onInc={() => increaseQuantity(item._id)}
            onDec={() => decreaseQuantity(item._id)}
            onRemove={() => removeItem(item._id)}
          />
        ))}
      </div>

      {/* Right */}
      <aside className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              taxes={taxes}
              discount={coupon?.discount ?? 0}
              onApplyCoupon={handleApplyCoupon}
              applying={applying}
              error={error}
              couponApplied={!!coupon}
              total={total}
              onCheckoutHref="/checkout"
            />
          </CardContent>
        </Card>
        <Link href="/collections/all" className="block text-center text-gray-600 hover:underline">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
};

export default CartPage;