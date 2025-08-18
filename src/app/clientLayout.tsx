"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HIDE_LAYOUT_PATHS = ["/admin", "/login"];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const path = usePathname() || "";
  const shouldHideLayout = HIDE_LAYOUT_PATHS.some((p) => path.startsWith(p));
  const isHome = path === "/";

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const offset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    setIsScrolled(offset > 50);
  }, []);

  // Only listen to scroll on the home page (others are always solid)
  useEffect(() => {
    if (shouldHideLayout || !isHome) {
      setIsScrolled(false);
      return;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldHideLayout, isHome, handleScroll]);

  // Force solid header on non-home pages
  const headerScrolledProp = isHome ? isScrolled : true;

  return (
    <>
      {!shouldHideLayout && <Header isScrolled={headerScrolledProp} />}

      {/* Add top padding only when header is visible AND not on home */}
      <main className={`min-h-screen ${!shouldHideLayout && !isHome ? "pt-16" : ""}`}>
        {children}
      </main>

      {!shouldHideLayout && <Footer />}
    </>
  );
}
