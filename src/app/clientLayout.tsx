// src/components/ClientLayout.tsx
"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HIDE_LAYOUT_PATHS = ["/admin", "/login"];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const path = usePathname() || "";
  const shouldHideLayout = HIDE_LAYOUT_PATHS.some((p) => path.startsWith(p));

  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const offset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    setIsScrolled(offset > 50);
  }, []);

  useEffect(() => {
    if (shouldHideLayout) {
      setIsScrolled(false);
      return;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldHideLayout, handleScroll]);

  return (
    <>
      {!shouldHideLayout && <Header isScrolled={isScrolled} />}

      <main className="min-h-screen">{children}</main>

      {!shouldHideLayout && <Footer />}
    </>
  );
}
