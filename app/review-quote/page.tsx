"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    Lock,
    Mail,
    Hash,
    Package,
    DollarSign,
    User,
    MapPin,
    Edit3,
    MessageSquare,
    Send,
    ShoppingCart,
    CheckCircle,
    AlertCircle,
    Loader2,
    Truck,
    Clock,
    Phone
} from 'lucide-react'
import { toast } from 'sonner'
import AddressDisplay from '@/components/AddressDisplay'
import AddressEditModal from '@/components/AddressEditModal'
import { verifyQuoteAccess } from './actions/verify-access'
import { updateQuoteAddress } from './actions/update-address'
import { addQuoteNote } from './actions/add-note'
import { updateFulfillmentType } from '../(master-admin)/master-admin/quote-requests/[id]/actions/update-fulfillment-type'

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

interface QuoteRequest {
    id: string
    customer_name: string
    customer_last_name: string
    customer_email: string
    customer_phone: string
    customer_company?: string
    customer_message?: string
    total_items: number
    status: 'pending' | 'approved' | 'closed' | 'rejected'
    order_fulfillment_type?: 'delivery' | 'pickup'
    created_at: string
    order_confirmation_number?: string
    quote_request_items: QuoteRequestItem[]
    shipping_address?: Address
    billing_address?: Address
    profiles?: {
        id: string
        first_name: string
        last_name: string
        email: string
        phone_number?: string
    }
    approved_info?: {
        approved_date: string
        approved_by: string
        approved_profile_id: string
    }
}

interface Note {
    id: string
    quote_request_id: string
    profile_id?: string
    content: string
    created_at: string
    is_customer_note: boolean
    profiles?: {
        first_name: string
        last_name: string
    } | null
}

