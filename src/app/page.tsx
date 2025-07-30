// src/app/page.tsx
"use client";

import HeroCarousel from "@/components/Carousel";
import CollectionCards from "@/components/featured-Collection";
import Testimonials from "@/components/Testimonials";
import { BestSellers } from "@/components/BestSeller";
import NewsletterPage from "@/components/NewsLetterForm";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />

      <main className="bg-white">
        <CollectionCards />

        <BestSellers />

        <div className="container mx-auto px-4">
          <Testimonials />
        </div>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-6">
              Stay in the Loop
            </h2>
            <p className="text-gray-600 text-lg mb-12">Get exclusive access to new collections and special offers</p>
            <NewsletterPage />
          </div>
        </section>
      </main>
    </>
  );
}
