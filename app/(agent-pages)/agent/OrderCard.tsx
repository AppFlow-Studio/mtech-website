"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Pencil, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

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

export interface Order {
    id: string;
    order_name: string;
    notes: string;
    status: "draft" | "submitted" | "approved" | "fulfilled";
    created_at: string;
    items?: Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        imageSrc?: string;
    }>;
}

interface OrderCardProps {
    order: Order;
    refetchOrders: () => void;
    setSelectedInquiryForCart: (inquiry: Order) => void;
}

export default function OrderCard({ order, refetchOrders, setSelectedInquiryForCart }: OrderCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const onEdit = () => {
        toast.error("Edit order: " + order.order_name);
    }
    const onDelete = async () => {
        setDeleting(true);
        toast.success("Order deleted: " + order.order_name);
        refetchOrders();
        setDeleting(false);
    }
    const onShop = () => {
        setSelectedInquiryForCart(order);
    }
    // Sample items for demonstration if none provided
    const items = order.items ?? [
        { id: "1", name: "Clover POS Terminal", quantity: 1, price: 899, imageSrc: "/products/product-1.png" },
        { id: "2", name: "Receipt Paper (10pk)", quantity: 2, price: 19.99, imageSrc: "/products/product-2.png" },
        { id: "3", name: "Cash Drawer", quantity: 1, price: 129, imageSrc: "/products/product-3.png" },
    ];
    const hasItems = order.items && order.items.length > 0;
    return (
        <Card className="border border-border rounded-lg hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-foreground truncate">{order.order_name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">Created {formatDate(order.created_at)}</CardDescription>
                </div>
                <div className="flex gap-2 items-center">{statusBadge(order.status)}</div>
            </CardHeader>
            <CardContent className="flex flex-row gap-0">
                {/* Detailed Order Information */}
                <section className="w-1/2 pr-6 flex flex-col justify-between">
                    <div>
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                        <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" onClick={onEdit}>
                            <Pencil className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onShop}>
                            <ShoppingCart className="h-4 w-4 mr-1" /> Shop for Order
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
                                {order.items!.slice(0, 3).map((item) => (
                                    <li key={item.id} className="flex items-center gap-3">
                                        {item.imageSrc && (
                                            <img src={item.imageSrc} alt={item.name} className="w-10 h-10 object-cover rounded border" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-medium text-foreground truncate">{item.name}</span>
                                            <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price}</span>
                                        </div>
                                    </li>
                                ))}
                                {order.items!.length > 3 && (
                                    <li className="text-xs text-muted-foreground italic">+{order.items!.length - 3} more item(s)...</li>
                                )}
                            </ul>
                        ) : (
                            <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                        )}
                    </div>
                </section>
            </CardContent>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the order <span className="font-semibold">{order.order_name}</span>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting} className="flex-1">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                await onDelete();
                                setShowDeleteDialog(false);
                                refetchOrders();
                            }}
                            disabled={deleting}
                            className="flex-1"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
} 