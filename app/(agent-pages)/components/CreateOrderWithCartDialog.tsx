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
                shippingAddress,
                cartItems.map((item) => ({
                    product_id: item.product.id,
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
                product_id: item.product.id,
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Order Form */}
                    <div className="space-y-6">
                        <Card>
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

                        {/* Shipping Address Section */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Shipping Address
                                    </CardTitle>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowShippingAddress(!showShippingAddress)}
                                    >
                                        {showShippingAddress ? "Remove Address" : "Add Shipping Address"}
                                    </Button>
                                </div>
                            </CardHeader>
                            {showShippingAddress && (
                                <CardContent className="space-y-4">
                                    {/* Country/Region */}
                                    <div className="space-y-2">
                                        <Label htmlFor="country">Country/region</Label>
                                        <select
                                            id="country"
                                            value={shippingAddress.country || 'United States'}
                                            onChange={(e) => handleAddressInputChange('country', e.target.value)}
                                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="United States">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Mexico">Mexico</option>
                                        </select>
                                    </div>

                                    {/* First Name & Last Name */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">First name *</Label>
                                            <Input
                                                id="first_name"
                                                value={shippingAddress.first_name || ''}
                                                onChange={(e) => handleAddressInputChange('first_name', e.target.value)}
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Last name *</Label>
                                            <Input
                                                id="last_name"
                                                value={shippingAddress.last_name || ''}
                                                onChange={(e) => handleAddressInputChange('last_name', e.target.value)}
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                    </div>

                                    {/* Company */}
                                    <div className="space-y-2">
                                        <Label htmlFor="company">Company (optional)</Label>
                                        <Input
                                            id="company"
                                            value={shippingAddress.company || ''}
                                            onChange={(e) => handleAddressInputChange('company', e.target.value)}
                                            placeholder="Enter company name"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address *</Label>
                                        <Autocomplete
                                            id="address"
                                            value={shippingAddress.formatted_address || ''}
                                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY || ''}
                                            onPlaceSelected={handlePlaceSelected}
                                            onChange={(e: any) => handleAddressInputChange('formatted_address', e.target.value)}
                                            options={{
                                                types: ["address"],
                                                componentRestrictions: { country: "us" },
                                            }}
                                            placeholder="Start typing address..."
                                            className={cn(
                                                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                                                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                                            )}
                                        />
                                    </div>

                                    {/* Address Line 2 */}
                                    <div className="space-y-2">
                                        <Label htmlFor="apartment_suite">Apartment, suite, etc. (optional)</Label>
                                        <Input
                                            id="apartment_suite"
                                            value={shippingAddress.apartment_suite || ''}
                                            onChange={(e) => handleAddressInputChange('apartment_suite', e.target.value)}
                                            placeholder="Enter apartment, suite, etc."
                                        />
                                    </div>

                                    {/* City, State, ZIP */}
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={shippingAddress.city || ''}
                                                onChange={(e) => handleAddressInputChange('city', e.target.value)}
                                                placeholder="Enter city"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={shippingAddress.state || ''}
                                                onChange={(e) => handleAddressInputChange('state', e.target.value)}
                                                placeholder="Enter state"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="zip_code">ZIP code</Label>
                                            <Input
                                                id="zip_code"
                                                value={shippingAddress.zip_code || ''}
                                                onChange={(e) => handleAddressInputChange('zip_code', e.target.value)}
                                                placeholder="Enter ZIP code"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone *</Label>
                                        <div className="flex">
                                            <select
                                                value="+1"
                                                disabled
                                                className="w-24 h-9 rounded-l-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="+1">🇺🇸 +1</option>
                                            </select>
                                            <Input
                                                id="phone"
                                                value={shippingAddress.phone || ''}
                                                onChange={(e) => handleAddressInputChange('phone', e.target.value)}
                                                placeholder="Enter phone number"
                                                className="ml-0 rounded-l-none"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    </div>

                    {/* Right Side - Cart Items */}
                    <div className="space-y-6">
                        <Card>
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
                        <Card>
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