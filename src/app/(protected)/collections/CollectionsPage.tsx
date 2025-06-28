// src/components/CollectionsPage.tsx
"use client";

import { useState, useEffect } from "react";
import { get } from "@/lib/api";
import { ProductCard, BagColl } from "@/components/ProductCard";
import { FilterMenu } from "@/components/FilterMenu";
import { SortMenu } from "@/components/SortMenu";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  defaultType?: number;
}

const SKELETON_COUNT = 8;

export default function CollectionsPage({ defaultType }: Props) {
  const [products, setProducts] = useState<BagColl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<number | undefined>(defaultType);
  const [availability, setAvailability] = useState<"all" | "in-stock" | "out-of-stock">("all");
  const [priceSort, setPriceSort] = useState<"low-high" | "high-low" | "">("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (typeFilter != null) params.set("type", String(typeFilter));
      if (availability !== "all") params.set("availability", availability);
      if (priceSort) params.set("priceSort", priceSort);

      const url = `/bag-collections/getlist?${params.toString()}`;
      const res = await get<{ success: boolean; items: BagColl[]; message?: string }>(url);

      if (!res.success) throw new Error(res.message || "Failed to load products.");
      setProducts(res.items);
    } catch (err: any) {
      const msg = err.message || "Network error.";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Error loading products",
        text: msg,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // re-fetch whenever filters change
  useEffect(() => {
    fetchProducts();
  }, [typeFilter, availability, priceSort]);

  const clearFilters = () => {
    setAvailability("all");
    setPriceSort("");
  };

  return (
    <div className="bg-white min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <h1 className="text-4xl font-serif text-black">All Products</h1>
          <button
            onClick={clearFilters}
            disabled={loading || (availability === "all" && !priceSort)}
            className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            Clear Filters
          </button>
        </header>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <FilterMenu
            availability={availability}
            priceSort={priceSort}
            onChange={({ availability, priceSort }) => {
              setAvailability(availability);
              setPriceSort(priceSort);
            }}
          />
          <SortMenu total={products.length} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="h-80 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {products.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}