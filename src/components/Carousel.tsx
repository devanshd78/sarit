// src/components/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { get } from "@/lib/api";

export type SlideType = {
  _id: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaText?: string;
  image: string;           // data URI
};

export default function HeroCarousel() {
  const [slides, setSlides] = useState<SlideType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlides() {
      try {
        const res = await get<{ success: boolean; items: SlideType[] }>(
          "/slides/getlist"
        );
        if (res.success) {
          setSlides(res.items);
        }
      } catch (err) {
        console.error("Error loading slides:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">Loading slides…</span>
      </div>
    );
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-[500px]"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                unoptimized
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-lg text-white mb-4">{slide.subtitle}</p>
                )}
                {slide.ctaHref && slide.ctaText && (
                  <a
                    href={slide.ctaHref}
                    className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    {slide.ctaText}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