export default function ReviewQuotePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null)
    const [notes, setNotes] = useState<Note[]>([])
    const [newNote, setNewNote] = useState('')
    const [isSubmittingNote, setIsSubmittingNote] = useState(false)

    // Login form state
    const [orderConfirmationNumber, setOrderConfirmationNumber] = useState('')
    const [email, setEmail] = useState('')
    const [loginError, setLoginError] = useState('')

    // Address editing state
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [editingAddressType, setEditingAddressType] = useState<'shipping' | 'billing'>('shipping')
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    // Fulfillment type state
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>('delivery')

    // Check for pre-filled data from URL params
    useEffect(() => {
        const orderNumber = searchParams.get('order')
        const emailParam = searchParams.get('email')

        if (orderNumber) setOrderConfirmationNumber(orderNumber)
        if (emailParam) setEmail(emailParam)
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setLoginError('')

        try {
            const result = await verifyQuoteAccess(orderConfirmationNumber, email)

            if (result.success) {
                setQuoteRequest(result.quoteRequest)
                setFulfillmentType(result.quoteRequest.order_fulfillment_type || 'delivery')
                setIsAuthenticated(true)
                toast.success('Successfully logged in!')
            } else {
                setLoginError(result.error || 'Invalid credentials or quote not found')
            }
        } catch (error) {
            console.error('Login error:', error)
            setLoginError('An error occurred. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const getTotalValue = () => {
        if (!quoteRequest || !quoteRequest.quote_request_items) return 0
        return quoteRequest.quote_request_items.reduce((total: number, item: QuoteRequestItem) => {
            const price = item?.quoted_price || item.product?.default_price || 0
            return total + (price * item.quantity)
        }, 0)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const startEditingAddress = (type: 'shipping' | 'billing') => {
        setEditingAddressType(type)
        setAddressModalOpen(true)
    }

    const saveAddress = async (address: any) => {
        if (!quoteRequest) return

        setIsSavingAddress(true)
        try {
            const result = await updateQuoteAddress(quoteRequest.id, editingAddressType, address)

            if (result.success) {
                toast.success(`${editingAddressType === 'shipping' ? 'Shipping' : 'Billing'} address updated successfully`)
                // Update local state
                setQuoteRequest(prev => prev ? {
                    ...prev,
                    [editingAddressType === 'shipping' ? 'shipping_address' : 'billing_address']: address
                } : null)
                setAddressModalOpen(false)
            } else {
                throw new Error(result.error || 'Failed to update address')
            }
        } catch (error) {
            toast.error('Failed to update address')
        } finally {
            setIsSavingAddress(false)
        }
    }

    const submitNote = async () => {
        if (!newNote.trim() || !quoteRequest) return

        setIsSubmittingNote(true)
        try {
            const result = await addQuoteNote(quoteRequest.id, newNote)

            if (result.success && result.note) {
                setNewNote('')
                toast.success('Note submitted successfully')
            } else {
                throw new Error(result.error || 'Failed to submit note')
            }
        } catch (error) {
            toast.error('Failed to submit note')
        } finally {
            setIsSubmittingNote(false)
        }
    }

    const getCheckoutUrl = () => {
        if (!quoteRequest) return '#'

        const orderNumber = quoteRequest.order_confirmation_number || ''
        const email = quoteRequest.customer_email
        const fulfillmentTypeParam = fulfillmentType

        return `/review-quote/checkout/${orderNumber}?email=${encodeURIComponent(email)}&fulfillmentType=${fulfillmentTypeParam}`
    }

    const [fulfillmentTypeModalOpen, setFulfillmentTypeModalOpen] = useState(false)
    const [pendingFulfillmentType, setPendingFulfillmentType] = useState<'delivery' | 'pickup'>('delivery')

    const onUpdateFulfillmentType = async (type: 'delivery' | 'pickup') => {
        if (!quoteRequest) return
        const response = await updateFulfillmentType(quoteRequest.id, type)
        if (response instanceof Error) {
            toast.error('Failed to update fulfillment type', {
                description: response.message
            })
        } else {
            toast.success('Fulfillment type updated successfully')
            setFulfillmentType(type)
        }
    }

    const handleFulfillmentTypeChange = (type: 'delivery' | 'pickup') => {
        setPendingFulfillmentType(type)
        setFulfillmentTypeModalOpen(true)
    }

    const confirmFulfillmentTypeChange = async () => {
        await onUpdateFulfillmentType(pendingFulfillmentType)
        setFulfillmentTypeModalOpen(false)
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="shadow-xl">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <Lock className="h-8 w-8 text-purple-600" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Review Your Quote
                            </CardTitle>
                            <p className="text-gray-600 mt-2">
                                Enter your order confirmation number and email to access your quote
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Confirmation Number
                                    </label>
                                    <div className="relative">
                                        <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            value={orderConfirmationNumber}
                                            onChange={(e) => setOrderConfirmationNumber(e.target.value)}
                                            placeholder="Enter your order number"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {loginError && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <AlertCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm text-red-700">{loginError}</span>
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <Lock className="h-4 w-4 mr-2" />
                                            Access Quote
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (!quoteRequest) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading quote...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Your Quote Review
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Order #{quoteRequest.order_confirmation_number} • Created {formatDate(quoteRequest.created_at)}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approved
                            </Badge>
                            <Link href={getCheckoutUrl()}>
                                <Button
                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                    size="lg"
                                    disabled={!quoteRequest}
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Proceed to Checkout
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Quote Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <Package className="h-5 w-5" />
                                    <span>Your Quote Items</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {quoteRequest.quote_request_items.map((item: QuoteRequestItem) => {
                                        const price = item.quoted_price || item.product?.default_price || 0
                                        const total = price * item.quantity

                                        return (
                                            <div key={item.id} className="border rounded-lg p-4">
                                                <div className="flex items-start space-x-4">
                                                    {item.product?.imageSrc && (
                                                        <img
                                                            src={item.product.imageSrc}
                                                            alt={item.product.name}
                                                            className="w-16 h-16 object-cover rounded-md"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900">
                                                            {item.product?.name || item.product_name}
                                                        </h3>
                                                        {item.product?.description && (
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {item.product.description.slice(0, 100)}...
                                                            </p>
                                                        )}
                                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                                            <span>Quantity: {item.quantity}</span>
                                                            <span>Price: ${price.toFixed(2)}</span>
                                                            <span className="font-medium text-gray-900">
                                                                Total: ${total.toFixed(2)}
                                                            </span>
                                                        </div>
                                                        {item.notes && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                <strong>Your Notes:</strong> {item.notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-lg font-medium text-gray-900">Total Value:</span>
                                        <span className="text-2xl font-bold text-purple-600">
                                            ${getTotalValue().toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notes Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Notes & Communication</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Add Note */}
                                <div className="mb-6">
                                    <Textarea
                                        placeholder="Leave a note for the MTech team..."
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        className="min-h-[100px]"
                                    />
                                    <div className="flex justify-end mt-2">
                                        <Button
                                            onClick={submitNote}
                                            disabled={!newNote.trim() || isSubmittingNote}
                                            size="sm"
                                        >
                                            {isSubmittingNote ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-4 w-4 mr-2" />
                                                    Send Note
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Notes List */}
                                <div className="space-y-4">
                                    {notes.map((note) => (
                                        <div key={note.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-medium text-gray-900">
                                                            {note.is_customer_note
                                                                ? `${quoteRequest.customer_name} ${quoteRequest.customer_last_name}`
                                                                : note.profiles
                                                                    ? `${note.profiles.first_name} ${note.profiles.last_name}`
                                                                    : 'MTech Team'
                                                            }
                                                        </span>
                                                        <Badge variant={note.is_customer_note ? "outline" : "default"}>
                                                            {note.is_customer_note ? 'Customer' : 'MTech Team'}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-700">{note.content}</p>
                                                </div>
                                                <span className="text-xs text-gray-500 ml-4">
                                                    {formatDate(note.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <User className="h-5 w-5" />
                                    <span>Customer Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">
                                            {quoteRequest.customer_name} {quoteRequest.customer_last_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{quoteRequest.customer_email}</span>
                                    </div>
                                    {quoteRequest.customer_company && (
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm">{quoteRequest.customer_company}</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quoted By */}
                        {quoteRequest.profiles && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <User className="h-5 w-5" />
                                        <span>Quoted By</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <p className="font-medium">
                                            {quoteRequest.profiles.first_name} {quoteRequest.profiles.last_name}
                                        </p>
                                        <p className="text-sm text-gray-600">{quoteRequest.profiles.email}</p>
                                        <p className="text-sm text-gray-600">Phone: {quoteRequest.profiles.phone_number}</p>

                                        {quoteRequest.approved_info && (
                                            <p className="text-sm text-gray-500">
                                                Approved on {formatDate(quoteRequest.approved_info.approved_date)}
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Fulfillment & Addresses */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Fulfillment & Addresses</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Fulfillment Type Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Order Fulfillment Type
                                    </label>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant={fulfillmentType === 'delivery' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFulfillmentTypeChange('delivery')}
                                            className="flex items-center space-x-2"
                                        >
                                            <Truck className="h-4 w-4" />
                                            <span>Delivery</span>
                                        </Button>
                                        <Button
                                            variant={fulfillmentType === 'pickup' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFulfillmentTypeChange('pickup')}
                                            className="flex items-center space-x-2"
                                        >
                                            <MapPin className="h-4 w-4" />
                                            <span>Pickup</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Delivery Address (only show if delivery is selected) */}
                                    {fulfillmentType === 'delivery' && (
                                        <AddressDisplay
                                            address={quoteRequest.shipping_address || {}}
                                            type="shipping"
                                            onEdit={() => startEditingAddress('shipping')}
                                        />
                                    )}

                                    {/* Pickup Location (only show if pickup is selected) */}
                                    {fulfillmentType === 'pickup' && (
                                        <div className="border rounded-lg p-4 bg-muted/20">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-medium text-foreground">Pickup Location</h4>
                                                <Badge variant="secondary">MTech Distributors</Badge>
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                                    <span>182 Bay Ridge Ave, Brooklyn, NY 11220</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span>Business Hours: Mon-Fri 9AM-6PM</span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                                    <span>Contact: (347) 659-1866</span>
                                                </div>
                                            </div>
                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                                    <strong>Pickup Instructions:</strong> Please bring a valid ID and order confirmation number.
                                                    Orders will be ready for pickup within 24-48 hours after approval.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Billing Address (always show) */}
                                    <AddressDisplay
                                        address={quoteRequest.billing_address || {}}
                                        type="billing"
                                        onEdit={() => startEditingAddress('billing')}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Address Edit Modal */}
            <AddressEditModal
                open={addressModalOpen}
                onOpenChange={setAddressModalOpen}
                address={editingAddressType === 'shipping' ? (quoteRequest.shipping_address || {}) : (quoteRequest.billing_address || {})}
                type={editingAddressType}
                onSave={saveAddress}
                isSaving={isSavingAddress}
            />

            {/* Fulfillment Type Change Confirmation Dialog */}
            <Dialog open={fulfillmentTypeModalOpen} onOpenChange={setFulfillmentTypeModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Change Fulfillment Type
                        </DialogTitle>
                        <DialogDescription>
                            You are about to change the fulfillment type for this order. The other party will be notified of this change.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">i</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                        Important Notice
                                    </h4>
                                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                        <li>• Changing fulfillment type will notify the MTech team</li>
                                        <li>• This may affect delivery arrangements and pricing</li>
                                        <li>• Please ensure this change is necessary</li>
                                        <li>• The change will be logged in the order history</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Change Details</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Current Type: <span className="font-medium text-foreground capitalize">{fulfillmentType}</span></p>
                                <p>New Type: <span className="font-medium text-foreground capitalize">{pendingFulfillmentType}</span></p>
                                <p>Order #: <span className="font-medium text-foreground">{quoteRequest?.order_confirmation_number}</span></p>
                                <p>Customer: <span className="font-medium text-foreground">{quoteRequest?.customer_name} {quoteRequest?.customer_last_name}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setFulfillmentTypeModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmFulfillmentTypeChange}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <MapPin className="h-4 w-4 mr-2" />
                            Confirm Change
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
