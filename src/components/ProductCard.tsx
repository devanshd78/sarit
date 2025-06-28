"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, IndianRupeeIcon } from "lucide-react";

export type BagColl = {
  _id: string;
  title: string;
  bagName: string;
  description: string;
  productDescription?: string;
  href: string;
  type: 1 | 2;
  price: number;
  compareAt: number;
  onSale: boolean;
  quantity: number;
  deliveryCharge: number;
  rating: number;
  reviews: number;
  dimensions: { width: number; height: number; depth: number; unit: string };
  weight: { value: number; unit: string };
  material?: string;
  colors: string[];
  capacity?: string;
  brand?: string;
  features: string[];
  images: string[];
  createdAt: string;
};

export const ProductCard: FC<{ product: BagColl }> = ({ product }) => {
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating - fullStars >= 0.5;

  return (
    <Link
      href={`/collections/view?id=${product._id}`}
      className="group block"
    >
      <motion.div
        className="group block"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="relative overflow-hidden p-0 border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <div className="relative w-full aspect-square bg-gray-100">
              <Image
                src={product.images[0]}
                alt={product.bagName}
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                placeholder="blur"
                blurDataURL="/images/placeholder.png"
              />
            </div>
            {product.onSale && (
              <Badge variant="outline" className="absolute top-2 left-2 bg-red-400 text-white">
                Sale
              </Badge>
            )}
            {product.type === 1 && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-blue-400 text-white">
                New
              </Badge>
            )}
            {product.type === 2 && (
              <Badge variant="outline" className="absolute top-2 right-2 bg-green-400 text-white">
                Kids
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            <CardTitle className="text-base font-semibold text-gray-900 line-clamp-2">
              {product.bagName}
            </CardTitle>
            <p className="text-sm text-gray-600 line-clamp-3">
              {product.description}
            </p>
            <div className="flex items-center space-x-1">
              {[...Array(fullStars)].map((_, i) => (
                <Star key={i} size={16} className="text-yellow-500" />
              ))}
              {halfStar && <StarHalf size={16} className="text-yellow-500" />}
              <span className="text-sm text-gray-500">({product.reviews})</span>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 pt-0 space-y-2 sm:space-y-0">
            <div className="flex items-baseline space-x-2">
              {product.compareAt > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  <IndianRupeeIcon size={14} className="inline" />
                  {product.compareAt.toFixed(0)}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900 flex items-center">
                <IndianRupeeIcon size={18} className="inline" />
                {product.price.toFixed(0)}
              </span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
};
