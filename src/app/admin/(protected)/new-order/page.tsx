"use client";

import React, { FC, useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import { post } from "@/lib/api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Swal from "sweetalert2";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
    _id: string;
    bagName: string;
    price: number;
    quantity: number;
}

interface ShippingAddress {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: { id: string; name: string };
    state: { id: string; name: string };
    pin: string;
    phone: string;
}

interface Coupon {
    code: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    discountAmount: number;
}

interface Order {
    orderId: string;
    items: OrderItem[];
    contact: { email: string; subscribe: boolean };
    shippingAddress: ShippingAddress;
    billingAddress?: ShippingAddress;
    paymentMethod: string;
    shippingMethod?: { id: "standard" | "express"; label: string; cost: number };
    subtotal: number;
    taxes: number;
    shippingCost: number;
    grossTotal: number;
    coupon?: Coupon;
    discount: number;
    total: number;
    status: string;
    createdAt: string;
}

interface OrderListResponse {
    success: true;
    data: Order[];
    pagination: {
        total: number;
        page: number;
        pages: number;
        limit: number;
    };
}

const LIMIT_OPTIONS = [10, 20, 50, 100] as const;

// Allowed statuses
const STATUS_OPTIONS = [
    "pending",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
] as const;

const NewOrdersPage: FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotal] = useState(1);

    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [loading, setLoading] = useState(false);

    const [detailsOpen, setDetailsOpen] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [selected, setSelected] = useState<Order | null>(null);

    // Fetch orders from backend
    const fetchOrders = useCallback(
        async (p: number, lim: number, q: string, from?: string, to?: string) => {
            setLoading(true);
            try {
                const res = await post<OrderListResponse>("/checkout/getlist", {
                    page: p,
                    limit: lim,
                    search: q || undefined,
                    status: "",
                    dateFrom: from || undefined,
                    dateTo: to || undefined,
                    sortBy: "shippingPriority", // hint backend to prefer express
                });

                if (res.success) {
                    // Sort Express first, then by createdAt desc (safety in case backend didn’t)
                    const sorted = [...res.data].sort((a, b) => {
                        const ax = a.shippingMethod?.id === "express" ? 1 : 0;
                        const bx = b.shippingMethod?.id === "express" ? 1 : 0;
                        return bx - ax || +new Date(b.createdAt) - +new Date(a.createdAt);
                    });
                    setOrders(sorted);
                    setTotal(res.pagination.pages);
                }
            } catch (err) {
                console.error("Error fetching orders:", err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Debounce filter changes
    const debouncedFetch = useCallback(
        debounce((p, lim, q, f, t) => {
            fetchOrders(p, lim, q, f, t);
        }, 500),
        [fetchOrders]
    );

    // Initial load & when page/limit change
    useEffect(() => {
        fetchOrders(page, limit, search, dateFrom, dateTo);
    }, [page, limit]); // eslint-disable-line react-hooks/exhaustive-deps

    // When filters change, reset to page 1
    useEffect(() => {
        setPage(1);
        debouncedFetch(1, limit, search, dateFrom, dateTo);
    }, [search, dateFrom, dateTo]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleStatusChange = async (
        orderId: string,
        newStatus: (typeof STATUS_OPTIONS)[number]
    ) => {
        try {
            const res = await post<{ success: boolean; message: string; data: Order }>(
                "/checkout/update-Status",
                { orderId, status: newStatus }
            );

            if (res.success) {
                setOrders((prev) =>
                    prev.map((o) =>
                        o.orderId === orderId ? { ...o, status: res.data.status } : o
                    )
                );
                Swal.fire({
                    icon: "success",
                    title: "Status updated",
                    text: `Order is now "${newStatus}".`,
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                Swal.fire("Error", res.message, "error");
            }
        } catch (err) {
            console.error("Error updating status:", err);
            Swal.fire("Error", "Server error updating status", "error");
        }
    };

    // Wrap with confirmation dialog
    const confirmStatusChange = (
        orderId: string,
        newStatus: (typeof STATUS_OPTIONS)[number]
    ) => {
        Swal.fire({
            title: "Are you sure?",
            text: `Change order ${orderId} status to "${newStatus}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, change it",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                handleStatusChange(orderId, newStatus);
            }
        });
    };

    // Open modal and fetch order details
    const openDetails = async (orderId: string) => {
        setDetailsOpen(true);
        setDetailsLoading(true);
        try {
            const res = await post<{ success: boolean; data: Order }>("/checkout/getbyId", {
                orderId,
            });
            if (res.success) setSelected(res.data);
        } catch (e) {
            console.error("get order details", e);
        } finally {
            setDetailsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header + Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-semibold">New Orders</h1>
                <div className="flex items-center space-x-2 bg-white">
                    <Select value={String(limit)} onValueChange={(v) => setLimit(Number(v))}>
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {LIMIT_OPTIONS.map((l) => (
                                <SelectItem key={l} value={String(l)}>
                                    {l}/page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-white"
                        variant="outline"
                        onClick={() => fetchOrders(page, limit, search, dateFrom, dateTo)}
                        disabled={loading}
                    >
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                    className="bg-white"
                    placeholder="Search by Order ID or Email"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Input
                    className="bg-white"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                />
                <Input
                    className="bg-white"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                />
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <Table className="min-w-full divide-y divide-gray-200">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </TableHead>
                            <TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shipping Address
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shipping
                            </TableHead>
                            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gross (₹)
                            </TableHead>
                            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Discount (₹)
                            </TableHead>
                            <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total (₹)
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                            </TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={11} className="px-6 py-8 text-center">
                                    <Progress className="inline-block w-32 h-1 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.map((order) => {
                                const addr = order.shippingAddress;
                                const fullAddr = `${addr.address}${addr.apartment ? `, ${addr.apartment}` : ""
                                    }, ${addr.city.name}, ${addr.state.name} – ${addr.pin}`;

                                return (
                                    <TableRow key={order.orderId} className="hover:bg-gray-50">
                                        <TableCell className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                                            {order.orderId}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {order.contact.email}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                                            {order.items.reduce((sum, it) => sum + it.quantity, 0)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-normal text-sm text-gray-700">
                                            {fullAddr}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                            {order.shippingMethod ? (
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        className={
                                                            order.shippingMethod.id === "express"
                                                                ? "bg-red-100 text-red-700 border-red-200"
                                                                : "bg-green-100 text-green-700 border-green-200"
                                                        }
                                                        variant="outline"
                                                    >
                                                        {order.shippingMethod.label}
                                                    </Badge>
                                                    <span className="text-gray-700">
                                                        ₹{order.shippingMethod.cost.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                            {order.grossTotal.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-700">
                                            {order.discount.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right font-semibold text-gray-900">
                                            {order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge
                                                variant={
                                                    order.status === "pending" ? "outline" : "secondary"
                                                }
                                                className="uppercase"
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-2">
                                                <Select
                                                    value={order.status}
                                                    onValueChange={(v) =>
                                                        confirmStatusChange(
                                                            order.orderId,
                                                            v as (typeof STATUS_OPTIONS)[number]
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="w-32">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-white">
                                                        {STATUS_OPTIONS.map((s) => (
                                                            <SelectItem key={s} value={s}>
                                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openDetails(order.orderId)}
                                                >
                                                    View details
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={11} className="px-6 py-8 text-center text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page === 1 || loading}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Details Modal */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-4xl md:min-w-4xl bg-white p-6 rounded-lg shadow-lg">
                    <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                            {selected ? (
                                <span>
                                    Order <span className="font-mono">{selected.orderId}</span> •{" "}
                                    {format(new Date(selected.createdAt), "yyyy-MM-dd HH:mm")}
                                </span>
                            ) : (
                                "Loading…"
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {detailsLoading ? (
                        <div className="py-10 text-center text-sm text-gray-500">Loading…</div>
                    ) : selected ? (
                        <div className="space-y-6">
                            {/* Top meta */}
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-500">Payment</div>
                                    <div className="font-medium">
                                        {selected.paymentMethod?.toUpperCase() || "—"}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-500">Shipping</div>
                                    <div className="flex items-center gap-2">
                                        {selected.shippingMethod ? (
                                            <>
                                                <Badge
                                                    className={
                                                        selected.shippingMethod.id === "express"
                                                            ? "bg-red-100 text-red-700 border-red-200"
                                                            : "bg-green-100 text-green-700 border-green-200"
                                                    }
                                                    variant="outline"
                                                >
                                                    {selected.shippingMethod.label}
                                                </Badge>
                                                <span>₹{selected.shippingMethod.cost.toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-500">—</span>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded">
                                    <div className="text-xs text-gray-500">Contact</div>
                                    <div className="font-medium">{selected.contact.email}</div>
                                </div>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <div className="text-sm text-gray-700">
                                        <div>
                                            {selected.shippingAddress.firstName}{" "}
                                            {selected.shippingAddress.lastName}
                                        </div>
                                        <div>
                                            {selected.shippingAddress.address}
                                            {selected.shippingAddress.apartment
                                                ? `, ${selected.shippingAddress.apartment}`
                                                : ""}
                                        </div>
                                        <div>
                                            {selected.shippingAddress.city.name},{" "}
                                            {selected.shippingAddress.state.name} –{" "}
                                            {selected.shippingAddress.pin}
                                        </div>
                                        <div>Phone: {selected.shippingAddress.phone}</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Billing Address</h4>
                                    {selected.billingAddress ? (
                                        <div className="text-sm text-gray-700">
                                            <div>
                                                {selected.billingAddress.firstName}{" "}
                                                {selected.billingAddress.lastName}
                                            </div>
                                            <div>
                                                {selected.billingAddress.address}
                                                {selected.billingAddress.apartment
                                                    ? `, ${selected.billingAddress.apartment}`
                                                    : ""}
                                            </div>
                                            <div>
                                                {selected.billingAddress.city.name},{" "}
                                                {selected.billingAddress.state.name} –{" "}
                                                {selected.billingAddress.pin}
                                            </div>
                                            <div>Phone: {selected.billingAddress.phone}</div>
                                        </div>
                                    ) : (
                                        <div className="text-sm text-gray-500">
                                            Same as shipping address
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h4 className="font-semibold mb-3">Items</h4>
                                <div className="space-y-3">
                                    {selected.items.map((it) => (
                                        <div key={it._id} className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <div className="font-medium">{it.bagName}</div>
                                                <div className="text-xs text-gray-500">
                                                    Qty: {it.quantity}
                                                </div>
                                            </div>
                                            <div className="text-sm text-gray-700">
                                                ₹{(it.price * it.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            <div className="grid gap-2 md:grid-cols-2">
                                <div className="text-sm text-gray-700 space-y-1">
                                    <div>Subtotal: ₹{selected.subtotal.toFixed(2)}</div>
                                    <div>Taxes: ₹{selected.taxes.toFixed(2)}</div>
                                    <div>Shipping: ₹{selected.shippingCost.toFixed(2)}</div>
                                    {selected.discount > 0 && (
                                        <div>
                                            Discount: -₹{selected.discount.toFixed(2)}{" "}
                                            {selected.coupon?.code
                                                ? `(${selected.coupon.code})`
                                                : ""}
                                        </div>
                                    )}
                                </div>
                                <div className="text-right font-semibold">
                                    Total: ₹{selected.total.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default NewOrdersPage;
