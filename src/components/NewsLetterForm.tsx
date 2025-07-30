"use client";

import React, { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { post } from "@/lib/api";

export default function NewsletterPage() {
  const [email, setEmail]     = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) =>
    /^\S+@\S+\.\S+$/.test(value.trim());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const json = await post<{ success: boolean; message?: string }>("/newsletter/subscribe", {
        email: email.trim().toLowerCase(),
      });

      if (!json.success) {
        setError(json.message || "Subscription failed. Please try again.");
      } else {
        Swal.fire({
          icon: "success",
          title: "Subscribed!",
          text: "Thanks—check your inbox for the confirmation email.",
          customClass: {
            popup: "rounded-2xl p-6",
            title: "text-2xl font-semibold mb-2",
            htmlContainer: "text-gray-800",
          },
        });
        setEmail("");
      }
    } catch {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-yellow-100 to-yellow-200 py-24">
      {/* half-oval white accent */}
      <div
        aria-hidden
        className="hidden lg:block absolute inset-y-0 left-0 w-1/2 bg-white rounded-r-[250px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-12 px-6 lg:flex-row lg:gap-24">
        {/* IMAGE */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative h-64 w-64 sm:h-72 sm:w-72 md:h-80 md:w-80 lg:h-96 lg:w-96">
            <Image
              src="/images/everyday-bag.jpg"
              alt="Stylish bag"
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* TEXT & FORM */}
        <div className="w-full lg:w-1/2 text-gray-900">
          <h2 className="mb-2 text-4xl font-serif font-bold leading-snug sm:text-5xl lg:text-6xl">
            Join Our Newsletter
          </h2>
          <p className="mb-6 max-w-lg text-lg text-gray-700">
            Exclusive offers, fresh drops, and styling tips—straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 sm:flex-row">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className={
                `flex-1 rounded-full border-2 bg-white px-5 py-3 placeholder-gray-400 focus:outline-none focus:ring-0 ` +
                (error
                  ? "border-red-500 focus:border-red-500"
                  : "border-amber-400 focus:border-amber-500")
              }
            />

            <Button
              type="submit"
              disabled={loading}
              className={
                `flex shrink-0 items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition ` +
                (loading
                  ? "bg-amber-300 text-white"
                  : "bg-amber-600 text-white hover:bg-amber-700")
              }
            >
              {loading ? <span className="opacity-70">…</span> : <ArrowRight className="h-5 w-5" />}
            </Button>
          </form>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  );
}
