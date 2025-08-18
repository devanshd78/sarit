"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, User, ShoppingBag, ChevronDown, LogOut, UserCircle } from "lucide-react";
import { useCart } from "./context/CartContext";
import { usePathname } from "next/navigation";

interface NavigationProps {
  isScrolled: boolean;
}

const navItems = [
  { name: "HOME", href: "/" },
  { name: "SHOP", href: "/shop" },
  { name: "COLLECTIONS", href: "/collections" },
  { name: "ABOUT", href: "/about-us" },
  { name: "CONTACT", href: "/contact-us" }
];

const Navigation: React.FC<NavigationProps> = ({ isScrolled }) => {

  const pathname = usePathname();
  const isHome = pathname === "/";
  const solidNav = !isHome || isScrolled;

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { totalCount } = useCart();

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  // On mount, read userId from localStorage
  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setProfileOpen(false);
    };
    if (profileOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [profileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  const handleSignOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    setProfileOpen(false);
    window.location.href = "/";
  };

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
    {!mobileOpen && (
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${solidNav
          ? "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="text-2xl font-bold text-white tracking-wider hover:text-gray-200 transition-colors duration-200"
              >
                <img
                  src="/images/Logo.jpeg"
                  alt="Zexa Store logo"
                  className="h-20 w-auto mb-3"
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="relative group px-4 py-2 text-sm font-medium tracking-wider text-white transition-all duration-300 hover:text-black"
                  >
                    <span className="relative z-10">{item.name}</span>
                    <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-sm"></div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Profile / Login */}
              {userId ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setProfileOpen(!profileOpen);
                    }}
                    className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                  >
                    <UserCircle size={20} />
                    <span className="text-sm font-medium max-w-20 truncate">{userId}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white/95 backdrop-blur-md py-2 shadow-xl ring-1 ring-black/5 border border-white/20"
                      >
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <User size={16} />
                          <span>My Profile</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center space-x-3 w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => (window.location.href = "/login")}
                  className="flex items-center space-x-2 text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                  aria-label="Login"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">Login</span>
                </motion.button>
              )}

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/cart")}
                className="relative text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
                aria-label={`Shopping cart with ${totalCount} items`}
              >
                <ShoppingBag size={20} />
                <AnimatePresence>
                  {totalCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white shadow-lg"
                    >
                      {totalCount > 99 ? '99+' : totalCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <MenuIcon size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>
    )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex md:hidden"
          >
            {/* Sidebar */}
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 bg-white/95 backdrop-blur-md shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="text-2xl font-bold text-black"
                  >
                    <img
                      src="/images/Logo.jpeg"
                      alt="Zexa Store logo"
                      className="h-20 w-auto mb-3"
                    />
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeMobileMenu}
                    aria-label="Close menu"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X size={24} />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-6">
                  <div className="space-y-2">
                    {navItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 text-lg font-medium text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                        >
                          {item.name}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* User Actions */}
                <div className="border-t border-gray-200 p-6 space-y-3">
                  {userId ? (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                        <UserCircle size={24} className="text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Signed in as</p>
                          <p className="text-sm text-gray-600 truncate">{userId}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                      >
                        <User size={20} />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleSignOut();
                          closeMobileMenu();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        window.location.href = "/login";
                        closeMobileMenu();
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                    >
                      <User size={20} />
                      <span>Login</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      window.location.href = "/cart";
                      closeMobileMenu();
                    }}
                    className="relative flex items-center space-x-3 w-full px-4 py-3 text-gray-800 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-200"
                  >
                    <ShoppingBag size={20} />
                    <span>Shopping Cart</span>
                    {totalCount > 0 && (
                      <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs font-bold text-white">
                        {totalCount > 99 ? '99+' : totalCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.aside>

            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/60 backdrop-blur-sm"
              onClick={closeMobileMenu}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;