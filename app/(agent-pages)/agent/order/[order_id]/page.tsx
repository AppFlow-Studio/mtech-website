"use client"
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, CheckCircle, AlertCircle, ShoppingCart, Mail, Phone, MapPin, Edit, Truck, Package, Calendar, Clock, ExternalLink } from 'lucide-react';
import { OrderItems } from '@/lib/types';
import { useState } from 'react';
import AddressEditModal from '@/components/AddressEditModal';
import { toast } from 'sonner';
import { UpdateOrderShippingAddress } from '../../../actions/update-order-shipping-address';
import { submitOrder } from '@/app/(agent-pages)/actions/submit-order';
import { useProfile } from '@/lib/hooks/useProfile';
import FulfillmentMethodSelector from '../../../components/FulfillmentMethodSelector';
import { updateOrderItemFulfillment } from '../../../actions/update-order-item-fulfillment';
import CheckoutDialog from '../../../components/CheckoutDialog';

function statusBadge(status: string) {
    const config: Record<string, { color: string; label: string }> = {
        draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
        unpaid: { color: "bg-yellow-100 text-yellow-800", label: "Unpaid" },
        paid: { color: "bg-green-100 text-green-800", label: "Paid" },
        '30-day-terms-unpaid': { color: "bg-yellow-100 text-yellow-800", label: "30-day Terms Unpaid" },
        '30-day-terms-paid': { color: "bg-green-100 text-green-800", label: "30-day Terms Paid" },
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
    const { data: OrderInfo, isLoading: OrderInfoLoading, refetch: refetchOrderInfo } = useSuspenseQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    });
    const { profile } = useProfile();
    const router = useRouter();
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const getItemTotalWithModifiers = (item: OrderItems) => {
        if (!item.order_item_modifiers) {
            return item.price_at_order * Number(item.quantity);
        }
        return item.price_at_order + item.order_item_modifiers?.reduce((total: number, modifier: any) => total + modifier.price_adjustment_at_order, 0) * Number(item.quantity);
    };

    const GetOrderTotal = () => {
        return OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + getItemTotalWithModifiers(item), 0);
    };

    const total = GetOrderTotal();
    const tax = total * 0.08;
    const totalWithTax = total + tax;

    console.log(OrderInfo)
    const handleCheckout = () => {
        if (OrderInfo.order_items.length === 0) {
            toast.error('No items in this order');
            return;
        }
        if (OrderInfo.status !== 'approved') {
            setShowCheckoutDialog(true);
        } else {
            // Show checkout dialog for approved orders
            setShowCheckoutDialog(true);
        }
    };

    const handleCheckoutSubmit = async (paymentData: any) => {
        // Here you would integrate with your payment processor for authorization hold
        // For now, we'll simulate a successful authorization hold
        console.log('Payment authorization data:', paymentData);

        // You can add your payment authorization logic here
        // Example: await authorizePaymentHold(paymentData, OrderInfo);

        // For demo purposes, we'll just show a success message
        toast.success('Payment authorization hold placed successfully!');

        // You might want to update the order status here
        // await updateOrderStatus(params.order_id, 'pending_payment');

        // Refetch order data
        refetchOrderInfo();
    };
    const handleSubmitOrderForApproval = async () => {
        setIsSubmittingOrder(true);
        const response = await submitOrder(params.order_id, profile, OrderInfo.order_name, OrderInfo.notes, OrderInfo.order_items, OrderInfo.order_confirmation_number);
        if (response) {
            toast.success('Order submitted for approval successfully!');
            refetchOrderInfo();
            setIsSubmittingOrder(false);
        } else {
            toast.error('Failed to submit order for approval');
            setIsSubmittingOrder(false);
        }
    }

    const handleSaveAddress = async (address: any) => {
        setIsSavingAddress(true);
        try {
            await UpdateOrderShippingAddress(params.order_id, address);
            toast.success('Shipping address updated successfully!');
            setShowAddressModal(false);
            refetchOrderInfo();
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to update shipping address');
        } finally {
            setIsSavingAddress(false);
        }
    };

    const handleFulfillmentUpdate = async (itemId: string, fulfillmentMethod: 'SHIPPING' | 'PICKUP', shippingAddress?: any) => {
        try {
            const result = await updateOrderItemFulfillment(itemId, {
                fulfillment_type: fulfillmentMethod,
            });

            if (result.success) {
                toast.success('Fulfillment method updated successfully!');
                refetchOrderInfo();
            } else {
                toast.error(result.error || 'Failed to update fulfillment method');
            }
        } catch (error) {
            console.error('Error updating fulfillment method:', error);
            toast.error('An error occurred while updating fulfillment method');
        }
    };

    // Get shipping address from order data
    const shippingAddress = OrderInfo.shipping_address || OrderInfo.shipping_address_json ?
        (typeof OrderInfo.shipping_address === 'string' ? JSON.parse(OrderInfo.shipping_address) : OrderInfo.shipping_address) :
        null;

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
        <div className="max-w-7xl mx-auto py-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.back()}
            >
                ← Back to Orders
            </Button>
            {/* Order Overview */}
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <Card className="">
                    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold text-foreground">Order: {OrderInfo.order_name}</CardTitle>
                            <CardDescription className="text-muted-foreground">Order ID: {OrderInfo.order_confirmation_number || OrderInfo.id}</CardDescription>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">Created: {formatDate(OrderInfo.created_at)}</span>
                                {statusBadge(OrderInfo.status)}
                                {statusBadge(OrderInfo.payment_status)}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row gap-8">
                        {/* Agent Info */}
                        <div className="w-full md:w-1/2 bg-muted/40 rounded-lg p-4 flex flex-col gap-2 animate-in fade-in-0 slide-in-from-left-2">
                            <h4 className="font-semibold text-foreground mb-2">Agent Info</h4>
                            <div className="text-sm"><span className="font-medium">Name:</span> {OrderInfo.agent.first_name} {OrderInfo.agent.last_name}</div>
                            <div className="text-sm"><span className="font-medium">Email:</span> {OrderInfo.agent.email}</div>
                            <div className="text-sm"><span className="font-medium">Phone:</span> {OrderInfo.agent.phone_number}</div>
                            <div className="text-sm"><span className="font-medium">Tier:</span> {OrderInfo.agent.agent_tiers.name}</div>
                        </div>
                        {/* Order Info */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Status:</span>
                                {statusBadge(OrderInfo.status)}
                                {statusBadge(OrderInfo.payment_status)}
                            </div>
                            <div>
                                <span className="text-sm font-medium">Agent Notes:</span>
                                <div className="text-muted-foreground mt-1">{OrderInfo.notes || <span className="italic">No notes</span>}</div>
                            </div>
                            <div>
                                <span className="text-sm font-medium">Order Total:</span>
                                <span className="ml-2 text-lg font-bold text-green-700">${totalWithTax.toFixed(2)}</span>
                                <div className="text-xs text-muted-foreground mt-1">
                                    Subtotal: ${total.toFixed(2)}<br />
                                    NY Sales Tax (8%): ${tax.toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Address Section */}
                <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-muted-foreground" />
                                Shipping Address
                            </CardTitle>
                            <CardDescription>
                                Delivery information for this order
                            </CardDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAddressModal(true)}
                            className="flex items-center gap-2"
                        >
                            <Edit className="h-4 w-4" />
                            {shippingAddress ? 'Edit Address' : 'Add Address'}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {shippingAddress ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm font-medium text-foreground mb-1">Contact Information</div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div>{shippingAddress.first_name} {shippingAddress.last_name}</div>
                                            {shippingAddress.company && (
                                                <div>{shippingAddress.company}</div>
                                            )}
                                            <div>{shippingAddress.phone}</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-foreground mb-1">Address</div>
                                        <div className="space-y-1 text-sm text-muted-foreground">
                                            <div>{shippingAddress.formatted_address}</div>
                                            {shippingAddress.apartment_suite && (
                                                <div>{shippingAddress.apartment_suite}</div>
                                            )}
                                            <div>
                                                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip_code}
                                            </div>
                                            <div>{shippingAddress.country}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground mb-2">No shipping address added yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Add a shipping address to enable delivery options for this order.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </section>
            {/* Fulfillment Methods Section */}
            <FulfillmentMethodSelector
                orderItems={OrderInfo.order_items}
                shippingAddress={shippingAddress}
                onFulfillmentUpdate={handleFulfillmentUpdate}
                onSaveAddress={handleSaveAddress}
            />

            {/* Cart Items Section */}
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                    <CardDescription>Details of the items in this order</CardDescription>

                    {/* Admin Approval Disclaimer */}
                    {OrderInfo.status === 'approved' && (
                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-green-800 mb-1">Order Approved by Admin</p>
                                    <p className="text-green-700 mb-3">
                                        This order has been reviewed and approved by our admin team. You can now proceed with checkout.
                                    </p>
                                    {OrderInfo.admin_assigned && (
                                        <div className="bg-white flex flex-col gap-1 rounded-md p-3 border border-green-200">
                                            <p className="text-xs font-medium text-green-800 mb-1">Approved by:</p>
                                            <p className="text-sm text-green-700">
                                                {OrderInfo.admin.first_name} {OrderInfo.admin.last_name}
                                            </p>
                                            <p className="text-xs flex items-center gap-1 text-green-600">
                                                <Mail className="h-4 w-4" />
                                                {OrderInfo.admin.email}
                                            </p>
                                            <p className="text-xs flex items-center gap-1 text-green-600">
                                                <Phone className="h-4 w-4" />
                                                {OrderInfo.admin.phone_number || "No phone number provided"}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={handleCheckout}
                            // Disabled unless all items have a fulfillment method
                            disabled={OrderInfo.order_items.some((item: OrderItems) => !item.fulfillment_type) || OrderInfo.status === 'submitted'}

                            className={`flex items-center gap-2 ${OrderInfo.status === 'approved'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {OrderInfo.status === 'approved' ? 'Proceed to Checkout' : OrderInfo.status === 'submitted' ? 'Awaiting Admin Approval...' : 'Submit Order'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {OrderInfo.order_items.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">No items in this order.</div>
                        )}
                        {OrderInfo.order_items.map((item: OrderItems) => {
                            // Get fulfillment information for this item
                            const itemFulfillment = item.fulfillments;
                            const shipment = itemFulfillment?.shipments;

                            return (
                                <Card key={item.id} className="shadow-sm hover:shadow-md transition-shadow duration-200 animate-in fade-in-0 slide-in-from-bottom-2">
                                    <CardContent className="p-6">
                                        <div className="flex items-start gap-4">
                                            {/* Product Image */}
                                            {item.products?.imageSrc && (
                                                <img src={item.products.imageSrc} alt={item.products.name} className="w-16 h-16 object-cover rounded-lg border" />
                                            )}

                                            {/* Product Details */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-foreground text-lg">{item.products?.name}</h3>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {item.products?.description?.slice(0, 120)}...
                                                        </p>
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <div className="text-lg font-bold text-green-700">
                                                            ${(item.price_at_order * Number(item.quantity)).toFixed(2)}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            ${item.price_at_order} × {item.quantity}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Item Status and Fulfillment */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Left Column - Basic Info */}
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={item.order_status === 'SHIPPED' ? 'default' : 'secondary'}>
                                                                {item.order_status}
                                                            </Badge>
                                                            {itemFulfillment && (
                                                                <Badge variant="outline">
                                                                    {itemFulfillment.fulfillment_type}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        {
                                                            item.order_item_modifiers && item.order_item_modifiers.length > 0 && (
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        {item.order_item_modifiers.map((modifier: any) => (
                                                                            <div className="flex flex-col items-start gap-2">
                                                                                <p className="text-xs font-medium text-muted-foreground">
                                                                                    {modifier.modifiers.modifier_groups.name}
                                                                                </p>
                                                                                <Badge variant="outline" className="text-xs">
                                                                                    {modifier.modifiers.name}
                                                                                </Badge>
                                                                            </div>

                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                    {/* Right Column - Fulfillment Details */}
                                                    <div className="space-y-3">
                                                        {itemFulfillment ? (
                                                            <div className="bg-muted/50 rounded-lg p-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    {itemFulfillment.fulfillment_type === 'SHIPPING' ? (
                                                                        <Truck className="h-4 w-4 text-blue-600" />
                                                                    ) : (
                                                                        <Package className="h-4 w-4 text-green-600" />
                                                                    )}
                                                                    <span className="font-medium text-sm">
                                                                        {itemFulfillment.fulfillment_type} Fulfillment
                                                                    </span>
                                                                </div>

                                                                {shipment && shipment.length > 0 && (
                                                                    shipment.map((shipment) => (
                                                                        <div className="space-y-2">
                                                                            {shipment.tracking_number && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-medium">Tracking:</span>
                                                                                    <a
                                                                                        href={`https://www.fedex.com/fedextrack/?trknbr=${shipment.tracking_number}`}
                                                                                        target="_blank"
                                                                                        rel="noopener noreferrer"
                                                                                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                                                    >
                                                                                        {shipment.tracking_number}
                                                                                        <ExternalLink className="h-3 w-3" />
                                                                                    </a>
                                                                                </div>
                                                                            )}

                                                                            {shipment.carrier && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-medium">Carrier:</span>
                                                                                    <span className="text-xs">{shipment.carrier}</span>
                                                                                </div>
                                                                            )}

                                                                            {itemFulfillment.additional_fee > 0 && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-xs font-medium">Shipping Fee:</span>
                                                                                    <span className="text-xs font-bold text-green-700">
                                                                                        ${itemFulfillment.additional_fee.toFixed(2)}
                                                                                    </span>
                                                                                </div>
                                                                            )}

                                                                            {shipment.created_at && (
                                                                                <div className="flex items-center gap-2">
                                                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                                                    <span className="text-xs">
                                                                                        Created: {new Date(shipment.created_at).toLocaleDateString()}
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                )}

                                                                {itemFulfillment.fulfillment_type === 'PICKUP' && itemFulfillment.pickups?.[0] && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-medium">Pickup Code:</span>
                                                                            <span className="text-xs font-bold">{itemFulfillment.pickups[0].pickup_code}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-medium">Status:</span>
                                                                            <Badge variant="outline" className="text-xs">
                                                                                {itemFulfillment.pickups[0].status}
                                                                            </Badge>
                                                                        </div>
                                                                        {itemFulfillment.pickups[0].picked_up_at && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Calendar className="h-3 w-3 text-muted-foreground" />
                                                                                <span className="text-xs">
                                                                                    Picked up: {new Date(itemFulfillment.pickups[0].picked_up_at).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        {itemFulfillment.pickups[0].created_at && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-3 w-3 text-muted-foreground" />
                                                                                <span className="text-xs">
                                                                                    Created: {new Date(itemFulfillment.pickups[0].created_at).toLocaleDateString()}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                                                <div className="flex items-center gap-2">
                                                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                                                    <span className="text-sm font-medium text-yellow-800">
                                                                        No fulfillment method assigned
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-yellow-700 mt-1">
                                                                    This item needs a fulfillment method to be assigned.
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Approval Required Dialog */}
            <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600" />
                            Order Approval Required
                        </DialogTitle>
                        <DialogDescription className="text-left">
                            <div className="space-y-3">
                                <p>
                                    Your order is currently in <strong>{OrderInfo.status}</strong> status and requires admin approval before you can proceed with checkout.
                                </p>
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-sm text-blue-800">
                                        <strong>Next Steps:</strong>
                                    </p>
                                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                        <li>• Submit your order for admin review</li>
                                        <li>• Wait for admin approval notification</li>
                                        <li>• Return here to complete checkout once approved</li>
                                    </ul>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    You'll receive a notification once your order has been reviewed and approved by our admin team.
                                </p>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowApprovalDialog(false)}
                        >
                            Close
                        </Button>
                        {OrderInfo.status === 'draft' &&
                            <Button
                                onClick={() => {
                                    handleSubmitOrderForApproval();
                                }}
                                disabled={isSubmittingOrder}
                            >
                                {isSubmittingOrder ? 'Submitting...' : 'Submit Order'}
                            </Button>}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Address Edit Modal */}
            <AddressEditModal
                open={showAddressModal}
                onOpenChange={setShowAddressModal}
                address={shippingAddress || {
                    country: "United States",
                    first_name: "",
                    last_name: "",
                    company: "",
                    formatted_address: "",
                    apartment_suite: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    phone: ""
                }}
                type="shipping"
                onSave={handleSaveAddress}
                isSaving={isSavingAddress}
            />

            {/* Checkout Dialog */}
            <CheckoutDialog
                open={showCheckoutDialog}
                onOpenChange={setShowCheckoutDialog}
                orderInfo={OrderInfo}
                profile={profile}
                refetchOrderInfo={refetchOrderInfo}
                onCheckout={handleCheckoutSubmit}
            />
        </div>
    );
}
