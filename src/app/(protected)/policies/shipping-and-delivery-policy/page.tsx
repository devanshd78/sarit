// Save as: app/policies/shipping-and-delivery-policy/page.tsx (Next.js App Router)
// If you're using the Pages Router, rename to: pages/policies/shipping-and-delivery-policy.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy | Zexa Store",
  description:
    "Zexa Pvt. Ltd. shipping policy: processing times, methods, charges, delivery timelines, tracking, serviceability, and claims.",
  alternates: { canonical: "/policies/shipping-and-delivery-policy" },
};

export default function ShippingPolicyPage() {
  return (
    <main className="bg-white text-gray-900">
      {/* Header / Hero */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:underline">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/policies" className="hover:underline">Policies</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-gray-700">Shipping &amp; Delivery Policy</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Shipping &amp; Delivery Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 14 September 2025</p>

        <p className="mt-6 leading-relaxed">
          We ship bag orders across India using our logistics partner <strong>Delhivery</strong> (and trusted alternatives where necessary to ensure coverage and speed).
        </p>

        {/* On this page / TOC */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="font-semibold">On this page</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li><a href="#order-processing" className="hover:underline">1) Order Processing</a></li>
            <li><a href="#shipping-methods-charges" className="hover:underline">2) Shipping Methods &amp; Charges</a></li>
            <li><a href="#delivery-timelines" className="hover:underline">3) Delivery Timelines</a></li>
            <li><a href="#tracking-updates" className="hover:underline">4) Tracking &amp; Updates</a></li>
            <li><a href="#delivery-attempts" className="hover:underline">5) Delivery Attempts &amp; Undeliverable Orders</a></li>
            <li><a href="#delivery-checks" className="hover:underline">6) Delivery Checks &amp; Claims</a></li>
            <li><a href="#serviceability" className="hover:underline">7) Serviceability &amp; Exceptions</a></li>
            <li><a href="#lost-delayed" className="hover:underline">8) Lost, Delayed, or Stuck Parcels</a></li>
            <li><a href="#packaging" className="hover:underline">9) Packaging</a></li>
            <li><a href="#company-details" className="hover:underline">Company Details</a></li>
          </ul>
        </div>

        {/* 1) Order Processing */}
        <section id="order-processing" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">1) Order Processing</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Processing time:</strong> Orders are typically processed within 24–48 working hours (Mon–Sat), excluding Sundays/official holidays and periods of abnormal order volume.
            </li>
            <li>
              <strong>Address changes:</strong> We can update addresses before dispatch only. After shipping, address changes aren’t guaranteed and are subject to the courier’s policy.
            </li>
            <li>
              <strong>GST invoice:</strong> A tax invoice will be provided with your shipment or via email.
            </li>
          </ul>
        </section>

        {/* 2) Shipping Methods & Charges */}
        <section id="shipping-methods-charges" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">2) Shipping Methods &amp; Charges</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Courier service:</strong> Primarily Delhivery. For certain PIN codes or operational reasons, we may ship via another reputed partner.
            </li>
            <li>
              <strong>Charges:</strong> Displayed at checkout based on destination, weight/volumetric weight, and service level. Any free-shipping offers will be clearly shown at checkout.
            </li>
            <li>
              <strong>COD (Cash on Delivery):</strong> If enabled, COD fees (if any) will be shown at checkout. The courier may require exact change and may call prior to delivery.
            </li>
          </ul>
        </section>

        {/* 3) Delivery Timelines */}
        <section id="delivery-timelines" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">3) Delivery Timelines</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              <strong>Metro &amp; Tier-1 cities:</strong> Usually 2–5 working days post-dispatch.
            </li>
            <li>
              <strong>Other serviceable locations:</strong> Usually 3–7 working days post-dispatch.
            </li>
            <li>
              <strong>Remote/ODA locations:</strong> May take 7–10+ working days.
            </li>
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            Timelines are estimates and can vary due to weather, festivals, operational backlogs, or force-majeure events.
          </p>
        </section>

        {/* 4) Tracking & Updates */}
        <section id="tracking-updates" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">4) Tracking &amp; Updates</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>You’ll receive a tracking link/AWB number via SMS/email after dispatch.</li>
            <li>Live status is available on the courier’s tracking page. For assistance, contact our support with your Order ID and AWB.</li>
          </ul>
        </section>

        {/* 5) Delivery Attempts & Undeliverable Orders */}
        <section id="delivery-attempts" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">5) Delivery Attempts &amp; Undeliverable Orders</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Couriers will make one or more delivery attempts and may contact you by phone/SMS.</li>
            <li>
              If delivery fails (e.g., not reachable, address incomplete, premises closed, COD not ready/refused), the shipment may be returned to origin (RTO).
            </li>
            <li>
              We can re-ship after reconfirming your address; re-shipping charges may apply. For prepaid orders not re-shipped, we’ll refund the item value after deducting two-way shipping costs if levied by the carrier.
            </li>
          </ul>
        </section>

        {/* 6) Delivery Checks & Claims */}
        <section id="delivery-checks" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">6) Delivery Checks &amp; Claims</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>Please check that the outer carton is intact and not tampered before accepting.</li>
            <li>
              If tampered/damaged, either refuse delivery or note the issue with the delivery agent and contact us within 48 hours with photos/video.
            </li>
            <li>
              For short-shipment/missing items, share an unboxing video (if available) to expedite resolution.
            </li>
          </ul>
        </section>

        {/* 7) Serviceability & Exceptions */}
        <section id="serviceability" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">7) Serviceability &amp; Exceptions</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>We currently ship only within India.</li>
            <li>Certain PIN codes may be unserviceable or restricted for COD, depending on courier network coverage.</li>
            <li>Bulky/oversized items may attract different delivery arrangements or timelines (you’ll be informed if applicable).</li>
          </ul>
        </section>

        {/* 8) Lost, Delayed, or Stuck Parcels */}
        <section id="lost-delayed" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">8) Lost, Delayed, or Stuck Parcels</h2>
          <ul className="mt-2 list-disc pl-5 space-y-2">
            <li>
              If a parcel appears stuck in transit or delayed, contact support; we’ll raise a ticket with the courier and keep you posted.
            </li>
            <li>
              If a shipment is confirmed lost by the courier, you may choose a full refund or replacement (subject to stock).
            </li>
          </ul>
        </section>

        {/* 9) Packaging */}
        <section id="packaging" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">9) Packaging</h2>
          <p className="mt-2">
            All bags ship in secure, tamper-evident packaging. Please retain original packaging until you’re sure you’ll keep the item (it’s required for returns).
          </p>
        </section>

        {/* Company Details */}
        <section id="company-details" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">Company Details (for your footer/legal pages)</h2>
          <div className="mt-2 space-y-2">
            <p><strong>Legal name:</strong> Zexa Pvt. Ltd.</p>
            <p><strong>CIN/GST:</strong> [Insert here]</p>
            <p><strong>Registered address:</strong> [Insert full address]</p>
            <p>
              <strong>Customer support:</strong> <a className="underline" href="mailto:support@zexa.in">support@zexa.in</a>
              {" "}|{" "}
              <a className="underline" href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a>
            </p>
          </div>
        </section>

        {/* Footer links */}
        <p className="mt-10 text-sm text-gray-700">
          Please also review our {" "}
          <Link href="/policies/return-and-refund-policy" className="underline">Return &amp; Refund Policy</Link>, {" "}
          <Link href="/policies/terms-of-service" className="underline">Terms &amp; Conditions</Link> and {" "}
          <Link href="/policies/privacy-policy" className="underline">Privacy Policy</Link>.
        </p>

        {/* Back to top + Contact CTA */}
        <div className="mt-8 flex items-center gap-3">
          <a href="#top" className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back to top</a>
          <Link href="/contact" className="inline-block rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90">Contact Support</Link>
        </div>
      </section>
    </main>
  );
}
