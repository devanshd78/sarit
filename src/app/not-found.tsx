// src/app/not-found.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { AlertTriangle, Home, LifeBuoy } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-6">
      <Card className="max-w-lg w-full shadow-2xl rounded-2xl overflow-hidden">
        {/* Illustration */}
        <div className="relative h-48 w-full bg-blue-50">
          <Image
            src="/assets/404-illustration.svg"
            alt="Page Not Found Illustration"
            fill
            className="object-contain"
          />
        </div>

        {/* Header */}
        <CardHeader className="text-center p-6">
          <AlertTriangle className="mx-auto text-red-500 w-12 h-12" />
          <CardTitle className="mt-4 text-3xl font-extrabold text-gray-900">
            Page Not Found
          </CardTitle>
          <CardDescription className="mt-2 text-gray-600">
            Oops! The page you’re looking for doesn’t exist or has been moved.
          </CardDescription>
        </CardHeader>

        {/* Actions */}
        <CardContent className="px-6 pb-8 flex justify-center space-x-4">
          <Button variant="default" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact" className="flex items-center space-x-2">
              <LifeBuoy className="w-5 h-5" />
              <span>Contact Support</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
