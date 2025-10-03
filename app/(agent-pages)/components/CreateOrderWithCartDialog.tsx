"use client"
import { useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, MapPin, ShoppingCart, X, Package } from "lucide-react";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/useProfile";
import Autocomplete from "react-google-autocomplete";
import { cn } from "@/lib/utils";
import { parseAddress } from "@/utils/parse-address";
import { createOrderWithItems } from "../actions/create-order-with-items";
import { syncOrderItems } from "../actions/sync-order-items";

interface Address {
    country?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    formatted_address?: string;
    apartment_suite?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
}

interface CartItem {
    product: any;
    price: number;
    quantity: number;
}

interface CreateOrderWithCartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    cartItems: CartItem[];
    clearCart: () => void;
    onOrderCreated?: (orderId: string) => void;
}

export default function CreateOrderWithCartDialog({
    open,
    onOpenChange,
    cartItems,
    clearCart,
    onOrderCreated
}: CreateOrderWithCartDialogProps) {

    const { profile } = useProfile();
    const [orderForm, setOrderForm] = useState({
        order_name: "",
        notes: ""
    });
    const [shippingAddress, setShippingAddress] = useState<Address>({
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
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showShippingAddress, setShowShippingAddress] = useState(false);

    const handleClose = () => {
        setOrderForm({ order_name: "", notes: "" });
        setShippingAddress({
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
        });
        setShowShippingAddress(false);
        setIsSubmitting(false);
        onOpenChange(false);
    };

    const handleAddressInputChange = (field: keyof Address, value: string) => {
        setShippingAddress(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePlaceSelected = (place: any) => {
        const parsedAddress = parseAddress(place.address_components);
        setShippingAddress(prev => ({
            ...prev,
            formatted_address: parsedAddress.formatted_address,
            apartment_suite: parsedAddress.apartment_suite || '',
            city: parsedAddress.city || '',
            state: parsedAddress.state || '',
            zip_code: parsedAddress.zip_code || ''
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        if (!profile) {
            toast.error("Please login to create an order");
            return;
        }
        if (cartItems.length === 0) {
            toast.error("No items in cart to add to order");
            return;
        }
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create the order first
            const orderResult = await createOrderWithItems(
                profile.id,
                orderForm.order_name,
                orderForm.notes,
                cartItems.map((item) => ({
                    product_id: item?.product?.id || item.id,
                    quantity: Number(item.quantity),
                    price_at_order: item.price
                }))
            );

            if (orderResult instanceof Error) {
                toast.error('Failed to create order',
                    {
                        description: orderResult.message
                    }
                );
                setIsSubmitting(false);
                return;
            }

            // Add cart items to the order
            const orderItems = cartItems.map((item) => ({
                order_id: orderResult.order.id,
                product_id: item?.product?.id || item.id,
                quantity: Number(item.quantity),
                price_at_order: item.price
            }));

            const syncResult = await syncOrderItems(orderResult.order.id, orderItems);
            if (syncResult instanceof Error) {
                toast.error('Failed to add cart items to order',
                    {
                        description: syncResult.message
                    }
                );
                setIsSubmitting(false);
                return;
            }

            toast.success('New order created with cart items!');
            clearCart();
            if (onOrderCreated) {
                onOrderCreated(orderResult.order.id);
            }
            handleClose();
        } catch (error) {
            console.error('Error creating order with cart items:', error);
            toast.error('Failed to create order with cart items');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isAddressValid = shippingAddress?.first_name &&
        shippingAddress?.last_name &&
        shippingAddress?.formatted_address &&
        shippingAddress?.phone;

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getTotalItems = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Create New Order with Cart Items
                    </DialogTitle>
                    <DialogDescription>
                        Review your cart items and fill out the order details to create a new order.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Left Side - Order Form */}
                    <Card className="col-span-1 ">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="block text-sm font-medium mb-1">Order Name *</Label>
                                <Input
                                    value={orderForm.order_name}
                                    onChange={e => setOrderForm(f => ({ ...f, order_name: e.target.value }))}
                                    placeholder="Enter order name"
                                    required
                                />
                            </div>
                            <div>
                                <Label className="block text-sm font-medium mb-1">Notes</Label>
                                <Textarea
                                    value={orderForm.notes}
                                    onChange={e => setOrderForm(f => ({ ...f, notes: e.target.value }))}
                                    placeholder="Add any notes for this order..."
                                    className="min-h-[80px] resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Side - Cart Items */}

                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <ShoppingCart className="h-4 w-4" />
                                    Cart Items ({getTotalItems()})
                                </span>
                                <Badge variant="secondary" className="text-lg">
                                    ${getCartTotal().toFixed(2)}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cartItems?.length === 0 ? (
                                <div className="text-center py-8">
                                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                    <p className="text-muted-foreground">No items in cart</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cartItems?.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                            <div className="w-12 h-12 bg-muted rounded overflow-hidden flex-shrink-0">
                                                <img
                                                    src={item.imageSrc}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                                                <p className="text-xs text-muted-foreground">
                                                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-sm">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="col-span-2">
                        <CardHeader>
                            <CardTitle className="text-lg">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span>Items ({getTotalItems()}):</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Tax (8%):</span>
                                <span>${(getCartTotal() * 0.08).toFixed(2)}</span>
                            </div>
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-medium text-lg">
                                    <span>Total:</span>
                                    <span>${(getCartTotal() * 1.08).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        className="flex-1"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                        className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isSubmitting || !orderForm.order_name || (showShippingAddress && !isAddressValid) || cartItems.length === 0}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Creating Order...
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Order with {getTotalItems()} Items
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
} 