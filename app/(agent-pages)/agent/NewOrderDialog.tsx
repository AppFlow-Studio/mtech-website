"use client"
import { useState, FormEvent, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Loader2, MapPin } from "lucide-react";
import makeNewOrder from "../actions/make-new-order";
import { toast } from "sonner";
import { useProfile } from "@/lib/hooks/useProfile";
import Autocomplete from "react-google-autocomplete";
import { cn } from "@/lib/utils";
import { parseAddress } from "@/utils/parse-address";

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

interface NewOrderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    refetchAgentOrders: () => void;
    onOrderCreated?: (orderData: any) => Promise<void>;
}

export default function NewOrderDialog({ open, onOpenChange, refetchAgentOrders, onOrderCreated }: NewOrderDialogProps) {
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
        e.preventDefault();
        setIsSubmitting(true);

        // Include shipping address if provided
        const orderData = {
            ...orderForm,
            agent_id: profile.id,
            shipping_address: showShippingAddress ? shippingAddress : null
        };

        // If onOrderCreated callback is provided, use it instead of makeNewOrder
        if (onOrderCreated) {
            try {
                await onOrderCreated(orderData);
                setIsSubmitting(false);
                handleClose();
            } catch (error) {
                setIsSubmitting(false);
                toast.error("Failed to create order with cart items");
            }
        } else {
            // Use the original makeNewOrder flow
            const data = await makeNewOrder(orderData);
            if (data instanceof Error) {
                setIsSubmitting(false);
                toast.error(data.message);
                handleClose();
            } else {
                setIsSubmitting(false);
                handleClose();
                toast.success("Order created!");
                refetchAgentOrders();
            }
        }
    };

    const isAddressValid = shippingAddress?.first_name &&
        shippingAddress?.last_name &&
        shippingAddress?.formatted_address &&
        shippingAddress?.phone;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-fit max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Cart Order</DialogTitle>
                    <DialogDescription>
                        Fill out the details to create a new order.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                    {/* Order Details */}
                    <div className="space-y-4">
                        <div>
                            <Label className="block text-sm font-medium mb-1">Order Name</Label>
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
                    </div>

                    {/* Shipping Address Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <Label className="text-sm font-medium">Shipping Address</Label>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowShippingAddress(!showShippingAddress)}
                            >
                                {showShippingAddress ? "Remove Address" : "Add Shipping Address"}
                            </Button>
                        </div>

                        {showShippingAddress && (
                            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
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
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
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
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            disabled={isSubmitting || !orderForm.order_name || (showShippingAddress && !isAddressValid)}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Order
                                </>
                            )}
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-green-500 text-white hover:bg-green-600"
                            disabled={isSubmitting || !orderForm.order_name || (showShippingAddress && !isAddressValid)}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Shop for this order
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 