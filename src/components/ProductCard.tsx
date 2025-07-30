"use client";

import { FC, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Star,
  StarHalf,
  IndianRupeeIcon,
  Minus,
  Plus,
  Check,
  Heart,
  Eye,
  ShoppingBag
} from "lucide-react";
import { useCart } from "@/components/context/CartContext";

export type BagColl = {
  _id: string;
  bagName: string;
  description: string;
  href: string;
  type: 1 | 2;
  price: number;
  compareAt: number;
  onSale: boolean;
  rating: number;
  reviews: number;
  images: string[];
};

export const ProductCard: FC<{ product: BagColl }> = ({ product }) => {
  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating - fullStars >= 0.5;
  const { addItem } = useCart();

  // local states
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ ...product, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Reset after 2 seconds
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.compareAt > 0
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group w-md sm:w-sm md:w-md"
    >
      <Card className="bg-white relative overflow-hidden border-0 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
        <CardHeader className="p-0 relative">
          {/* Image Container with Multiple Images */}
          <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-3xl">
            <Image
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.bagName}
              fill
              className="object-cover transition-all duration-700 ease-out group-hover:scale-110"
              placeholder="blur"
              blurDataURL="/images/placeholder.png"
            />

            {/* Image Navigation Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/60 hover:bg-white/80'
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Overlay Actions */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 ${isWishlisted
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
                  }`}
              >
                <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
              </motion.button>

              <Link href={`/collections/view?id=${product._id}`}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 backdrop-blur-md transition-all duration-200"
                >
                  <Eye size={16} />
                </motion.button>
              </Link>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col space-y-2">
              {product.onSale && discountPercentage > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.type === 1 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                  New
                </Badge>
              )}
              {product.type === 2 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                  Kids
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {/* Product Name */}
          <Link href={`/collections/view?id=${product._id}`}>
            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
              {product.bagName}
            </CardTitle>
          </Link>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-current" />
                ))}
                {halfStar && <StarHalf size={16} className="text-yellow-400 fill-current" />}
                {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                  <Star key={i} size={16} className="text-gray-300" />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                {product.rating.toFixed(1)} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900 flex items-center">
                <IndianRupeeIcon size={20} className="inline-block" />
                {product.price.toLocaleString()}
              </span>
              {product.compareAt > 0 && (
                <span className="text-lg text-gray-400 line-through flex items-center">
                  <IndianRupeeIcon size={16} className="inline-block" />
                  {product.compareAt.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-4 p-4">
  {/* — Quantity — */}
  <div className="flex items-center rounded-full bg-gray-100 p-1">
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        decrement();
      }}
      aria-label="Decrease quantity"
      className="rounded-full p-2 transition-colors duration-200 hover:bg-white"
    >
      <Minus size={16} className="text-gray-600" />
    </motion.button>

    <span className="min-w-[3rem] px-4 text-center text-lg font-semibold text-gray-900">
      {quantity}
    </span>

    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={(e) => {
        e.preventDefault();
        increment();
      }}
      aria-label="Increase quantity"
      className="rounded-full p-2 transition-colors duration-200 hover:bg-white"
    >
      <Plus size={16} className="text-gray-600" />
    </motion.button>
  </div>

  {/* — Add to cart — */}
  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
    <Button
      onClick={handleAddToCart}
      disabled={added}
      className={`flex items-center space-x-2 rounded-2xl px-6 py-3 text-base font-semibold transition-all duration-300 ${
        added
          ? 'bg-green-500 text-white hover:bg-green-600'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl'
      }`}
    >
      {added ? (
        <>
          <Check size={20} />
          <span>Added!</span>
        </>
      ) : (
        <>
          <ShoppingBag size={20} />
          <span>Add&nbsp;to&nbsp;Cart</span>
        </>
      )}
    </Button>
  </motion.div>
</CardFooter>
      </Card>
    </motion.div>
  );
};