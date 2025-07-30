// File: src/app/admin/front-page/bag-collections/page.tsx
"use client";

import { useState, useEffect } from "react";
import { get, post } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Expanded type to match backend schema
type BagColl = {
  _id: string;
  title: string;
  bagName: string;
  description: string;
  productDescription?: string;
  href: string;
  type: 1 | 2;
  price: number;
  compareAt: number;
  onSale: boolean;
  quantity: number;
  deliveryCharge: number;
  rating: number;
  reviews: number;
  isBestSeller:boolean;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: string;
  };
  weight: {
    value: number;
    unit: string;
  };
  material?: string;
  colors: string[];
  capacity?: string;
  brand?: string;
  features: string[];
  images: string[];
  createdAt: string;
};

const TYPE_LABELS = {
  1: "New Arrivals",
  2: "Kids Collections",
};

export default function AdminBagCollectionsPage() {
  const [items, setItems] = useState<BagColl[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function load(typeFilter?: 1 | 2) {
    setLoading(true);
    try {
      const url = typeFilter
        ? `/bag-collections/getlist?type=${typeFilter}`
        : "/bag-collections/getlist";
      const res = await get<{
        success: boolean;
        items: BagColl[];
        message?: string;
      }>(url);
      if (!res.success) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message || "Failed to load.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      setItems(res.items);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Network error.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the collection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      timer: 2000,
      timerProgressBar: true,
    });
    if (!isConfirmed) return;

    try {
      const res = await post<{ success: boolean; message?: string }>(
        "/bag-collections/delete",
        { id }
      );
      if (!res.success) {
        return Swal.fire({
          icon: "error",
          title: "Error",
          text: res.message || "Delete failed.",
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
      Swal.fire({
        icon: "success",
        title: "Deleted",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      load();
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Network error.",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Bag Collections</h1>
        <Link href="/admin/bag-collection/add-update">
          <Button variant="outline" size="icon" aria-label="New Collection">
            <Plus size={16} />
          </Button>
        </Link>
      </div>

      <div className="space-x-2">
        <Button variant="outline" onClick={() => load()}>
          All
        </Button>
        <Button variant="outline" onClick={() => load(1)}>
          New Arrivals
        </Button>
        <Button variant="outline" onClick={() => load(2)}>
          Kids Collections
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Collections</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Bag Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Compare At</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>On Sale</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Best Sellers</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Colors</TableHead>
                <TableHead>Features</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={18} className="py-8 text-center">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : items.length ? (
                items.map((c) => (
                  <TableRow key={c._id} className="hover:bg-muted">
                    <TableCell>
                      <div className="flex space-x-2 overflow-x-auto">
                        {c.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`${c.bagName} ${i + 1}`}
                            className="h-12 w-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{c.bagName}</TableCell>
                    <TableCell>{TYPE_LABELS[c.type]}</TableCell>
                    <TableCell>₹{c.price.toFixed(0)}</TableCell>
                    <TableCell>₹{c.compareAt.toFixed(0)}</TableCell>
                    <TableCell>{c.quantity}</TableCell>
                    <TableCell>{c.onSale ? "Yes" : "No"}</TableCell>
                    <TableCell>{c.reviews}</TableCell>
                    <TableCell>₹{c.deliveryCharge.toFixed(0)}</TableCell>
                    <TableCell>{c.rating.toFixed(1)}</TableCell>
                    <TableCell>{c.isBestSeller ? 'Yes' : "No"}</TableCell>
                    <TableCell>
                      {`${c.dimensions.width}×${c.dimensions.height}×${c.dimensions.depth} ${c.dimensions.unit}`}
                    </TableCell>
                    <TableCell>
                      {`${c.weight.value} ${c.weight.unit}`}
                    </TableCell>
                    <TableCell>{c.material || "—"}</TableCell>
                    <TableCell>{c.brand || "—"}</TableCell>
                    <TableCell>{c.capacity || "—"}</TableCell>
                    <TableCell>
                      {c.colors.length ? c.colors.join(", ") : "—"}
                    </TableCell>
                    <TableCell>
                      {c.features.length ? c.features.join(", ") : "—"}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/admin/bag-collection/add-update?id=${c._id}`
                          )
                        }
                        aria-label="Edit"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => remove(c._id)}
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={18} className="py-8 text-center">
                    No collections yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
