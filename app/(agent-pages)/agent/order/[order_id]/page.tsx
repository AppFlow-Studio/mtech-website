"use client"
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(admin-pages)/admin/actions/order-actions/get-order-info';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { OrderItems } from '@/lib/types';

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

export default function AgentOrderDetailsPage({ params }: { params: { order_id: string } }) {
    const { data: OrderInfo, isLoading: OrderInfoLoading } = useSuspenseQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    });
    const router = useRouter();
    const total = OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + item.price_at_order * Number(item.quantity), 0);
    const tax = total * 0.08;
    const totalWithTax = total + tax;

    if (OrderInfoLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <div className="text-lg text-muted-foreground font-medium animate-pulse">Loading order details...</div>
            </div>
        );
    }
    if (OrderInfo instanceof Error) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-bounce text-red-500 text-4xl mb-2">⚠️</div>
                <div className="text-lg text-red-600 font-semibold">Error: {OrderInfo.message}</div>
            </div>
        );
    }
    return (
        <div className="max-w-5xl mx-auto py-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.push("/agent")}
            >
                ← Back to Orders
            </Button>
            {/* Order Overview */}
            <Card className="mb-6">
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl font-bold text-foreground">Order: {OrderInfo.order_name}</CardTitle>
                        <CardDescription className="text-muted-foreground">Order ID: {OrderInfo.id}</CardDescription>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Created: {formatDate(OrderInfo.created_at)}</span>
                            {statusBadge(OrderInfo.status)}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                    {/* Agent Info */}
                    <div className="w-full md:w-1/3 bg-muted/40 rounded-lg p-4 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-left-2">
                        <h4 className="font-semibold text-foreground mb-2">Agent Info</h4>
                        <div className="text-sm"><span className="font-medium">Name:</span> {OrderInfo.profiles.first_name} {OrderInfo.profiles.last_name}</div>
                        <div className="text-sm"><span className="font-medium">Email:</span> {OrderInfo.profiles.email}</div>
                        <div className="text-sm"><span className="font-medium">Phone:</span> {OrderInfo.profiles.phone_number}</div>
                        <div className="text-sm"><span className="font-medium">Tier:</span> {OrderInfo.profiles.agent_tiers.name}</div>
                    </div>
                    {/* Order Info */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Status:</span>
                            {statusBadge(OrderInfo.status)}
                        </div>
                        <div>
                            <span className="text-sm font-medium">Agent Notes:</span>
                            <div className="text-muted-foreground mt-1">{OrderInfo.notes || <span className="italic">No notes</span>}</div>
                        </div>
                        <div>
                            <span className="text-sm font-medium">Order Total:</span>
                            <span className="ml-2 text-lg font-bold text-green-700">${totalWithTax}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
            {/* Cart Items Section */}
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                    <CardDescription>Details of the items in this order</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {OrderInfo.order_items.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">No items in this order.</div>
                        )}
                        {OrderInfo.order_items.map((item: OrderItems) => (
                            <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in-0 slide-in-from-bottom-2">
                                <CardContent className="flex items-center gap-4 py-4">
                                    {item.products?.imageSrc && (
                                        <img src={item.products.imageSrc} alt={item.products.name} className="w-14 h-14 object-cover rounded border" />
                                    )}
                                    <div className="flex-1 flex-row flex">
                                        <div className="flex flex-col gap-1">
                                            <div className="font-semibold text-foreground">{item.products?.name}</div>
                                            <div className="text-xs text-muted-foreground mb-1">{item.products?.description}</div>
                                            <div className="flex flex-wrap gap-2 items-center text-xs">
                                                <Badge>{item.order_status}</Badge>
                                                <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                                                <span>Price: ${item.price_at_order}</span>
                                                <span>Subtotal: ${item.price_at_order * Number(item.quantity)}</span>
                                            </div>
                                        </div>
                                        <div className="w-px bg-border mx-6" />
                                        <div className="flex flex-col gap-2">
                                            {item.fulfillment_type && <Badge variant="outline">{item.fulfillment_type}</Badge>}
                                            {(item.order_status === "SHIPPED" || item.fulfillment_type === "SHIPPING") && (
                                                <div className="text-xs mt-1 text-muted-foreground">
                                                    Tracking: <span className="font-medium">{item.tracking_number || "-"}</span> | Carrier: <span className="font-medium">{item.carrier || "-"}</span>
                                                </div>
                                            )}
                                            {(item.order_status === "READY_FOR_PICKUP" || item.fulfillment_type === "PICKUP") && (
                                                <div className="text-xs mt-1 text-muted-foreground">
                                                    Pickup Details: <span className="font-medium">{item.pickup_details || "-"}</span>
                                                </div>
                                            )}
                                            {item.fulfillment_type == null && (
                                                <div className="text-xs italic text-muted-foreground px-2 py-1 rounded bg-muted">
                                                    No fulfillment info assigned yet
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
