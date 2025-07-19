import { useSubmittedOrders } from "../actions/OrderStore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";

function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
        submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
        approved: { color: "bg-green-100 text-green-800", label: "Approved" },
        fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled" },
    };
    const c = config[status] || config.draft;
    return <Badge className={`${c.color} font-medium`}>{c.label}</Badge>;
}

function formatDate(date: string) {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function OrderManagementPage() {
    const { data: submittedOrders, isLoading: isSubmittedOrdersLoading } = useSubmittedOrders();
    const orders = Array.isArray(submittedOrders) ? submittedOrders : [];
    const totalOrders = orders.length;
    const submittedCount = orders.filter((o: any) => o.status === "submitted").length;
    const fulfilledCount = orders.filter((o: any) => o.status === "fulfilled").length;
    const approvedCount = orders.filter((o: any) => o.status === "approved").length;

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

    // Filtered and sorted orders
    const filteredOrders = orders
        .filter((order: any) => statusFilter === "all" || order.status === statusFilter)
        .sort((a: any, b: any) => {
            const aDate = new Date(a.created_at).getTime();
            const bDate = new Date(b.created_at).getTime();
            return sortOrder === "desc" ? bDate - aDate : aDate - bDate;
        });

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold mb-2">Order Management</h1>
                <p className="text-muted-foreground mb-6">View and manage all submitted orders. Click "Manage" to view or fulfill an order.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalOrders}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{submittedCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fulfilled</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">{fulfilledCount}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Status:</label>
                    <select
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="submitted">Submitted</option>
                        <option value="approved">Approved</option>
                        <option value="fulfilled">Fulfilled</option>
                    </select>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm font-medium">Sort:</label>
                    <select
                        className="px-3 py-2 border border-border rounded-md bg-background"
                        value={sortOrder}
                        onChange={e => setSortOrder(e.target.value as "desc" | "asc")}
                    >
                        <option value="desc">Newest to Oldest</option>
                        <option value="asc">Oldest to Newest</option>
                    </select>
                </div>
            </div>
            <div>
                <h2 className="text-lg font-semibold mb-4">All Orders</h2>
                {isSubmittedOrdersLoading ? (
                    <div className="text-muted-foreground py-8">Loading orders...</div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-muted-foreground py-8">No orders found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredOrders.map((order: any) => (
                            <OrderManagementCard key={order.id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function OrderManagementCard({ order }: { order: any }) {
    const hasItems = order.order_items && order.order_items.length > 0;
    const total = hasItems ? order.order_items.reduce((acc: number, item: any) => acc + item.price_at_order * item.quantity, 0) : 0;
    return (
        <Link href={`/master-admin/orders/${order.id}`}>
            <Card className="border border-border rounded-lg hover:shadow-md hover:scale-105 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                        <CardTitle className="text-lg font-semibold text-foreground truncate">{order.order_name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">Created {formatDate(order.created_at)}</CardDescription>
                    </div>
                    <div className="flex gap-2 items-center">{statusBadge(order.status)}</div>
                </CardHeader>
                <CardContent className="flex flex-row gap-0">
                    {/* Order Info */}
                    <section className="w-1/2 pr-6 flex flex-col justify-between">
                        <div>
                            <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                            <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                        </div>
                        <div className="flex mt-4">
                            <Button size="sm" variant="outline" /* TODO: Link to dynamic order page */>
                                Manage
                            </Button>
                        </div>
                    </section>
                    {/* Vertical Divider */}
                    <div className="w-px bg-border mx-6" />
                    {/* Items in the order */}
                    <section className="w-1/2 flex flex-col justify-center">
                        <div className="mb-2">
                            <span className="block text-xs font-medium text-muted-foreground mb-1">Cart Items</span>
                            {hasItems ? (
                                <ul className="space-y-2">
                                    {order.order_items.slice(0, 2).map((item: any) => (
                                        <li key={item.product_id} className="flex items-center gap-3">
                                            {item.products?.imageSrc && (
                                                <img src={item.products.imageSrc} alt={item.products.name} className="w-10 h-10 object-cover rounded border" />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <span className="block font-medium text-foreground truncate">{item.products?.name}</span>
                                                <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price_at_order}</span>
                                            </div>
                                        </li>
                                    ))}
                                    {order.order_items.length > 2 && (
                                        <li className="text-xs text-muted-foreground italic">+{order.order_items.length - 2} more item(s)...</li>
                                    )}
                                </ul>
                            ) : (
                                <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                            )}
                        </div>
                    </section>
                </CardContent>
            </Card>
        </Link>
    );
}