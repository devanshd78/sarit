// src/pages/cart.tsx
"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/context/CartContext";
import { IndianRupeeIcon, Trash2 } from "lucide-react";

const CartPage: FC = () => {
  const { items, removeItem, increaseQuantity, decreaseQuantity, totalCount } = useCart();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-3xl font-semibold mb-4">Your cart is empty</h2>
        <Link
          href="/catalog"
          className="text-sareet-primary hover:underline text-lg"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:grid lg:grid-cols-3 lg:gap-12">
      {/* Items List */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-4xl font-extrabold mb-6">Shopping Cart</h1>

        {items.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center bg-white shadow-sm rounded-lg overflow-hidden"
          >
            {/* Thumbnail */}
            <div className="w-full md:w-40 h-40 relative flex-shrink-0">
              <Image
                src={item.images[0]}
                alt={item.bagName}
                fill
                className="object-cover"
              />
            </div>

            {/* Details */}
            <div className="flex-1 p-4">
              <Link href={`/collection/view?id=${item._id}`}>
                <h2 className="text-xl font-semibold hover:text-sareet-primary transition">
                  {item.bagName}
                </h2>
              </Link>
              <p className="mt-1 text-gray-600">Color: {item.colors[0] || '—'}</p>
              <p className="mt-2 text-lg font-medium flex items-center">
                <IndianRupeeIcon className="inline-block mr-1" size={18} />
                {item.price.toFixed(2)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-end p-4 space-y-4">
              <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => decreaseQuantity(item._id)}
                  className="px-3 py-1 hover:bg-gray-100 transition"
                >
                  –
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => increaseQuantity(item._id)}
                  className="px-3 py-1 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item._id)}
                className="text-gray-400 hover:text-red-600 transition"
                aria-label="Remove item"
              >
                <Trash2 size={20} />
              </button>

              <p className="text-lg font-semibold">
                <IndianRupeeIcon className="inline-block mr-1" size={16} />
                {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <aside className="mt-8 lg:mt-0 bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Items ({totalCount}):</span>
          <span className="font-medium">{totalCount}</span>
        </div>

        <div className="flex justify-between mb-6">
          <span className="text-gray-600">Subtotal:</span>
          <span className="font-medium flex items-center">
            <IndianRupeeIcon className="inline-block mr-1" size={16} />
            {subtotal.toFixed(2)}
          </span>
        </div>

        <Link
          href="/checkout"
          className="block w-full text-center bg-sareet-primary text-black py-3 rounded-md font-semibold hover:bg-sareet-primary-dark transition"
        >
          Proceed to Checkout
        </Link>

        <Link
          href="/collections/all"
          className="block text-center mt-4 text-gray-600 hover:underline"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
};

export default CartPage;
