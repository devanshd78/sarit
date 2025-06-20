// src/components/Banner.tsx
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

export interface BannerProps {
  /** Background image URL (public folder or remote) */
  image: string;
  /** Main heading */
  title: string;
  /** Subheading or description */
  subtitle: string;
  /** CTA button text */
  ctaText: string;
  /** CTA link href */
  ctaHref: string;
}

const Banner: FC<BannerProps> = ({
  image,
  title,
  subtitle,
  ctaText,
  ctaHref,
}) => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden rounded-lg">
      {/* Background image */}
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif text-white font-semibold mb-2">
          {title}
        </h2>
        <p className="text-sm md:text-base lg:text-lg text-white max-w-2xl mb-4">
          {subtitle}
        </p>
        <Link
          href={ctaHref}
          className="inline-block bg-white text-black uppercase text-sm md:text-base font-medium px-6 py-2 rounded hover:bg-gray-100 transition"
        >
          {ctaText}
        </Link>
      </div>
    </div>
  );
};

export default Banner;
