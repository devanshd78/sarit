"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import type { BagColl } from "@/components/ProductCard";

export type CartItem = BagColl & { quantity: number };

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const didHydrate = useRef(false);

  // 1) Hydrate from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("cart");
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore parse errors
    } finally {
      didHydrate.current = true;
    }
  }, []);

  // 2) Persist *after* hydration, skip initial render
  useEffect(() => {
    if (!didHydrate.current) return;
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  // Add or update item quantity
  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i._id === item._id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + item.quantity,
        };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i._id !== id));

  const clearCart = () => setItems([]);

  const increaseQuantity = (id: string) =>
    setItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );

  // Decrease quantity or remove item if it reaches zero
  const decreaseQuantity = (id: string) =>
    setItems((prev) =>
      prev.reduce<CartItem[]>((acc, item) => {
        if (item._id === id) {
          const newQty = item.quantity - 1;
          if (newQty > 0) {
            acc.push({ ...item, quantity: newQty });
          }
          // if newQty <= 0, omit the item (remove from cart)
        } else {
          acc.push(item);
        }
        return acc;
      }, [])
    );

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside <CartProvider>");
  return ctx;
};
