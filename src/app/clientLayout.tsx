// src/components/ClientLayout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const path = usePathname() || "";
  const isAdmin = path.startsWith("/admin");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      setIsScrolled(false);
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // run once to initialize
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isAdmin]);

  return (
    <>
      {/* Header only on non-admin */}
      {!isAdmin && <Header isScrolled={isScrolled} />}

      <main>
        {children}
      </main>

      {/* Footer only on non-admin */}
      {!isAdmin && <Footer />}
    </>
  );
}
