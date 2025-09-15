// File: src/app/admin/bag-collection/add-update/page.tsx
"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { post, get } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function AddUpdateBagCollection() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id");
  const isEditing = Boolean(id);

  // form state
  const [title, setTitle] = useState("");
  const [bagName, setBagName] = useState("");
  const [description, setDescription] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [href, setHref] = useState("");
  const [type, setType] = useState<1 | 2>(1);
  const [price, setPrice] = useState("");
  const [compareAt, setCompareAt] = useState("");
  const [onSale, setOnSale] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [deliveryCharge, setDeliveryCharge] = useState("");
  const [rating, setRating] = useState("");
  const [reviews, setReviews] = useState("");
  const [isBestSeller, setIsBestSeller] = useState(false);
  // dimensions
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [depth, setDepth] = useState("");
  const [dimUnit, setDimUnit] = useState("cm");
  // weight
  const [weightValue, setWeightValue] = useState("");
  const [weightUnit, setWeightUnit] = useState("kg");
  // other metadata
  const [material, setMaterial] = useState("");
  const [colors, setColors] = useState("");
  const [capacity, setCapacity] = useState("");
  const [brand, setBrand] = useState("");
  const [features, setFeatures] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);

  // load when editing
  useEffect(() => {
    if (isEditing && id) {
      (async () => {
        const res = await get<{ success: boolean; item: any; message?: string }>(
          `/bag-collections/get/${id}`
        );
        if (res.success) {
          const c = res.item;
          setTitle(c.title);
          setBagName(c.bagName);
          setDescription(c.description);
          setProductDescription(c.productDescription || "");
          setHref(c.href);
          setType(c.type);
          setPrice(c.price.toString());
          setCompareAt(c.compareAt.toString());
          setOnSale(c.onSale);
          setQuantity(c.quantity);
          setDeliveryCharge(c.deliveryCharge.toString());
          setRating(c.rating.toString());
          setReviews(c.reviews.toString());
          setIsBestSeller(c.isBestSeller || false);
          setWidth(c.dimensions?.width?.toString() || "");
          setHeight(c.dimensions?.height?.toString() || "");
          setDepth(c.dimensions?.depth?.toString() || "");
          setDimUnit(c.dimensions?.unit || "cm");
          setWeightValue(c.weight?.value?.toString() || "");
          setWeightUnit(c.weight?.unit || "kg");
          setMaterial(c.material || "");
          setColors((c.colors || []).join(", "));
          setCapacity(c.capacity || "");
          setBrand(c.brand || "");
          setFeatures((c.features || []).join(", "));
        } else {
          Swal.fire("Error", res.message || "Could not load item.", "error");
        }
      })();
    }
  }, [isEditing, id]);

  // submit handler
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!title || !bagName || !description || !href) {
      return Swal.fire("Missing Fields", "Please fill in all required fields.", "warning");
    }

    const fd = new FormData();
    if (isEditing && id) fd.append("id", id);
    fd.append("title", title);
    fd.append("bagName", bagName);
    fd.append("description", description);
    fd.append("productDescription", productDescription);
    fd.append("href", href);
    fd.append("type", type.toString());
    fd.append("price", price);
    fd.append("compareAt", compareAt);
    fd.append("onSale", String(onSale));
    fd.append("quantity", String(quantity));
    fd.append("deliveryCharge", deliveryCharge);
    fd.append("rating", rating);
    fd.append("reviews", reviews);
    fd.append("isBestSeller", String(isBestSeller));
    // pack dimensions & weight as JSON strings
    const dims = { width, height, depth, unit: dimUnit };
    fd.append("dimensions", JSON.stringify(dims));
    const wt = { value: weightValue, unit: weightUnit };
    fd.append("weight", JSON.stringify(wt));

    fd.append("material", material);
    fd.append("colors", colors);
    fd.append("capacity", capacity);
    fd.append("brand", brand);
    fd.append("features", features);

    const files = fileRef.current?.files;
    if (files && files.length) {
      Array.from(files).forEach((f) => fd.append("images", f));
    } else if (!isEditing) {
      return Swal.fire("No Images", "Upload at least one image.", "warning");
    }

    setSaving(true);
    try {
      const url = isEditing ? "/bag-collections/update" : "/bag-collections/create";
      const res = await post<{ success: boolean; message?: string }>(url, fd);
      if (res.success) {
        Swal.fire("Saved", "", "success");
        router.back();
      } else {
        Swal.fire("Error", res.message || "Save failed.", "error");
      }
    } catch {
      Swal.fire("Network Error", "Please try again.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="ml-3 text-2xl font-semibold">
          {isEditing ? "Edit Collection" : "New Collection"}
        </h1>
      </div>

      <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        {/* Basic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="text-sm font-medium">Title *</span>
            <Input value={title} onChange={e => setTitle(e.target.value)} required />
          </label>
          <label>
            <span className="text-sm font-medium">Bag Name *</span>
            <Input value={bagName} onChange={e => setBagName(e.target.value)} required />
          </label>
        </div>
        <label>
          <span className="text-sm font-medium">Short Description *</span>
          <Textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </label>
        <label>
          <span className="text-sm font-medium">Product Description</span>
          <Textarea
            value={productDescription}
            onChange={e => setProductDescription(e.target.value)}
          />
        </label>
        <label>
          <span className="text-sm font-medium">Product Link *</span>
          <Input value={href} onChange={e => setHref(e.target.value)} required />
        </label>

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label>
            <span className="text-sm font-medium">Price (₹) *</span>
            <Input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            <span className="text-sm font-medium">Compare At (₹)</span>
            <Input
              type="number"
              value={compareAt}
              onChange={e => setCompareAt(e.target.value)}
            />
          </label>
          <div className="flex items-center mt-6">
            <input
              id="onSale"
              type="checkbox"
              checked={onSale}
              onChange={e => setOnSale(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="onSale" className="ml-2 text-sm">On Sale</label>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <label>
            <span className="text-sm font-medium">Quantity</span>
            <Input
              type="number"
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
            />
          </label>
          <label>
            <span className="text-sm font-medium">Delivery Charge (₹)</span>
            <Input
              type="number"
              value={deliveryCharge}
              onChange={e => setDeliveryCharge(e.target.value)}
            />
          </label>
          <label>
            <span className="text-sm font-medium">Collection Type</span>
            <Select value={type.toString()} onValueChange={v => setType(Number(v) as 1 | 2)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="1">New Arrivals</SelectItem>
                <SelectItem value="2">Kids Collections</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* Ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="text-sm font-medium">Rating (0–5)</span>
            <Input
              type="number"
              min="0" max="5" step="1"
              value={rating}
              onChange={e => setRating(e.target.value)}
            />
          </label>
          <label>
            <span className="text-sm font-medium">Reviews</span>
            <Input
              type="number"
              value={reviews}
              onChange={e => setReviews(e.target.value)}
            />
          </label>
        </div>

          <div className="flex items-center mt-6">
            <input
              id="bestSeller"
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="bestSeller" className="ml-2 text-sm">
              Best Seller
            </label>
          </div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <label>
            <span className="text-sm font-medium">Width</span>
            <Input value={width} onChange={e => setWidth(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Height</span>
            <Input value={height} onChange={e => setHeight(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Depth</span>
            <Input value={depth} onChange={e => setDepth(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Unit</span>
            <Select value={dimUnit} onValueChange={setDimUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="cm">cm</SelectItem>
                <SelectItem value="in">in</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* Weight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="text-sm font-medium">Weight</span>
            <Input value={weightValue} onChange={e => setWeightValue(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Weight Unit</span>
            <Select value={weightUnit} onValueChange={setWeightUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">kg</SelectItem>
                <SelectItem value="lb">lb</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        {/* Misc */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label>
            <span className="text-sm font-medium">Material</span>
            <Input value={material} onChange={e => setMaterial(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Colors (comma-sep)</span>
            <Input value={colors} onChange={e => setColors(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Capacity</span>
            <Input value={capacity} onChange={e => setCapacity(e.target.value)} />
          </label>
          <label>
            <span className="text-sm font-medium">Brand</span>
            <Input value={brand} onChange={e => setBrand(e.target.value)} />
          </label>
        </div>

        <label>
          <span className="text-sm font-medium">Features (comma-sep)</span>
          <Input value={features} onChange={e => setFeatures(e.target.value)} />
        </label>

        {/* Images */}
        <label>
          <span className="text-sm font-medium">
            Images {isEditing ? "(overwrite)" : "(required)"}
          </span>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="mt-1"
          />
        </label>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
}
