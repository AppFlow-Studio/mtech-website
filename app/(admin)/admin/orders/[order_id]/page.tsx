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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { CheckCircle, Loader2, Pencil, Plus, Trash2, UserCheck, Users, AlertTriangle } from 'lucide-react';
import OrderItemCard from '@/app/(master-admin)/master-admin/orders/[order_id]/OrderItemCard';
import { OrderItems } from '@/lib/types';
import { UpdateOrderItem } from '@/app/(master-admin)/master-admin/actions/order-actions/update-order-item';
import { UpdateOrder } from '@/app/(master-admin)/master-admin/actions/order-actions/update-order';
import { DeleteOrder } from '@/app/(master-admin)/master-admin/actions/order-actions/delete-order';
import { useQueryClient } from '@tanstack/react-query';
import OrderProductShopping from '@/app/(master-admin)/master-admin/components/OrderProductShopping';
import { ConfirmOrder } from '@/app/(admin)/actions/confirm-order';
const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "fulfilled", label: "Fulfilled" },
];

export default function OrderIDManagerPage({ params }: { params: { order_id: string } }) {
    const queryClient = useQueryClient();
    const { data: OrderInfo, isLoading: OrderInfoLoading, refetch: refetchOrderInfo } = useSuspenseQuery({
        queryKey: ['order', params.order_id],
        queryFn: () => GetOrderInfo(params.order_id),
    })
    const [editStatus, setEditStatus] = useState(false);
    const [status, setStatus] = useState(OrderInfo.status);
    const [editNotes, setEditNotes] = useState(false);
    const [notes, setNotes] = useState(OrderInfo.notes);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showAddItemDialog, setShowAddItemDialog] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [editAssignment, setEditAssignment] = useState(false);
    const [assignedTo, setAssignedTo] = useState(OrderInfo.admin_assigned || '');
    const [isAssigning, setIsAssigning] = useState(false);
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
    const total = OrderInfo.order_items.reduce((acc: number, item: OrderItems) => acc + item.price_at_order * Number(item.quantity), 0);
    const tax = total * 0.08;
    const totalWithTax = total;
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

    const handleConfirmOrder = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmOrderSave = async () => {
        setIsSaving(true);
        try {
            const isConfirmed = await ConfirmOrder(OrderInfo.id);
            if (isConfirmed instanceof Error) {
                toast.error("Failed to confirm order", {
                    description: isConfirmed.message
                });
            } else {
                toast.success("Order confirmed successfully!");
            }
            setShowConfirmDialog(false);
            refetchOrderInfo();
        } catch (error) {
            toast.error("Failed to confirm order");
        } finally {
            setIsSaving(false);
        }
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
        <div className="max-w-7xl mx-auto py-10 space-y-8 animate-in fade-in-0 slide-in-from-bottom-2">
            <Button
                variant="outline"
                className="mb-4"
                onClick={() => router.push("/admin")}
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
                    <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Delete Order
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-8">
                    {/* Order Status Notification */}
       

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
                            {!editStatus ? (
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
                            )}
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
                            <span className="ml-2 text-lg font-bold text-green-700">${totalWithTax}</span>
                        </div>
                        {/* Order Assignment Section */}
                        {/* <div className="border-t border-border pt-4 mt-4">
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
                        </div> */}
                    </div>
                </CardContent>
            </Card>
            {/* Cart Items Section (refactored) */}
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2">
                <CardHeader>
                    <CardTitle>Cart Items</CardTitle>
                    <CardDescription>Manage the items in this order</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Order Status Notification */}
                    {OrderInfo.status === 'approved' && (
                        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-green-800 mb-1">Order Confirmed</p>
                                    <p className="text-green-700">
                                        This order has been confirmed. Any edits to the cart items will revert this order back to the submitted stage and require re-confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-start mb-4">
                        {OrderInfo.status === 'submitted' && <Button
                            variant="default"
                            onClick={handleConfirmOrder}
                            className='bg-green-500 hover:bg-green-600 text-white'
                        >
                            <CheckCircle className="h-4 w-4 mr-1" /> Confirm Cart
                        </Button>}
                    </div>
                    <div className="space-y-4">
                        {OrderInfo.order_items.length === 0 && (
                            <div className="text-center text-muted-foreground py-8">No items in this order.</div>
                        )}
                        {OrderInfo.order_items.map((item: OrderItems) => (
                            <OrderItemCard
                                key={item.id}
                                item={item}
                                order_id={params.order_id}
                                refetchOrderInfo={async () => {
                                    await queryClient.invalidateQueries({ queryKey: ['order', params.order_id] });
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button variant="outline" onClick={() => setShowAddItemDialog(true)}>
                            <Plus className="h-4 w-4 mr-1" /> Add Products
                        </Button>
                    </div>
                </CardContent>
            </Card>
            {/* Delete Order Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
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

            {/* Add Item Options */}

            {
                showAddItemDialog && (
                    <OrderProductShopping
                        agent_id={OrderInfo.profiles.id}
                        agent_tier={OrderInfo.profiles.agent_tiers}
                        agent_profile={OrderInfo.profiles}
                        agent_notes={OrderInfo.notes}
                        order_id={params.order_id}
                        setShowAddItemDialog={setShowAddItemDialog}
                        refetchOrderInfo={refetchOrderInfo}
                    />
                )
            }

            {/* Order Confirmation Dialog */}
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Confirm Order
                        </DialogTitle>
                        <DialogDescription>
                            Please review the order before confirming. This action will finalize the order.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-800 mb-1">Important Notice</p>
                                    <p className="text-amber-700">
                                        Once this order is confirmed, any subsequent edits to the cart items will unconfirm the order and require re-confirmation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground">Order Summary:</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order Name:</span>
                                    <span className="font-medium">{OrderInfo.order_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Order ID:</span>
                                    <span className="font-medium">{OrderInfo.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Agent:</span>
                                    <span className="font-medium">{OrderInfo.profiles.first_name} {OrderInfo.profiles.last_name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Items:</span>
                                    <span className="font-medium">{OrderInfo.order_items.length} products</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-medium">${totalWithTax.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/30 rounded-lg p-3">
                            <p className="text-sm text-muted-foreground">
                                <strong>Current Status:</strong> {OrderInfo.status}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                <strong>Created:</strong> {formatDate(OrderInfo.created_at)}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmDialog(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmOrderSave}
                            disabled={isSaving}
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Confirm Order
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}