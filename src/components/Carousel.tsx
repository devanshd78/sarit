import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronDown } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen md:h-[85vh] lg:h-[75vh] overflow-hidden">
      {/* Background Image from Pexels */}
      <Image
        src="https://images.pexels.com/photos/4887255/pexels-photo-4887255.jpeg"
        alt="Collection of stylish bags"
        fill
        className="object-cover"
        unoptimized
        priority
      />
      {/* <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div> */}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-4 tracking-tight">
          Carry Confidence
        </h1>
        <p className="max-w-xl text-base sm:text-lg md:text-xl text-gray-200 mb-8 tracking-wide">
          Premium School & Everyday Bags Designed for You
        </p>
        <Link
          href="/collections/all"
          className="group inline-flex items-center bg-white text-black px-8 py-3 text-lg font-medium rounded-full tracking-wide transition-all duration-300 hover:bg-transparent hover:text-white border-2 border-white"
        >
          Shop Now
          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white opacity-75" />
      </div>
    </section>
  );
};

export default Hero;