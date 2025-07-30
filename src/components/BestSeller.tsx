// src/components/BestSellers.tsx
"use client";

import { FC, useState, useEffect, useRef } from "react";
import { get } from "@/lib/api";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, BagColl } from "@/components/ProductCard";

export const BestSellers: FC = () => {
  const [items, setItems]       = useState<BagColl[]>([]);
  const [loading, setLoading]   = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await get<{ success: boolean; items: BagColl[] }>(
          "/bag-collections/best-sellers"
        );
        if (res.success) setItems(res.items);
      } catch (err) {
        console.error("Failed to load best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const scroll = (offset: number) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Best Sellers
          </h2>
          <p className="text-gray-400 mt-2">
            Our most-loved backpacks
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center">
            <Progress className="w-32 h-1" />
          </div>
        )}

        {/* Carousel */}
        {!loading && (
          <div className="relative">
            <div
              ref={sliderRef}
              className="flex overflow-x-auto space-x-6 snap-x snap-mandatory scroll-px-6 pb-4"
            >
              {items.map((prod) => (
                <div
                  key={prod._id}
                  className="snap-start flex-none w-[280px] md:w-[320px]"
                >
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>

            {/* Arrows (desktop) */}
            <button
              onClick={() =>
                scroll(-(sliderRef.current?.offsetWidth ?? 0) / 2)
              }
              aria-label="Scroll left"
              className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() =>
                scroll((sliderRef.current?.offsetWidth ?? 0) / 2)
              }
              aria-label="Scroll right"
              className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full shadow hover:bg-gray-100 transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
