'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    CreditCard,
    Package,
    Truck,
    AlertTriangle,
    CheckCircle,
    DollarSign,
    ShoppingCart,
    Lock,
    Shield,
    Info,
    Clock
} from 'lucide-react'
import { toast } from 'sonner'
import { captureSale } from '../agent/order/[order_id]/actions/capture-sale'
import { submitOrder } from '../actions/submit-order'
import { Profile } from '@/lib/hooks/useProfile'

interface CheckoutDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    orderInfo: any
    profile: Profile | null
    refetchOrderInfo: () => void
    onCheckout: (paymentData: any) => Promise<void>
}

export default function CheckoutDialog({
    open,
    onOpenChange,
    profile,
    orderInfo,
    refetchOrderInfo,
    onCheckout
}: CheckoutDialogProps) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [activeTab, setActiveTab] = useState('overview')

    // Payment form state
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardHolderName: '',
        expiryDate: '',
        cvv: '',
        billingAddress: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'United States'
        }
    })

    const handleInputChange = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.')
            if (parent === 'billingAddress') {
                setPaymentData(prev => ({
                    ...prev,
                    billingAddress: {
                        ...prev.billingAddress,
                        [child]: value
                    }
                }))
            }
        } else {
            setPaymentData(prev => ({
                ...prev,
                [field]: value
            }))
        }
    }

    const handleCheckout = async () => {
        // TODO: Add payment authorization tab
        // if (activeTab === 'overview') {
        //     setActiveTab('payment')
        //     return
        // }
        // if (!paymentData.cardNumber || !paymentData.cardHolderName || !paymentData.expiryDate || !paymentData.cvv) {
        //     toast.error('Please fill in all payment fields')
        //     return
        // }

        setIsProcessing(true)
        if(!profile) {
            toast.error('Profile Error. Please login again.')
            return
        }
        try {
            // const response = await captureSale(orderInfo.id, calculateTotal(), orderInfo.order_name, {
            //     cardnumber: paymentData.cardNumber,
            //     expirydate: paymentData.expiryDate,
            //     cvv: Number(paymentData.cvv),
            //     cardholdername: paymentData.cardHolderName
            // })
            const response = await submitOrder(orderInfo.id, profile,orderInfo.order_name, orderInfo.notes, orderInfo.order_items, orderInfo.order_confirmation_number)
            if (response instanceof Error) {
                toast.error('Authorization failed. Please try again.', {
                    description: response.message
                })
            } else {
                toast.success('Payment authorization submitted successfully!')
                console.log(response)
                refetchOrderInfo()
                onOpenChange(false)
            }
        } catch (error) {
            toast.error('Authorization failed. Please try again.')
        } finally {
            setIsProcessing(false)
        }
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
            return parts.join(' ')
        } else {
            return v
        }
    }

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    const calculateSubtotal = () => {
        return orderInfo.order_items.reduce((acc: number, item: any) =>
            acc + (item.price_at_order * item.quantity), 0
        )
    }

    const calculateTax = () => {
        return calculateSubtotal() * 0.08
    }

    const calculateTotal = () => {
        return calculateSubtotal() + calculateTax()
    }

    const getShippingItemsCount = () => {
        return orderInfo.order_items.filter((item: any) => item.fulfillment_type === 'SHIPPING').length
    }

    const getPickupItemsCount = () => {
        return orderInfo.order_items.filter((item: any) => item.fulfillment_type === 'PICKUP').length
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Order Authorization
                    </DialogTitle>
                    <DialogDescription>
                        Review your order and authorize payment hold for processing
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Order Overview</TabsTrigger>
                        {/* <TabsTrigger value="payment">Payment Authorization</TabsTrigger> */}
                    </TabsList>

                    {/* Order Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        {/* Order Items Review */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Order Items
                                </CardTitle>
                                <CardDescription>
                                    Review the items in your order
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {orderInfo.order_items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                            {item.products?.imageSrc && (
                                                <img
                                                    src={item.products.imageSrc}
                                                    alt={item.products.name}
                                                    className="w-16 h-16 object-cover rounded border"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-semibold">{item.products?.name}</div>
                                                <div className="text-sm text-muted-foreground">
                                                    {item.products?.description?.slice(0, 100)}...
                                                </div>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-sm">Qty: {item.quantity}</span>
                                                    <span className="text-sm">Price: ${item.price_at_order}</span>
                                                    <span className="text-sm font-semibold">
                                                        Subtotal: ${(item.price_at_order * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <Badge
                                                    variant={item.fulfillment_type === 'SHIPPING' ? 'default' : 'secondary'}
                                                    className={item.fulfillment_type === 'SHIPPING' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                                                >
                                                    {item.fulfillment_type === 'SHIPPING' ? (
                                                        <Truck className="h-3 w-3 mr-1" />
                                                    ) : (
                                                        <Package className="h-3 w-3 mr-1" />
                                                    )}
                                                    {item.fulfillment_type}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <section className='flex grid-cols-2 gap-4'>
                            {/* Fulfillment Summary */}
                            <Card className='w-full'>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Fulfillment Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Truck className="h-4 w-4 text-blue-600" />
                                                <span className="font-semibold text-blue-800">Shipping Items</span>
                                            </div>
                                            <div className="text-blue-700">
                                                {getShippingItemsCount()} item(s) will be shipped
                                            </div>
                                        </div>
                                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Package className="h-4 w-4 text-green-600" />
                                                <span className="font-semibold text-green-800">Pickup Items</span>
                                            </div>
                                            <div className="text-green-700">
                                                {getPickupItemsCount()} item(s) for pickup
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Order Summary */}
                            <Card className='w-full'>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="h-5 w-5" />
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span>Subtotal:</span>
                                            <span>${calculateSubtotal().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Tax (8%):</span>
                                            <span>${calculateTax().toFixed(2)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between font-semibold text-lg">
                                            <span>Total:</span>
                                            <span>${calculateTotal().toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>

                        {/* Important Disclaimers */}
                        <Card className="border-amber-200 bg-amber-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-amber-800">
                                    <AlertTriangle className="h-5 w-5" />
                                    Important Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Shipping Fee Notice */}
                                    {getShippingItemsCount() > 0 && (
                                        <div className="space-y-2">
                                            <div className="font-semibold text-amber-800">Shipping Fees</div>
                                            <div className="text-sm text-amber-700">
                                                <ul className="list-disc list-inside space-y-1">
                                                    <li>Additional shipping fees will be calculated after admin approval</li>
                                                    <li>Fees are based on weight, dimensions, and destination</li>
                                                    <li>You will be notified of the exact shipping cost before processing</li>
                                                    <li>Pickup items have no additional fees</li>
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* Payment Hold Notice */}
                                    <div className="space-y-2">
                                        <div className="font-semibold text-amber-800">Payment Authorization</div>
                                        <div className="text-sm text-amber-700">
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>A temporary hold will be placed on your card for the order total</li>
                                                <li>No charges will be processed until admin approval</li>
                                                <li>The hold will be released if the order is not approved</li>
                                                <li>Final charges may include additional shipping fees</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Process Timeline */}
                                    <div className="space-y-2">
                                        <div className="font-semibold text-amber-800">Next Steps</div>
                                        <div className="text-sm text-amber-700">
                                            <ol className="list-decimal list-inside space-y-1">
                                                <li>Submit payment authorization (card hold only)</li>
                                                <li>Admin reviews and approves your order</li>
                                                <li>Shipping fees calculated (if applicable)</li>
                                                <li>Final payment processed with all fees</li>
                                                <li>Order fulfillment begins</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5" />
                                    Order Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Order Name:</span>
                                        <span>{orderInfo.order_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Order ID:</span>
                                        <span className="font-mono">{orderInfo.order_confirmation_number || orderInfo.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Status:</span>
                                        <Badge variant="outline">{orderInfo.status}</Badge>
                                    </div>
                                    {orderInfo.notes && (
                                        <div>
                                            <span className="font-medium">Notes:</span>
                                            <div className="text-sm text-muted-foreground mt-1">{orderInfo.notes}</div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment Authorization Tab */}
                    <TabsContent value="payment" className="space-y-6">
                        {/* Authorization Notice */}
                        <Card className="border-blue-200 bg-blue-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-800">
                                    <Clock className="h-5 w-5" />
                                    Payment Authorization Hold
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-blue-800">
                                        <strong>Important:</strong> You are authorizing a temporary hold on your payment method, not a charge.
                                    </div>
                                    <div className="text-sm text-blue-700">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>A hold will be placed for ${calculateTotal().toFixed(2)} (order total)</li>
                                            <li>No money will be charged until admin approval</li>
                                            <li>The hold will be released if order is not approved</li>
                                            <li>Final amount may include additional shipping fees</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Payment Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Payment Information
                                    </CardTitle>
                                    <CardDescription>
                                        Enter your payment details for authorization hold
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <Input
                                            id="cardNumber"
                                            value={paymentData.cardNumber}
                                            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength={19}
                                            className="mt-1"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="cardHolderName">Cardholder Name</Label>
                                        <Input
                                            id="cardHolderName"
                                            value={paymentData.cardHolderName}
                                            onChange={(e) => handleInputChange('cardHolderName', e.target.value)}
                                            placeholder="John Doe"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiryDate">Expiry Date</Label>
                                            <Input
                                                id="expiryDate"
                                                value={paymentData.expiryDate}
                                                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                                placeholder="MM/YY"
                                                maxLength={5}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input
                                                id="cvv"
                                                value={paymentData.cvv}
                                                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                                placeholder="123"
                                                maxLength={4}
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Billing Address */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        Billing Address
                                    </CardTitle>
                                    <CardDescription>
                                        Address for billing purposes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={paymentData.billingAddress.street}
                                            onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                                            placeholder="123 Main St"
                                            className="mt-1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={paymentData.billingAddress.city}
                                                onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                                                placeholder="New York"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <Input
                                                id="state"
                                                value={paymentData.billingAddress.state}
                                                onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                                                placeholder="NY"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="zipCode">ZIP Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={paymentData.billingAddress.zipCode}
                                                onChange={(e) => handleInputChange('billingAddress.zipCode', e.target.value)}
                                                placeholder="10001"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={paymentData.billingAddress.country}
                                                onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                                                placeholder="United States"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Security Notice */}
                        <Card className="border-green-200 bg-green-50">
                            <CardContent className="pt-6">
                                <div className="flex items-start gap-3">
                                    <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                                    <div>
                                        <div className="font-medium text-green-800 mb-1">Secure Payment Authorization</div>
                                        <div className="text-sm text-green-700">
                                            Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data. Only an authorization hold will be placed - no charges until approval.
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                        disabled={isProcessing}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {isProcessing ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                Authorizing...
                            </>
                        ) : activeTab === 'payment' ? (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Authorize Payment Hold
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {/* Continue to Payment Info */}
                                Submit Order
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
