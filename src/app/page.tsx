// src/app/page.tsx
import HeroCarousel from "@/components/Carousel";
import CollectionCards from "@/components/collectionCard";
import Testimonials from "@/components/Testimonials";
import Banner from "@/components/Banner";
import NewsletterPage from "@/components/NewsLetterForm";

export type Testimonial = {
  quote: string;
  author: string;
};
const testimonials: Testimonial[] = [
  {
    quote: "Absolutely love the quality and style!",
    author: "Priya S.",
  },
  {
    quote: "Fast shipping and great customer service.",
    author: "Rahul M.",
  },
  {
    quote: "My kids adore their new outfits.",
    author: "Anjali K.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero Slider */}
      <HeroCarousel />

      {/* 2. Main content */}
      <main className="bg-white">
        {/* 2.1 Collection cards (New Arrivals / Best Sellers / Kids) */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <CollectionCards />
          </div>
        </section>

        {/* 2.2 Featured Products */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black mb-6">Featured Products</h2>
            {/* You can swap CollectionCards for a ProductGrid if you want different items */}
            <CollectionCards />
          </div>
        </section>

        {/* 2.3 Lookbook Banner */}
        <Banner
          image="/images/lookbook-banner.jpg"
          title="Explore Our Lookbook"
          subtitle="Handpicked styles to elevate your everyday."
          ctaText="Shop the Look"
          ctaHref="/collections/lookbook"
        />

        {/* 2.4 Testimonials */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black text-center mb-8">What People Are Saying</h2>
            <Testimonials items={testimonials} />
          </div>
        </section>

        {/* 2.5 Newsletter Signup */}
        <section className="py-12 bg-white-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-serif text-black text-center mb-6">Stay in the Loop</h2>
            <NewsletterPage />
          </div>
        </section>
      </main>
    </>
  );
}
