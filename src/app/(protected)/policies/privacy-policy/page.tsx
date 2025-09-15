// Save as: app/policies/privacy-policy/page.tsx (Next.js App Router)
// If you're using the Pages Router, rename to: pages/policies/privacy-policy.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Zexa Store",
  description:
    "Zexa Pvt. Ltd. Privacy Policy: what we collect, how we use it, legal bases, sharing, retention, security, and your rights.",
  alternates: { canonical: "/policies/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-white text-gray-900">
      <div id="top" />
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
            <li className="text-gray-700">Privacy Policy</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: 14 September 2025</p>

        <p className="mt-6 leading-relaxed">
          This Privacy Policy describes how <strong>Zexa Pvt. Ltd.</strong> ("<strong>Zexa</strong>", "<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") collects, uses, shares, and protects your
          information when you visit <strong>zexa.in</strong>, place orders, or interact with our services (the "<strong>Services</strong>"). By using the Services, you agree to the practices described here.
        </p>

        {/* TOC */}
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="font-semibold">On this page</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li><a href="#scope" className="hover:underline">1) Scope &amp; Data Controller</a></li>
            <li><a href="#data-we-collect" className="hover:underline">2) Information We Collect</a></li>
            <li><a href="#sources" className="hover:underline">3) Sources of Information</a></li>
            <li><a href="#how-we-use" className="hover:underline">4) How We Use Information</a></li>
            <li><a href="#legal-bases" className="hover:underline">5) Legal Bases</a></li>
            <li><a href="#sharing" className="hover:underline">6) Sharing &amp; Disclosures</a></li>
            <li><a href="#cookies" className="hover:underline">7) Cookies &amp; Similar Technologies</a></li>
            <li><a href="#retention" className="hover:underline">8) Data Retention</a></li>
            <li><a href="#security" className="hover:underline">9) Security</a></li>
            <li><a href="#international" className="hover:underline">10) International Transfers</a></li>
            <li><a href="#your-rights" className="hover:underline">11) Your Rights</a></li>
            <li><a href="#children" className="hover:underline">12) Children’s Privacy</a></li>
            <li><a href="#third-parties" className="hover:underline">13) Third‑Party Links &amp; Services</a></li>
            <li><a href="#updates" className="hover:underline">14) Changes to This Policy</a></li>
            <li><a href="#contact" className="hover:underline">15) Contact &amp; Grievance Officer</a></li>
          </ul>
        </div>

        {/* 1 */}
        <section id="scope" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">1) Scope &amp; Data Controller</h2>
          <p className="mt-2">
            This Policy applies to personal information processed by Zexa in connection with the Services. Unless otherwise stated, the data controller is:
          </p>
          <address className="mt-2 not-italic leading-relaxed">
            <p><strong>Zexa Pvt. Ltd.</strong></p>
            <p>Registered address: [Insert full address with PIN]</p>
            <p>Email: <a className="underline" href="mailto:support@zexa.in">support@zexa.in</a></p>
            <p>Phone/WhatsApp: <a className="underline" href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a></p>
          </address>
          <p className="mt-2 text-sm text-gray-700">
            We process data in accordance with applicable laws such as India’s Digital Personal Data Protection Act, 2023 ("DPDP Act") and, where relevant (e.g., if you are located in the EEA/UK), the GDPR/UK GDPR.
          </p>
        </section>

        {/* 2 */}
        <section id="data-we-collect" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">2) Information We Collect</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Identity &amp; Contact:</strong> name, email, phone, shipping/billing address.</li>
            <li><strong>Order &amp; Transaction:</strong> items purchased, order IDs, delivery details, payment status (we do not store full card details).</li>
            <li><strong>Communications:</strong> messages via email, chat, WhatsApp, or support tickets.</li>
            <li><strong>Device &amp; Usage:</strong> IP address, approximate location, browser/device type, activity logs, and pages viewed.</li>
            <li><strong>Cookies &amp; IDs:</strong> cookies, pixels, and similar identifiers for essential operations, analytics, and (if enabled) marketing.</li>
            <li><strong>User Content:</strong> reviews, ratings, survey responses, photos (if submitted).</li>
            <li><strong>Consent &amp; Preferences:</strong> marketing subscriptions and cookie choices.</li>
          </ul>
        </section>

        {/* 3 */}
        <section id="sources" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">3) Sources of Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Directly from you (account creation, checkout, support).</li>
            <li>Automatically from your device/browser via cookies and similar technologies.</li>
            <li>From service providers (e.g., payment gateways, logistics partners) to complete your orders.</li>
          </ul>
        </section>

        {/* 4 */}
        <section id="how-we-use" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">4) How We Use Information</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Process and deliver your orders; provide invoices and updates.</li>
            <li>Customer support, returns, warranty, and dispute resolution.</li>
            <li>Improve our website, products, logistics, and user experience.</li>
            <li>Detect, prevent, and investigate fraud or abuse.</li>
            <li>Send transactional messages; send marketing communications with your consent (where required).</li>
            <li>Comply with legal obligations (tax, accounting, consumer protection).</li>
          </ul>
        </section>

        {/* 5 */}
        <section id="legal-bases" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">5) Legal Bases</h2>
          <p className="mt-2">
            Depending on your location, we rely on one or more of the following legal bases: (a) performance of a contract; (b) your consent; (c) compliance with a legal obligation; (d) our legitimate interests (e.g., ensuring site security, preventing fraud, improving Services) balanced against your rights.
          </p>
        </section>

        {/* 6 */}
        <section id="sharing" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">6) Sharing &amp; Disclosures</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Logistics partners:</strong> e.g., Delhivery and other couriers for pickup, transport, and delivery.</li>
            <li><strong>Payment processors:</strong> to process payments and prevent fraud; we do not store full card details.</li>
            <li><strong>Technology &amp; analytics providers:</strong> hosting, analytics, communications, and customer support tools.</li>
            <li><strong>Marketing partners:</strong> if you opt in to marketing/ads; you can opt out at any time.</li>
            <li><strong>Legal &amp; compliance:</strong> to comply with law, enforce terms, or protect rights and safety.</li>
            <li><strong>Business transfers:</strong> during mergers, acquisitions, or asset sales, subject to this Policy.</li>
          </ul>
        </section>

        {/* 7 */}
        <section id="cookies" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">7) Cookies &amp; Similar Technologies</h2>
          <p className="mt-2">
            We use cookies and similar technologies to run the site, analyze performance, and (if enabled) personalize content/ads. You can manage preferences via our cookie banner or settings.
          </p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li><strong>Essential:</strong> required for core functionality (cart, checkout, authentication).</li>
            <li><strong>Analytics:</strong> to measure and improve performance and user experience.</li>
            <li><strong>Marketing:</strong> to deliver relevant offers (used only if you consent, where required).</li>
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            You can also control cookies from your browser settings. Note that blocking some types of cookies may impact your experience.
          </p>
          <div id="cookie-settings" className="mt-4">
            <Link href="#" className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Open Cookie Settings</Link>
          </div>
        </section>

        {/* 8 */}
        <section id="retention" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">8) Data Retention</h2>
          <p className="mt-2">
            We retain information for as long as necessary to fulfill the purposes outlined in this Policy, including to comply with legal, tax, and accounting requirements, resolve disputes, and enforce agreements. Retention periods vary by data type and context (e.g., order records may be retained for statutory periods).
          </p>
        </section>

        {/* 9 */}
        <section id="security" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">9) Security</h2>
          <p className="mt-2">
            We implement reasonable technical and organizational measures to protect personal information. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* 10 */}
        <section id="international" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">10) International Transfers</h2>
          <p className="mt-2">
            If we transfer your information outside your country (for example, to service providers), we take appropriate safeguards as required by applicable law (such as contractual protections or adequacy mechanisms).
          </p>
        </section>

        {/* 11 */}
        <section id="your-rights" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">11) Your Rights</h2>
          <p className="mt-2">Depending on your location, you may have rights to:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Access, correct, and delete your personal information.</li>
            <li>Withdraw consent at any time (this won’t affect processing already carried out).</li>
            <li>Object to or restrict certain processing (e.g., direct marketing).</li>
            <li>Request data portability (where applicable).</li>
            <li>Lodge a complaint with a data protection authority.</li>
          </ul>
          <p className="mt-2 text-sm text-gray-700">
            To exercise rights, contact us using the details below. We may ask for information to verify your identity and respond within timelines required by law.
          </p>
        </section>

        {/* 12 */}
        <section id="children" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">12) Children’s Privacy</h2>
          <p className="mt-2">
            Our Services are not intended for children under the age of 13. We do not knowingly collect personal information from children without appropriate consent as required by law.
          </p>
        </section>

        {/* 13 */}
        <section id="third-parties" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">13) Third‑Party Links &amp; Services</h2>
          <p className="mt-2">
            Our site may contain links to third‑party websites or services. Their privacy practices are governed by their own policies; we encourage you to review them.
          </p>
        </section>

        {/* 14 */}
        <section id="updates" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">14) Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Policy from time to time. Changes are effective when posted on this page with the updated date. If changes are material, we may provide additional notice (e.g., email or site banner).
          </p>
        </section>

        {/* 15 */}
        <section id="contact" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">15) Contact &amp; Grievance Officer</h2>
          <address className="mt-2 not-italic leading-relaxed">
            <p><strong>Legal name:</strong> Zexa Pvt. Ltd.</p>
            <p><strong>Email:</strong> <a className="underline" href="mailto:support@zexa.in">support@zexa.in</a></p>
            <p><strong>Phone/WhatsApp:</strong> <a className="underline" href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a></p>
            <p><strong>Registered address:</strong> [Insert full address with PIN]</p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Grievance Officer (India):</strong> [Name], [Email], [Phone], [Address].
            </p>
          </address>
        </section>

        <div className="mt-10 flex items-center gap-3">
          <a href="#top" className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back to top</a>
          <Link href="/contact" className="inline-block rounded-lg bg-black text-white px-4 py-2 text-sm hover:opacity-90">Contact Support</Link>
        </div>
      </section>
    </main>
  );
}
