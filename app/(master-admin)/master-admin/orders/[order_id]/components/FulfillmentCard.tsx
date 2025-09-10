'use client'

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Truck,
    Package,
    Printer,
    ExternalLink,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    AlertCircle,
    Copy,
    QrCode
} from 'lucide-react';
import { toast } from 'sonner';
import { completePickup } from '../../../actions/shipping/complete-pickup';
import { cancelShipment } from '../../../actions/shipping/cancel-shipment';
import { cancelFedExShipment } from '../../../actions/shipping/cancel-fedex-shipment';
import { saveManualTracking } from '../../../actions/shipping/save-manual-tracking';

interface Shipment {
    id: string;
    tracking_number: string;
    label_url: string;
    carrier: string;
    service_type: string;
    created_at: string;
    tracking_history?: any[];
    tracking_status?: any;
    is_manual_entry?: boolean;
}

interface Fulfillment {
    id: string;
    order_id: string;
    fulfillment_type: 'SHIPPING' | 'PICKUP';
    status: 'PENDING' | 'SHIPPED' | 'READY_FOR_PICKUP' | 'COMPLETE' | 'CANCELLED';
    additional_fee: number;
    created_at: string;
    cancelled_at?: string;
    shipments: Shipment[];
    pickups: Pickup[];
    order_items?: OrderItem[];
}

interface Pickup {
    id: string;
    fulfillment_id: string;
    pickup_code: string;
    status: 'READY_FOR_PICKUP' | 'COMPLETED';
    picked_up_at?: string;
    created_at: string;
}

interface OrderItem {
    id: string;
    products: {
        name: string;
        imageSrc?: string;
        description?: string;
    };
    quantity: number;
    price_at_order: number;
}

interface FulfillmentCardProps {
    fulfillment: Fulfillment;
    profileId: string;
}

