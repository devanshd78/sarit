// src/components/CollectionCards.tsx
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface Collection {
  title: string;
  subtitle: string;
  imageSrc: string;
  href: string;
}

const collections: Collection[] = [
  {
    title: "New Arrivals",
    subtitle: "Explore Our Collection →",
    imageSrc: "/images/card-new.jpg",
    href: "/collections/new-arrivals",
  },
  {
    title: "Best Sellers",
    subtitle: "Explore Our Collection →",
    imageSrc: "/images/card-best.jpg",
    href: "/collections/best-sellers",
  },
  {
    title: "Kids Collection",
    subtitle: "Explore Our Collection →",
    imageSrc: "/images/card-kids.jpg",
    href: "/collections/kids-collection",
  },
];

const CollectionCards: FC = () => (
  <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {collections.map((col) => (
      <Link key={col.href} href={col.href} className="group">
        <Card className="overflow-hidden hover:shadow-lg transition">
          <div className="relative h-64">
            <Image
              src={col.imageSrc}
              alt={col.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          </div>
          <CardContent className="pt-4">
            <CardTitle className="text-xl">{col.title}</CardTitle>
            <CardDescription className="flex items-center text-sm text-gray-600">
              {col.subtitle}
              <ChevronRight className="w-4 h-4 ml-1" />
            </CardDescription>
          </CardContent>
        </Card>
      </Link>
    ))}
  </div>
);

export default CollectionCards;
