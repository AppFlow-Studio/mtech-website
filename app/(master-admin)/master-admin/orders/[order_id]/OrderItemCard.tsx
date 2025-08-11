import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, CheckCircle, DollarSign, TrendingUp, TrendingDown, Package, Truck, ExternalLink, Printer, Clock } from "lucide-react";
import { OrderItems } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
import { UpdateOrderItem } from "@/app/(master-admin)/master-admin/actions/order-actions/update-order-item";
import { DeleteOrderItem } from "@/app/(master-admin)/master-admin/actions/order-actions/delete-order-item";
import { GetAgentTierPrice } from "@/app/(master-admin)/master-admin/actions/order-actions/get-agent-tier-price";
import { createPickupFulfillment } from "@/app/(master-admin)/master-admin/actions/shipping/create-pickup-fulfillment";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/hooks/useProfile";

// Types for props
interface OrderItemCardProps {
    item: OrderItems;
    order_id: string;
    refetchOrderInfo: () => void | Promise<void>;
    agentTierId?: string;
}

function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string; icon: any }> = {
        PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending", icon: Loader2 },
        READY_FOR_PICKUP: { color: "bg-green-100 text-green-800", label: "Ready for Pickup", icon: Package },
        SHIPPED: { color: "bg-blue-100 text-blue-800", label: "Shipped", icon: Truck },
        COMPLETED: { color: "bg-purple-100 text-purple-800", label: "Completed", icon: CheckCircle },
    };
    const c = config[status] || config.PENDING;
    const Icon = c.icon;
    return (
        <Badge className={`${c.color} font-medium flex items-center gap-1`}>
            <Icon className="h-3 w-3" />
            {c.label}
        </Badge>
    );
}

