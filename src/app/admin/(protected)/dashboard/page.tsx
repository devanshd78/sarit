// src/app/admin/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { get, post } from "@/lib/api";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

type Stats = {
  slides: number;
  collections: number;
  testimonials: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    slides: 0,
    collections: 0,
    testimonials: 0,
  });
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await post("/admin/logout", {});
      router.push("/admin/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut size={16} /> <span>Logout</span>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Slides</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.slides}</span>
            <Link href="/admin/front/slides" className="text-sm text-blue-600 hover:underline">
              Manage →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collections</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.collections}</span>
            <Link href="/admin/front/collections" className="text-sm text-blue-600 hover:underline">
              Manage →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-4xl font-bold">{stats.testimonials}</span>
            <Link href="/admin/front/testimonials" className="text-sm text-blue-600 hover:underline">
              Manage →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
