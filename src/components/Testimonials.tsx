// src/components/Testimonials.tsx
"use client";

import React from "react";

export type Testimonial = {
  quote: string;
  author: string;
};

export default function Testimonials({
  items,
}: {
  items: Testimonial[];
}) {
  return (
    <div className="flex overflow-x-auto space-x-6 py-4">
      {items.map((t, i) => (
        <blockquote
          key={i}
          className="flex-none w-80 p-6 bg-white border border-gray-200 rounded-2xl"
        >
          <p className="text-gray-800 mb-4">“{t.quote}”</p>
          <footer className="text-sm font-semibold text-black">
            — {t.author}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}
