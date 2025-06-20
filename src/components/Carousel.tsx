// src/components/HeroCarousel.tsx
"use client";

import { FC } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

interface Slide {
  title: string;
  subtitle: string;
  imageSrc: string;
  ctaHref: string;
  ctaText:string;
}

const slides: Slide[] = [
  {
    title: "New Arrivals",
    subtitle: "Discover the hottest trends and must-have looks",
    imageSrc: "/images/hero-1.jpg",
    ctaHref: "/collections/new-arrivals",
    ctaText: "Shop Now",
  },
  {
    title: "Summer Specials",
    subtitle: "Brighten your day with our summer range",
    imageSrc: "/images/hero-2.jpg",
    ctaHref: "/collections/summer-specials",
    ctaText: "Explore Summer",
  },
  {
    title: "Kids Collection",
    subtitle: "Fun and functional backpacks for every kid",
    imageSrc: "/images/hero-3.jpg",
    ctaHref: "/collections/kids-collection",
    ctaText: "Shop Kids",
  },
];

const HeroCarousel: FC = () => {
  return (
    <div className="relative w-full">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-[500px]"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              <Image
                src={slide.imageSrc}
                alt={slide.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-4xl font-bold text-white mb-2">
                  {slide.title}
                </h2>
                <p className="text-lg text-white mb-4">{slide.subtitle}</p>
                <a
                  href={slide.ctaHref}
                  className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition"
                >
                  {slide.ctaText}
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;