export function FulfillmentCard({ fulfillment, profileId }: FulfillmentCardProps) {
    const [isPrinting, setIsPrinting] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showActionsDropdown, setShowActionsDropdown] = useState(false);
    const [showTrackingDetails, setShowTrackingDetails] = useState<{ [key: string]: boolean }>({});
    const getStatusConfig = (status: string) => {
        const configs = {
            'PENDING': {
                color: 'bg-yellow-100 text-yellow-800',
                icon: Clock,
                label: 'Pending'
            },
            'SHIPPED': {
                color: 'bg-blue-100 text-blue-800',
                icon: Truck,
                label: 'Shipped'
            },
            'READY_FOR_PICKUP': {
                color: 'bg-green-100 text-green-800',
                icon: Package,
                label: 'Ready for Pickup'
            },
            'COMPLETE': {
                color: 'bg-purple-100 text-purple-800',
                icon: CheckCircle,
                label: 'Complete'
            },
            'CANCELLED': {
                color: 'bg-red-100 text-red-800',
                icon: AlertCircle,
                label: 'Cancelled'
            }
        };
        return configs[status as keyof typeof configs] || configs['PENDING'];
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handlePrintLabel = async (shipment: Shipment) => {
        setIsPrinting(true);
        try {
            if (shipment.label_url) {
                // Open label in new window for printing
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
        } catch (error) {
            toast.error('Failed to open label for printing');
        } finally {
            setIsPrinting(false);
        }
    };

    const handleDownloadLabel = async (shipment: Shipment) => {
        try {
            if (shipment.label_url) {
                const link = document.createElement('a');
                link.href = shipment.label_url;
                link.download = `shipping-label-${shipment.tracking_number || 'label'}.pdf`;
                link.click();
                toast.success('Label downloaded successfully');
            } else {
                toast.error('No label URL available');
            }
        } catch (error) {
            toast.error('Failed to download label');
        }
    };

    const handleCompletePickup = async () => {
        setIsCompleting(true);
        try {
            const result = await completePickup(fulfillment.id);
            if (result.success) {
                toast.success('Pickup completed successfully!');
                // Refresh the page to update the UI
                window.location.reload();
            } else {
                toast.error(result.error || 'Failed to complete pickup');
            }
        } catch (error) {
            toast.error('An error occurred while completing pickup');
        } finally {
            setIsCompleting(false);
        }
    };

    const copyPickupCode = async (pickupCode: string) => {
        try {
            await navigator.clipboard.writeText(pickupCode);
            toast.success('Pickup code copied to clipboard');
        } catch (error) {
            toast.error('Failed to copy pickup code');
        }
    };

    const handleCancelShipment = async () => {
        setIsCancelling(true);
        try {

            // First, try to cancel with FedEx API if we have shipment details
            if (fulfillment.shipments && fulfillment.shipments.length > 0) {
                const shipment = fulfillment.shipments[0];
                if (shipment.carrier?.toLowerCase().includes('fedex') && shipment.tracking_number) {
                    // Call FedEx cancel API
                    const fedexResult = await cancelFedExShipment({ trackingNumber: shipment.tracking_number, fulfillmentId: fulfillment.id, orderId: fulfillment.order_id, userName: profileId, items: (fulfillment?.order_items || []) as any });
                    if (!fedexResult.success) {
                        toast.error(`FedEx API Error: ${fedexResult.error}`);
                        setIsCancelling(false);
                        return;
                    }
                }
            }

            // Then update our database
            const result = await cancelShipment(fulfillment.id, profileId);
            if (result.success) {
                toast.success('Shipment cancelled successfully!');
                window.location.reload();
            } else {
                toast.error(result.error || 'Failed to cancel shipment');
            }
        } catch (error) {
            toast.error('An error occurred while cancelling shipment');
        } finally {
            setIsCancelling(false);
            setShowCancelDialog(false);
        }

    };

    const handleUpdateFulfillmentType = async (newType: 'SHIPPING' | 'PICKUP') => {
        setIsUpdating(true);
        try {
            // Import the function dynamically to avoid import issues
            const { updateFulfillmentType } = await import('../../../actions/shipping/update-fulfillment-type');
            const result = await updateFulfillmentType(fulfillment.id, newType);
            if (result.success) {
                toast.success(`Fulfillment updated to ${newType} successfully!`);
                window.location.reload();
            } else {
                toast.error(result.error || 'Failed to update fulfillment type');
            }
        } catch (error) {
            toast.error('An error occurred while updating fulfillment type');
        } finally {
            setIsUpdating(false);
            setShowEditDialog(false);
        }
    };

    const handleSaveManualTracking = async (trackingData: any) => {
        try {
            const result = await saveManualTracking({
                fulfillmentId: fulfillment.id,
                trackingNumber: trackingData.trackingNumber,
                carrier: trackingData.carrier,
                serviceType: trackingData.servicelevel?.name,
                trackingHistory: trackingData.trackingHistory || [],
                trackingStatus: trackingData.trackingStatus,
                labelUrl: undefined
            });

            if (result.success) {
                toast.success('Manual tracking information saved successfully!');
                window.location.reload();
            } else {
                toast.error(result.error || 'Failed to save tracking information');
            }
        } catch (error) {
            toast.error('An error occurred while saving tracking information');
        }
    };

    const getTrackingStatusColor = (status: string) => {
        const statusColors = {
            'PRE_TRANSIT': 'bg-yellow-100 text-yellow-800',
            'TRANSIT': 'bg-blue-100 text-blue-800',
            'DELIVERED': 'bg-green-100 text-green-800',
            'RETURNED': 'bg-red-100 text-red-800',
            'FAILURE': 'bg-red-100 text-red-800',
            'UNKNOWN': 'bg-gray-100 text-gray-800'
        };
        return statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
    };

    const formatTrackingDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const toggleTrackingDetails = (shipmentId: string) => {
        setShowTrackingDetails(prev => ({
            ...prev,
            [shipmentId]: !prev[shipmentId]
        }));
    };

    const statusConfig = getStatusConfig(fulfillment.status);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Card className="animate-in fade-in-0 slide-in-from-bottom-2 hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                {fulfillment.fulfillment_type === 'SHIPPING' ? (
                                    <Truck className="h-5 w-5 text-blue-600" />
                                ) : (
                                    <Package className="h-5 w-5 text-green-600" />
                                )}
                            </div>
                            <div>
                                <CardTitle className="text-lg font-semibold">
                                    {fulfillment.fulfillment_type === 'SHIPPING' ? 'Shipping Fulfillment' : 'Pickup Fulfillment'}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-3 w-3" />
                                    Created {formatDate(fulfillment.created_at)}
                                    {fulfillment.cancelled_at && (
                                        <span className="text-sm text-red-500">
                                            Cancelled {formatDate(fulfillment.cancelled_at)}
                                        </span>
                                    )}
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge className={`${statusConfig.color} font-medium flex items-center gap-1`}>
                                <StatusIcon className="h-3 w-3" />
                                {statusConfig.label}
                            </Badge>

                            {/* Action Buttons */}
                            {fulfillment.status !== 'COMPLETE' && fulfillment.status !== 'CANCELLED' && (
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="flex items-center gap-1"
                                        onClick={() => setShowActionsDropdown((prev) => !prev)}
                                        aria-haspopup="menu"
                                    >
                                        Options
                                        <svg
                                            className="h-4 w-4 ml-1"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth={2}
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Button>
                                    {showActionsDropdown && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                                            <div className="py-1">
                                                {fulfillment.fulfillment_type === 'SHIPPING' && fulfillment.status === 'SHIPPED' && (
                                                    <button
                                                        onClick={() => {
                                                            setShowCancelDialog(true);
                                                            setShowActionsDropdown(false);
                                                        }}
                                                        disabled={isCancelling}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <AlertCircle className="h-4 w-4" />
                                                        Cancel Shipment
                                                    </button>
                                                )}
                                                {fulfillment.fulfillment_type === 'PICKUP' && (
                                                    <button
                                                        onClick={() => {
                                                            setShowEditDialog(true);
                                                            setShowActionsDropdown(false);
                                                        }}
                                                        disabled={isUpdating}
                                                        className="w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        <Package className="h-4 w-4" />
                                                        Edit Pickup
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Items Included */}
                    {fulfillment.order_items && fulfillment.order_items.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Items Included ({fulfillment.order_items.length})
                                {fulfillment.additional_fee > 0 && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <DollarSign className="h-4 w-4 text-green-600" />
                                        <span className="text-sm font-medium text-green-800">
                                            Additional Fee: ${fulfillment.additional_fee.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </h4>
                            <div className="space-y-2">
                                {fulfillment.order_items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        {item.products.imageSrc && (
                                            <img
                                                src={item.products.imageSrc}
                                                alt={item.products.name}
                                                className="w-10 h-10 object-cover rounded border"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm text-foreground truncate">
                                                {item.products.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Qty: {item.quantity} • ${item.price_at_order} each
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold text-foreground">
                                                ${(item.price_at_order * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-sm font-medium text-foreground">Subtotal:</span>
                            <span className="text-sm font-semibold text-foreground">
                                ${fulfillment.order_items.reduce((acc, item) => acc + (item.price_at_order * item.quantity), 0).toFixed(2)}
                            </span>
                        </div> */}
                        </div>
                    )}

                    {/* Additional Fee */}




                    {/* Pickup Details */}
                    {fulfillment.fulfillment_type === 'PICKUP' && fulfillment.pickups && fulfillment.pickups.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                Pickup Details
                            </h4>
                            {fulfillment.pickups.map((pickup) => (
                                <div key={pickup.id} className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Pickup Code:</span>
                                                <span className="text-sm font-mono bg-white px-3 py-1 rounded border font-bold text-green-700">
                                                    {pickup.pickup_code}
                                                </span>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Status: {pickup.status === 'READY_FOR_PICKUP' ? 'Ready for Pickup' : 'Completed'}
                                            </div>
                                            {pickup.picked_up_at && (
                                                <div className="text-xs text-muted-foreground">
                                                    Picked up: {new Date(pickup.picked_up_at).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => copyPickupCode(pickup.pickup_code)}
                                                className="bg-white hover:bg-green-50"
                                            >
                                                <Copy className="h-3 w-3 mr-1" />
                                                Copy Code
                                            </Button>
                                            {pickup.status === 'READY_FOR_PICKUP' && (
                                                <Button
                                                    size="sm"
                                                    variant="default"
                                                    onClick={handleCompletePickup}
                                                    disabled={isCompleting}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {isCompleting ? (
                                                        <Clock className="h-3 w-3 mr-1 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                    )}
                                                    Mark as Completed
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Shipments */}
                    {fulfillment.fulfillment_type === 'SHIPPING' && fulfillment.shipments && fulfillment.shipments.length > 0 ? (
                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                                <Truck className="h-4 w-4" />
                                Shipment Details
                            </h4>
                            {fulfillment.shipments.map((shipment) => (
                                <div key={shipment.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">Tracking:</span>
                                                <span className={`text-sm font-mono bg-white px-2 py-1 rounded border ${fulfillment.status === 'CANCELLED' ? 'line-through' : ''}`}>
                                                    {shipment.tracking_number}
                                                </span>
                                                {shipment.is_manual_entry && (
                                                    <Badge variant="secondary" className="text-xs">
                                                        Manual Entry
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className={`${fulfillment.status === 'CANCELLED' ? 'line-through' : ''}`}>Carrier: {shipment.carrier}</span>
                                                <span>•</span>
                                                <span className={`${fulfillment.status === 'CANCELLED' ? 'line-through' : ''}`}>Service: {shipment.service_type}</span>
                                            </div>

                                            {/* Current Tracking Status */}
                                            {shipment.tracking_status && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">Status:</span>
                                                    <Badge className={`text-xs ${getTrackingStatusColor(shipment.tracking_status.status)}`}>
                                                        {shipment.tracking_status.status.replace('_', ' ')}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTrackingDate(shipment.tracking_status.statusDate)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            {shipment.label_url && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handlePrintLabel(shipment)}
                                                        disabled={isPrinting || fulfillment.status === 'CANCELLED'}
                                                        className="bg-white hover:bg-gray-50"
                                                    >
                                                        <Printer className="h-3 w-3 mr-1" />
                                                        Print
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={fulfillment.status === 'CANCELLED'}
                                                        onClick={() => handleDownloadLabel(shipment)}
                                                        className="bg-white hover:bg-gray-50"
                                                    >
                                                        <ExternalLink className="h-3 w-3 mr-1" />
                                                        Download
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tracking History */}
                                    {shipment.tracking_history && shipment.tracking_history.length > 0 && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => toggleTrackingDetails(shipment.id)}
                                                className="text-xs text-blue-600 hover:text-blue-800 mb-2"
                                            >
                                                {showTrackingDetails[shipment.id] ? 'Hide' : 'Show'} Tracking History
                                            </Button>

                                            {showTrackingDetails[shipment.id] && (
                                                <div className="space-y-2 max-h-48 overflow-y-auto">
                                                    {shipment.tracking_history.map((event, index) => (
                                                        <div key={index} className="p-2 bg-white border border-gray-100 rounded text-xs">
                                                            <div className="flex items-center justify-between mb-1">
                                                                <Badge className={`text-xs ${getTrackingStatusColor(event.status)}`}>
                                                                    {event.status.replace('_', ' ')}
                                                                </Badge>
                                                                <span className="text-muted-foreground">
                                                                    {formatTrackingDate(event.statusDate)}
                                                                </span>
                                                            </div>
                                                            {event.statusDetails && (
                                                                <p className="text-muted-foreground">{event.statusDetails}</p>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Tracking Link */}
                                    {shipment.tracking_number && fulfillment.status !== 'CANCELLED' && (
                                        <div className="pt-2 border-t border-gray-200">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                    // Generate tracking URL based on carrier
                                                    let trackingUrl = '';
                                                    const carrier = shipment.carrier?.toLowerCase();
                                                    if (carrier?.includes('fedex')) {
                                                        trackingUrl = `https://www.fedex.com/fedextrack/?trknbr=${shipment.tracking_number}`;
                                                    } else if (carrier?.includes('ups')) {
                                                        trackingUrl = `https://www.ups.com/track?tracknum=${shipment.tracking_number}`;
                                                    } else if (carrier?.includes('usps')) {
                                                        trackingUrl = `https://tools.usps.com/go/TrackConfirmAction?tLabels=${shipment.tracking_number}`;
                                                    } else if (carrier?.includes('shippo')) {
                                                        trackingUrl = `https://goshippo.com/tracking/${shipment.tracking_number}`;
                                                    } else {
                                                        trackingUrl = `https://www.google.com/search?q=${shipment.tracking_number}`;
                                                    }
                                                    window.open(trackingUrl, '_blank');
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-800"
                                            >
                                                Track Package →
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : fulfillment.fulfillment_type === 'SHIPPING' && (
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm text-yellow-800">
                                No shipment details available yet
                            </span>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Pickup Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Pickup Fulfillment</DialogTitle>
                        <DialogDescription>
                            Choose what you want to do with this pickup fulfillment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                onClick={() => handleUpdateFulfillmentType('SHIPPING')}
                                disabled={isUpdating}
                                className="w-full justify-start bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                            >
                                <Truck className="h-4 w-4 mr-2" />
                                Convert to Shipping
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => handleCancelShipment()}
                                disabled={isCancelling}
                                className="w-full justify-start bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Cancel Pickup
                            </Button>
                        </div>

                        <div className="text-xs text-muted-foreground">
                            <p><strong>Convert to Shipping:</strong> Changes this pickup to a shipping fulfillment. Items will be available for shipping setup.</p>
                            <p><strong>Cancel Pickup:</strong> Cancels this pickup and returns items to unfulfilled status.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Cancel Shipment Confirmation Dialog */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-5 w-5" />
                            Cancel Shipment
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to cancel this shipment? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-start gap-3">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                <div className="space-y-2">
                                    <h4 className="font-medium text-red-800">Important Information</h4>
                                    <ul className="text-sm text-red-700 space-y-1">
                                        <li>• This will cancel the shipment with the carrier (FedEx)</li>
                                        <li>• Items will be returned to unfulfilled status</li>
                                        <li>• Shipping labels will be invalidated</li>
                                        <li>• Customer will need to be notified</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {fulfillment.shipments && fulfillment.shipments.length > 0 && (
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <div className="text-sm">
                                    <span className="font-medium">Shipment Details:</span>
                                    <div className="mt-1 text-muted-foreground">
                                        <div >Tracking: {fulfillment.shipments[0].tracking_number}</div>
                                        <div>Carrier: {fulfillment.shipments[0].carrier}</div>
                                        <div>Service: {fulfillment.shipments[0].service_type}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={isCancelling}
                        >
                            Keep Shipment
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleCancelShipment}
                            disabled={isCancelling}
                        >
                            {isCancelling ? (
                                <>
                                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                                    Cancelling...
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-4 w-4 mr-2" />
                                    Cancel Shipment
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default FulfillmentCard;
