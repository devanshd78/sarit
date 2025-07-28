"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Download, Edit2, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { AxiosResponse } from "axios";
import { Label } from "@/components/ui/label";

type Coupon = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  expiresAt?: string;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  createdAt: string;
};

type CouponListResponse = {
  data: Coupon[];
  pagination: { total: number; page: number; pages: number; limit: number };
};

export default function CouponsAdminPage() {
  // State
  const [data, setData] = React.useState<Coupon[]>([]);
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [total, setTotal] = React.useState(0);
  const [search, setSearch] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Form state
  const emptyForm = {
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    expiresAt: "",
    usageLimit: 0,
    active: true,
  };
  const [form, setForm] = React.useState(emptyForm);
  const [isEditing, setIsEditing] = React.useState(false);

  // Debounce search
  const debouncedSearch = useDebounce(search, 400);

  // Columns + actions
  const columns: ColumnDef<Coupon>[] = [
    { accessorKey: "code", header: "Code" },
    { accessorKey: "discountType", header: "Type" },
    { accessorKey: "discountValue", header: "Value" },
    {
      accessorKey: "expiresAt",
      header: "Expires",
      cell: ({ row }) =>
        row.original.expiresAt
          ? new Date(row.original.expiresAt).toLocaleDateString()
          : "—",
    },
    { accessorKey: "usageLimit", header: "Limit" },
    { accessorKey: "usedCount", header: "Used" },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) => <span>{row.original.active ? "✔️" : "❌"}</span>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(row.original)}
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            onClick={() => onDelete(row.original.code)}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Fetch list
  const fetchList = React.useCallback(async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<CouponListResponse> = await api.post(
        "/coupons/getlist",
        { page, limit, search: debouncedSearch }
      );
      const payload = res.data;
      setData(payload.data);
      setTotal(payload.pagination.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch]);

  React.useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Handlers
  function onEdit(c: Coupon) {
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      expiresAt: c.expiresAt?.slice(0, 10) || "",
      usageLimit: c.usageLimit,
      active: c.active,
    });
    setIsEditing(true);
  }

  async function onDelete(code: string) {
    if (!confirm(`Delete coupon ${code}?`)) return;
    setLoading(true);
    try {
      await api.post(`/coupons/${code}/delete`);
      fetchList();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.post(`/coupons/${form.code}/update`, form);
      } else {
        await api.post("/coupons/create", form);
      }
      setForm(emptyForm);
      setIsEditing(false);
      fetchList();
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.errors?.map((x: any) => x.msg).join("\n") ||
          "Save failed"
      );
    } finally {
      setLoading(false);
    }
  }

  function onCancel() {
    setForm(emptyForm);
    setIsEditing(false);
  }

  // CSV export
  function exportCSV() {
    const rows = [
      ["Code", "Type", "Value", "Expires", "Limit", "Used", "Active", "Created"],
      ...data.map((c) => [
        c.code,
        c.discountType,
        String(c.discountValue),
        c.expiresAt || "",
        String(c.usageLimit),
        String(c.usedCount),
        c.active ? "true" : "false",
        new Date(c.createdAt).toISOString(),
      ]),
    ];
    const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `coupons_page_${page}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="p-6 space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Coupon" : "New Coupon"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Code */}
            <div className="flex flex-col">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="e.g. SPRINGSALE"
                value={form.code}
                disabled={isEditing}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                required
              />
            </div>

            {/* Discount Type */}
            <div className="flex flex-col">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={form.discountType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, discountType: v as any }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Discount Value */}
            <div className="flex flex-col">
              <Label htmlFor="discountValue">Discount Value</Label>
              <Input
                id="discountValue"
                type="number"
                placeholder="e.g. 20"
                value={form.discountValue}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountValue: Number(e.target.value),
                  }))
                }
                required
              />
            </div>

            {/* Expires At */}
            <div className="flex flex-col">
              <Label htmlFor="expiresAt">Expires At</Label>
              <Input
                id="expiresAt"
                type="date"
                value={form.expiresAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, expiresAt: e.target.value }))
                }
              />
            </div>

            {/* Usage Limit */}
            <div className="flex flex-col">
              <Label htmlFor="usageLimit">Usage Limit</Label>
              <Input
                id="usageLimit"
                type="number"
                placeholder="0 = unlimited"
                value={form.usageLimit}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    usageLimit: Number(e.target.value),
                  }))
                }
              />
            </div>

            {/* Active */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={form.active}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, active: Boolean(v) }))
                }
              />
              <Label htmlFor="active" className="!mb-0">
                Active
              </Label>
            </div>

            {/* Buttons */}
            <div className="col-span-full flex space-x-2">
              <Button type="submit" disabled={loading}>
                {isEditing ? "Update Coupon" : "Create Coupon"}
              </Button>
              {isEditing && (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table + controls */}
      <Card>
        <CardHeader>
          <CardTitle>Coupon Codes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* search + page size + export */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <Input
              placeholder="Search code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-60"
            />
            <div className="flex items-center gap-2">
              <Select
                value={String(limit)}
                onValueChange={(v) => {
                  setLimit(Number(v));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Rows" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {[5, 10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" />
                CSV
              </Button>
            </div>
          </div>

          {/* table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : data.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No coupons found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* pagination */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> • Total:{" "}
              <strong>{total}</strong>
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => setPage(1)} disabled={page === 1}>
                {"<<"}
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
              <Button
                size="sm"
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
              >
                {">>"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Debounce hook
function useDebounce<T>(value: T, delay = 300) {
  const [d, setD] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setD(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return d;
}

// CSV escape
function escapeCSV(v: string) {
  const s = v.replace(/"/g, '""');
  return /,|\n|"/.test(s) ? `"${s}"` : s;
}
