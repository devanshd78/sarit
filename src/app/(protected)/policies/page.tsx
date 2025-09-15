// Save as: app/policies/page.tsx (Next.js App Router)
// If you're using the Pages Router, rename to: pages/policies/index.tsx

import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ShieldCheck, RotateCcw, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Policies | Zexa Store",
  description: "Browse Zexa's legal and customer service policies: Terms, Privacy, Returns, and Shipping.",
  alternates: { canonical: "/policies" },
};

const PolicyCard = ({
  href,
  title,
  description,
  icon: Icon,
  updated,
}: {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  updated?: string;
}) => (
  <Link
    href={href}
    className="group block rounded-2xl border border-gray-200 p-6 hover:shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-black"
  >
    <div className="flex items-start gap-4">
      <div className="rounded-xl border border-gray-200 p-3">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold group-hover:underline">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>
        {updated ? (
          <p className="mt-2 text-xs text-gray-500">Last updated: {updated}</p>
        ) : null}
      </div>
    </div>
  </Link>
);

export default function PoliciesIndexPage() {
  return (
    <main className="bg-white text-gray-900">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700">Policies</li>
          </ol>
        </nav>

        <header>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Policies</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">
            Here you can find our store policies and legal terms. If you have any questions, please
            <Link href="/contact" className="underline ml-1">contact support</Link>.
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PolicyCard
            href="/policies/terms-of-service"
            title="Terms of Service"
            description="Your agreement with Zexa when you use our website and purchase products."
            icon={FileText}
            updated="14 September 2025"
          />
          <PolicyCard
            href="/policies/privacy-policy"
            title="Privacy Policy"
            description="How we collect, use, and protect your personal information."
            icon={ShieldCheck}
          />
          <PolicyCard
            href="/policies/return-and-refund-policy"
            title="Return & Refund Policy"
            description="Returns, cancellations, exchanges, and refund timelines."
            icon={RotateCcw}
            updated="14 September 2025"
          />
          <PolicyCard
            href="/policies/shipping-and-delivery-policy"
            title="Shipping & Delivery Policy"
            description="Processing times, delivery estimates, tracking, and serviceability."
            icon={Truck}
            updated="14 September 2025"
          />
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <p className="text-sm text-gray-700">
            Looking for something else? Visit our {" "}
            <Link href="/faq" className="underline">FAQ</Link> or {" "}
            <Link href="/contact" className="underline">Contact Support</Link>.
          </p>
        </div>
      </section>
    </main>
  );
}
