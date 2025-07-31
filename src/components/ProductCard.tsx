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
    setTimeout(() => setAdded(false), 2000);
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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="group w-full max-w-sm mx-auto"
    >
      <Card className="bg-white relative overflow-hidden border-0 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 h-full">
        <CardHeader className="p-0 relative">
          {/* Compact Image Container */}
          <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-2xl">
            <Image
              src={product.images[currentImageIndex] || product.images[0]}
              alt={product.bagName}
              fill
              className="object-cover transition-all duration-500 ease-out group-hover:scale-105"
              placeholder="blur"
              blurDataURL="/images/placeholder.png"
            />

            {/* Compact Image Navigation Dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentImageIndex(index);
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'bg-white scale-125'
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Compact Overlay Actions */}
            <div className="absolute top-2 right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className={`p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
                  isWishlisted
                    ? 'bg-red-500 text-white shadow-md'
                    : 'bg-white/90 text-gray-700 hover:bg-white hover:text-red-500'
                }`}
              >
                <Heart size={12} className={isWishlisted ? 'fill-current' : ''} />
              </motion.button>

              <Link href={`/collections/view?id=${product._id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-1.5 rounded-full bg-white/90 text-gray-700 hover:bg-white hover:text-blue-500 backdrop-blur-sm transition-all duration-200"
                >
                  <Eye size={12} />
                </motion.button>
              </Link>
            </div>

            {/* Compact Badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {product.onSale && discountPercentage > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                  -{discountPercentage}%
                </Badge>
              )}
              {product.type === 1 && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                  New
                </Badge>
              )}
              {product.type === 2 && (
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                  Kids
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-3 space-y-2">
          {/* Compact Product Name */}
          <Link href={`/collections/view?id=${product._id}`}>
            <CardTitle className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors duration-200 cursor-pointer leading-tight">
              {product.bagName}
            </CardTitle>
          </Link>

          {/* Compact Rating & Reviews */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <div className="flex items-center">
                {[...Array(fullStars)].map((_, i) => (
                  <Star key={i} size={12} className="text-yellow-400 fill-current" />
                ))}
                {halfStar && <StarHalf size={12} className="text-yellow-400 fill-current" />}
                {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                  <Star key={i} size={12} className="text-gray-300" />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews})
              </span>
            </div>
          </div>

          {/* Compact Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900 flex items-center">
              <IndianRupeeIcon size={16} className="inline-block" />
              {product.price.toLocaleString()}
            </span>
            {product.compareAt > 0 && (
              <span className="text-sm text-gray-400 line-through flex items-center">
                <IndianRupeeIcon size={12} className="inline-block" />
                {product.compareAt.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-3 pt-0 space-y-2">
          {/* Compact Quantity Selector */}
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center bg-gray-100 rounded-full p-0.5">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  decrement();
                }}
                className="p-1.5 rounded-full hover:bg-white transition-colors duration-200"
                aria-label="Decrease quantity"
              >
                <Minus size={12} className="text-gray-600" />
              </motion.button>
              <span className="px-3 py-1 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">
                {quantity}
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault();
                  increment();
                }}
                className="p-1.5 rounded-full hover:bg-white transition-colors duration-200"
                aria-label="Increase quantity"
              >
                <Plus size={12} className="text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* Compact Add to Cart Button */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full"
          >
            <Button
              onClick={handleAddToCart}
              disabled={added}
              className={`w-full py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                added
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg'
              }`}
            >
              {added ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-center space-x-1"
                >
                  <Check size={16} />
                  <span>Added!</span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center space-x-1">
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </div>
              )}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};