'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
    Truck,
    Package,
    MapPin,
    Edit,
    CheckCircle,
    AlertCircle,
    Settings,
    Plus,
    Save
} from 'lucide-react'
import { toast } from 'sonner'
import AddressEditModal from '@/components/AddressEditModal'

interface FulfillmentMethodSelectorProps {
    orderItems: any[]
    shippingAddress: any
    onFulfillmentUpdate: (itemId: string, fulfillmentMethod: 'SHIPPING' | 'PICKUP', shippingAddress?: any) => void
    onSaveAddress: (address: any) => Promise<void>
}

export default function FulfillmentMethodSelector({
    orderItems,
    shippingAddress,
    onFulfillmentUpdate,
    onSaveAddress
}: FulfillmentMethodSelectorProps) {
    const [showFulfillmentDialog, setShowFulfillmentDialog] = useState(false)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [fulfillmentMethod, setFulfillmentMethod] = useState<'SHIPPING' | 'PICKUP'>('SHIPPING')
    const [showAddressModal, setShowAddressModal] = useState(false)
    const [isSavingAddress, setIsSavingAddress] = useState(false)
    const [customShippingAddress, setCustomShippingAddress] = useState<any>(null)
    const [useCustomAddress, setUseCustomAddress] = useState(false)

    const handleFulfillmentUpdate = () => {
        if (!selectedItem) return

        let addressToUse = null
        if (fulfillmentMethod === 'SHIPPING') {
            addressToUse = useCustomAddress ? customShippingAddress : shippingAddress
        }

        onFulfillmentUpdate(selectedItem.id, fulfillmentMethod, addressToUse)
        setShowFulfillmentDialog(false)
        setSelectedItem(null)
        setFulfillmentMethod('SHIPPING')
        setUseCustomAddress(false)
        setCustomShippingAddress(null)

        toast.success(`Fulfillment method updated to ${fulfillmentMethod}`)
    }

    const handleSaveCustomAddress = async (address: any) => {
        setIsSavingAddress(true)
        try {
            await onSaveAddress(address)
            setCustomShippingAddress(address)
            setUseCustomAddress(true)
            toast.success('Custom shipping address saved!')
        } catch (error) {
            toast.error('Failed to save custom address')
        } finally {
            setIsSavingAddress(false)
        }
    }

    const getFulfillmentBadge = (method: string) => {
        if (method === 'SHIPPING') {
            return <Badge variant="default" className="bg-blue-100 text-blue-800">Shipping</Badge>
        } else if (method === 'PICKUP') {
            return <Badge variant="default" className="bg-green-100 text-green-800">Pickup</Badge>
        }
        return <Badge variant="outline" className="text-muted-foreground">Not Set</Badge>
    }

    const openFulfillmentDialog = (item: any) => {
        setSelectedItem(item)
        setFulfillmentMethod(item.fulfillment_method || 'SHIPPING')
        setShowFulfillmentDialog(true)
    }

    return (
        <>
            {/* Fulfillment Methods Overview */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Fulfillment Methods
                    </CardTitle>
                    <CardDescription>
                        Specify how each item should be fulfilled - shipping or pickup
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {orderItems.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    {item.products?.imageSrc && (
                                        <img
                                            src={item.products.imageSrc}
                                            alt={item.products.name}
                                            className="w-12 h-12 object-cover rounded border"
                                        />
                                    )}
                                    <div>
                                        <div className="font-semibold mb-1">{item.products?.name}</div>
                                        {item.order_item_modifiers.map((modifier: any) => (
                                            <div className="flex flex-col items-start gap-1">
                                                <p className="text-xs font-medium text-muted-foreground">
                                                    {modifier.modifiers.modifier_groups.name}
                                                </p>
                                                <Badge variant="outline" className="text-xs">
                                                    {modifier.modifiers.name}
                                                </Badge>
                                            </div>

                                        ))}
                                        <div className="text-sm text-muted-foreground">
                                            Qty: {item.quantity} | ${item.price_at_order}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {getFulfillmentBadge(item.fulfillment_type)}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openFulfillmentDialog(item)}
                                    >
                                        <Settings className="h-4 w-4 mr-2" />
                                        Configure
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Fulfillment Configuration Dialog */}
            <Dialog open={showFulfillmentDialog} onOpenChange={setShowFulfillmentDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            Configure Fulfillment Method
                        </DialogTitle>
                        <DialogDescription>
                            {selectedItem && (
                                <div className="mt-2">
                                    <div className="font-semibold">{selectedItem.products?.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Qty: {selectedItem.quantity} | ${selectedItem.price_at_order}
                                    </div>
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedItem && (
                        <div className="space-y-6">
                            {/* Fulfillment Method Selection */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Fulfillment Method</CardTitle>
                                    <CardDescription>
                                        Choose how this item should be delivered
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup
                                        value={fulfillmentMethod}
                                        onValueChange={(value: 'SHIPPING' | 'PICKUP') => setFulfillmentMethod(value)}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                            <RadioGroupItem value="SHIPPING" id="shipping" />
                                            <Label htmlFor="shipping" className="flex items-center gap-3 cursor-pointer flex-1">
                                                <Truck className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <div className="font-semibold">Shipping</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Item will be shipped to a the address specified in the order
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>

                                        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                                            <RadioGroupItem value="PICKUP" id="pickup" />
                                            <Label htmlFor="pickup" className="flex items-center gap-3 cursor-pointer flex-1">
                                                <Package className="h-5 w-5 text-green-600" />
                                                <div>
                                                    <div className="font-semibold">Pickup</div>
                                                    <div className="text-sm text-muted-foreground">
                                                        Item will be available for pickup at our location
                                                    </div>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Shipping Address Configuration */}
                            {fulfillmentMethod === 'SHIPPING' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5" />
                                            Shipping Address
                                        </CardTitle>
                                        <CardDescription>
                                            The shipping address for this item
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Default Order Address */}
                                        {shippingAddress && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium">Order Default Address</Label>
                                                    {/* <RadioGroup
                                                        value={useCustomAddress ? "custom" : "default"}
                                                        onValueChange={(value) => setUseCustomAddress(value === "custom")}
                                                        className="flex items-center space-x-4"
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="default" id="default-address" />
                                                            <Label htmlFor="default-address" className="text-sm">Use Default</Label>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="custom" id="custom-address" />
                                                            <Label htmlFor="custom-address" className="text-sm">Custom Address</Label>
                                                        </div>
                                                    </RadioGroup> */}
                                                </div>

                                                {!useCustomAddress && (
                                                    <div className="p-4 bg-muted/30 rounded-lg">
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
                                                )}
                                            </div>
                                        )}

                                        {/* Custom Address */}
                                        {useCustomAddress && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-medium">Custom Shipping Address</Label>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setShowAddressModal(true)}
                                                    >
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        {customShippingAddress ? 'Edit Address' : 'Add Address'}
                                                    </Button>
                                                </div>

                                                {customShippingAddress ? (
                                                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <div className="text-sm font-medium text-green-800 mb-1">Contact Information</div>
                                                                <div className="space-y-1 text-sm text-green-700">
                                                                    <div>{customShippingAddress.first_name} {customShippingAddress.last_name}</div>
                                                                    {customShippingAddress.company && (
                                                                        <div>{customShippingAddress.company}</div>
                                                                    )}
                                                                    <div>{customShippingAddress.phone}</div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-green-800 mb-1">Address</div>
                                                                <div className="space-y-1 text-sm text-green-700">
                                                                    <div>{customShippingAddress.formatted_address}</div>
                                                                    {customShippingAddress.apartment_suite && (
                                                                        <div>{customShippingAddress.apartment_suite}</div>
                                                                    )}
                                                                    <div>
                                                                        {customShippingAddress.city}, {customShippingAddress.state} {customShippingAddress.zip_code}
                                                                    </div>
                                                                    <div>{customShippingAddress.country}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
                                                        <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                                        <p className="text-muted-foreground mb-2">No custom address set</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            Click "Add Address" to set a custom shipping address for this item.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* No Default Address Warning */}
                                        {!shippingAddress && (
                                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                                                    <div>
                                                        <div className="font-medium text-amber-800 mb-1">No Default Address</div>
                                                        <div className="text-sm text-amber-700">
                                                            This order doesn't have a default shipping address. You'll need to add a custom address for shipping.
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Pickup Information */}
                            {fulfillmentMethod === 'PICKUP' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Pickup Information
                                        </CardTitle>
                                        <CardDescription>
                                            Item will be available for pickup at our location
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                                                <div>
                                                    <div className="font-medium text-green-800 mb-1">Pickup Location</div>
                                                    <div className="text-sm text-green-700 space-y-1">
                                                        <div>Mtech Office</div>
                                                        <div>182 Bay Ridge Ave</div>
                                                        <div>Brooklyn, NY 11209</div>
                                                        <div>United States</div>
                                                    </div>
                                                    <div className="text-sm text-green-600 mt-2">
                                                        You'll be notified when your item is ready for pickup.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            variant="outline"
                            onClick={() => setShowFulfillmentDialog(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleFulfillmentUpdate}
                            disabled={fulfillmentMethod === 'SHIPPING' && !shippingAddress}
                            className="flex-1"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save Configuration
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Address Edit Modal TODO*/}
            {/* <AddressEditModal
                open={showAddressModal}
                onOpenChange={setShowAddressModal}
                address={customShippingAddress || {
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
                onSave={handleSaveCustomAddress}
                isSaving={isSavingAddress}
            /> */}
        </>
    )
}
