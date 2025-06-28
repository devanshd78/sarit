// src/components/CollectionCards.tsx
"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { get } from "@/lib/api";

export type CollectionType = {
  _id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
};

const CollectionCards: FC = () => {
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await get<{ success: boolean; items: CollectionType[] }>(
          "/collections/getlist"
        );
        if (res.success) {
          setCollections(res.items);
        }
      } catch (err) {
        console.error("Failed to load collections:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">Loading collections…</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((col) => (
        <Link key={col._id} href={col.href} className="group block">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <Image
                src={col.image}      // now a data-URI string
                alt={col.title}
                fill
                unoptimized
                className="object-cover group-hover:scale-105 transition-transform duration-300"
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
};

export default CollectionCards;
