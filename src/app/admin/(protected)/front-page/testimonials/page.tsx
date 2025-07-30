// src/app/admin/front-page/testimonials/page.tsx
"use client";

import { useState, useEffect } from "react";
import { get, post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

type Testimonial = {
  _id: string;
  quote: string;
  author: string;
  createdAt: string;
};

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [quote, setQuote] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await get<{ success: boolean; items: Testimonial[] }>(
        "/testimonials/getlist"
      );
      if (res.success) setItems(res.items);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Load error", text: "Could not fetch testimonials." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Add new testimonial
  const handleAdd = async () => {
    if (!quote.trim() || !author.trim()) {
      Swal.fire({ icon: "warning", title: "Missing fields", text: "Quote and author are required." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await post<{ success: boolean; item?: Testimonial; message?: string }>(
        "/testimonials/create",
        { quote, author }
      );
      if (res.success && res.item) {
        fetchTestimonials();
        setDialogOpen(false);
        setQuote("");
        setAuthor("");
        Swal.fire({ icon: "success", title: "Added!", text: "Testimonial added.", timer: 1500, showConfirmButton: false });
      } else {
        throw new Error(res.message || "Add failed");
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Add failed", text: err.message || "" });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete testimonial
  const handleDelete = async (id: string) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the testimonial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });
    if (!isConfirmed) return;

    try {
      const res = await post<{ success: boolean; message?: string }>(
        "/testimonials/delete",
        { id }
      );
      if (res.success) {
        fetchTestimonials();
        Swal.fire({ icon: "success", title: "Deleted", text: "Testimonial removed.", timer: 1200, showConfirmButton: false });
      } else {
        throw new Error(res.message || "Delete failed");
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Delete failed", text: err.message || "" });
    }
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Testimonial</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quote</label>
                <Textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  rows={3}
                  placeholder="“This product is amazing…”"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <Input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
            </div>
            <DialogFooter className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-black text-white" onClick={handleAdd} disabled={submitting}>
                {submitting ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Table in Card with shadow */}
      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Loading…
                  </TableCell>
                </TableRow>
              ) : items.length > 0 ? (
                items.map((t) => (
                  <TableRow key={t._id} className="hover:bg-muted">
                    <TableCell className="max-w-xs truncate">{t.quote}</TableCell>
                    <TableCell>{t.author}</TableCell>
                    <TableCell>{format(new Date(t.createdAt), "Pp")}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(t._id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No testimonials found.
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
