// src/pages/collection/view.tsx
"use client";

import { useState, useEffect, FC } from "react";
import { useSearchParams } from "next/navigation";
import { get } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  StarHalf,
  Truck,
  IndianRupeeIcon,
  Share2,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useCart } from "@/components/context/CartContext";

// Fully expanded TypeScript type matching your backend schema:
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

const ProductViewPage: FC = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { addItem } = useCart();

  const [product, setProduct] = useState<BagColl | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    get<{ success: boolean; item: BagColl }>(`/bag-collections/get/${id}`)
      .then((res) => {
        if (res.success) setProduct(res.item);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="container mx-auto p-8 text-center">Loading…</div>
    );
  if (!product)
    return (
      <div className="container mx-auto p-8 text-center">
        Product not available
      </div>
    );

  const fullStars = Math.floor(product.rating);
  const halfStar = product.rating - fullStars >= 0.5;

  const handleAddToCart = () => {    
    addItem({ ...product, quantity });
    setAdded(true);
  };

  return (
    <div className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-12">
      {/* Left: Thumbnails + Main Image */}
      <div className="space-y-4">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={product.images[selectedImage]}
            alt={product.bagName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex space-x-3 overflow-x-auto">
          {product.images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative h-24 w-24 rounded-lg overflow-hidden transform transition hover:scale-105 focus:outline-none ${
                idx === selectedImage
                  ? "ring-2 ring-black"
                  : "ring-1 ring-gray-200"
              }`}
            >
              <Image
                src={img}
                alt={`${product.bagName} ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className="flex flex-col space-y-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {product.bagName}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {product.brand && (
            <span>
              <strong>Brand:</strong> {product.brand}
            </span>
          )}
          {product.material && (
            <span>
              <strong>Material:</strong> {product.material}
            </span>
          )}
          {product.capacity && (
            <span>
              <strong>Capacity:</strong> {product.capacity}
            </span>
          )}
          {product.colors.length > 0 && (
            <span>
              <strong>Colors:</strong> {product.colors.join(", ")}
            </span>
          )}
        </div>

        {/* Price & Rating */}
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold flex items-center">
            <IndianRupeeIcon size={24} className="inline mr-1" />
            {product.price.toFixed(0)}
          </div>
          <div className="flex items-center text-yellow-500">
            {Array.from({ length: fullStars }, (_, i) => (
              <Star key={i} size={20} />
            ))}
            {halfStar && <StarHalf size={20} />}
          </div>
        </div>

        {/* Quantity + Add to Cart / Buy Now */}
        <div className="flex items-center space-x-4">
          <div className="flex border border-gray-300 rounded-md overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 hover:bg-gray-100"
            >
              –
            </button>
            <span className="px-6 text-gray-900 font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 py-2 hover:bg-gray-100"
            >
              +
            </button>
          </div>
          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-md text-white font-semibold transition-colors ${
              added ? "bg-green-600 hover:bg-green-700" : "bg-black hover:bg-gray-800"
            }`}
          >
            {added ? "Added to Cart" : "Add to Cart"}
          </motion.button>
        </div>

        <button className="w-full py-3 text-center text-black font-semibold border border-black rounded-md hover:bg-gray-100 transition">
          Buy It Now
        </button>

        {/* Accordion: Description / Shipping / Returns */}
        <Accordion type="single" collapsible className="mt-8">
          <AccordionItem value="overview">
            <AccordionTrigger>Overview</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 text-sm">
                {product.productDescription || product.description}
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="shipping">
            <AccordionTrigger>Shipping Info</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 text-sm">
                Free shipping on orders over ₹999; delivery in 5–7 days.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="returns">
            <AccordionTrigger>Returns & Exchanges</AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-700 text-sm">
                Return within 30 days for a full refund.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Tabs: Specs / Reviews / Warranty */}
        <div className="mt-8">
          <Tabs defaultValue="specs">
            <TabsList>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
            </TabsList>

            <TabsContent value="specs">
              <ul className="text-sm text-gray-700 space-y-2">
                {product.material && (
                  <li>
                    <strong>Material:</strong> {product.material}
                  </li>
                )}
                <li>
                  <strong>Dimensions:</strong>{" "}
                  {`${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth} ${product.dimensions.unit}`}
                </li>
                <li>
                  <strong>Weight:</strong>{" "}
                  {`${product.weight.value} ${product.weight.unit}`}
                </li>
                {product.capacity && (
                  <li>
                    <strong>Capacity:</strong> {product.capacity}
                  </li>
                )}
                {product.colors.length > 0 && (
                  <li>
                    <strong>Available Colors:</strong>{" "}
                    {product.colors.join(", ")}
                  </li>
                )}
                {product.features.length > 0 && (
                  <li>
                    <strong>Features:</strong> {product.features.join(", ")}
                  </li>
                )}
              </ul>
            </TabsContent>

            <TabsContent value="reviews">
              {product.reviews > 0 ? (
                <p className="text-sm text-gray-700">
                  {product.reviews} review
                  {product.reviews > 1 ? "s" : ""}.
                </p>
              ) : (
                <p className="text-sm text-gray-700">
                  No reviews yet. Be the first to review!
                </p>
              )}
            </TabsContent>

            <TabsContent value="warranty">
              <p className="text-sm text-gray-700">
                1-year warranty on manufacturing defects.
              </p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Social Share */}
        <div className="mt-8 flex items-center space-x-4 text-gray-600">
          <Share2 size={24} className="hover:text-gray-900 cursor-pointer" />
          <Link href="#" className="hover:text-gray-900">
            Share on Facebook
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPage;
