"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Trash2, 
  Heart,
  ShoppingBag,
  Package
} from "lucide-react";
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
    clearCart,
  } = useCart();

  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clearing, setClearing] = useState(false);

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

  const handleClearCart = async () => {
    setClearing(true);
    // Add a small delay for better UX
    setTimeout(() => {
      clearCart();
      setClearing(false);
    }, 500);
  };

  // Empty Cart State
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center justify-center text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-8 shadow-lg"
            >
              <ShoppingCart className="w-16 h-16 text-gray-400" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Your cart is empty
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 mb-8 leading-relaxed"
            >
              Looks like you haven't added any items to your cart yet. 
              Start shopping to fill it up!
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-4 w-full"
            >
              <Button
                asChild
                className="w-full h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/collections">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Start Shopping
                </Link>
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="w-full h-12 border-2 border-gray-300 hover:border-gray-400 rounded-xl transition-all duration-300"
              >
                <Link href="/">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
        >
          <div className="flex items-center mb-4 sm:mb-0">
            <ShoppingCart className="w-8 h-8 text-gray-700 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              asChild
              className="border-gray-300 hover:border-gray-400 rounded-xl"
            >
              <Link href="/collections">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
            
            {items.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={clearing}
                className="border-red-300 text-red-600 hover:border-red-400 hover:bg-red-50 rounded-xl"
              >
                {clearing ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Package className="w-4 h-4 mr-2" />
                  </motion.div>
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Clear Cart
              </Button>
            )}
          </div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 space-y-4 mb-8 lg:mb-0"
          >
            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Package className="w-5 h-5 mr-2 text-gray-600" />
                    Cart Items
                  </span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-6 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <CartItemRow
                          item={item}
                          onInc={() => increaseQuantity(item._id)}
                          onDec={() => decreaseQuantity(item._id)}
                          onRemove={() => removeItem(item._id)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Items */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8"
            >
              <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50 border-b border-gray-100">
                  <CardTitle className="flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-pink-600" />
                    You might also like
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    <p>Recommended items will appear here</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 border-gray-300 hover:border-gray-400 rounded-xl"
                    >
                      <Link href="/collections">
                        Browse Collections
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:sticky lg:top-8 lg:self-start"
          >
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

            {/* Additional Actions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 space-y-3"
            >
              <Button
                asChild
                variant="outline"
                className="w-full border-gray-300 hover:border-gray-400 rounded-xl"
              >
                <Link href="/collections">
                  Continue Shopping
                </Link>
              </Button>
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  🔒 Secure checkout • 30-day returns • Free shipping over ₹999
                </p>
              </div>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default CartPage;