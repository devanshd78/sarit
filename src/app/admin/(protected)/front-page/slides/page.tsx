// src/app/admin/front-page/slides/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { get, post } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Edit2, Trash2, Plus } from "lucide-react";
import Swal from "sweetalert2";

type Slide = {
    _id: string;
    title: string;
    subtitle: string;
    ctaHref: string;
    ctaText: string;
    image: string; // data URI
    createdAt: string;
    updatedAt: string;
};

export default function AdminSlidesPage() {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [loading, setLoading] = useState(false);

    // Add dialog state
    const [addOpen, setAddOpen] = useState(false);
    const [addTitle, setAddTitle] = useState("");
    const [addSubtitle, setAddSubtitle] = useState("");
    const [addCtaText, setAddCtaText] = useState("");
    const [addCtaHref, setAddCtaHref] = useState("");
    const addFileRef = useRef<HTMLInputElement>(null);
    const [adding, setAdding] = useState(false);

    // Edit dialog state
    const [editOpen, setEditOpen] = useState(false);
    const [cur, setCur] = useState<Slide | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editSubtitle, setEditSubtitle] = useState("");
    const [editCtaText, setEditCtaText] = useState("");
    const [editCtaHref, setEditCtaHref] = useState("");
    const editFileRef = useRef<HTMLInputElement>(null);
    const [updating, setUpdating] = useState(false);

    // Image viewer dialog state
    const [viewOpen, setViewOpen] = useState(false);
    const [viewSrc, setViewSrc] = useState<string>("");

    // Fetch slides list
    const fetchSlides = async () => {
        setLoading(true);
        try {
            const res = await get<{ success: boolean; items: Slide[] }>("/slides/getlist");
            if (res.success) setSlides(res.items);
            else throw new Error("Fetch failed");
        } catch (err) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Error", text: "Could not load slides." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // Create slide
    const handleAdd = async () => {
        if (!addTitle || !addSubtitle || !addCtaText || !addCtaHref) {
            Swal.fire({ icon: "warning", title: "Missing fields", text: "All text fields are required." });
            return;
        }
        const file = addFileRef.current?.files?.[0];
        if (!file) {
            Swal.fire({ icon: "warning", title: "No image", text: "Please select an image file." });
            return;
        }

        setAdding(true);
        try {
            const fd = new FormData();
            fd.append("title", addTitle);
            fd.append("subtitle", addSubtitle);
            fd.append("ctaText", addCtaText);
            fd.append("ctaHref", addCtaHref);
            fd.append("image", file);

            const data = await post<{ success: boolean; item?: Slide }>("/slides/create", fd);
            if (data.success) {
                fetchSlides();
                setAddOpen(false);
                setAddTitle("");
                setAddSubtitle("");
                setAddCtaText("");
                setAddCtaHref("");
                if (addFileRef.current) addFileRef.current.value = "";
                Swal.fire({ icon: "success", title: "Added!", timer: 1200, showConfirmButton: false });
            } else {
                throw new Error("Add failed");
            }
        } catch (err: any) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Add failed", text: err.message || "" });
        } finally {
            setAdding(false);
        }
    };

    // Open edit dialog & populate
    const openEdit = (slide: Slide) => {
        setCur(slide);
        setEditTitle(slide.title);
        setEditSubtitle(slide.subtitle);
        setEditCtaText(slide.ctaText);
        setEditCtaHref(slide.ctaHref);
        if (editFileRef.current) editFileRef.current.value = "";
        setEditOpen(true);
    };

    // Update slide
    const handleUpdate = async () => {
        if (!cur || !editTitle || !editSubtitle || !editCtaText || !editCtaHref) {
            Swal.fire({ icon: "warning", title: "Missing fields", text: "All text fields are required." });
            return;
        }

        setUpdating(true);
        try {
            const fd = new FormData();
            fd.append("id", cur._id);
            fd.append("title", editTitle);
            fd.append("subtitle", editSubtitle);
            fd.append("ctaText", editCtaText);
            fd.append("ctaHref", editCtaHref);
            const file = editFileRef.current?.files?.[0];
            if (file) fd.append("image", file);

            const data = await post<{ success: boolean; item?: Slide }>("/slides/update", fd);
            if (data.success) {
                fetchSlides();
                setEditOpen(false);
                Swal.fire({ icon: "success", title: "Updated!", timer: 1200, showConfirmButton: false });
            } else {
                throw new Error("Update failed");
            }
        } catch (err: any) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Update failed", text: err.message || "" });
        } finally {
            setUpdating(false);
        }
    };

    // Delete slide
    const handleDelete = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: "Delete slide?",
            text: "This cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
        });
        if (!isConfirmed) return;

        try {
            const res = await post<{ success: boolean }>("/slides/delete", { id });
            if (res.success) {
                fetchSlides();
                Swal.fire({ icon: "success", title: "Deleted", timer: 1000, showConfirmButton: false });
            } else {
                throw new Error("Delete failed");
            }
        } catch (err: any) {
            console.error(err);
            Swal.fire({ icon: "error", title: "Delete failed", text: err.message || "" });
        }
    };

    return (
        <div className="p-4 space-y-6">
            {/* Header & Add */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Slides</h1>
                <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center space-x-1">
                            <Plus size={16} />
                            <span>Add Slide</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New Slide</DialogTitle>
                            <DialogDescription>Fill out the fields below and upload an image.</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <Input placeholder="Title" value={addTitle} onChange={(e) => setAddTitle(e.target.value)} />
                            <Textarea placeholder="Subtitle" value={addSubtitle} onChange={(e) => setAddSubtitle(e.target.value)} />
                            <Input placeholder="CTA Text" value={addCtaText} onChange={(e) => setAddCtaText(e.target.value)} />
                            <Input placeholder="CTA URL" value={addCtaHref} onChange={(e) => setAddCtaHref(e.target.value)} />
                            <input type="file" ref={addFileRef} accept="image/*" className="block" />
                        </div>
                        <DialogFooter className="flex justify-end space-x-2 mt-6">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button onClick={handleAdd} disabled={adding} variant="outline">
                                {adding ? "Saving…" : "Save"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Slides Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Slides</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Preview</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Subtitle</TableHead>
                                <TableHead>CTA</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        Loading…
                                    </TableCell>
                                </TableRow>
                            ) : slides.length > 0 ? (
                                slides.map((s) => (
                                    <TableRow key={s._id} className="hover:bg-muted">
                                        <TableCell>
                                            <button
                                                onClick={() => {
                                                    setViewSrc(s.image);
                                                    setViewOpen(true);
                                                }}
                                                className="cursor-pointer"
                                            >
                                                <img src={s.image} alt={s.title} className="h-12 w-20 object-cover rounded" />
                                            </button>
                                        </TableCell>
                                        <TableCell>{s.title}</TableCell>
                                        <TableCell className="max-w-xs truncate">{s.subtitle}</TableCell>
                                        <TableCell className="max-w-xs truncate">{s.ctaText}</TableCell>
                                        <TableCell>{format(new Date(s.createdAt), "Pp")}</TableCell>
                                        <TableCell className="text-center space-x-2">
                                            <Button variant="outline" size="icon" onClick={() => openEdit(s)}>
                                                <Edit2 size={16} />
                                            </Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(s._id)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8">
                                        No slides available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Edit Slide Dialog */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                    <DialogHeader>
                        <DialogTitle>Update Slide</DialogTitle>
                        <DialogDescription>Modify any field and optionally upload a new image.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <Input placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                        <Textarea placeholder="Subtitle" value={editSubtitle} onChange={(e) => setEditSubtitle(e.target.value)} />
                        <Input placeholder="CTA Text" value={editCtaText} onChange={(e) => setEditCtaText(e.target.value)} />
                        <Input placeholder="CTA URL" value={editCtaHref} onChange={(e) => setEditCtaHref(e.target.value)} />
                        <input type="file" ref={editFileRef} accept="image/*" className="block" />
                    </div>
                    <DialogFooter className="flex justify-end space-x-2 mt-6">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleUpdate} disabled={updating} variant="outline">
                            {updating ? "Updating…" : "Update"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Image Viewer Dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                <DialogContent className="bg-black p-0 rounded-lg shadow-lg max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="sr-only">Image Preview</DialogTitle>
                    </DialogHeader>
                    <img src={viewSrc} alt="Slide preview" className="w-full h-auto rounded-lg" />
                    <div className="absolute top-2 right-2">
                        <DialogClose asChild>
                            <Button variant="ghost" size="icon" className="text-white">
                                ✕
                            </Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
