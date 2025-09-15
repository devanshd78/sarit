// Save as: app/policies/return-and-refund-policy/page.tsx (Next.js App Router)
// If you're using the Pages Router, rename to: pages/policies/return-and-refund-policy.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return & Refund Policy | Zexa Store",
  description:
    "Read Zexa Pvt. Ltd.'s return, exchange, cancellation and refund policy for bag orders. Timelines, eligibility, and contact details included.",
  alternates: { canonical: "/policies/return-and-refund-policy" },
};

export default function RefundPolicyPage() {
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
            <li className="text-gray-700">Return & Refund Policy</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Return &amp; Refund Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 14 September 2025</p>

        <p className="mt-6 leading-relaxed">
          At <strong>Zexa Pvt. Ltd.</strong> (“Zexa”, “we”, “our”), we want you to love your purchase. This policy explains when and how returns,
          cancellations, and refunds work for bag orders placed on our store.
        </p>

        {/* On this page / TOC */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="font-semibold">On this page</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li><a href="#cancellations" className="hover:underline">1) Cancellations</a></li>
            <li><a href="#returns-exchanges" className="hover:underline">2) Returns &amp; Exchanges</a></li>
            <li><a href="#damaged-defective" className="hover:underline">3) Damaged/Defective/Wrong Item</a></li>
            <li><a href="#refunds" className="hover:underline">4) Refunds — How &amp; When</a></li>
            <li><a href="#contact" className="hover:underline">5) Contact Us</a></li>
          </ul>
        </div>

        {/* 1) Cancellations */}
        <section id="cancellations" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">1) Cancellations</h2>

          <h3 className="mt-4 font-medium">Before dispatch</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You may cancel within 24 hours of placing the order or before dispatch (whichever is earlier).</li>
            <li>Cancel from your account dashboard or contact us via email/phone/WhatsApp (details below).</li>
            <li>If you’ve already paid, we’ll initiate a full refund to your original payment method within 5–7 business days after confirmation.</li>
          </ul>

          <h3 className="mt-6 font-medium">After dispatch</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Once shipped, cancellation isn’t possible.</li>
            <li>You may refuse delivery at arrival. After the product returns to us in original condition, we’ll refund the item value (shipping charges—if any—are non-refundable).</li>
          </ul>

          <h3 className="mt-6 font-medium">Partial cancellations</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>For multi-item orders, you can cancel one or more items before dispatch.</li>
            <li>Refunds will be processed only for the cancelled items.</li>
          </ul>

          <h3 className="mt-6 font-medium">Seller/Store cancellations</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>In rare cases (e.g., stock unavailability, logistics constraints, payment not verified), we may cancel your order.</li>
            <li>You’ll be notified immediately and receive a 100% refund.</li>
          </ul>

          <p className="mt-4 text-sm text-gray-700">
            <strong>Refund timelines:</strong> We process refunds for cancelled/returned orders within 5–7 business days after we confirm eligibility. Actual credit times depend on your bank/payment provider.
          </p>
        </section>

        {/* 2) Returns & Exchanges */}
        <section id="returns-exchanges" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">2) Returns &amp; Exchanges</h2>

          <h3 className="mt-4 font-medium">Return window</h3>
          <p className="mt-2">Returns are accepted within 7 days of delivery for most bags (handbags, backpacks, duffels, laptop bags, etc.).</p>

          <h3 className="mt-6 font-medium">Return eligibility</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Item must be unused, unwashed, undamaged, with original tags, accessories, and brand packaging intact.</li>
            <li>Keep the invoice included in the shipment.</li>
            <li>For any manufacturing defect, transit damage, or wrong item received, contact us within 48 hours of delivery with photos/video of the outer carton and the product.</li>
          </ul>

          <h3 className="mt-6 font-medium">Non-returnable items</h3>
          <p className="mt-2">Personalized/monogrammed items, final-sale/clearance items, and gift cards/vouchers cannot be returned unless defective.</p>

          <h3 className="mt-6 font-medium">Return methods</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Delhivery reverse pickup (where serviceable):</strong> We’ll arrange pickup from your address and keep you updated via SMS/email.
            </li>
            <li>
              <strong>Self-ship (if reverse pickup isn’t available):</strong> Use any reliable courier with tracking; share the AWB/receipt. We’ll reimburse standard courier charges (subject to a reasonable cap; please confirm with support before shipping).
            </li>
          </ul>

          <h3 className="mt-6 font-medium">Quality check &amp; outcomes</h3>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Once we receive your return</strong>, we run a QC (typically 24–72 working hours).</li>
            <li><strong>Approved:</strong> Choose refund to original payment method or store credit (if offered).</li>
            <li><strong>Partially approved/Rejected</strong> (e.g., missing tags, signs of use/damage): We’ll notify you. You may opt for reshipment back to you (re-shipping charges may apply).</li>
          </ul>

          <h3 className="mt-6 font-medium">Exchanges</h3>
          <p className="mt-2">If you need a different color/model, place a new order and return the original for a refund, or request an exchange (subject to stock and serviceability).</p>
        </section>

        {/* 3) Damaged/Defective/Wrong Item */}
        <section id="damaged-defective" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">3) Damaged/Defective/Wrong Item</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>If the outer carton is tampered or the package is visibly damaged, please refuse delivery and contact us immediately.</li>
            <li>If discovered after delivery, report within 48 hours with clear photos/video of the packaging and product.</li>
            <li>We’ll arrange a replacement or refund after verification.</li>
          </ul>
        </section>

        {/* 4) Refunds — How & When */}
        <section id="refunds" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">4) Refunds — How &amp; When</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>
              <strong>Method:</strong> Always to the original payment method; COD orders (if offered) are refunded via bank transfer/UPI as collected by our support team.
            </li>
            <li>
              <strong>Timeline:</strong> 5–7 business days from approval/confirmation on our end; bank posting times may vary.
            </li>
            <li>
              <strong>Shipping fees:</strong> Original shipping fees (if any) are non-refundable, except where the mistake is ours (wrong item/defect).
            </li>
          </ul>
        </section>

        {/* 5) Contact Us */}
        <section id="contact" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">5) Contact Us</h2>
          <address className="mt-2 not-italic leading-relaxed">
            {/* TODO: Replace placeholders with your official details */}
            <p>
              <strong>Email:</strong> <a className="underline" href="mailto:support@zexa.in">support@zexa.in</a>
              <span className="text-gray-500"> (replace with your official email)</span>
            </p>
            <p>
              <strong>Phone/WhatsApp:</strong> <a className="underline" href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a>
              <span className="text-gray-500"> (replace with your official number)</span>
            </p>
            <p><strong>Business hours:</strong> Mon–Sat, 10:00–18:00 IST</p>
            <p>
              <strong>Returns address:</strong> Zexa Pvt. Ltd., [Full Address with PIN]
              <span className="text-gray-500"> (replace with your warehouse/return hub)</span>
            </p>
          </address>

          <p className="mt-6 text-sm text-gray-700">
            By purchasing from Zexa, you agree to this Return &amp; Refund Policy along with our
            {" "}
            <Link href="/policies/terms-of-service" className="underline">Terms &amp; Conditions</Link> and
            {" "}
            <Link href="/policies/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </section>

        {/* Back to top */}
        <div className="mt-10">
          <a href="#top" className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back to top</a>
        </div>
      </section>
    </main>
  );
}
