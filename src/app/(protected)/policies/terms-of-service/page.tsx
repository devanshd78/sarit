// Save as: app/policies/terms-of-service/page.tsx (Next.js App Router)
// If you're using the Pages Router, rename to: pages/policies/terms-of-service.tsx

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Zexa Store",
  description:
    "Read Zexa Pvt. Ltd.'s Terms of Service governing website use, purchases, payments, returns, and legal terms.",
  alternates: { canonical: "/policies/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <main className="bg-white text-gray-900">
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
            <li className="text-gray-700">Terms of Service</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Effective date: 14 September 2025</p>

        <p className="mt-6 leading-relaxed">
          These Terms of Service ("<strong>Terms</strong>") constitute a legally binding agreement between
          <strong> Zexa Pvt. Ltd.</strong> ("<strong>Zexa</strong>", "<strong>we</strong>", "<strong>us</strong>", "<strong>our</strong>") and you regarding your
          access to and use of the website, products, and services made available at <strong>zexa.in</strong> and related channels (collectively, the "<strong>Services</strong>"). By accessing or using the Services, you agree to be bound by these Terms.
        </p>

        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-5">
          <h2 className="font-semibold">On this page</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1">
            <li><a href="#eligibility" className="hover:underline">1) Eligibility</a></li>
            <li><a href="#account" className="hover:underline">2) Account Registration &amp; Security</a></li>
            <li><a href="#products-pricing" className="hover:underline">3) Product Information, Pricing &amp; Availability</a></li>
            <li><a href="#orders" className="hover:underline">4) Orders &amp; Contract Formation</a></li>
            <li><a href="#payments" className="hover:underline">5) Payments</a></li>
            <li><a href="#shipping" className="hover:underline">6) Shipping &amp; Delivery</a></li>
            <li><a href="#returns" className="hover:underline">7) Returns, Exchanges &amp; Refunds</a></li>
            <li><a href="#promotions" className="hover:underline">8) Promotions, Coupons &amp; Gift Cards</a></li>
            <li><a href="#ip" className="hover:underline">9) Intellectual Property</a></li>
            <li><a href="#user-content" className="hover:underline">10) User Content &amp; Reviews</a></li>
            <li><a href="#prohibited" className="hover:underline">11) Prohibited Uses</a></li>
            <li><a href="#third-party" className="hover:underline">12) Third‑Party Services</a></li>
            <li><a href="#disclaimer" className="hover:underline">13) Disclaimer of Warranties</a></li>
            <li><a href="#liability" className="hover:underline">14) Limitation of Liability</a></li>
            <li><a href="#indemnity" className="hover:underline">15) Indemnification</a></li>
            <li><a href="#law-disputes" className="hover:underline">16) Governing Law &amp; Dispute Resolution</a></li>
            <li><a href="#privacy" className="hover:underline">17) Privacy</a></li>
            <li><a href="#communications" className="hover:underline">18) Communications &amp; Consent</a></li>
            <li><a href="#termination" className="hover:underline">19) Termination</a></li>
            <li><a href="#changes" className="hover:underline">20) Changes to These Terms</a></li>
            <li><a href="#contact" className="hover:underline">21) Contact &amp; Grievance Officer</a></li>
            <li><a href="#boilerplate" className="hover:underline">22) Miscellaneous</a></li>
          </ul>
        </div>

        <section id="eligibility" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">1) Eligibility</h2>
          <p className="mt-2">
            You must be at least 18 years old to use the Services, or use them under the supervision of a parent/guardian who agrees to be bound by these Terms.
          </p>
        </section>

        <section id="account" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">2) Account Registration &amp; Security</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</li>
            <li>Provide accurate, complete information and promptly update any changes.</li>
            <li>Notify us immediately of any unauthorized use or suspected breach of security.</li>
          </ul>
        </section>

        <section id="products-pricing" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">3) Product Information, Pricing &amp; Availability</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>We aim for accuracy but do not warrant that product descriptions, images, or pricing are error‑free; errors may be corrected without prior notice.</li>
            <li>All prices are in INR and inclusive/exclusive of applicable taxes as shown at checkout.</li>
            <li>Products are subject to availability and may be withdrawn or limited in quantity at our discretion.</li>
          </ul>
        </section>

        <section id="orders" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">4) Orders &amp; Contract Formation</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Your order is an offer to buy. We accept only when we dispatch the product and send a shipping confirmation.</li>
            <li>We may cancel an order for reasons including stock unavailability, payment issues, suspected fraud, or logistics constraints. Refunds will be processed per our policies.</li>
          </ul>
        </section>

        <section id="payments" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">5) Payments</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>We accept UPI, credit/debit cards, net banking, select wallets, and COD (if offered). Payment methods shown at checkout are the ones currently supported.</li>
            <li>By submitting a payment, you represent that you are authorized to use the selected method and authorize us (or our payment processor) to charge the full order amount, including taxes and charges.</li>
            <li>COD orders may require verification and are subject to additional service fees, if any, displayed at checkout.</li>
          </ul>
        </section>

        <section id="shipping" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">6) Shipping &amp; Delivery</h2>
          <p className="mt-2">
            Shipping is governed by our {" "}
            <Link href="/policies/shipping-and-delivery-policy" className="underline">Shipping &amp; Delivery Policy</Link>.
          </p>
        </section>

        <section id="returns" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">7) Returns, Exchanges &amp; Refunds</h2>
          <p className="mt-2">
            Returns and refunds are governed by our {" "}
            <Link href="/policies/return-and-refund-policy" className="underline">Return &amp; Refund Policy</Link>.
          </p>
        </section>

        <section id="promotions" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">8) Promotions, Coupons &amp; Gift Cards</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Promo codes are single‑use unless stated otherwise, valid until their expiry, and cannot be combined with other offers unless permitted.</li>
            <li>Gift cards/vouchers are redeemable as per the terms specified at the time of issue and are non‑refundable to cash unless required by law.</li>
          </ul>
        </section>

        <section id="ip" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">9) Intellectual Property</h2>
          <p className="mt-2">
            All content on the Services—including text, graphics, logos, images, and software—is owned by or licensed to Zexa and protected by applicable intellectual property laws. You may not use our IP without prior written consent.
          </p>
        </section>

        <section id="user-content" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">10) User Content &amp; Reviews</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>You remain the owner of content you submit (e.g., reviews, photos), but grant Zexa a worldwide, royalty‑free license to use, reproduce, and display such content in connection with the Services.</li>
            <li>Do not submit content that is unlawful, defamatory, infringing, or misleading. We may remove or modify content that violates these Terms.</li>
          </ul>
        </section>

        <section id="prohibited" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">11) Prohibited Uses</h2>
          <p className="mt-2">You agree not to misuse the Services, including by:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>Violating laws or third‑party rights;</li>
            <li>Interfering with or disrupting the operation of the Services;</li>
            <li>Attempting to gain unauthorized access to accounts or systems;</li>
            <li>Engaging in fraudulent, deceptive, or harmful conduct.</li>
          </ul>
        </section>

        <section id="third-party" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">12) Third‑Party Services</h2>
          <p className="mt-2">
            We may link to third‑party websites or use third‑party services (including payment gateways and logistics partners). We are not responsible for their content, policies, or practices.
          </p>
        </section>

        <section id="disclaimer" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">13) Disclaimer of Warranties</h2>
          <p className="mt-2">
            The Services are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, Zexa disclaims all warranties, express or implied, including merchantability, fitness for a particular purpose, and non‑infringement.
          </p>
        </section>

        <section id="liability" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">14) Limitation of Liability</h2>
          <p className="mt-2">
            To the maximum extent permitted by law, Zexa will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for loss of profits, revenue, data, or business, arising out of or related to your use of the Services.
          </p>
        </section>

        <section id="indemnity" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">15) Indemnification</h2>
          <p className="mt-2">
            You agree to defend, indemnify, and hold harmless Zexa and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable attorneys’ fees) arising out of or related to your breach of these Terms or misuse of the Services.
          </p>
        </section>

        <section id="law-disputes" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">16) Governing Law &amp; Dispute Resolution</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>These Terms are governed by the laws of India, without regard to its conflict of laws principles.</li>
            <li>Subject to applicable consumer laws, the courts at [Your City], India shall have exclusive jurisdiction. You may also be entitled to remedies under the Consumer Protection Act, 2019.</li>
            <li>Before filing a claim, please contact us to attempt an informal resolution.</li>
          </ul>
        </section>

        <section id="privacy" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">17) Privacy</h2>
          <p className="mt-2">
            Your use of the Services is also governed by our {" "}
            <Link href="/policies/privacy-policy" className="underline">Privacy Policy</Link>.
          </p>
        </section>

        <section id="communications" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">18) Communications &amp; Consent</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            <li>By using the Services, you consent to receive transactional emails, SMS, and WhatsApp updates related to your orders.</li>
            <li>You can opt out of non‑transactional marketing communications at any time via the provided unsubscribe options.</li>
          </ul>
        </section>

        <section id="termination" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">19) Termination</h2>
          <p className="mt-2">
            We may suspend or terminate your access to the Services at any time for conduct that violates these Terms or is otherwise harmful. You may discontinue use at any time.
          </p>
        </section>

        <section id="changes" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">20) Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. Changes are effective when posted on this page with the updated date. Continued use of the Services constitutes acceptance of the revised Terms.
          </p>
        </section>

        <section id="contact" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">21) Contact &amp; Grievance Officer</h2>
          <address className="mt-2 not-italic leading-relaxed">
            <p><strong>Legal name:</strong> Zexa Pvt. Ltd.</p>
            <p><strong>Email:</strong> <a className="underline" href="mailto:support@zexa.in">support@zexa.in</a></p>
            <p><strong>Phone/WhatsApp:</strong> <a className="underline" href="tel:+91XXXXXXXXXX">+91-XXXXXXXXXX</a></p>
            <p><strong>Registered address:</strong> [Insert full address with PIN]</p>
            <p className="mt-2 text-sm text-gray-600">
              <strong>Grievance Officer (per IT Act, 2000/Intermediary Guidelines):</strong> [Name], [Email], [Phone], [Address].
            </p>
          </address>
        </section>

        <section id="boilerplate" className="mt-10 scroll-mt-24">
          <h2 className="text-2xl font-semibold">22) Miscellaneous</h2>
          <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
            <li><strong>Severability:</strong> If any provision is held invalid, the remaining provisions remain in full force.</li>
            <li><strong>No Waiver:</strong> Our failure to enforce a provision is not a waiver of our right to do so later.</li>
            <li><strong>Assignment:</strong> You may not assign these Terms without our consent. We may assign to an affiliate or in connection with a merger, acquisition, or sale of assets.</li>
            <li><strong>Entire Agreement:</strong> These Terms, together with the policies referenced herein, constitute the entire agreement between you and Zexa regarding the Services.</li>
          </ul>
        </section>

        <div className="mt-10">
          <a href="#top" className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back to top</a>
        </div>
      </section>
    </main>
  );
}
