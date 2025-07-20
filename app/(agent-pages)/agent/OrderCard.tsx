"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Pencil, Trash2, ShoppingCart, PlaneLanding, PlaneTakeoff, Eye, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/lib/types";
import { deleteOrder } from "../actions/delete-order";
import { editOrderInfo } from "../actions/edit-order-info";
import { submitOrder } from "../actions/submit-order";

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
    order_items?: Array<{
        product_id: string;
        quantity: number;
        price_at_order: number;
        products: Product;
    }>;
}

interface OrderCardProps {
    order: Order;
    refetchOrders: () => void;
    setSelectedInquiryForCart: (inquiry: Order) => void;
    setCartItems: (items: any[]) => void;
}

// const productForCart = {
//     id: agent_product.id,
//     name: agent_product.name,
//     description: agent_product.description,
//     price: agent_product.price,
//     imageSrc: agent_product.imageSrc,
//     regularPrice: agent_product.default_price,
//     category: agent_product.category,
//     tags: agent_product.tags,
//     inStock: agent_product.inStock
// }


export default function OrderCard({ order, refetchOrders, setSelectedInquiryForCart, setCartItems }: OrderCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editingInfo, setEditingInfo] = useState(false);
    const [editForm, setEditForm] = useState({
        order_name: order.order_name,
        notes: order.notes,
    });
    const [isSaving, setIsSaving] = useState(false);
    const onEdit = () => {
        setOpenEditDialog(true);
    }
    const onDelete = async () => {
        setDeleting(true);
        const result = await deleteOrder(order.id);
        if (result instanceof Error) {
            toast.error(result.message)
        }
        else {
            toast.success("Order deleted: " + order.order_name);
            refetchOrders();
            setDeleting(false);
            setShowDeleteDialog(false);
        }
    }
    const onShop = () => {
        const hasItems = order.order_items && order.order_items.length > 0;
        if (hasItems) {
            setCartItems(order.order_items!.map((item) => ({
                order_id: order.id,
                quantity: item.quantity,
                id: item.product_id,
                name: item.products.name,
                description: item.products.description,
                price: item.price_at_order,
                imageSrc: item.products.imageSrc,
            })));
        }
        setSelectedInquiryForCart(order);
    }
    const hasItems = order.order_items && order.order_items.length > 0;
    const onSubmitOrder = async () => {
        const result = await submitOrder(order.id)
        if (result instanceof Error) {
            toast.error(result.message)
        }
        else {
            toast.success("Order submitted: " + order.order_name);
            refetchOrders();
        }
    }
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
                <section className="w-[45%] pr-6 flex flex-col justify-between">
                    <div>
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                        <p className="text-sm text-foreground whitespace-pre-line min-h-[24px]">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                    </div>
                    <div className="flex mt-4 justify-between">
                        <Button size="sm" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>

                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={onEdit}>
                                <Eye className="h-4 w-4 mr-1" /> View
                            </Button>
                            {order.status === 'approved' ? (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onShop}>
                                    <CheckCircle className="h-4 w-4 mr-1" />Checkout 
                                </Button>
                            ) : (
                                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={onShop}>
                                    <ShoppingCart className="h-4 w-4 mr-1" /> Shop for Order
                                </Button>
                            )}
                        </div>
                    </div>
                </section>
                {/* Vertical Divider */}
                <div className="w-px bg-border mx-6" />
                {/* Items in the order */}
                <section className="w-[40%] flex flex-col justify-center">
                    <div className="mb-2">
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Cart Items</span>
                        {hasItems ? (
                            <ul className="space-y-2">
                                {order.order_items!.slice(0, 2).map((item) => (
                                    <li key={item.product_id} className="flex items-center gap-3">
                                        {item.products.imageSrc && (
                                            <img src={item.products.imageSrc} alt={item.products.name} className="w-10 h-10 object-cover rounded border" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <span className="block font-medium text-foreground truncate">{item.products.name}</span>
                                            <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price_at_order}</span>
                                        </div>
                                    </li>
                                ))}
                                {order.order_items!.length > 2 && (
                                    <li className="text-xs text-muted-foreground italic">+{order.order_items!.length - 2} more item(s)...</li>
                                )}
                            </ul>
                        ) : (
                            <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                        )}
                    </div>
                </section>
                <div className="w-px bg-border mx-6" />
                <section className="w-[15%] flex flex-col justify-between">
                    <div className="mb-2">
                        <span className="block text-xs font-medium text-muted-foreground mb-1">Total</span>
                        <p className="text-lg text-foreground">${order.order_items!.reduce((acc, item) => acc + item.price_at_order * item.quantity, 0)}</p>
                    </div>
                    {order.status === 'draft' && <Button onClick={onSubmitOrder} size="sm" className="bg-green-600 hover:bg-green-700 text-white" >
                        <PlaneTakeoff className="h-4 w-4 mr-1" /> Submit Order
                    </Button>}
                </section>
            </CardContent>
            {/* Edit Cart Dialog */}
            <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
                <DialogContent className="max-w-2xl sm:max-w-[calc(90vw-2rem)] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-foreground">Order Details</DialogTitle>
                        <DialogDescription>Detailed view of this order and its cart items.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 mt-2">
                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Order Name</span>
                                    {!editingInfo && (
                                        <Button size="sm" variant="outline" onClick={() => setEditingInfo(true)}>
                                            Edit Info
                                        </Button>
                                    )}
                                </div>
                                {!editingInfo ? (
                                    <p className="text-base font-semibold text-foreground transition-all duration-200">{order.order_name}</p>
                                ) : (
                                    <input
                                        className="w-full px-3 py-2 border border-border rounded-md text-base font-semibold text-foreground transition-all duration-200"
                                        value={editForm.order_name}
                                        onChange={e => setEditForm(f => ({ ...f, order_name: e.target.value }))}
                                        disabled={isSaving}
                                    />
                                )}
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Status</span>
                                    {statusBadge(order.status)}
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Created</span>
                                    <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                                </div>
                                <div>
                                    <span className="block text-xs font-medium text-muted-foreground mb-1">Notes</span>
                                    {!editingInfo ? (
                                        <p className="text-sm text-foreground whitespace-pre-line min-h-[24px] transition-all duration-200">{order.notes || <span className="italic text-muted-foreground">No notes</span>}</p>
                                    ) : (
                                        <textarea
                                            className="w-full px-3 py-2 border border-border rounded-md min-h-[60px] resize-none text-sm text-foreground transition-all duration-200"
                                            value={editForm.notes}
                                            onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))}
                                            disabled={isSaving}
                                        />
                                    )}
                                </div>
                                {editingInfo && (
                                    <div className="flex gap-2 pt-2 animate-in fade-in-0 slide-in-from-bottom-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => {
                                                setEditingInfo(false);
                                                setEditForm({ order_name: order.order_name, notes: order.notes });
                                            }}
                                            disabled={isSaving}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            onClick={async () => {
                                                setIsSaving(true);
                                                const result = await editOrderInfo(order.id, editForm.order_name, editForm.notes);
                                                if (result instanceof Error) {
                                                    toast.error(result.message);
                                                } else {
                                                    toast.success("Order info updated!");
                                                    setEditingInfo(false);
                                                    refetchOrders();
                                                }
                                                setIsSaving(false);
                                            }}
                                            disabled={isSaving || !editForm.order_name}
                                        >
                                            {isSaving ? "Saving..." : "Save"}
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <span className="block text-xs font-medium text-muted-foreground mb-1">Cart Items</span>
                                {hasItems ? (
                                    <ul className="space-y-3 max-h-[300px] overflow-y-auto">
                                        {order.order_items!.map((item) => (
                                            <li key={item.product_id} className="flex items-center gap-4 border-b border-border pb-2 last:border-b-0">
                                                {item.products.imageSrc && (
                                                    <img src={item.products.imageSrc} alt={item.products.name} className="w-12 h-12 object-cover rounded border" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="block font-medium text-foreground truncate">{item.products.name}</span>
                                                    <span className="block text-xs text-muted-foreground">Qty: {item.quantity} &bull; ${item.price_at_order}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-foreground">${(item.price_at_order * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-xs text-muted-foreground italic py-4">No items in cart</div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-4">
                            <Button variant="outline" onClick={() => setOpenEditDialog(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
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