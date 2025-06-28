// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import type { Testimonial as TestimonialType } from "@/components/Testimonials";
import { get } from "@/lib/api";
import HeroCarousel from "@/components/Carousel";
import CollectionCards from "@/components/collectionCard";
import Testimonials from "@/components/Testimonials";
import Banner from "@/components/Banner";
import NewsletterPage from "@/components/NewsLetterForm";

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get<{ success: boolean; items: TestimonialType[] }>(
          "/testimonials/getlist"
        );
        if (res.success) setTestimonials(res.items);
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <HeroCarousel />

      <main className="bg-white">

        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black mb-6">
              Featured Products
            </h2>
            <CollectionCards />
          </div>
        </section>

        <Banner
          image="/images/lookbook-banner.jpg"
          title="Explore Our Lookbook"
          subtitle="Handpicked styles to elevate your everyday."
          ctaText="Shop the Look"
          ctaHref="/collections/lookbook"
        />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black text-center mb-8">
              What People Are Saying
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <Testimonials items={testimonials} />
            )}
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black text-center mb-6">
              Stay in the Loop
            </h2>
            <NewsletterPage />
          </div>
        </section>
      </main>
    </>
  );
}
