import React from "react";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white py-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <img
              src="/images/Logo.jpeg"
              alt="Zexa Store logo"
              className="h-20 w-auto mb-3"
            />
            <h3 className="text-2xl font-bold mb-6">Zexa Store</h3>
            <p className="text-gray-400">
              Crafting premium bags for the modern lifestyle.
            </p>
          </div>

          {/* Shop */}
          <nav aria-label="Shop">
            <h4 className="font-semibold mb-4 tracking-wider">SHOP</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shop/school-bags" className="hover:text-white transition-colors">
                  School Bags
                </Link>
              </li>
              <li>
                <Link href="/shop/backpacks" className="hover:text-white transition-colors">
                  Backpacks
                </Link>
              </li>
              <li>
                <Link href="/shop/totes" className="hover:text-white transition-colors">
                  Totes
                </Link>
              </li>
              <li>
                <Link href="/shop/accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </nav>

          {/* Support */}
          <nav aria-label="Support">
            <h4 className="font-semibold mb-4 tracking-wider">SUPPORT</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </nav>

          {/* Connect */}
          <div>
            <h4 className="font-semibold mb-4 tracking-wider">CONNECT</h4>
            <div className="flex space-x-4">
              <Link
                href="https://instagram.com/yourhandle"
                aria-label="Instagram"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </Link>
              <Link
                href="https://facebook.com/yourhandle"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="w-6 h-6" />
              </Link>
              <Link
                href="https://twitter.com/yourhandle"
                aria-label="Twitter / X"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {year} Zexa Store. All rights reserved.</p>

          <nav aria-label="Legal" className="mt-4 md:mt-0">
            <ul className="flex flex-wrap gap-6 text-sm text-gray-400">
              <li>
                <Link href="/policies/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/return-and-refund-policy" className="hover:text-white transition-colors">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping-and-delivery-policy" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery Policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
