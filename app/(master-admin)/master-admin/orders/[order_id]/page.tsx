'use client'
import { useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { GetOrderInfo } from '@/app/(master-admin)/master-admin/actions/order-actions/get-order-info';
import { GetAdminProfiles } from '@/app/(master-admin)/master-admin/actions/order-actions/get-admin-profiles';
import { AssignOrder } from '@/app/(master-admin)/master-admin/actions/order-actions/assign-order';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { CheckCircle, Loader2, Pencil, Plus, Trash2, UserCheck, Users, Package, MessageSquare, History, Truck, CheckSquare, Square, AlertTriangle } from 'lucide-react';
import OrderItemCard from './OrderItemCard';
import { OrderItems } from '@/lib/types';
import { UpdateOrderItem } from '@/app/(master-admin)/master-admin/actions/order-actions/update-order-item';
import { UpdateOrder } from '@/app/(master-admin)/master-admin/actions/order-actions/update-order';
import { DeleteOrder } from '../../actions/order-actions/delete-order';
import { useQueryClient } from '@tanstack/react-query';
import OrderProductShopping from '../../components/OrderProductShopping';
import OrderNotes from '../[order_id]/components/OrderNotes';
import OrderAuditLog from '../[order_id]/components/OrderAuditLog';
import CreateReturnDialog from '../[order_id]/components/CreateReturnDialog';
import FulfillmentCard from '../[order_id]/components/FulfillmentCard';
import ShippingItemSelector from '@/components/shipping/ShippingItemSelector';
import { Label } from '@/components/ui/label';
import Autocomplete from "react-google-autocomplete";
import { parseAddress } from '@/utils/parse-address';
import { cn } from '@/lib/utils';
import { useProfile } from '@/lib/hooks/useProfile';
import ApproveOrderDialog from './components/ApproveOrderDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { createShippingFulfillmentOrder } from '../../actions/shipping/create-shipping-fulfillment-order';
import { createPickupFulfillment } from '../../actions/shipping/create-pickup-fulfillment';
import { Checkbox } from '@/components/ui/checkbox';

const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
    { value: '30-day-terms-unpaid', label: '30-day Terms Unpaid' },
    { value: '30-day-terms-paid', label: '30-day Terms Paid' },
    { value: "approved", label: "Approved" },
    { value: "fulfilled", label: "Fulfilled" },
];

