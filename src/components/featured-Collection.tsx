import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const FeaturedCollections: React.FC = () => {
  const collections = [
    {
      title: 'Kids Collection',
      tagline: 'Fun & durable bags for young explorers',
      image: './images/kids-collection.jpg',
      href: '/collections/kids-collection'
    },
    {
      title: 'New Arrivals',
      tagline: 'Fresh styles just landed',
      image: './images/new-arrivals.jpg',
      href: '/collections/new-arrivals'
    },
    {
      title: 'Everyday Backpacks',
      tagline: 'Your reliable daily companion',
      image: './images/everyday-bag.jpg',
      href: '/collections/everyday-backpacks'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg">Discover our signature ranges</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              href={collection.href}
              className="block border-2 border-black bg-white group hover:bg-black hover:text-white transition-all duration-300 cursor-pointer"
            >
              <div className="p-8">
                <div className="aspect-square mb-6 overflow-hidden">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-2xl font-bold font-serif mb-3">
                  {collection.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-300 mb-6">
                  {collection.tagline}
                </p>
                <div className="flex items-center font-semibold">
                  <span className="mr-2">Explore</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
