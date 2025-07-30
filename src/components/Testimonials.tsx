// src/components/Testimonials.tsx
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Progress } from "@/components/ui/progress";

interface Testimonial {
  _id: string;
  quote: string;
  author: string;
}

const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTestimonials = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<{ success: boolean; items: Testimonial[] }>(
        "/testimonials/getList"
      );
      if (res.data.success) {
        setTestimonials(res.data.items);
      } else {
        setError("Failed to load testimonials.");
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Server error loading testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <Progress className="w-32 h-1 mx-auto" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            What They Say
          </h2>
          <p className="text-gray-600 text-lg">
            Real experiences from real customers
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, idx) => {
            // alternate bg/text for zebra effect
            const isDark = idx % 2 === 0;
            const bgClass = isDark ? "bg-black" : "bg-white border-2 border-black";
            const textClass = isDark ? "text-white" : "text-black";

            return (
              <div key={t._id} className={`p-8 ${bgClass} ${textClass}`}>
                <p className="text-lg font-serif italic mb-6 leading-relaxed">
                  “{t.quote}”
                </p>
                <p className="font-semibold tracking-wider text-sm uppercase">
                  {t.author}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
