"use client";

import * as React from "react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Download } from "lucide-react";
import { post } from "@/lib/api";

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
}

interface ContactListResponse {
    data: Contact[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

// Debounce hook
function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = React.useState(value);
    React.useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function ContactsAdminPage() {
    const [data, setData] = React.useState<Contact[]>([]);
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const [total, setTotal] = React.useState(0);
    const [search, setSearch] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const debouncedSearch = useDebouncedValue(search, 400);

    const columns: ColumnDef<Contact>[] = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Phone" },
        { accessorKey: "comment", header: "Comment" },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) =>
                new Date(row.original.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                }),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const fetchContacts = React.useCallback(async () => {
        setLoading(true);
        try {
            const json = await post<ContactListResponse>("/contact/list", {
                page,
                limit,
                search: debouncedSearch,
            });
            setData(json.data);
            setTotal(json.pagination.total);
        } catch (err) {
            console.error("Error fetching contacts:", err);
        } finally {
            setLoading(false);
        }
    }, [page, limit, debouncedSearch]);


    React.useEffect(() => {
        fetchContacts();
    }, [fetchContacts]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    const exportCSV = () => {
        const rows = [
            ["Name", "Email", "Phone", "Comment", "Created At"],
            ...data.map((c) => [
                c.name,
                c.email,
                c.phone || "",
                c.comment.replace(/\n/g, " "),
                new Date(c.createdAt).toISOString(),
            ]),
        ];
        const csv = rows.map((r) => r.map(escapeCSV).join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `contacts_page_${page}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Contact Messages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Top controls */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <Input
                            placeholder="Search name, email, phone, comment..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full md:max-w-sm"
                        />
                        <div className="flex items-center gap-2">
                            <Select
                                value={String(limit)}
                                onValueChange={(v) => {
                                    setLimit(Number(v));
                                    setPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[110px]">
                                    <SelectValue placeholder="Rows" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {[5, 10, 20, 50].map((n) => (
                                        <SelectItem key={n} value={String(n)}>
                                            {n} / page
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

                    {/* Table */}
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                {table.getHeaderGroups().map((hg) => (
                                    <TableRow key={hg.id}>
                                        {hg.headers.map((header) => (
                                            <TableHead key={header.id}>
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={columns.length} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                                            </div>
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
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            Page <strong>{page}</strong> of <strong>{totalPages}</strong> • Total:{" "}
                            <strong>{total}</strong>
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(1)}
                                disabled={page === 1}
                            >
                                {"<<"}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </Button>
                            <Button
                                variant="outline"
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

function escapeCSV(value: string) {
    if (value == null) return "";
    const needsQuotes = value.includes(",") || value.includes("\n") || value.includes('"');
    let escaped = value.replace(/"/g, '""');
    if (needsQuotes) escaped = `"${escaped}"`;
    return escaped;
}
