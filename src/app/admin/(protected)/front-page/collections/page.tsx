// src/app/admin/front-page/collections/page.tsx
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

type Collection = {
  _id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string; // data URI
  createdAt: string;
};

export default function AdminCollectionsPage() {
  const [items, setItems] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);

  // Add dialog
  const [addOpen, setAddOpen] = useState(false);
  const [title, setTitle]       = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [href, setHref]         = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving]     = useState(false);

  // Edit dialog
  const [editOpen, setEditOpen] = useState(false);
  const [cur, setCur]           = useState<Collection|null>(null);
  const [eTitle, setETitle]     = useState("");
  const [eSubtitle, setESubtitle] = useState("");
  const [eHref, setEHref]       = useState("");
  const editRef = useRef<HTMLInputElement>(null);
  const [updating, setUpdating] = useState(false);

  // Image view dialog
  const [viewOpen, setViewOpen] = useState(false);
  const [viewSrc, setViewSrc]   = useState("");

  // fetch all
  const fetchAll = async () => {
    setLoading(true);
    try {
      const res = await get<{ success: boolean; items: Collection[] }>("/collections/getlist");
      if (res.success) setItems(res.items);
      else throw new Error("Fetch failed");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Error", text: "Could not load collections." });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { fetchAll(); }, []);

  // create
  const handleCreate = async () => {
    if (!title.trim() || !subtitle.trim() || !href.trim()) {
      return Swal.fire("Missing fields", "All text fields are required.", "warning");
    }
    const file = fileRef.current?.files?.[0];
    if (!file) {
      return Swal.fire("No image", "Please select an image file.", "warning");
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("subtitle", subtitle);
      fd.append("href", href);
      fd.append("image", file);
      const data = await post<{ success: boolean }>("/collections/create", fd);
      if (data.success) {
        fetchAll();
        setAddOpen(false);
        setTitle(""); setSubtitle(""); setHref(""); if (fileRef.current) fileRef.current.value = "";
        Swal.fire("Added!", "", "success");
      } else throw new Error();
    } catch (err:any) {
      console.error(err);
      Swal.fire("Create failed", err.message||"", "error");
    } finally { setSaving(false); }
  };

  // open edit
  const openEdit = (c: Collection) => {
    setCur(c);
    setETitle(c.title); setESubtitle(c.subtitle); setEHref(c.href);
    if (editRef.current) editRef.current.value="";
    setEditOpen(true);
  };

  // update
  const handleUpdate = async () => {
    if (!cur) return;
    if (!eTitle.trim()||!eSubtitle.trim()||!eHref.trim()) {
      return Swal.fire("Missing fields","All text fields are required.","warning");
    }
    setUpdating(true);
    try {
      const fd = new FormData();
      fd.append("id", cur._id);
      fd.append("title", eTitle);
      fd.append("subtitle", eSubtitle);
      fd.append("href", eHref);
      const file = editRef.current?.files?.[0];
      if (file) fd.append("image", file);
      const data = await post<{ success: boolean }>("/collections/update", fd);
      if (data.success) {
        fetchAll();
        setEditOpen(false);
        Swal.fire("Updated!", "", "success");
      } else throw new Error();
    } catch(err:any) {
      console.error(err);
      Swal.fire("Update failed", err.message||"", "error");
    } finally { setUpdating(false); }
  };

  // delete
  const handleDelete = async (id:string) => {
    const { isConfirmed } = await Swal.fire({
      title: "Delete collection?",
      text: "Cannot be undone.",
      icon: "warning",
      showCancelButton:true,
      confirmButtonText:"Delete"
    });
    if (!isConfirmed) return;
    try {
      const res=await post<{success:boolean}>("/collections/delete",{id});
      if(res.success){
        fetchAll();
        Swal.fire("Deleted","", "success");
      } else throw new Error();
    } catch(err:any){
      console.error(err);
      Swal.fire("Delete failed", err.message||"", "error");
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header + Add */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Collections</h1>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center space-x-1">
              <Plus size={16}/><span>Add Collection</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white p-6 rounded-xl shadow-lg max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Collection</DialogTitle>
              <DialogDescription>Fill out fields & upload an image.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)}/>
              <Textarea placeholder="Subtitle" value={subtitle} onChange={e=>setSubtitle(e.target.value)}/>
              <Input placeholder="Link (href)" value={href} onChange={e=>setHref(e.target.value)}/>
              <input type="file" ref={fileRef} accept="image/*" className="block"/>
            </div>
            <DialogFooter className="flex justify-end space-x-2 mt-6">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button onClick={handleCreate} disabled={saving} variant="outline">{saving?"Saving…":"Save"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* List */}
      <Card>
        <CardHeader><CardTitle>All Collections</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Subtitle</TableHead>
                <TableHead>Link</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8">Loading…</TableCell></TableRow>
              ) : items.length > 0 ? (
                items.map(c=>(
                <TableRow key={c._id} className="hover:bg-muted">
                  <TableCell>
                    <button onClick={()=>{
                      setViewSrc(c.image); setViewOpen(true);
                    }} className="cursor-pointer">
                      <img src={c.image} alt={c.title} className="h-12 w-20 object-cover rounded"/>
                    </button>
                  </TableCell>
                  <TableCell>{c.title}</TableCell>
                  <TableCell className="max-w-xs truncate">{c.subtitle}</TableCell>
                  <TableCell>
                    <a href={c.href} target="_blank" rel="noreferrer" className="underline">
                      {c.href}
                    </a>
                  </TableCell>
                  <TableCell>{format(new Date(c.createdAt),"Pp")}</TableCell>
                  <TableCell className="text-center space-x-2">
                    <Button variant="outline" size="icon" onClick={()=>openEdit(c)}>
                      <Edit2 size={16}/>
                    </Button>
                    <Button variant="outline" size="icon" onClick={()=>handleDelete(c._id)}>
                      <Trash2 size={16}/>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center py-8">No collections.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white p-6 rounded-xl shadow-lg max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Modify fields & optional new image.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input placeholder="Title" value={eTitle} onChange={e=>setETitle(e.target.value)}/>
            <Textarea placeholder="Subtitle" value={eSubtitle} onChange={e=>setESubtitle(e.target.value)}/>
            <Input placeholder="Link (href)" value={eHref} onChange={e=>setEHref(e.target.value)}/>
            <input type="file" ref={editRef} accept="image/*" className="block"/>
          </div>
          <DialogFooter className="flex justify-end space-x-2 mt-6">
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleUpdate} disabled={updating} variant="outline">{updating?"Updating…":"Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Viewer */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="bg-black p-0 rounded-lg shadow-lg max-w-3xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Image Preview</DialogTitle>
          </DialogHeader>
          <img src={viewSrc} alt="preview" className="w-full h-auto rounded-lg"/>
          <div className="absolute top-2 right-2">
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="text-white">✕</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
