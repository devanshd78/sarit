// src/app/layout.tsx
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import ClientLayout from "./clientLayout";
import { CartProvider } from "@/components/context/CartContext";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Sareet Knits",
  description: "Discover the latest in saree fashion with Sareet Knits. Shop our exclusive collection of hand-knitted sarees, perfect for every occasion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} antialiased`}>
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>
      </body>
    </html>
  );
}
