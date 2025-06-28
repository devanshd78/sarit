// src/app/admin/layout.tsx

import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import AdminSidebar from "@/components/AdminSidebar";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sarit Admin Panel",
  description: "Manage your content, orders & more",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${lexend.className} flex min-h-screen bg-gray-50`}>
        {/* The sidebar is a client component, but the `body` wrapper itself is server‐rendered */}
        <AdminSidebar />

        {/* Main content area, pushed to the right of the 16rem (256px) sidebar on desktop */}
        <main
          className="
            px-4 py-6               /* base padding */
            flex-1
            pt-16                    /* mobile header offset */
            md:pt-6                  /* desktop: header lives in the sidebar */
            md:px-8                  /* extra horizontal padding on desktop */
            overflow-auto
            transition-all ease-out duration-200
          "
        >
          {children}
        </main>
      </div>
  );
}