export function OrderItemCard({ item, order_id, refetchOrderInfo, agentTierId }: OrderItemCardProps) {
    const { profile } = useProfile()
    const [editDialog, setEditDialog] = useState(false);
    const [editQty, setEditQty] = useState(item.quantity);
    const [editPrice, setEditPrice] = useState(item.price_at_order);
    const [editStatus, setEditStatus] = useState(item.order_status);
    const [editTracking, setEditTracking] = useState(item.tracking_number || "");
    const [editCarrier, setEditCarrier] = useState(item.carrier || "");
    const [editPickup, setEditPickup] = useState(item.pickup_details || "");
    const [editFulfillment, setEditFulfillment] = useState(item.fulfillment_type || "PICKUP");
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [agentTierPrice, setAgentTierPrice] = useState<number | null>(null);
    const [isLoadingTierPrice, setIsLoadingTierPrice] = useState(false);
    const [isPreparingPickup, setIsPreparingPickup] = useState(false);

    // Check if item is fulfilled
    const isFulfilled = item.fulfillment_id || item.order_status === 'SHIPPED' || item.order_status === 'COMPLETED';
    const hasFulfillment = item.fulfillments && item.fulfillments.length > 0;

    // Fetch agent tier price when component mounts
    useEffect(() => {
        const fetchAgentTierPrice = async () => {
            if (agentTierId && item.products?.id) {
                setIsLoadingTierPrice(true);
                try {
                    const price = await GetAgentTierPrice(agentTierId, item.products.id);
                    setAgentTierPrice(price);
                } catch (error) {
                    console.error('Failed to fetch agent tier price:', error);
                } finally {
                    setIsLoadingTierPrice(false);
                }
            }
        };

        fetchAgentTierPrice();
    }, [agentTierId, item.products?.id]);

    // Calculate price difference
    const priceDifference = agentTierPrice ? item.price_at_order - agentTierPrice : 0;
    const priceDifferencePercentage = agentTierPrice ? ((priceDifference / agentTierPrice) * 100) : 0;

    const handleSave = async () => {
        setIsSaving(true);
        setError("");
        try {
            // Add Trigger to notify the user that the item is being updated via email
            const isUpdated = await UpdateOrderItem(order_id, item.id, {
                quantity: editQty,
                price_at_order: editPrice,
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
        const isDeleted = await DeleteOrderItem(order_id, item.id, item.products.name, profile?.first_name + ' ' + profile?.last_name || 'Unknown', item.quantity);
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

    const handlePrintLabel = (fulfillment: any) => {
        if (fulfillment.shipments && fulfillment.shipments.length > 0) {
            const shipment = fulfillment.shipments[0];
            if (shipment.label_url) {
                const printWindow = window.open(shipment.label_url, '_blank');
                if (printWindow) {
                    printWindow.onload = () => {
                        printWindow.print();
                    };
                }
                toast.success('Opening shipping label for printing...');
            } else {
                toast.error('No label URL available');
            }
        }
    };

    const handlePreparePickup = async () => {
        setIsPreparingPickup(true);
        try {
            const result = await createPickupFulfillment(order_id, [item]);
            if (result.success && result.data) {
                toast.success(`Pickup prepared! Code: ${result.data.pickup_code}`);
                refetchOrderInfo();
            } else {
                toast.error(result.error || 'Failed to prepare pickup');
            }
        } catch (error) {
            toast.error('An error occurred while preparing pickup');
        } finally {
            setIsPreparingPickup(false);
        }
    };

    return (
        <>
            <Card className={cn(
                "mb-4 shadow-sm hover:shadow-md transition-all duration-300 animate-in fade-in-0 slide-in-from-bottom-2",
                isFulfilled && "border-l-4 border-l-green-500 bg-green-50/30",
                hasFulfillment && "border-l-4 border-l-blue-500 bg-blue-50/30"
            )}>
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
                            {/* Price Comparison Display */}
                            {agentTierPrice !== null && (
                                <div className="mt-2">
                                    {isLoadingTierPrice ? (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Loading tier price...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="text-muted-foreground">Tier Price: ${agentTierPrice}</span>
                                            {priceDifference !== 0 && (
                                                <div className={cn(
                                                    "flex items-center gap-1",
                                                    priceDifference > 0 ? "text-red-600" : "text-green-600"
                                                )}>
                                                    {priceDifference > 0 ? (
                                                        <TrendingUp className="h-3 w-3" />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" />
                                                    )}
                                                    <span className="font-medium">
                                                        {priceDifference > 0 ? '+' : ''}{priceDifference.toFixed(2)} ({priceDifferencePercentage > 0 ? '+' : ''}{priceDifferencePercentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="w-px bg-border mx-6" />
                        <div className="flex flex-col gap-2">
                            {/* Fulfillment Status */}
                            {hasFulfillment ? (
                                <div className="space-y-2">
                                    {item.fulfillments?.map((fulfillment: any) => (
                                        <div key={fulfillment.id} className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                                <Badge className="bg-blue-100 text-blue-800 text-xs">
                                                    {fulfillment.fulfillment_type === 'SHIPPING' ? (
                                                        <Truck className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <Package className="h-3 w-3 mr-1" />
                                                    )}
                                                    {fulfillment.fulfillment_type}
                                                </Badge>
                                                {fulfillment.shipments && fulfillment.shipments.length > 0 && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handlePrintLabel(fulfillment)}
                                                        className="h-6 px-2 text-xs"
                                                    >
                                                        <Printer className="h-3 w-3 mr-1" />
                                                        Print Label
                                                    </Button>
                                                )}
                                            </div>
                                            {fulfillment.shipments && fulfillment.shipments.length > 0 && (
                                                <div className="text-xs text-blue-700">
                                                    <div>Tracking: {fulfillment.shipments[0].tracking_number}</div>
                                                    <div>Carrier: {fulfillment.shipments[0].carrier}</div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {item.fulfillment_type &&
                                        <div className="text-left">
                                            <Badge
                                                variant={item.fulfillment_type === 'SHIPPING' ? 'default' : 'secondary'}
                                                className={item.fulfillment_type === 'SHIPPING' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                                            >
                                                {item.fulfillment_type === 'SHIPPING' ? (
                                                    <Truck className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <Package className="h-3 w-3 mr-1" />
                                                )}
                                                {item.fulfillment_type}
                                            </Badge>
                                        </div>
                                    }
                                    {item.order_status === "SHIPPED" || item.fulfillment_type === "SHIPPING" && (
                                        <div className="text-xs mt-1 text-muted-foreground">
                                            Tracking: <span className="font-medium">{item.tracking_number || "-"}</span> | Carrier: <span className="font-medium">{item.carrier || "-"}</span>
                                        </div>
                                    )}
                                    {item.fulfillment_type === "PICKUP" && (
                                        <div className="text-xs mt-1 text-muted-foreground">
                                            Pickup Details: <span className="font-medium">{item.pickup_details || "-"}</span>
                                        </div>
                                    )}
                                    {item.fulfillment_type == null && (
                                        <div className="text-xs italic text-muted-foreground px-2 py-1 rounded bg-muted">
                                            No fulfillment info assigned yet
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {!item.fulfillment_id && item.fulfillment_type === 'PICKUP' && (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handlePreparePickup}
                                disabled={isPreparingPickup}
                                className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                            >
                                {isPreparingPickup ? (
                                    <Clock className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                    <Package className="h-3 w-3 mr-1" />
                                )}
                                {isPreparingPickup ? 'Preparing...' : 'Mark as Ready for Pickup'}
                            </Button>
                        )}
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
                                <label className="block text-sm font-medium mb-1">Order Price</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={editPrice}
                                        onChange={e => setEditPrice(Number(e.target.value))}
                                        disabled={isSaving}
                                        className="pl-8"
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Order Status</label>
                            <select
                                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                                value={editStatus}
                                onChange={e => setEditStatus(e.target.value as any)}
                                disabled={isSaving}
                            >
                                <option value="PENDING">Pending</option>
                                <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="COMPLETED">Completed</option>
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
                            <div>
                                <label className="block text-sm font-medium mb-1">Pickup Details</label>
                                <Textarea
                                    value={editPickup}
                                    onChange={e => setEditPickup(e.target.value)}
                                    disabled={isSaving}
                                    placeholder="Enter pickup instructions or details..."
                                />
                            </div>
                        )}
                        {error && (
                            <div className="text-red-600 text-sm">{error}</div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2 justify-end mt-4">
                        <Button variant="outline" onClick={() => setEditDialog(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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