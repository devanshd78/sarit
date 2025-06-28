// src/components/Testimonials.tsx
"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";


export type Testimonial = {
  quote: string;
  author: string;
};


const Testimonials: FC<{ items: Testimonial[] }> = ({ items }) => {
  return (
    <div className="relative w-full py-8">
      {/* Prev / Next buttons */}
      <button
        className="swiper-button-prev-custom absolute left-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="Previous testimonial"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        className="swiper-button-next-custom absolute right-0 top-1/2 z-10 -translate-y-1/2 p-2 bg-white rounded-full shadow hover:bg-gray-100"
        aria-label="Next testimonial"
      >
        <ChevronRight size={20} />
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1.2 },
          768: { slidesPerView: 1.5 },
          1024: { slidesPerView: 2 },
        }}
      >
        {items.map((t, i) => (
          <SwiperSlide key={i}>
            <blockquote className="h-full flex flex-col justify-between p-6 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <p className="text-gray-800 italic text-lg mb-4 flex-grow">
                “{t.quote}”
              </p>
              <footer className="text-sm font-semibold text-black mt-4">
                — {t.author}
              </footer>
            </blockquote>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Testimonials;