export default function OrderIDManagerPage({ params }: { params: { order_id: string } }) {
    const queryClient = useQueryClient();
    const { data: OrderInfo, isLoading: OrderInfoLoading, refetch: refetchOrderInfo } = useSuspenseQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    })
    const { profile } = useProfile();
    const [shippingAddress, setShippingAddress] = useState(OrderInfo.shipping_address);
    const [editStatus, setEditStatus] = useState(false);
    const [status, setStatus] = useState(OrderInfo.status);
    const [editNotes, setEditNotes] = useState(false);
    const [notes, setNotes] = useState(OrderInfo.notes);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddItemDialog, setShowAddItemDialog] = useState(false);
    const [showApproveDialog, setShowApproveDialog] = useState(false);
    // Remove local cartItems state
    // const [cartItems, setCartItems] = useState(OrderInfo.order_items);
    const [editAssignment, setEditAssignment] = useState(false);
    const [assignedTo, setAssignedTo] = useState(OrderInfo.admin_assigned || '');
    const [isAssigning, setIsAssigning] = useState(false);
    const [showReturnDialog, setShowReturnDialog] = useState(false);
    const [showShippingSelector, setShowShippingSelector] = useState(false);

    // Bulk selection state
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [showBulkFulfillmentDialog, setShowBulkFulfillmentDialog] = useState(false);
    const [bulkFulfillmentType, setBulkFulfillmentType] = useState<'SHIPPING' | 'PICKUP' | null>(null);
    const [isCreatingBulkFulfillment, setIsCreatingBulkFulfillment] = useState(false);

    const router = useRouter();

    // Fetch admin profiles for assignment
    const { data: adminProfiles, isLoading: adminProfilesLoading } = useQuery({
        queryKey: ['admin-profiles'],
        queryFn: GetAdminProfiles,
    });

    // Helper
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
        };
        const c = config[status] || config.draft;
        return <Badge className={`${c.color} font-medium`}>{c.label}</Badge>;
    }
    const handlePlaceSelected = (place: any) => {
        const parsedAddress = parseAddress(place.address_components);
        setShippingAddress((prev: any) => ({
            ...prev,
            formatted_address: parsedAddress.formatted_address,
            apartment_suite: parsedAddress.apartment_suite || '',
            city: parsedAddress.city || '',
            state: parsedAddress.state || '',
            zip_code: parsedAddress.zip_code || ''
        }));
    };
    function formatDate(date: string) {
        return new Date(date).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }
    const total = OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + item.price_at_order * Number(item.quantity), 0);
    const tax = total * 0.08;
    const totalWithTax = total + tax;

    // Bulk selection helpers
    const unfulfilledItems = OrderInfo.order_items.filter((item: OrderItems) =>
        !item.fulfillment_id && item.order_status !== 'SHIPPED' && item.order_status !== 'COMPLETED'
    );

    const handleItemSelection = (itemId: string, isSelected: boolean) => {
        if (isSelected) {
            setSelectedItems(prev => [...prev, itemId]);
        } else {
            setSelectedItems(prev => prev.filter(id => id !== itemId));
        }
    };

    const handleSelectAll = () => {
        if (selectedItems.length === unfulfilledItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(unfulfilledItems.map((item: OrderItems) => item.id));
        }
    };

    const handleBulkFulfillment = (type: 'SHIPPING' | 'PICKUP') => {
        setBulkFulfillmentType(type);
        setShowBulkFulfillmentDialog(true);
    };

    const handleCreateBulkFulfillment = async () => {
        if (!bulkFulfillmentType || selectedItems.length === 0) return;

        setIsCreatingBulkFulfillment(true);
        try {
            const selectedOrderItems = OrderInfo.order_items.filter((item: OrderItems) =>
                selectedItems.includes(item.id)
            );

            if (bulkFulfillmentType === 'SHIPPING') {
                const result = await createShippingFulfillmentOrder(
                    params.order_id,
                    selectedOrderItems,
                    "0" // No additional fee for bulk shipping
                );

                if (result instanceof Error) {
                    toast.error('Failed to create shipping fulfillment', {
                        description: result.message
                    });
                } else {
                    toast.success(`Created shipping fulfillment for ${selectedItems.length} items`);
                }
            } else if (bulkFulfillmentType === 'PICKUP') {
                const result = await createPickupFulfillment(
                    params.order_id,
                    selectedOrderItems
                );

                if (!result.success) {
                    toast.error('Failed to create pickup fulfillment', {
                        description: result.error
                    });
                } else {
                    toast.success(`Created pickup fulfillment for ${selectedItems.length} items`);
                }
            }

            // Reset bulk selection
            setSelectedItems([]);
            setIsBulkMode(false);
            setShowBulkFulfillmentDialog(false);
            setBulkFulfillmentType(null);

            // Refresh order info
            refetchOrderInfo();
        } catch (error) {
            toast.error('An error occurred while creating bulk fulfillment');
        } finally {
            setIsCreatingBulkFulfillment(false);
        }
    };
    // Handlers
    const handleStatusSave = async () => {
        setIsSaving(true);
        await UpdateOrder(OrderInfo.id, { status: status });
        setEditStatus(false);
        setIsSaving(false);
        toast.success("Order status updated");
        refetchOrderInfo();
    };
    const handleNotesSave = async () => {
        setIsSaving(true);
        await UpdateOrder(OrderInfo.id, { notes: notes });
        setEditNotes(false);
        setIsSaving(false);
        toast.success("Order notes updated");
        refetchOrderInfo();
    };
    const handleDeleteOrder = async () => {
        setIsSaving(true);
        await DeleteOrder(OrderInfo.id);
        setIsSaving(false);
        setShowDeleteDialog(false);
        toast.success("Order deleted");
        router.push("/master-admin");
    };

    const handleAssignmentSave = async () => {
        setIsAssigning(true);
        try {
            await AssignOrder(OrderInfo.id, assignedTo);
            setEditAssignment(false);
            toast.success("Order assignment updated");
            refetchOrderInfo();
        } catch (error) {
            toast.error("Failed to update assignment");
        } finally {
            setIsAssigning(false);
        }
    };

    const handleAddressInputChange = (field: keyof any, value: string) => {
        setShippingAddress((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };


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
        <div className="max-w-8xl mx-auto py-10 px-4 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            <div className='flex flex-row items-center justify-between'>
                <Button
                    variant="outline"
                    className="mb-4"
                    onClick={() => router.back()}
                >
                    ← Back to Orders
                </Button>

                <div className="flex gap-2">
                    {
                        OrderInfo.status === 'submitted' && (
                            <Tooltip>
                                <TooltipTrigger

                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => setShowApproveDialog(true)}
                                        disabled={OrderInfo.admin_assigned === null}
                                        className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" /> Approve Order
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {OrderInfo.admin_assigned === null ? 'Please assign an admin to the order before approving' :
                                        'Approve the order'}
                                </TooltipContent>
                            </Tooltip>
                        )
                    }
                    {OrderInfo.status === 'approved' && <Button
                        variant="outline"
                        onClick={() => setShowReturnDialog(true)}
                        className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                    >
                        <Package className="h-4 w-4 mr-1" /> Create Return
                    </Button>}
                    <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {/* Order Overview */}
            <div className=' grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch mb-6'>
                <Card className="col-span-1 lg:col-span-2">
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
                                {statusBadge(OrderInfo.payment_status)}
                                {/* {!editStatus ? (
                                    <>
                                        {statusBadge(OrderInfo.status)}
                                        <Button size="sm" variant="outline" onClick={() => setEditStatus(true)}>
                                            Edit
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <select
                                            className="px-3 py-2 border border-border rounded-md bg-background"
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                            disabled={isSaving}
                                        >
                                            {statusOptions.map((opt: any) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        <Button size="sm" className="ml-2" onClick={handleStatusSave} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Save
                                        </Button>
                                        <Button size="sm" variant="outline" className="ml-2" onClick={() => { setEditStatus(false); setStatus(OrderInfo.status); }} disabled={isSaving}>
                                            Cancel
                                        </Button>
                                    </>
                                )} */}
                            </div>
                            <div>
                                <span className="text-sm font-medium">Agent Notes:</span>
                                {!editNotes ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-muted-foreground">{OrderInfo.notes || <span className="italic">No notes</span>}</span>
                                        <Button size="sm" variant="outline" onClick={() => setEditNotes(true)}>
                                            <Pencil className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Textarea
                                            value={notes}
                                            onChange={e => setNotes(e.target.value)}
                                            className="min-h-[60px] w-full"
                                            disabled={isSaving}
                                        />
                                        <Button size="sm" className="ml-2" onClick={handleNotesSave} disabled={isSaving}>
                                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Save
                                        </Button>
                                        <Button size="sm" variant="outline" className="ml-2" onClick={() => { setEditNotes(false); setNotes(OrderInfo.notes); }} disabled={isSaving}>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                            </div>
                            <div>
                                <span className="text-sm font-medium">Order Total:</span>
                                <span className="ml-2 text-lg font-bold text-green-700">${totalWithTax.toFixed(2)}</span>
                            </div>
                            {/* Order Assignment Section */}
                            <div className="border-t border-border pt-4 mt-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheck className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Order Assignment:</span>
                                </div>
                                {!editAssignment ? (
                                    <div className="flex items-center gap-2">
                                        {OrderInfo.admin_assigned ? (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                    <Users className="h-3 w-3 mr-1" />
                                                    {adminProfiles?.find((admin: any) => admin.id === OrderInfo.admin_assigned)?.first_name} {adminProfiles?.find((admin: any) => admin.id === OrderInfo.admin_assigned)?.last_name}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    ({adminProfiles?.find((admin: any) => admin.id === OrderInfo.admin_assigned)?.role})
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground text-sm italic">Not assigned</span>
                                        )}
                                        <Button size="sm" variant="outline" onClick={() => setEditAssignment(true)}>
                                            <Pencil className="h-4 w-4 mr-1" /> {OrderInfo.admin_assigned ? 'Reassign' : 'Assign'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <select
                                            className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                                            value={assignedTo}
                                            onChange={e => setAssignedTo(e.target.value)}
                                            disabled={isAssigning || adminProfilesLoading}
                                        >
                                            <option value="">Select an admin...</option>
                                            {adminProfiles?.map((admin: any) => (
                                                <option key={admin.id} value={admin.id}>
                                                    {admin.first_name} {admin.last_name} ({admin.role})
                                                </option>
                                            ))}
                                        </select>
                                        <Button size="sm" className="ml-2" onClick={handleAssignmentSave} disabled={isAssigning || adminProfilesLoading}>
                                            {isAssigning ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} Save
                                        </Button>
                                        <Button size="sm" variant="outline" className="ml-2" onClick={() => { setEditAssignment(false); setAssignedTo(OrderInfo.admin_assigned || ''); }} disabled={isAssigning}>
                                            Cancel
                                        </Button>
                                    </div>
                                )}
                                {adminProfilesLoading && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground">Loading admin profiles...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <OrderNotes orderId={params.order_id} />
            </div>

            {/* Fulfillment History */}
            {OrderInfo.fulfillments && OrderInfo.fulfillments.length > 0 && (
                <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Fulfillment History
                        </CardTitle>
                        <CardDescription>Shipping and pickup fulfillments for this order</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {OrderInfo.fulfillments.map((fulfillment: any) => (
                                <FulfillmentCard key={fulfillment.id} fulfillment={fulfillment} profileId={profile?.id || ''} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Unfulfilled Items */}
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Unfulfilled Items</CardTitle>
                            <CardDescription>Manage the items in this order</CardDescription>
                        </div>
                        {unfulfilledItems.length > 0 && (
                            <div className="flex items-center gap-2">
                                {!isBulkMode ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsBulkMode(true)}
                                        className="flex items-center gap-2"
                                    >
                                        <CheckSquare className="h-4 w-4" />
                                        Bulk Select
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setIsBulkMode(false);
                                                setSelectedItems([]);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        {selectedItems.length > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {selectedItems.length} selected
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleBulkFulfillment('SHIPPING')}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Truck className="h-4 w-4" />
                                                    Bulk Ship
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleBulkFulfillment('PICKUP')}
                                                    className="flex items-center gap-2"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    Bulk Pickup
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Bulk Selection Header */}
                    {isBulkMode && unfulfilledItems.length > 0 && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    checked={selectedItems.length === unfulfilledItems.length}
                                    onCheckedChange={handleSelectAll}
                                />
                                <span className="text-sm font-medium">
                                    Select All ({unfulfilledItems.length} items)
                                </span>
                                {selectedItems.length > 0 && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {selectedItems.length} selected
                                    </Badge>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {unfulfilledItems.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <Package className="h-12 w-12 mx-auto mb-4 text-green-500" />
                                <p className="text-lg font-medium text-green-700">All items have been fulfilled!</p>
                                <p className="text-sm text-muted-foreground">Check the fulfillment history above for shipping details.</p>
                            </div>
                        ) : (
                            unfulfilledItems.map((item: OrderItems) => (
                                <div key={item.id} className="flex items-start gap-3">
                                    {isBulkMode && (
                                        <div className="pt-2">
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onCheckedChange={(checked) =>
                                                    handleItemSelection(item.id, checked as boolean)
                                                }
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <OrderItemCard
                                            item={item}
                                            order_id={params.order_id}
                                            agentTierId={OrderInfo.agent?.agent_tiers?.id}
                                            refetchOrderInfo={async () => {
                                                await queryClient.invalidateQueries({ queryKey: ['order', params.order_id] });
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setShowShippingSelector(true)}>
                            <Truck className="h-4 w-4 mr-1" /> Get Shipping Rates
                        </Button>
                        <Button variant="outline" onClick={() => {
                            setShowAddItemDialog(true);
                            document.getElementById('add-item-options')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}>
                            <Plus className="h-4 w-4 mr-1" /> Add Products
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <OrderAuditLog orderId={params.order_id} />

            {/* Delete Order Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className='max-w-lg'>
                    <DialogHeader>
                        <DialogTitle>Delete Order</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this order? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isSaving} className="flex-1">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteOrder}
                            disabled={isSaving}
                            className="flex-1"
                        >
                            {isSaving ? "Deleting..." : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Bulk Fulfillment Dialog */}
            <Dialog open={showBulkFulfillmentDialog} onOpenChange={setShowBulkFulfillmentDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {bulkFulfillmentType === 'SHIPPING' ? (
                                <Truck className="h-5 w-5 text-blue-600" />
                            ) : (
                                <Package className="h-5 w-5 text-green-600" />
                            )}
                            Create Bulk {bulkFulfillmentType === 'SHIPPING' ? 'Shipping' : 'Pickup'} Fulfillment
                        </DialogTitle>
                        <DialogDescription>
                            This will create a single fulfillment for {selectedItems.length} selected items.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-blue-800 mb-1">Bulk Fulfillment</p>
                                    <p className="text-blue-700">
                                        {bulkFulfillmentType === 'SHIPPING'
                                            ? 'All selected items will be grouped into a single shipping fulfillment. You can add tracking information later.'
                                            : 'All selected items will be grouped into a single pickup fulfillment. A pickup code will be generated.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground">Selected Items ({selectedItems.length}):</h4>
                            <div className="max-h-32 overflow-y-auto space-y-1">
                                {selectedItems.map((itemId) => {
                                    const item = OrderInfo.order_items.find((i: OrderItems) => i.id === itemId);
                                    return item ? (
                                        <div key={itemId} className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
                                            <Package className="h-3 w-3 text-muted-foreground" />
                                            <span className="font-medium">{item.products.name}</span>
                                            <span className="text-muted-foreground">× {item.quantity}</span>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowBulkFulfillmentDialog(false)}
                            className="flex-1"
                            disabled={isCreatingBulkFulfillment}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateBulkFulfillment}
                            disabled={isCreatingBulkFulfillment}
                            className={`flex-1 ${bulkFulfillmentType === 'SHIPPING'
                                ? 'bg-blue-600 hover:bg-blue-700'
                                : 'bg-green-600 hover:bg-green-700'
                                } text-white`}
                        >
                            {isCreatingBulkFulfillment ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    {bulkFulfillmentType === 'SHIPPING' ? (
                                        <Truck className="h-4 w-4 mr-2" />
                                    ) : (
                                        <Package className="h-4 w-4 mr-2" />
                                    )}
                                    Create {bulkFulfillmentType === 'SHIPPING' ? 'Shipping' : 'Pickup'}
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Item Options */}
            <section id="add-item-options" className="scroll-mt-10">
                {
                    showAddItemDialog && (
                        <OrderProductShopping
                            agent_id={OrderInfo.agent.id}
                            agent_tier={OrderInfo.agent.agent_tiers}
                            agent_profile={OrderInfo.agent}
                            agent_notes={OrderInfo.notes}
                            order_id={params.order_id}
                            setShowAddItemDialog={setShowAddItemDialog}
                            refetchOrderInfo={refetchOrderInfo}
                        />
                    )
                }
            </section>


            {/* Approve Order Dialog */}
            <ApproveOrderDialog
                open={showApproveDialog}
                onOpenChange={setShowApproveDialog}
                order={OrderInfo}
            />
            {/* Create Return Dialog */}
            <CreateReturnDialog
                isOpen={showReturnDialog}
                onClose={() => setShowReturnDialog(false)}
                orderId={params.order_id}
                orderItems={OrderInfo.order_items}
                orderName={OrderInfo.order_name}
            />

            {/* Shipping Item Selector */}
            <ShippingItemSelector
                isOpen={showShippingSelector}
                order_id={OrderInfo.id}
                orderNumber={OrderInfo.order_confirmation_number}
                customerEmail={OrderInfo.agent.email}
                onClose={() => setShowShippingSelector(false)}
                orderItems={OrderInfo.order_items}
                refetchOrderInfo={refetchOrderInfo}
                order_shipping_address={shippingAddress}
                onRateSelected={(rate, selectedItems) => {
                    console.log('Selected rate:', rate);
                    console.log('Selected items:', selectedItems);
                    // TODO: Handle the selected rate - could save to database, update order, etc.
                    toast.success(`Shipping rate selected: ${rate.serviceName} - $${rate.ratedShipmentDetails[0].totalNetCharge.amount}`);
                }}
            />

        </div>
    )
}