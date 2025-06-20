// src/components/ProductCard.tsx
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Star, StarHalf } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  image: string;
  rating: number;     // e.g. 4.5
  reviews: number;    // e.g. 6
  price: number;      // current price
  compareAt?: number; // original price if on sale
  onSale?: boolean;
};

export const ProductCard: FC<{ product: Product }> = ({ product }) => {
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating - fullStars >= 0.5;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="
          bg-white 
          border border-gray-200 
          rounded-2xl 
          overflow-hidden
        ">
        <CardHeader className="p-0 relative">
          {/* Image wrapper: only this scales on hover */}
          <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transform transition-transform duration-300 ease-out group-hover:scale-105"
            />
          </div>
          {product.onSale && (
            <div className="
                absolute top-2 left-2 
                bg-black text-white 
                text-xs font-semibold 
                uppercase px-2 py-1 
                rounded
              ">
              Sale
            </div>
          )}
        </CardHeader>

        <CardContent className="p-4 space-y-2">
          <CardTitle className="text-sm font-medium text-black leading-snug line-clamp-2">
            {product.name}
          </CardTitle>

          <div className="flex items-center space-x-1 text-xs">
            {[...Array(fullStars)].map((_, i) => (
              <Star key={i} size={14} className="text-yellow-500" />
            ))}
            {halfStar && <StarHalf size={14} className="text-yellow-500" />}
            <span className="text-gray-500">({product.reviews})</span>
          </div>
        </CardContent>

        <CardFooter className="px-4 pb-4 pt-0 flex items-baseline justify-between">
          {product.compareAt && (
            <span className="text-gray-400 text-sm line-through">
              ₹{product.compareAt.toFixed(0)}
            </span>
          )}
          <span className="text-lg font-semibold text-black">
            ₹{product.price.toFixed(0)}
          </span>
        </CardFooter>
      </div>
    </Link>
  );
};
