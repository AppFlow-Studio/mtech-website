"use client"
import { useQuery } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, Mail, Phone, ArrowLeft, CreditCard, Truck, Package, DollarSign, Calendar } from 'lucide-react';
import { OrderItems } from '@/lib/types';
import { useState } from 'react';

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

function itemStatusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
        PROCESSING: { color: "bg-blue-100 text-blue-800", label: "Processing" },
        SHIPPED: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
        DELIVERED: { color: "bg-green-100 text-green-800", label: "Delivered" },
        READY_FOR_PICKUP: { color: "bg-orange-100 text-orange-800", label: "Ready for Pickup" },
        CANCELLED: { color: "bg-red-100 text-red-800", label: "Cancelled" },
    };
    const c = config[status] || config.PENDING;
    return <Badge className={`${c.color} text-xs font-medium`}>{c.label}</Badge>;
}

export default function AgentOrderCheckoutPage({ params }: { params: { order_id: string } }) {
    const { data: OrderInfo, isLoading: OrderInfoLoading } = useQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    });

    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    if (OrderInfoLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <div className="text-lg text-muted-foreground font-medium animate-pulse">Loading checkout...</div>
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

    // Redirect if order is not approved (after loading check)
    if (OrderInfo && OrderInfo.status !== 'approved') {
        router.push(`/agent/order/${params.order_id}`);
        return null;
    }

    // If no order info yet, show loading
    if (!OrderInfo) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <div className="text-lg text-muted-foreground font-medium animate-pulse">Loading order details...</div>
            </div>
        );
    }

    const subtotal = OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + item.price_at_order * Number(item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handleCompleteCheckout = async () => {
        setIsProcessing(true);
        // TODO: Implement checkout completion logic
        setTimeout(() => {
            setIsProcessing(false);
            // Redirect to order confirmation or orders list
            router.push('/agent');
        }, 2000);
    };

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push(`/agent/order/${params.order_id}`)}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Order
                </Button>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-foreground">Checkout</h1>
                    <p className="text-muted-foreground">Complete your approved order</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Checkout Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Order Summary
                            </CardTitle>
                            <CardDescription>
                                Order #{OrderInfo.id} • {OrderInfo.order_name}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {OrderInfo.order_items.map((item: OrderItems, index: number) => (
                                    <div key={item.id} className="flex items-start gap-4 p-4 border border-border rounded-lg">
                                        {item.products?.imageSrc && (
                                            <img
                                                src={item.products.imageSrc}
                                                alt={item.products.name}
                                                className="w-16 h-16 object-cover rounded border flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-foreground truncate">
                                                        {item.products?.name}
                                                    </h4>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.products?.description}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            Qty: {item.quantity}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            Price: ${item.price_at_order}
                                                        </span>
                                                        {itemStatusBadge(item.order_status)}
                                                    </div>
                                                </div>
                                                <div className="text-right ml-4">
                                                    <div className="font-semibold text-foreground">
                                                        ${(item.price_at_order * Number(item.quantity)).toFixed(2)}
                                                    </div>
                                                    {item.fulfillment_type && (
                                                        <Badge variant="outline" className="mt-1">
                                                            {item.fulfillment_type}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Fulfillment Details */}
                                            {(item.order_status === "SHIPPED" || item.fulfillment_type === "SHIPPING") && (
                                                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                                    <div className="flex items-center gap-2 text-sm text-blue-800">
                                                        <Truck className="h-4 w-4" />
                                                        <span className="font-medium">Shipping Details</span>
                                                    </div>
                                                    <div className="text-xs text-blue-700 mt-1">
                                                        Tracking: {item.tracking_number || "Pending"} |
                                                        Carrier: {item.carrier || "TBD"}
                                                    </div>
                                                </div>
                                            )}

                                            {(item.order_status === "READY_FOR_PICKUP" || item.fulfillment_type === "PICKUP") && (
                                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                                                    <div className="flex items-center gap-2 text-sm text-green-800">
                                                        <Package className="h-4 w-4" />
                                                        <span className="font-medium">Pickup Details</span>
                                                    </div>
                                                    <div className="text-xs text-green-700 mt-1">
                                                        {item.pickup_details || "Contact admin for pickup information"}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Admin Approval Information */}
                    <Card className="bg-green-50 border-green-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-800">
                                <CheckCircle className="h-5 w-5" />
                                Order Approved
                            </CardTitle>
                            <CardDescription className="text-green-700">
                                This order has been reviewed and approved by our admin team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {OrderInfo.admin && (
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                    <h4 className="font-medium text-green-800 mb-3">Approved by Admin</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-green-700">Name:</span>
                                            <span className="text-sm text-green-600">
                                                {OrderInfo.admin.first_name} {OrderInfo.admin.last_name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-green-600" />
                                            <span className="text-sm text-green-600">{OrderInfo.admin.email}</span>
                                        </div>
                                        {OrderInfo.admin.phone_number && (
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-green-600" />
                                                <span className="text-sm text-green-600">{OrderInfo.admin.phone_number}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Checkout Sidebar */}
                <div className="space-y-6">
                    {/* Order Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Order Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Order ID:</span>
                                <span className="font-medium">{OrderInfo.id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Created:</span>
                                <span className="font-medium">{formatDate(OrderInfo.created_at)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                {statusBadge(OrderInfo.status)}
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Items:</span>
                                <span className="font-medium">{OrderInfo.order_items.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5" />
                                Payment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal:</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (8%):</span>
                                    <span className="font-medium">${tax.toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-green-600">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Complete Checkout */}
                    <Card>
                        <CardContent className="pt-6">
                            <Button
                                onClick={handleCompleteCheckout}
                                disabled={isProcessing}
                                className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                size="lg"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="h-4 w-4" />
                                        Complete Checkout
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground text-center mt-3">
                                By completing checkout, you confirm this order is ready for fulfillment
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 