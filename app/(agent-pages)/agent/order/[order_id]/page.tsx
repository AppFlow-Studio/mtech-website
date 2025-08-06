"use client"
import { useSuspenseQuery } from '@tanstack/react-query';
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, CheckCircle, AlertCircle, ShoppingCart, Mail, Phone, MapPin, Edit } from 'lucide-react';
import { OrderItems } from '@/lib/types';
import { useState } from 'react';
import AddressEditModal from '@/components/AddressEditModal';
import { toast } from 'sonner';
import { UpdateOrderShippingAddress } from '../../../actions/update-order-shipping-address';
import { submitOrder } from '@/app/(agent-pages)/actions/submit-order';

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
    const { data: OrderInfo, isLoading: OrderInfoLoading, refetch: refetchOrderInfo } = useSuspenseQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    });
    console.log('Agent Order Details Page', OrderInfo)
    const router = useRouter();
    const [showApprovalDialog, setShowApprovalDialog] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [isSavingAddress, setIsSavingAddress] = useState(false);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const total = OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + item.price_at_order * Number(item.quantity), 0);
    const tax = total * 0.08;
    const totalWithTax = total + tax;

    const handleCheckout = () => {
        if(OrderInfo.order_items.length === 0) {
            toast.error('No items in this order');
            return;
        }
        if (OrderInfo.status !== 'approved') {
            setShowApprovalDialog(true);
        } else {
            // Navigate to checkout page for approved orders
            router.push(`/agent/order/${params.order_id}/checkout`);
        }
    };
    const handleSubmitOrderForApproval = async () => {
        setIsSubmittingOrder(true);
        const response = await submitOrder(params.order_id, OrderInfo.agent.id, OrderInfo.order_name, OrderInfo.notes, OrderInfo.order_items, OrderInfo.order_confirmation_number);
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
            // Refetch the order data to get the updated address
            // You might want to use React Query's invalidateQueries here
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to update shipping address');
        } finally {
            setIsSavingAddress(false);
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
        <div className="max-w-5xl mx-auto py-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.back()}
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
                        </div>
                        <div>
                            <span className="text-sm font-medium">Agent Notes:</span>
                            <div className="text-muted-foreground mt-1">{OrderInfo.notes || <span className="italic">No notes</span>}</div>
                        </div>
                        <div>
                            <span className="text-sm font-medium">Order Total:</span>
                            <span className="ml-2 text-lg font-bold text-green-700">${totalWithTax.toFixed(2)}</span>
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
                            className={`flex items-center gap-2 ${OrderInfo.status === 'approved'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {OrderInfo.status === 'approved' ? 'Proceed to Checkout' : 'Request Checkout'}
                        </Button>
                    </div>
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
                                            <div className="text-xs text-muted-foreground mb-1">{item.products?.description.slice(0, 100)}...</div>
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
                       { OrderInfo.status === 'draft' && 
                        <Button
                            onClick={() => {
                                handleSubmitOrderForApproval();
                            }}
                            disabled={isSubmittingOrder}
                        >
                            {isSubmittingOrder ? 'Submitting...' : 'Submit Order'}
                        </Button> }
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
        </div>
    );
}
