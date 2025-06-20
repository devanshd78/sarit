// src/components/Footer.tsx
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Facebook, Instagram, ChevronDown } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="bg-black text-white">
      {/* Main footer */}
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo */}
        <div>
          <Link href="/" className="inline-block">
            <Image
              src="/assets/sarit-logo-white.svg"
              alt="Sarit"
              width={120}
              height={40}
            />
          </Link>
        </div>

        {/* Policies */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Sarit Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/return-exchange" className="hover:underline">
                Return and Exchange Policy
              </Link>
            </li>
            <li>
              <Link href="/return-refund" className="hover:underline">
                Return and Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Terms and Conditions
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                About Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Warranty */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Warranty Policy</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/warranty" className="hover:underline">
                Warranty Policy
              </Link>
            </li>
            <li>
              <Link href="/terms-of-service" className="hover:underline">
                Terms of Services
              </Link>
            </li>
          </ul>
        </div>

        {/* About + Social */}
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Sarit: Elevating Everyday Style with Function
          </h3>
          <p className="text-sm mb-4 leading-relaxed">
            At Sarit, we specialize in crafting high-quality, stylish, and practical
            products designed to make your daily life easier and more enjoyable.
          </p>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <Facebook className="w-5 h-5 hover:text-gray-300" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <Instagram className="w-5 h-5 hover:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>

      {/* Country / Copyright */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Country selector */}


          {/* Copyright */}
          <span className="text-sm">© 2025, Sarit.in Powered by Shopify</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
