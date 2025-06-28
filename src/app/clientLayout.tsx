// src/components/ClientLayout.tsx
"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const path = usePathname() || "";
  const isAdmin = path.startsWith("/admin");

  return (
    <>
      {/* Header only on non-admin */}
      {!isAdmin && <Header />}

      {/* Main wrapper: conditional bottom padding */}
      <main
        className={`bg-white min-h-screen ${
          isAdmin ? "" : "pb-48 pt-24"
        }`}
      >
        {children}
      </main>

      {/* Footer only on non-admin */}
      {!isAdmin && <Footer />}
    </>
  );
}
