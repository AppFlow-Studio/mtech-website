"use client";
import { useProfile } from "@/lib/hooks/useProfile";
import useOrderState from "./order-state";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in-0 slide-in-from-bottom-2">
            {orders.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).map((order) => {
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
    );
}
