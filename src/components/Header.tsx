// src/components/Header.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  ShoppingBag,
} from "lucide-react";
import { useCart } from "./context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Catalog", href: "/collections/all" },
  { label: "Contact", href: "/contact-us" },
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Kids Collection", href: "/collections/kids-collection" },
  { label: "Track Order", href: "/track-order" },
];

export default function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { totalCount } = useCart();

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Top announcement bar */}
      <div className="hidden md:flex bg-black text-white text-xs uppercase h-8 items-center justify-center space-x-4">
        <button
          className="cursor-pointer"
          onClick={() => {}}
          aria-label="Previous announcement"
        >
          <ChevronLeft size={14} />
        </button>
        <span>NEW ARRIVALS JUST LANDED</span>
        <button
          className="cursor-pointer"
          onClick={() => {}}
          aria-label="Next announcement"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center justify-between bg-black px-6 py-4">
        {/* Logo + primary nav */}
        <div className="flex items-center space-x-12">
          <Link href="/" className="inline-block">
            <Image
              src="/assets/sarit-logo-white.svg"
              alt="Sarit"
              width={100}
              height={32}
            />
          </Link>
          <nav className="flex space-x-6 text-sm text-white">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:underline cursor-pointer"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side: icons */}
        <div className="flex items-center space-x-6">
          <button
            className="cursor-pointer"
            aria-label="Search"
            onClick={() => {}}
          >
            <Search size={20} className="text-white hover:text-gray-300" />
          </button>

          <button
            className="cursor-pointer"
            aria-label="Account"
            onClick={() => router.push("/login")}
          >
            <User size={20} className="text-white hover:text-gray-300" />
          </button>

          <button
            className="relative cursor-pointer"
            aria-label="Cart"
            onClick={() => router.push("/cart")}
          >
            <ShoppingBag
              size={20}
              className="text-white hover:text-gray-300"
            />
            {totalCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className="flex md:hidden items-center justify-between bg-black px-4 py-3">
        <button
          className="cursor-pointer"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} className="text-white" />
        </button>

        <Link href="/" className="inline-block">
          <Image
            src="/assets/sarit-logo-white.svg"
            alt="Sarit"
            width={100}
            height={32}
          />
        </Link>

        <div className="flex items-center space-x-4">
          <button className="cursor-pointer" onClick={() => {}} aria-label="Search">
            <Search size={20} className="text-white" />
          </button>
          <button
            className="relative cursor-pointer"
            aria-label="Cart"
            onClick={() => router.push("/cart")}
          >
            <ShoppingBag size={20} className="text-white" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sidebar + Backdrop */}
      <div
        className={`fixed inset-0 z-30 transition-opacity ${
          sidebarOpen ? "opacity-50 visible" : "opacity-0 invisible"
        } bg-black`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <button
            className="cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
          <Link href="/" className="inline-block">
            <Image
              src="/assets/sarit-logo.svg"
              alt="Sarit"
              width={100}
              height={32}
            />
          </Link>
          <div className="w-6" />
        </div>

        <nav className="flex flex-col p-6 space-y-4 text-gray-800">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-base cursor-pointer"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t p-6 space-y-4">
          <button
            className="flex items-center space-x-2 text-gray-800 cursor-pointer"
            onClick={() => {
              setSidebarOpen(false);
              router.push("/login");
            }}
          >
            <User size={20} /> <span>Log in</span>
          </button>
          <div className="flex space-x-4">
            <Link href="https://facebook.com" target="_blank" aria-label="Facebook">
              <img src="/assets/icons/facebook.svg" alt="Facebook" className="w-5 h-5" />
            </Link>
            <Link href="https://instagram.com" target="_blank" aria-label="Instagram">
              <img src="/assets/icons/instagram.svg" alt="Instagram" className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </aside>
    </header>
  );
}