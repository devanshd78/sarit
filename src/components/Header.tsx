"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  User,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from './context/CartContext';

interface NavigationProps {
  isScrolled: boolean;
}

const navItems = ['HOME', 'SHOP', 'COLLECTIONS', 'ABOUT', 'CONTACT'];

const Navigation: React.FC<NavigationProps> = ({ isScrolled }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalCount } = useCart();

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/90 backdrop-blur-sm' : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-white tracking-wider">
                SARIT
              </Link>
            </div>

            {/* Desktop Nav + Icons */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-white hover:text-black hover:bg-white px-3 py-2 rounded-sm text-sm font-medium tracking-wider transition-all duration-200"
                >
                  {item}
                </Link>
              ))}
              {/* Utility Icons */}
              <button
                aria-label="Login"
                onClick={() => window.location.href = '/login'}
                className="text-white hover:text-black hover:bg-white p-2 rounded-sm transition-all duration-200"
              >
                <User size={20} />
              </button>
              <button
                onClick={() => { window.location.href = '/cart'; }}
                className="relative text-white hover:text-black hover:bg-white p-2 rounded-sm transition-all duration-200"
                >
                <ShoppingBag size={20} />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="text-white p-2 hover:text-gray-300 transition-all duration-200"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold">
                SARIT
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-2"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-800 text-base font-medium hover:text-black transition-colors duration-200"
                  onClick={() => setMobileOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </nav>
            <div className="border-t pt-4 space-y-4">
              <button
                onClick={() => { window.location.href = '/login'; }}
                className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors duration-200"
              >
                <User size={20} />
                <span>Login</span>
              </button>
              <button
                onClick={() => { window.location.href = '/cart'; }}
                className="flex items-center space-x-2 text-gray-800 hover:text-black transition-colors duration-200"
              >
                <ShoppingBag size={20} />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCount}
                  </span>
                )}
              </button>
            </div>
          </aside>

          {/* Backdrop */}
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
};

export default Navigation;