// src/app/admin/orders/new-orders/page.tsx
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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";


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
    paymentMethod: string;
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

const LIMIT_OPTIONS = [10, 20, 50, 100];

const OrderHistoryPage: FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const [totalPages, setTotal] = useState(1);

    const [search, setSearch] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [loading, setLoading] = useState(false);

    // Fetch orders from backend
    const fetchOrders = useCallback(
        async (
            p: number,
            lim: number,
            q: string,
            from?: string,
            to?: string
        ) => {
            setLoading(true);
            try {
                const res = await post<OrderListResponse>("/checkout/getlist", {
                    page: p,
                    limit: lim,
                    search: q || undefined,
                    status: "delivered",
                    dateFrom: from || undefined,
                    dateTo: to || undefined,
                });

                if (res.success) {
                    setOrders(res.data);
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
    }, [page, limit]);

    // When filters change, reset to page 1
    useEffect(() => {
        setPage(1);
        debouncedFetch(1, limit, search, dateFrom, dateTo);
    }, [search, dateFrom, dateTo]);


    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            {/* Header + Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-3xl font-semibold">Order History</h1>
                <div className="flex items-center space-x-2 bg-white">
                    <Select value={String(limit)} onValueChange={v => setLimit(Number(v))}>
                        <SelectTrigger className="w-20">
                            <SelectValue placeholder="Limit" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            {LIMIT_OPTIONS.map(l => (
                                <SelectItem key={l} value={String(l)}>
                                    {l}/page
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        className="bg-white" variant="outline" onClick={() => fetchOrders(page, limit, search, dateFrom, dateTo)} disabled={loading}>
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
                    onChange={e => setSearch(e.target.value)}
                />
                <Input

                    className="bg-white"
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                />
                <Input

                    className="bg-white"
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
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
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={10} className="px-6 py-8 text-center">
                                    <Progress className="inline-block w-32 h-1 mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : orders.length > 0 ? (
                            orders.map((order) => {
                                // build a one-line address
                                const addr = order.shippingAddress;
                                const fullAddr = `${addr.address}${addr.apartment ? `, ${addr.apartment}` : ""
                                    }, ${addr.city.name}, ${addr.state.name} – ${addr.pin}`;

                                return (
                                    <TableRow
                                        key={order.orderId}
                                        className="hover:bg-gray-50"
                                    >
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
                                                    order.status === "pending"
                                                        ? "outline"
                                                        : "secondary"
                                                }
                                                className="uppercase"
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(
                                                new Date(order.createdAt),
                                                "yyyy-MM-dd HH:mm"
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="px-6 py-8 text-center text-gray-500"
                                >
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
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        disabled={page === totalPages || loading}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;
