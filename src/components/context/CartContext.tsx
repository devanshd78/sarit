"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import api from "@/lib/api";

export type CartItem = {
  _id: string;
  bagName: string;
  price: number;
  quantity: number;
  images: string[];
  colors?: string[];
};

export type CouponResult = {
  code: string;
  discount: number;
  newTotal: number;
};

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  totalCount: number;
  subtotal: number;
  taxes: number;
  shippingCost: number;
  setShippingCost: (n: number) => void;
  coupon?: CouponResult | null;
  applyCoupon: (code: string, orderTotal: number) => Promise<CouponResult>;
  clearCoupon: () => void;
  total: number; // final total after discount, tax, shipping
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_KEY = "cart_items_v1";
const COUPON_KEY = "cart_coupon_v1";

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const didHydrate = useRef(false);

  // hydrate once
  useEffect(() => {
    try {
      const storedItems = localStorage.getItem(CART_KEY);
      const storedCoupon = localStorage.getItem(COUPON_KEY);
      if (storedItems) setItems(JSON.parse(storedItems));
      if (storedCoupon) setCoupon(JSON.parse(storedCoupon));
    } catch {/* ignore */}
    finally { didHydrate.current = true; }
  }, []);

  // persist
  useEffect(() => {
    if (!didHydrate.current) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!didHydrate.current) return;
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_KEY);
  }, [coupon]);

  // CRUD helpers
  const addItem = (item: CartItem) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i._id === item._id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
        return updated;
      }
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(i => i._id !== id));
  const clearCart = () => setItems([]);

  const increaseQuantity = (id: string) => setItems(prev => prev.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));

  const decreaseQuantity = (id: string) => setItems(prev => prev.reduce<CartItem[]>((acc, i) => {
    if (i._id === id) {
      const q = i.quantity - 1;
      if (q > 0) acc.push({ ...i, quantity: q });
    } else acc.push(i);
    return acc;
  }, []));

  // math
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const taxes = subtotal * 0.05; // keep same 5% unless you want to parametrize
  const preTotal = subtotal + shippingCost + taxes;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(0, preTotal - discount);
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  // coupon
  const applyCoupon = async (code: string, orderTotal: number): Promise<CouponResult> => {
    const res = await api.post<{ data: CouponResult }>("/coupons/apply", { code, orderTotal });
    const data = res.data.data;
    setCoupon(data);
    return data;
  };
  const clearCoupon = () => setCoupon(null);

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    totalCount,
    subtotal,
    taxes,
    shippingCost,
    setShippingCost,
    coupon,
    applyCoupon,
    clearCoupon,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
};