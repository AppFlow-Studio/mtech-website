import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, CheckCircle } from "lucide-react";
import { OrderItems } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { UpdateOrderItem } from "@/app/(master-admin)/master-admin/actions/order-actions/update-order-item";
import { DeleteOrderItem } from "@/app/(master-admin)/master-admin/actions/order-actions/delete-order-item";
import { toast } from "sonner";
// Types for props
interface OrderItemCardProps {
    item: OrderItems;
    order_id: string;
    refetchOrderInfo: () => void | Promise<void>;
}

const statusOptions = [
    { value: "PENDING", label: "Pending" },
    { value: "READY_FOR_PICKUP", label: "Ready for Pickup" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "COMPLETED", label: "Completed" },
];

function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        PENDING: { color: "bg-gray-100 text-gray-800", label: "Pending" },
        READY_FOR_PICKUP: { color: "bg-blue-100 text-blue-800", label: "Ready for Pickup" },
        SHIPPED: { color: "bg-green-100 text-green-800", label: "Shipped" },
        COMPLETED: { color: "bg-purple-100 text-purple-800", label: "Completed" },
    };
    const c = config[status] || config.PENDING;
    return <Badge className={`${c.color} font-medium`}>{c.label}</Badge>;
}


export function OrderItemCard({ item, order_id, refetchOrderInfo }: OrderItemCardProps) {
    const [editDialog, setEditDialog] = useState(false);
    const [editQty, setEditQty] = useState(item.quantity);
    const [editStatus, setEditStatus] = useState(item.order_status);
    const [editTracking, setEditTracking] = useState(item.tracking_number || "");
    const [editCarrier, setEditCarrier] = useState(item.carrier || "");
    const [editPickup, setEditPickup] = useState(item.pickup_details || "");
    const [editFulfillment, setEditFulfillment] = useState(item.fulfillment_type || "PICKUP");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    console.log(item)
    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        try {
            // Add Trigger to notify the user that the item is being updated via email
            const isUpdated = await UpdateOrderItem(order_id, item.id, {
                quantity: editQty,
                order_status: editStatus,
                tracking_number: editTracking,
                carrier: editCarrier,
                pickup_details: editPickup,
                fulfillment_type: editFulfillment,
                updated_at: new Date().toISOString(),
            });
            if (!(isUpdated instanceof Error)) {
                setIsSaving(false);
                setEditDialog(false);
                toast.success("Item updated successfully");
                refetchOrderInfo();
            } else {
                toast.error("Failed to update item", {
                    description: isUpdated.message,
                });
                setIsSaving(false);
            }
        } catch (e) {
            setError("Failed to save changes");
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        // Add Trigger to notify the user that the item is being deleted via email
        const isDeleted = await DeleteOrderItem(order_id, item.id);
        if (!(isDeleted instanceof Error)) {
            setShowDeleteDialog(false);
            toast.success("Item deleted successfully");
            refetchOrderInfo();
        } else {
            toast.error("Failed to delete item", {
                description: isDeleted.message,

            });
        }
    };

    return (
        <>
            <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in-0 slide-in-from-bottom-2">
                <CardContent className="flex items-center gap-4 py-4">
                    {item.products?.imageSrc && (
                        <img src={item.products.imageSrc} alt={item.products.name} className="w-14 h-14 object-cover rounded border" />
                    )}
                    <div className="flex-1 flex-row flex">

                        <div className="flex flex-col gap-1">
                            <div className="font-semibold text-foreground">{item.products?.name}</div>
                            <div className="text-xs text-muted-foreground mb-1">{item.products?.description.slice(0, 100)}...</div>
                            <div className="flex flex-wrap gap-2 items-center text-xs">
                                {statusBadge(item.order_status)}
                                <span>Qty: <span className="font-medium">{item.quantity}</span></span>
                                <span>Price: ${item.price_at_order}</span>
                                <span>Subtotal: ${item.price_at_order * Number(item.quantity)}</span>
                            </div>
                        </div>
                        <div className="w-px bg-border mx-6" />
                        <div className="flex flex-col gap-2">
                            {item.fulfillment_type && <Badge variant="outline">{item.fulfillment_type}</Badge>}
                            {item.order_status === "SHIPPED" || item.fulfillment_type === "SHIPPING" && (
                                <div className="text-xs mt-1 text-muted-foreground">
                                    Tracking: <span className="font-medium">{item.tracking_number || "-"}</span> | Carrier: <span className="font-medium">{item.carrier || "-"}</span>
                                </div>
                            )}
                            {item.order_status === "READY_FOR_PICKUP" || item.fulfillment_type === "PICKUP" && (
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
                    <div className="flex flex-col gap-2">
                        <Button size="icon" variant="outline" onClick={() => setEditDialog(true)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                            ×
                        </Button>
                    </div>
                </CardContent>
            </Card>
            <Dialog open={editDialog} onOpenChange={setEditDialog}>
                <DialogContent className="max-w-lg animate-in fade-in-0 zoom-in-95">
                    <DialogHeader>
                        <DialogTitle>Edit Order Item</DialogTitle>
                        <DialogDescription>Update item details and fulfillment status.</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            {item.products?.imageSrc && (
                                <img src={item.products.imageSrc} alt={item.products.name} className="w-12 h-12 object-cover rounded border" />
                            )}
                            <div>
                                <div className="font-medium text-foreground">{item.products?.name}</div>
                                <div className="text-xs text-muted-foreground">{item.products?.description.slice(0, 100)}...</div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Quantity</label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={editQty}
                                    onChange={e => setEditQty(Number(e.target.value))}
                                    disabled={isSaving}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Status</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    value={editStatus}
                                    onChange={e => setEditStatus(e.target.value as "PENDING" | "READY_FOR_PICKUP" | "SHIPPED" | "COMPLETED")}
                                    disabled={isSaving}
                                >
                                    {statusOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Fulfillment Type</label>
                                <select
                                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                    value={editFulfillment}
                                    onChange={e => setEditFulfillment(e.target.value as any)}
                                    disabled={isSaving}
                                >
                                    <option value="PICKUP">Pickup</option>
                                    <option value="SHIPPING">Shipping</option>
                                </select>
                            </div>
                            {editFulfillment === "SHIPPING" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tracking Number</label>
                                        <Input
                                            value={editTracking}
                                            onChange={e => setEditTracking(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Carrier</label>
                                        <Input
                                            value={editCarrier}
                                            onChange={e => setEditCarrier(e.target.value)}
                                            disabled={isSaving}
                                        />
                                    </div>
                                </>
                            )}
                            {editFulfillment === "PICKUP" && (
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Pickup Details</label>
                                    <Textarea
                                        value={editPickup}
                                        onChange={e => setEditPickup(e.target.value)}
                                        disabled={isSaving}
                                    />
                                </div>
                            )}
                        </div>
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <div className="flex gap-2 justify-end mt-2">
                            <Button variant="outline" onClick={() => setEditDialog(false)} disabled={isSaving}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSaving}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Save
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md animate-in fade-in-0 zoom-in-95">
                    <DialogHeader>
                        <DialogTitle>Delete Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this item from the order? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 justify-end mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default OrderItemCard; 