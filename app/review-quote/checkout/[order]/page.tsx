'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CreditCard, Truck, MapPin, Clock, CheckCircle, Lock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getQuoteData } from './actions/get-quote-data'

interface QuoteRequestItem {
    id: string
    product_id: string
    product_name: string
    quantity: number
    notes?: string
    quoted_price?: number
    product?: {
        id: string
        name: string
        description: string
        default_price: number
        imageSrc?: string
        tags?: string[]
    }
}

interface Address {
    name: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    zip_code: string
    country: string
    phone: string
}

interface CheckoutData {
    orderConfirmationNumber: string
    customerEmail: string
    items: QuoteRequestItem[]
    fulfillmentType: 'delivery' | 'pickup'
    shippingAddress?: Address
    billingAddress?: Address
    total: number
}

interface CheckoutPageProps {
    params: {
        order: string
    }
    searchParams: {
        email?: string
        fulfillmentType?: string
    }
}

export default function CheckoutPage({ params, searchParams }: CheckoutPageProps) {
    const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentStep, setCurrentStep] = useState(1)
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    })

    // Fetch real checkout data
    useEffect(() => {
        const fetchQuoteData = async () => {
            const orderNumber = params.order
            const email = searchParams.email?.replace('%40', '@')

            console.log('Checkout page received params:', { orderNumber, email })

            if (!orderNumber || !email) {
                setError('Missing order number or email')
                setIsLoading(false)
                return
            }

            try {
                const result = await getQuoteData(orderNumber, email)

                if (result.success && result.data) {
                    setCheckoutData(result.data)
                    setError(null)
                } else {
                    setError(result.error || 'Failed to fetch quote data')
                    console.error('Failed to fetch quote data:', result.error)
                }
            } catch (error) {
                setError('An error occurred while fetching quote data')
                console.error('Error fetching quote data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchQuoteData()
    }, [searchParams])

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

    const formatExpiry = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        if (v.length >= 2) {
            return v.substring(0, 2) + '/' + v.substring(2, 4)
        }
        return v
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading checkout...</p>
                </motion.div>
            </div>
        )
    }

    if (error || !checkoutData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="p-6 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Checkout Error</h2>
                        <p className="text-gray-600 mb-4">
                            {error || 'Unable to load checkout information.'}
                        </p>
                        <div className="space-y-2">
                            <Button className="w-full" onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.location.reload()}
                            >
                                Try Again
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Button
                    variant="ghost"
                    onClick={() => window.history.back()}
                    className="mb-4"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Order Review
                </Button>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Secure Checkout</h1>
                        <p className="text-gray-600 mt-2">
                            Order #{checkoutData.orderConfirmationNumber}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2 text-green-600">
                        <Lock className="h-5 w-5" />
                        <span className="text-sm font-medium">Secure Payment</span>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                Payment Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardData.number}
                                        onChange={(e) => setCardData(prev => ({
                                            ...prev,
                                            number: formatCardNumber(e.target.value)
                                        }))}
                                        maxLength={19}
                                        className="mt-1"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="expiry">Expiry Date</Label>
                                        <Input
                                            id="expiry"
                                            placeholder="MM/YY"
                                            value={cardData.expiry}
                                            onChange={(e) => setCardData(prev => ({
                                                ...prev,
                                                expiry: formatExpiry(e.target.value)
                                            }))}
                                            maxLength={5}
                                            className="mt-1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            value={cardData.cvv}
                                            onChange={(e) => setCardData(prev => ({
                                                ...prev,
                                                cvv: e.target.value.replace(/\D/g, '').slice(0, 4)
                                            }))}
                                            maxLength={4}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input
                                        id="cardName"
                                        placeholder="John Doe"
                                        value={cardData.name}
                                        onChange={(e) => setCardData(prev => ({
                                            ...prev,
                                            name: e.target.value
                                        }))}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    className="w-full bg-purple-600 hover:bg-purple-700"
                                    size="lg"
                                >
                                    <Lock className="h-4 w-4 mr-2" />
                                    Pay ${checkoutData.total.toFixed(2)}
                                </Button>
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Your payment is secured with bank-level encryption
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    {/* Order Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {checkoutData.items.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index }}
                                        className="flex items-center space-x-4"
                                    >
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            {item.product?.imageSrc ? (
                                                <img
                                                    src={item.product.imageSrc}
                                                    alt={item.product_name}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-purple-100 rounded flex items-center justify-center">
                                                    <span className="text-purple-600 font-semibold text-lg">
                                                        {item.product_name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-gray-900">
                                                ${((item.quoted_price || item.product?.default_price || 0) * item.quantity).toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                ${(item.quoted_price || item.product?.default_price || 0).toFixed(2)} each
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="flex justify-between items-center font-semibold text-lg">
                                <span>Total</span>
                                <span>${checkoutData.total.toFixed(2)}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Fulfillment Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                {checkoutData.fulfillmentType === 'delivery' ? (
                                    <Truck className="h-5 w-5 mr-2" />
                                ) : (
                                    <MapPin className="h-5 w-5 mr-2" />
                                )}
                                {checkoutData.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'} Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <Badge variant={checkoutData.fulfillmentType === 'delivery' ? 'default' : 'secondary'}>
                                        {checkoutData.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}
                                    </Badge>
                                </div>

                                {checkoutData.fulfillmentType === 'delivery' ? (
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Shipping Address</h4>
                                            <p className="text-sm text-gray-600">
                                                {checkoutData.shippingAddress?.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {checkoutData.shippingAddress?.address_line_1}
                                            </p>
                                            {checkoutData.shippingAddress?.address_line_2 && (
                                                <p className="text-sm text-gray-600">
                                                    {checkoutData.shippingAddress.address_line_2}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-600">
                                                {checkoutData.shippingAddress?.city}, {checkoutData.shippingAddress?.state} {checkoutData.shippingAddress?.zip_code}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {checkoutData.shippingAddress?.phone}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Pickup Location</h4>
                                            <p className="text-sm text-gray-600">MTech Distributors</p>
                                            <p className="text-sm text-gray-600">182 Bay Ridge Ave</p>
                                            <p className="text-sm text-gray-600">Brooklyn, NY 11220</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <Clock className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div>
                                    <h4 className="font-medium text-gray-900">Billing Address</h4>
                                    <p className="text-sm text-gray-600">
                                        {checkoutData.billingAddress?.name}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {checkoutData.billingAddress?.address_line_1}
                                    </p>
                                    {checkoutData.billingAddress?.address_line_2 && (
                                        <p className="text-sm text-gray-600">
                                            {checkoutData.billingAddress.address_line_2}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600">
                                        {checkoutData.billingAddress?.city}, {checkoutData.billingAddress?.state} {checkoutData.billingAddress?.zip_code}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security Notice */}
                    <Card className="border-green-200 bg-green-50">
                        <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                                <Lock className="h-5 w-5 text-green-600 mt-0.5" />
                                <div>
                                    <h4 className="font-medium text-green-900">Secure Payment</h4>
                                    <p className="text-sm text-green-700 mt-1">
                                        Your payment information is encrypted and secure. We never store your card details.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
