// src/app/admin/newsletter/subscribers/page.tsx
"use client";

import React, { FC, useState, useEffect } from "react";
import api from "@/lib/api";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

const SubscribersAdminPage: FC = () => {
  const [subs, setSubs]       = useState<Subscriber[]>([]);
  const [filter, setFilter]   = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the list of subscribers
  const fetchSubs = async () => {
    setLoading(true);
    try {
      const res = await api.get<{ success: boolean; data: Subscriber[] }>(
        "/newsletter/getlist"
      );
      if (res.data.success) {
        setSubs(res.data.data);
      } else {
        Swal.fire("Error", "Failed to load subscribers.", "error");
      }
    } catch (err) {
      console.error("Error loading subscribers:", err);
      Swal.fire("Error", "Server error loading subscribers.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  // Unsubscribe a user
  const handleUnsubscribe = async (email: string) => {
    const result = await Swal.fire({
      title: "Confirm Unsubscribe",
      text: `Remove ${email} from the newsletter list?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await api.post<{ success: boolean; message?: string }>(
        "/newsletter/unsubscribe",
        { email }
      );
      if (res.data.success) {
        setSubs((prev) => prev.filter((s) => s.email !== email));
        Swal.fire("Removed", `${email} has been unsubscribed.`, "success");
      } else {
        Swal.fire("Error", res.data.message || "Failed to unsubscribe.", "error");
      }
    } catch (err) {
      console.error("Unsubscribe error:", err);
      Swal.fire("Error", "Server error unsubscribing.", "error");
    }
  };

  // Filtered list based on email search
  const filtered = subs.filter((s) =>
    s.email.toLowerCase().includes(filter.trim().toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">
      <h1 className="text-3xl font-semibold">Newsletter Subscribers</h1>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by email"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button variant="outline" onClick={fetchSubs} disabled={loading}>
          Refresh
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <Table className="min-w-full divide-y divide-gray-200">
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Subscribed At
              </TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="px-6 py-8 text-center">
                  <Progress className="inline-block w-32 h-1 mx-auto" />
                </TableCell>
              </TableRow>
            ) : filtered.length > 0 ? (
              filtered.map((sub) => (
                <TableRow key={sub._id} className="hover:bg-gray-50">
                  <TableCell className="px-6 py-4 text-sm text-gray-700">
                    {sub.email}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-gray-500">
                    {format(new Date(sub.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm">
                    <Button
                    className="bg-white text-gray-800"
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnsubscribe(sub.email)}
                    >
                      Unsubscribe
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No subscribers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubscribersAdminPage;
