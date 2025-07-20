"use client";
import { useProfile } from "@/lib/hooks/useProfile";
import useOrderState from "./order-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Clock, Filter, TrendingUp, DollarSign, Package, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
        submitted: { color: "bg-blue-100 text-blue-800", label: "Submitted" },
        approved: { color: "bg-green-100 text-green-800", label: "Approved" },
        fulfilled: { color: "bg-purple-100 text-purple-800", label: "Fulfilled" },
        completed: { color: "bg-purple-100 text-purple-800", label: "Completed" },
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

export default function AgentOrdersScreen() {
    const { profile } = useProfile();
    const router = useRouter();
    const { data: orders, isLoading, isError } = useOrderState(profile?.id || "");
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Filter orders based on status
    const filteredOrders = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return [];
        if (statusFilter === 'all') return orders;
        return orders.filter(order => order.status === statusFilter);
    }, [orders, statusFilter]);

    // Calculate insights
    const insights = useMemo(() => {
        if (!orders || !Array.isArray(orders)) return null;

        const totalOrders = orders.length;
        const totalValue = orders.reduce((sum, order) => {
            const orderTotal = order.order_items?.reduce((acc: number, item: any) => acc + item.price_at_order * Number(item.quantity), 0) || 0;
            return sum + orderTotal;
        }, 0);

        const statusCounts = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const pendingOrders = statusCounts.submitted || 0;
        const approvedOrders = statusCounts.approved || 0;
        const completedOrders = (statusCounts.fulfilled || 0) + (statusCounts.completed || 0);

        return {
            totalOrders,
            totalValue,
            pendingOrders,
            approvedOrders,
            completedOrders,
            averageOrderValue: totalOrders > 0 ? totalValue / totalOrders : 0
        };
    }, [orders]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-2" />
                <span className="text-lg font-semibold text-primary">Loading your orders...</span>
            </div>
        );
    }
    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <Clock className="h-10 w-10 text-destructive mb-2 animate-bounce" />
                <span className="text-lg font-semibold text-destructive">Failed to load orders</span>
                <span className="text-muted-foreground text-sm mt-2">{orders instanceof Error ? orders.message : "Unknown error"}</span>
            </div>
        );
    }
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <span className="text-lg font-semibold text-muted-foreground">No orders yet.</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Insights Section */}
            {insights && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-800">Total Orders</p>
                                    <p className="text-2xl font-bold text-blue-900">{insights.totalOrders}</p>
                                </div>
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-800">Total Value</p>
                                    <p className="text-2xl font-bold text-green-900">${insights.totalValue.toLocaleString()}</p>
                                </div>
                                <DollarSign className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-800">Pending</p>
                                    <p className="text-2xl font-bold text-yellow-900">{insights.pendingOrders}</p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-800">Completed</p>
                                    <p className="text-2xl font-bold text-purple-900">{insights.completedOrders}</p>
                                </div>
                                <CheckCircle className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filter Section */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">Filter by status:</span>
                </div>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {filteredOrders.length} of {orders.length} orders
                </Badge>
            </div>

            <div className="flex space-x-2 mb-6">
                <Button
                    variant={statusFilter === 'all' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('all')}
                    className="text-sm"
                >
                    All
                </Button>
                <Button
                    variant={statusFilter === 'draft' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('draft')}
                    className="text-sm"
                >
                    Draft
                </Button>
                <Button
                    variant={statusFilter === 'submitted' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('submitted')}
                    className="text-sm"
                >
                    Submitted
                </Button>
                <Button
                    variant={statusFilter === 'approved' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('approved')}
                    className="text-sm"
                >
                    Approved
                </Button>
                <Button
                    variant={statusFilter === 'fulfilled' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('fulfilled')}
                    className="text-sm"
                >
                    Fulfilled
                </Button>
                <Button
                    variant={statusFilter === 'completed' ? 'default' : 'outline'}
                    onClick={() => setStatusFilter('completed')}
                    className="text-sm"
                >
                    Completed
                </Button>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-bottom-2">
                {filteredOrders.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).map((order) => {
                    const total = order.order_items?.reduce((acc: number, item: any) => acc + item.price_at_order * Number(item.quantity), 0) || 0;
                    const tax = total * 0.08;
                    const totalWithTax = total + tax;
                    return (
                        <Card
                            key={order.id}
                            className="hover:shadow-lg transition-shadow duration-200 border border-border rounded-xl cursor-pointer group animate-in fade-in-0 slide-in-from-bottom-2"
                            onClick={() => router.push(`/agent/order/${order.id}`)}
                        >
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <div>
                                    <CardTitle className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">{order.order_name}</CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">Updated {formatDate(order.updated_at)}</CardDescription>
                                </div>
                                <div className="flex gap-2 items-center">{statusBadge(order.status)}</div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2 pt-0">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">Items:</span> {order.order_items?.length || 0}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium">Total:</span> <span className="text-green-700 font-bold">${totalWithTax.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    <span>View details</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* No Results Message */}
            {filteredOrders.length === 0 && orders.length > 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">No orders found</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        No orders match the selected status filter.
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setStatusFilter('all')}
                        className="text-sm"
                    >
                        Show all orders
                    </Button>
                </div>
            )}
        </div>
    );
}
