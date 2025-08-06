'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
    Package,
    Truck,
    Calculator,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import FedExRateCalculator from './FedExRateCalculator';

interface Product {
    id: string;
    name: string;
    weight?: number;
    dimensions?: {
        length?: number;
        width?: number;
        height?: number;
    };
}

interface OrderItem {
    id: string;
    quantity: number;
    products: Product;
    price_at_order: number;
    fulfillment_type: "PICKUP" | "SHIPPING";
}

interface ShippingItemSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    orderItems: OrderItem[];
    onRateSelected?: (rate: any, selectedItems: OrderItem[]) => void;
    order_shipping_address: any;
}

export default function ShippingItemSelector({
    isOpen,
    onClose,
    orderItems,
    onRateSelected,
    order_shipping_address
}: ShippingItemSelectorProps) {
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [showRateCalculator, setShowRateCalculator] = useState(false);

    // Filter items that are marked for shipping
    const shippingItems = orderItems.filter(item => item.fulfillment_type === 'SHIPPING');

    const handleItemToggle = (item: OrderItem) => {
        setSelectedItems(prev => {
            const isSelected = prev.some(selected => selected.id === item.id);
            if (isSelected) {
                return prev.filter(selected => selected.id !== item.id);
            } else {
                return [...prev, item];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedItems.length === shippingItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems([...shippingItems]);
        }
    };

    const handleGetRates = () => {
        if (selectedItems.length === 0) {
            toast.error('Please select at least one item for shipping');
            return;
        }
        setShowRateCalculator(true);
    };

    const handleRateSelected = (rate: any) => {
        onRateSelected?.(rate, selectedItems);
        // setShowRateCalculator(false);
        // onClose();
        // toast.success(`Shipping rate selected for ${selectedItems.length} item(s)`);
    };

    const totalWeight = selectedItems.reduce((sum, item) => {
        const itemWeight = item.products.weight || 0;
        return sum + (itemWeight * item.quantity);
    }, 0);

    const totalValue = selectedItems.reduce((sum, item) => {
        return sum + (item.price_at_order * item.quantity);
    }, 0);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="min-w-6xl w-full">
                    <DialogHeader className=" h-fit">
                        <DialogTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Select Items for Shipping
                        </DialogTitle>
                        <DialogDescription>
                            Choose which shipping items to include in your rate calculation
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 justify-start h-full border">
                        {/* Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Shipping Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-muted-foreground">Available Items</div>
                                        <div className="text-2xl font-bold">{shippingItems.length}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-muted-foreground">Selected Items</div>
                                        <div className="text-2xl font-bold text-primary">{selectedItems.length}</div>
                                    </div>
                                </div>

                                {selectedItems.length > 0 && (
                                    <>
                                        <Separator className="my-4" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <div className="text-sm text-muted-foreground">Total Weight</div>
                                                <div className="text-lg font-semibold">{totalWeight.toFixed(2)} lbs</div>
                                            </div>
                                            <div>
                                                <div className="text-sm text-muted-foreground">Total Value</div>
                                                <div className="text-lg font-semibold">${totalValue.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Item Selection */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Shipping Items</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSelectAll}
                                    >
                                        {selectedItems.length === shippingItems.length ? 'Deselect All' : 'Select All'}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {shippingItems.length === 0 ? (
                                    <div className="text-center py-8">
                                        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No items marked for shipping</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Only items with fulfillment type "SHIPPING" will appear here
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {shippingItems.map((item) => {
                                            const isSelected = selectedItems.some(selected => selected.id === item.id);
                                            const itemWeight = item.products.weight || 0;
                                            const totalItemWeight = itemWeight * item.quantity;

                                            return (
                                                <Card
                                                    key={item.id}
                                                    className={`p-4 cursor-pointer transition-all hover:shadow-sm ${isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                                                        }`}
                                                    onClick={() => handleItemToggle(item)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={() => handleItemToggle(item)}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium">{item.products.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                Qty: {item.quantity} • ${item.price_at_order} each
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-sm font-medium">
                                                                {totalItemWeight.toFixed(1)} lbs
                                                            </div>
                                                            <div className="text-xs text-muted-foreground">
                                                                ${(item.price_at_order * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleGetRates}
                                disabled={selectedItems.length === 0}
                                className="flex-1"
                            >
                                <Calculator className="h-4 w-4 mr-2" />
                                Get Shipping Rates ({selectedItems.length})
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* FedEx Rate Calculator */}
            <FedExRateCalculator
                isOpen={showRateCalculator}
                onClose={() => setShowRateCalculator(false)}
                selectedItems={selectedItems}
                onRateSelected={handleRateSelected}
                order_shipping_address={order_shipping_address}
            />
        </>
    );
} 