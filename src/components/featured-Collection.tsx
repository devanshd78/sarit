'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';

// ---------- types ----------
interface ApiCollection {
  _id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string; // data URI from API
  createdAt: string;
  updatedAt: string;
}

interface Collection {
  id: string;
  title: string;
  tagline: string;
  image: string;
  href: string;
  priority?: boolean;
}

interface FeaturedCollectionsProps {
  className?: string;
}

// ---------- UI bits ----------
const CollectionSkeleton: React.FC = () => (
  <div className="border-2 border-gray-200 bg-white rounded-2xl overflow-hidden animate-pulse">
    <div className="p-6 md:p-8">
      <div className="aspect-square mb-6 bg-gray-200 rounded-xl" />
      <div className="h-8 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded mb-6 w-3/4" />
      <div className="h-6 bg-gray-200 rounded w-24" />
    </div>
  </div>
);

const CollectionError: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <div className="border-2 border-red-200 bg-red-50 rounded-2xl p-6 md:p-8 text-center">
    <div className="text-red-600 mb-4">
      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to load collection</h3>
    <p className="text-red-600 text-sm mb-4">Please try again later</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        Retry
      </button>
    )}
  </div>
);

const CollectionCard: React.FC<{
  collection: Collection;
  index: number;
  onImageError: (id: string) => void;
}> = ({ collection, index, onImageError }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
    onImageError(collection.id);
  };

  const handleImageLoad = () => setImageLoading(false);

  if (imageError) return <CollectionError />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link
        href={collection.href}
        className="block border-2 border-black bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-black/20 focus:border-gray-600"
        aria-label={`Explore ${collection.title} collection - ${collection.tagline}`}
      >
        <div className="p-6 md:p-8">
          <div className="relative aspect-square mb-6 overflow-hidden rounded-xl bg-gray-100">
            <AnimatePresence>
              {imageLoading && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-gray-100"
                >
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </motion.div>
              )}
            </AnimatePresence>

            <Image
              src={collection.image}
              alt={`${collection.title} collection featuring ${collection.tagline.toLowerCase()}`}
              fill
              className={`object-cover transition-all duration-700 ease-out group-hover:scale-110 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={collection.priority}
              onLoad={handleImageLoad}
              onError={handleImageError}
              // Using data URIs from API works fine with next/image.
              // If you switch to streaming endpoint URLs, consider `unoptimized` or configuring next.config images.
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>

          <div className="space-y-3">
            <motion.h3
              className="text-2xl md:text-3xl font-bold font-serif text-gray-900 transition-colors duration-500"
              whileHover={{ scale: 1.02 }}
            >
              {collection.title}
            </motion.h3>

            <p className="text-gray-600 transition-colors duration-500 leading-relaxed">
              {collection.tagline}
            </p>

            <motion.div
              className="flex items-center font-semibold text-gray-900 transition-colors duration-500 pt-2"
              whileHover={{ x: 4 }}
            >
              <span className="mr-2 tracking-wide">EXPLORE</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
            </motion.div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-2xl" />
      </Link>
    </motion.div>
  );
};

// ---------- Main ----------
const FeaturedCollections: React.FC<FeaturedCollectionsProps> = ({ className = '' }) => {
  const [items, setItems] = useState<ApiCollection[] | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''; // leave empty if same origin
  const endpoint = `${API_BASE}/collections/getlist`;

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(endpoint, { signal: controller.signal, headers: { 'Accept': 'application/json' } })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data?.success) throw new Error('API returned an error shape');
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to fetch');
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [endpoint]);

  useEffect(() => {
    const abort = fetchData();
    return abort;
  }, [fetchData]);

  const handleImageError = (id: string) => {
    setFailedImages((prev) => new Set(prev).add(id));
  };

  const uiCollections: Collection[] = useMemo(() => {
    if (!items) return [];
    return items
      .map((x) => ({
        id: x._id,
        title: x.title,
        tagline: x.subtitle,
        image: x.image, // data URI
        href: x.href,
      }))
      // optional: prioritize first 3 most recent
      .sort((a, b) => {
        const A = items.find((i) => i._id === a.id)?.createdAt ?? '';
        const B = items.find((i) => i._id === b.id)?.createdAt ?? '';
        return new Date(B).getTime() - new Date(A).getTime();
      });
  }, [items]);

  return (
    <section className={`py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif mb-6 text-gray-900 tracking-tight">
            Featured Collections
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Discover our signature ranges crafted for every journey
          </p>
        </motion.div>

        {/* Loading / Error / Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[...Array(3)].map((_, i) => (
              <CollectionSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto">
            <CollectionError onRetry={fetchData} />
          </div>
        ) : (
          <>
            {uiCollections.length === 0 ? (
              <div className="text-center text-gray-600">No collections yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                {uiCollections.map((collection, index) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    index={index}
                    onImageError={handleImageError}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <motion.div
          className="text-center mt-16 md:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link
            href="/collections"
            className="inline-flex items-center px-8 py-4 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-black/20"
          >
            <span className="mr-2">VIEW ALL COLLECTIONS</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
