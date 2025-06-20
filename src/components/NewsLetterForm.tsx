// src/app/newsletter/page.tsx
"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value: string) =>
    /^\S+@\S+\.\S+$/.test(value.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");

    // TODO: hook up to your newsletter API

    Swal.fire({
      icon: "success",
      title: "Subscribed!",
      text: "Thanks—check your inbox for a confirmation email.",
      confirmButtonColor: "#fff",
      background: "#000",
    });

    setEmail("");
  };

  return (
    <section className="w-full bg-black relative overflow-hidden py-20">
      {/* Soft half-oval in white on the left */}
      <div
        aria-hidden
        className="absolute left-0 top-0 h-full w-1/2 bg-white rounded-r-[200px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 flex flex-col lg:flex-row items-center gap-12">
        {/* Text + Form */}
        <div className="lg:w-1/2 w-full text-black">
          <h2 className="text-4xl font-serif mb-3">Newsletter Signup</h2>
          <p className="text-lg text-gray-300 mb-6">
            Subscribe for exclusive offers and updates.
          </p>

          <form className="flex max-w-md" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                flex-1 
                rounded-l-full 
                border-gray-700 
                bg-white 
                placeholder-gray-500
                ${error ? "border-red-500" : ""}
              `}
            />
            <Button
              type="submit"
              className="rounded-r-full bg-white text-black hover:bg-gray-100 px-4 flex items-center justify-center"
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>

        {/* Bag Image */}
        <div className="lg:w-1/2 w-full flex justify-center">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
            <Image
              src="/images/bag.png"
              alt="Stylish backpack"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
