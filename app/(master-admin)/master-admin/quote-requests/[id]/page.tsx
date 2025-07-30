"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    ArrowLeft,
    Mail,
    Phone,
    Building,
    Calendar,
    DollarSign,
    Package,
    MessageSquare,
    Trash2,
    Send,
    Smile,
    AtSign,
    Hash,
    Paperclip,
    User,
    Edit3,
    Copy,
    MapPin,
    Tag,
    Search,
    Filter,
    Loader2,
    Zap
} from 'lucide-react'
import { toast } from 'sonner'
import { GetQuoteInfo } from '../../actions/get-quote-info'
import { useQueryClient, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { GetAdminProfiles } from '../../actions/order-actions/get-admin-profiles'
import { AssignAdmin } from './actions/assign-admin'
import { updateQuoteOrderItemsPrice } from './actions/update-quote-order-items-price'

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
    customer_email: string
    customer_phone: string
    customer_company?: string
    customer_message?: string
    total_items: number
    status: 'pending' | 'reviewed' | 'quoted' | 'closed'
    created_at: string
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
}

interface AuditLogEntry {
    id: string
    timestamp: string
    user: string
    action: string
    details?: string
    type: 'comment' | 'status_change' | 'email_sent' | 'payment' | 'order_action'
}

// Fake audit log data
const fakeAuditLog: AuditLogEntry[] = [
    {
        id: '1',
        timestamp: '2024-07-25T22:27:00Z',
        user: 'mtech-distributors',
        action: 'edited the note on this order.',
        type: 'comment'
    },
    {
        id: '2',
        timestamp: '2024-07-25T22:25:00Z',
        user: 'mtech-distributors',
        action: 'added a note to this order.',
        type: 'comment'
    },
    {
        id: '3',
        timestamp: '2024-07-25T22:20:00Z',
        user: 'mtech-distributors',
        action: 'archived this order.',
        type: 'order_action'
    },
    {
        id: '4',
        timestamp: '2024-07-25T22:15:00Z',
        user: 'mtech-distributors',
        action: 'refunded 1 item and shipping.',
        type: 'payment'
    },
    {
        id: '5',
        timestamp: '2024-07-25T22:10:00Z',
        user: 'mtech-distributors',
        action: 'canceled the payment on Valor Pay.',
        type: 'payment'
    },
    {
        id: '6',
        timestamp: '2024-07-25T22:05:00Z',
        user: 'mtech-distributors',
        action: 'canceled this order.',
        type: 'order_action'
    },
    {
        id: '7',
        timestamp: '2024-07-25T21:30:00Z',
        user: 'system',
        action: 'Order confirmation email was sent to Eduardo Massi (miau54388@gmail.com).',
        type: 'email_sent'
    },
    {
        id: '8',
        timestamp: '2024-07-25T21:25:00Z',
        user: 'system',
        action: 'A $227.88 USD payment is pending on Pay Via Valor Pay.',
        type: 'payment'
    },
    {
        id: '9',
        timestamp: '2024-07-25T21:20:00Z',
        user: 'system',
        action: 'Confirmation #V5GUT4KHU was generated for this order.',
        type: 'order_action'
    },
    {
        id: '10',
        timestamp: '2024-07-25T21:15:00Z',
        user: 'Eduardo Massi',
        action: 'placed this order on Online Store (checkout #38127594668220).',
        type: 'order_action'
    }
]

export default function QuoteRequestDetailPage({ params }: { params: { id: string } }) {
    const queryClient = useQueryClient()
    const { data: quoteRequest, isLoading, isError, refetch } = useSuspenseQuery({
        queryKey: ['quote-request', params.id],
        queryFn: () => GetQuoteInfo(params.id),
    })
    const { data: adminProfiles, isLoading: adminProfilesLoading } = useQuery({
        queryKey: ['admin-profiles'],
        queryFn: GetAdminProfiles,
    });
    const router = useRouter()
    const [comment, setComment] = useState('')
    const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(fakeAuditLog)
    const [selectedAgentId, setSelectedAgentId] = useState<string>('')
    const [isAssigning, setIsAssigning] = useState(false)
    const [editingAddress, setEditingAddress] = useState<'shipping' | 'billing' | null>(null)
    const [addressForm, setAddressForm] = useState<Address>({
        name: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        phone: ''
    })

    // Pricing states
    const [pricingSearchTerm, setPricingSearchTerm] = useState('')
    const [selectedPricingTags, setSelectedPricingTags] = useState<string[]>([])
    const [pricingPriceRange, setPricingPriceRange] = useState({ min: '', max: '' })
    const [openBulkPricingDialog, setOpenBulkPricingDialog] = useState(false)
    const [bulkPricingMode, setBulkPricingMode] = useState<'fixed' | 'markup' | 'markup-current'>('fixed')
    const [bulkPricingValue, setBulkPricingValue] = useState('')
    const [bulkPricingError, setBulkPricingError] = useState('')
    const [openMarkupDialog, setOpenMarkupDialog] = useState(false)
    const [selectedItemForMarkup, setSelectedItemForMarkup] = useState<any>(null)
    const [markupPercentage, setMarkupPercentage] = useState('20')
    const [markupMultiplier, setMarkupMultiplier] = useState('1.2')
    const [isSavingPricing, setIsSavingPricing] = useState(false)
    const [itemPricing, setItemPricing] = useState<any>(null)
    const [originalPrices, setOriginalPrices] = useState<Record<string, number>>({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Track original prices and detect changes
    useEffect(() => {
        if (quoteRequest?.quote_request_items && Object.keys(originalPrices).length === 0) {
            const original = quoteRequest.quote_request_items.reduce((acc: Record<string, number>, item: QuoteRequestItem) => {
                // Use the actual quoted_price from database, or default_price if no quoted_price exists
                acc[item.id] = item.quoted_price !== undefined ? item.quoted_price : (item.product?.default_price || 0)
                return acc
            }, {} as Record<string, number>)
            setOriginalPrices(original)
            console.log('Setting original prices:', original)
        }
    }, [quoteRequest?.quote_request_items, originalPrices])

    console.log('originalPrices', originalPrices)
    // Check for unsaved changes
    useEffect(() => {
        if (quoteRequest?.quote_request_items && Object.keys(originalPrices).length > 0) {
            const hasChanges = quoteRequest.quote_request_items.some((item: QuoteRequestItem) => {
                const currentPrice = item.quoted_price || item.product?.default_price || 0
                const originalPrice = originalPrices[item.id] || 0
                return Math.abs(currentPrice - originalPrice) > 0.01 // Account for floating point precision
            })
            setHasUnsavedChanges(hasChanges)
            console.log('hasUnsavedChanges', hasChanges, 'originalPrices', originalPrices)
        } else {
            setHasUnsavedChanges(false)
        }
    }, [quoteRequest?.quote_request_items, originalPrices])

    const updateStatus = async (status: QuoteRequest['status']) => {
        if (!quoteRequest) return

        try {
            const response = await fetch(`/api/quote-requests/${quoteRequest.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            })

            if (response.ok) {
                // Update the query cache
                queryClient.setQueryData(['quote-request', params.id], {
                    ...quoteRequest,
                    status
                })
                toast.success('Status updated successfully')

                // Add to audit log
                const newEntry: AuditLogEntry = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    user: 'mtech-distributors',
                    action: `changed status to ${status}.`,
                    type: 'status_change'
                }
                setAuditLog([newEntry, ...auditLog])
            } else {
                throw new Error('Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
        }
    }
    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['quote-request', params.id] })
    }

    const handlePostComment = () => {
        if (!comment.trim()) return

        const newEntry: AuditLogEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            user: 'mtech-distributors',
            action: comment,
            type: 'comment'
        }
        setAuditLog([newEntry, ...auditLog])
        setComment('')
        toast.success('Comment posted')
    }

    const getStatusBadge = (status: QuoteRequest['status']) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
            reviewed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: 'Reviewed' },
            quoted: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Quoted' },
            closed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Closed' },
        }

        const config = statusConfig[status]
        return (
            <Badge className={config.color}>
                {config.label}
            </Badge>
        )
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const getTotalValue = () => {
        if (!quoteRequest) return 0
        return quoteRequest.quote_request_items.reduce((total: number, item: QuoteRequestItem) => {
            const price = item.product?.default_price || 0
            return total + (price * item.quantity)
        }, 0)
    }

    const handleAssignAdmin = async () => {
        setIsAssigning(true)
        const response = await AssignAdmin(quoteRequest.id, selectedAgentId)
        if (response instanceof Error) {
            toast.error('Failed to assign admin', {
                description: response.message
            })
        } else {
            toast.success('Admin assigned successfully', {
                description: 'The admin will be notified via email.'
            })
        }
        setIsAssigning(false)
    }

    const handleRemoveAssignment = async () => {
        const response = await AssignAdmin(quoteRequest.id, null)
        if (response instanceof Error) {
            toast.error('Failed to remove assignment', {
                description: response.message
            })
        }
        else {
            toast.success('Admin removed successfully', {
                description: 'The admin will be notified via email.'
            })
        }
        await handleRefresh()
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success('Address copied to clipboard')
        } catch (error) {
            toast.error('Failed to copy address')
        }
    }

    const startEditingAddress = (type: 'shipping' | 'billing') => {
        const currentAddress = type === 'shipping' ? quoteRequest.shipping_address : quoteRequest.billing_address
        if (currentAddress) {
            setAddressForm(currentAddress)
        } else {
            setAddressForm({
                name: quoteRequest.customer_name,
                address_line_1: '',
                address_line_2: '',
                city: '',
                state: '',
                zip_code: '',
                country: 'United States',
                phone: quoteRequest.customer_phone
            })
        }
        setEditingAddress(type)
    }

    const saveAddress = async () => {
        if (!editingAddress) return

        try {
            const response = await fetch(`/api/quote-requests/${quoteRequest.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    [`${editingAddress}_address`]: addressForm
                }),
            })

            if (response.ok) {
                // Update the query cache
                queryClient.setQueryData(['quote-request', params.id], {
                    ...quoteRequest,
                    [`${editingAddress}_address`]: addressForm
                })
                toast.success(`${editingAddress === 'shipping' ? 'Shipping' : 'Billing'} address updated successfully`)

                // Add to audit log
                const newEntry: AuditLogEntry = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    user: 'mtech-distributors',
                    action: `updated ${editingAddress} address.`,
                    type: 'status_change'
                }
                setAuditLog([newEntry, ...auditLog])

                setEditingAddress(null)
                setAddressForm({
                    name: '',
                    address_line_1: '',
                    address_line_2: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    country: '',
                    phone: ''
                })
            } else {
                throw new Error('Failed to update address')
            }
        } catch (error) {
            console.error('Error updating address:', error)
            toast.error('Failed to update address')
        }
    }

    const cancelEditing = () => {
        setEditingAddress(null)
        setAddressForm({
            name: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            zip_code: '',
            country: '',
            phone: ''
        })
    }

    const formatAddress = (address: Address) => {
        const lines = [
            address.name,
            address.address_line_1,
            address.address_line_2,
            `${address.city}, ${address.state} ${address.zip_code}`,
            address.country,
            address.phone
        ].filter(Boolean)
        return lines.join('\n')
    }

    // Pricing functions
    const pricingTags = [
        "atm parts",
        "pos parts",
        "network devices",
        "atm signage",
        "credit card terminals",
        "pos system",
        "pos accessories",
        "atm machines",
        "scales",
    ]

    const calculateMarkupPrice = (basePrice: number, percentage: number) => {
        return basePrice * (1 + percentage / 100)
    }

    const calculateMultiplierPrice = (basePrice: number, multiplier: number) => {
        return basePrice * multiplier
    }

    const handlePricingTagToggle = (tag: string) => {
        setSelectedPricingTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        )
    }

    const clearPricingFilters = () => {
        setSelectedPricingTags([])
        setPricingPriceRange({ min: '', max: '' })
        setPricingSearchTerm('')
    }

    const hasPricingFilters = selectedPricingTags.length > 0 || pricingPriceRange.min || pricingPriceRange.max

    const filteredQuoteItems = quoteRequest.quote_request_items.filter((item: QuoteRequestItem) => {
        const matchesSearch = item.product_name?.toLowerCase().includes(pricingSearchTerm.toLowerCase()) ||
            item.product?.description?.toLowerCase().includes(pricingSearchTerm.toLowerCase())

        const matchesTags = selectedPricingTags.length === 0 ||
            selectedPricingTags.some(tag =>
                item.product_name?.toLowerCase().includes(tag.toLowerCase()) ||
                item.product?.description?.toLowerCase().includes(tag.toLowerCase()) ||
                item.product?.tags?.some((productTag: string) => productTag.toLowerCase().includes(tag.toLowerCase()))
            )

        const currentPrice = item.quoted_price || item.product?.default_price || 0
        const matchesPriceRange = (!pricingPriceRange.min || currentPrice >= parseFloat(pricingPriceRange.min)) &&
            (!pricingPriceRange.max || currentPrice <= parseFloat(pricingPriceRange.max))

        return matchesSearch && matchesTags && matchesPriceRange
    })

    const openMarkupCalculator = (item: QuoteRequestItem) => {
        setSelectedItemForMarkup(item)
        setOpenMarkupDialog(true)
    }

    const applyMarkupPrice = () => {
        if (!selectedItemForMarkup) return

        const basePrice = selectedItemForMarkup.product?.default_price || 0
        let newPrice = 0

        if (markupPercentage) {
            newPrice = calculateMarkupPrice(basePrice, parseFloat(markupPercentage))
        } else if (markupMultiplier) {
            newPrice = calculateMultiplierPrice(basePrice, parseFloat(markupMultiplier))
        }

        // Update the quote request items with new price
        const updatedItems = quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
            ...item,
            quoted_price: item.id === selectedItemForMarkup.id ? newPrice : item.quoted_price
        }))

        // Update the query cache
        queryClient.setQueryData(['quote-request', params.id], {
            ...quoteRequest,
            quote_request_items: updatedItems
        })

        setOpenMarkupDialog(false)
        setSelectedItemForMarkup(null)
        toast.success('Price updated successfully')
    }

    const handleBulkPricingSet = async () => {
        if (!bulkPricingValue || isNaN(parseFloat(bulkPricingValue))) {
            setBulkPricingError('Please enter a valid value')
            return
        }

        const value = parseFloat(bulkPricingValue)
        if (value < 0) {
            setBulkPricingError('Value cannot be negative')
            return
        }

        setBulkPricingError('')
        setIsSavingPricing(true)

        try {
            let updatedItems = [...quoteRequest.quote_request_items]

            if (bulkPricingMode === 'fixed') {
                updatedItems = updatedItems.map((item: QuoteRequestItem) => ({
                    ...item,
                    quoted_price: filteredQuoteItems.some((fp: QuoteRequestItem) => fp.id === item.id) ? value : item.quoted_price
                }))
            } else if (bulkPricingMode === 'markup') {
                updatedItems = updatedItems.map((item: QuoteRequestItem) => {
                    if (filteredQuoteItems.some((fp: QuoteRequestItem) => fp.id === item.id)) {
                        const basePrice = item.product?.default_price || 0
                        const newPrice = calculateMarkupPrice(basePrice, value)
                        return { ...item, quoted_price: newPrice }
                    }
                    return item
                })
            } else if (bulkPricingMode === 'markup-current') {
                updatedItems = updatedItems.map((item: QuoteRequestItem) => {
                    if (filteredQuoteItems.some((fp: QuoteRequestItem) => fp.id === item.id)) {
                        const currentPrice = item.quoted_price || item.product?.default_price || 0
                        const newPrice = calculateMarkupPrice(currentPrice, value)
                        return { ...item, quoted_price: newPrice }
                    }
                    return item
                })
            }

            // Update the query cache
            queryClient.setQueryData(['quote-request', params.id], {
                ...quoteRequest,
                quote_request_items: updatedItems
            })

            toast.success(`Updated ${filteredQuoteItems.length} items`)
            setOpenBulkPricingDialog(false)
            setBulkPricingValue('')
        } catch (error) {
            console.error('Error updating prices:', error)
            toast.error('Failed to update prices')
        } finally {
            setIsSavingPricing(false)
        }
    }

    const saveAllPricing = async () => {
        setIsSavingPricing(true)
       const response = await updateQuoteOrderItemsPrice({
        QuoteRequestItems: quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
            id: item.id,
            quote_request_id: quoteRequest.id,
            product_id: item.product_id,
            quoted_price: item.quoted_price
        }))
       })

        if (response instanceof Error) {
            toast.error('Failed to update prices', {
                description: response.message
            })
        } else {
            toast.success('Prices updated successfully')
        }
        setIsSavingPricing(false)
    }

    const updateItemPrice = (itemId: string, newPrice: number) => {
        const updatedItems = quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
            ...item,
            quoted_price: item.id === itemId ? newPrice : item.quoted_price
        }))

        // Update the query cache
        queryClient.setQueryData(['quote-request', params.id], {
            ...quoteRequest,
            quote_request_items: updatedItems
        })
    }

    const resetToOriginalPrices = () => {
        const updatedItems = quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
            ...item,
            quoted_price: originalPrices[item.id] || item.product?.default_price || 0
        }))

        // Update the query cache
        queryClient.setQueryData(['quote-request', params.id], {
            ...quoteRequest,
            quote_request_items: updatedItems
        })

        toast.success('Prices reset to original values')
    }

    // Debug function to log current state
    const debugPricingState = () => {
        console.log('=== PRICING DEBUG ===')
        console.log('hasUnsavedChanges:', hasUnsavedChanges)
        console.log('originalPrices:', originalPrices)
        console.log('current items:', quoteRequest?.quote_request_items.map((item: QuoteRequestItem) => ({
            id: item.id,
            name: item.product_name,
            quoted_price: item.quoted_price,
            default_price: item.product?.default_price,
            original_price: originalPrices[item.id]
        })))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Loading quote request...</div>
            </div>
        )
    }

    if (!quoteRequest) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg text-muted-foreground">Quote request not found</div>
            </div>
        )
    }

    return (
        <div className="max-w8xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.back()}
                        className="flex items-center space-x-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Quote Request #{quoteRequest.id}</h1>
                        <p className="text-muted-foreground">Created {formatDate(quoteRequest.created_at)}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    {/* {getStatusBadge(quoteRequest.status)} */}
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                            if (confirm('Are you sure you want to delete this quote request?')) {
                                try {
                                    const response = await fetch(`/api/quote-requests/${quoteRequest.id}`, {
                                        method: 'DELETE',
                                    })
                                    if (response.ok) {
                                        toast.success('Quote request deleted')
                                        router.back()
                                    } else {
                                        toast.error('Failed to delete quote request')
                                    }
                                } catch (error) {
                                    console.error('Error deleting quote request:', error)
                                    toast.error('Failed to delete quote request')
                                }
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Main Content */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <div className=' grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <Card className='col-span-2'>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Customer Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{quoteRequest.customer_name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{quoteRequest.customer_email}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{quoteRequest.customer_phone}</span>
                                    </div>
                                    {quoteRequest.customer_company && (
                                        <div className="flex items-center space-x-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{quoteRequest.customer_company}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{formatDate(quoteRequest.created_at)}</span>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <div className='text-sm font-medium'>Notes:</div>
                                    {quoteRequest.customer_message && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm">{quoteRequest.customer_message}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Addresses */}
                        {/* Address Information */}
                        <Card className='col-span-1'>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPin className="h-5 w-5" />
                                    <span>Address Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Shipping Address */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-foreground">Shipping address</h4>
                                            <button
                                                onClick={() => startEditingAddress('shipping')}
                                                className="p-1 hover:bg-muted rounded transition-colors"
                                            >
                                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>

                                        {editingAddress === 'shipping' ? (
                                            <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                                                <Input
                                                    placeholder="Full Name"
                                                    value={addressForm.name}
                                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                                />
                                                <Input
                                                    placeholder="Address Line 1"
                                                    value={addressForm.address_line_1}
                                                    onChange={(e) => setAddressForm({ ...addressForm, address_line_1: e.target.value })}
                                                />
                                                <Input
                                                    placeholder="Address Line 2 (Optional)"
                                                    value={addressForm.address_line_2}
                                                    onChange={(e) => setAddressForm({ ...addressForm, address_line_2: e.target.value })}
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="City"
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="State"
                                                        value={addressForm.state}
                                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="ZIP Code"
                                                        value={addressForm.zip_code}
                                                        onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="Country"
                                                        value={addressForm.country}
                                                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    />
                                                </div>
                                                <Input
                                                    placeholder="Phone Number"
                                                    value={addressForm.phone}
                                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                />
                                                <div className="flex space-x-2">
                                                    <Button onClick={saveAddress} size="sm">
                                                        Save
                                                    </Button>
                                                    <Button onClick={cancelEditing} variant="outline" size="sm">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {quoteRequest.shipping_address ? (
                                                    <>
                                                        <div className="text-sm space-y-1">
                                                            <div className="font-medium">{quoteRequest.shipping_address.name}</div>
                                                            <div>{quoteRequest.shipping_address.address_line_1}</div>
                                                            {quoteRequest.shipping_address.address_line_2 && (
                                                                <div>{quoteRequest.shipping_address.address_line_2}</div>
                                                            )}
                                                            <div>{quoteRequest.shipping_address.city}, {quoteRequest.shipping_address.state} {quoteRequest.shipping_address.zip_code}</div>
                                                            <div>{quoteRequest.shipping_address.country}</div>
                                                            <div>{quoteRequest.shipping_address.phone}</div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => copyToClipboard(formatAddress(quoteRequest.shipping_address!))}
                                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                                <span>Copy address</span>
                                                            </button>
                                                            <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>View map</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground italic">
                                                        No shipping address provided
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Billing Address */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-foreground">Billing address</h4>
                                            <button
                                                onClick={() => startEditingAddress('billing')}
                                                className="p-1 hover:bg-muted rounded transition-colors"
                                            >
                                                <Edit3 className="h-4 w-4 text-muted-foreground" />
                                            </button>
                                        </div>

                                        {editingAddress === 'billing' ? (
                                            <div className="space-y-3 p-4 border rounded-lg bg-muted/20">
                                                <Input
                                                    placeholder="Full Name"
                                                    value={addressForm.name}
                                                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                                                />
                                                <Input
                                                    placeholder="Address Line 1"
                                                    value={addressForm.address_line_1}
                                                    onChange={(e) => setAddressForm({ ...addressForm, address_line_1: e.target.value })}
                                                />
                                                <Input
                                                    placeholder="Address Line 2 (Optional)"
                                                    value={addressForm.address_line_2}
                                                    onChange={(e) => setAddressForm({ ...addressForm, address_line_2: e.target.value })}
                                                />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="City"
                                                        value={addressForm.city}
                                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="State"
                                                        value={addressForm.state}
                                                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input
                                                        placeholder="ZIP Code"
                                                        value={addressForm.zip_code}
                                                        onChange={(e) => setAddressForm({ ...addressForm, zip_code: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="Country"
                                                        value={addressForm.country}
                                                        onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                                                    />
                                                </div>
                                                <Input
                                                    placeholder="Phone Number"
                                                    value={addressForm.phone}
                                                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                                                />
                                                <div className="flex space-x-2">
                                                    <Button onClick={saveAddress} size="sm">
                                                        Save
                                                    </Button>
                                                    <Button onClick={cancelEditing} variant="outline" size="sm">
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {quoteRequest.billing_address ? (
                                                    <>
                                                        <div className="text-sm space-y-1">
                                                            <div className="font-medium">{quoteRequest.billing_address.name}</div>
                                                            <div>{quoteRequest.billing_address.address_line_1}</div>
                                                            {quoteRequest.billing_address.address_line_2 && (
                                                                <div>{quoteRequest.billing_address.address_line_2}</div>
                                                            )}
                                                            <div>{quoteRequest.billing_address.city}, {quoteRequest.billing_address.state} {quoteRequest.billing_address.zip_code}</div>
                                                            <div>{quoteRequest.billing_address.country}</div>
                                                            <div>{quoteRequest.billing_address.phone}</div>
                                                        </div>
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => copyToClipboard(formatAddress(quoteRequest.billing_address!))}
                                                                className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                                                            >
                                                                <Copy className="h-3 w-3" />
                                                                <span>Copy address</span>
                                                            </button>
                                                            <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>View map</span>
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-sm text-muted-foreground italic">
                                                        No billing address provided
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Agent Assignment */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5" />
                                <span>Admin Assignment</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {quoteRequest.profiles ? (
                                <div className="bg-muted/40 rounded-lg p-4">
                                    <h4 className="font-semibold text-foreground mb-3">Currently Assigned Admin</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm font-medium">
                                                {quoteRequest.profiles.first_name} {quoteRequest.profiles.last_name}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{quoteRequest.profiles.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{quoteRequest.profiles.phone_number || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleRemoveAssignment}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Remove Assignment
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        No agent is currently assigned to this quote request.
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <select
                                            value={selectedAgentId}
                                            onChange={(e) => setSelectedAgentId(e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">Select an agent...</option>
                                            {adminProfiles?.map((agent) => (
                                                <option key={agent.id} value={agent.id}>
                                                    {agent.first_name} {agent.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            onClick={handleAssignAdmin}
                                            disabled={!selectedAgentId || isAssigning}
                                            className="bg-purple-600 hover:bg-purple-700 text-white"
                                        >
                                            {isAssigning ? 'Assigning...' : 'Assign Admin'}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Requested Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Package className="h-5 w-5" />
                                    <span>Requested Items & Pricing</span>
                                </div>
                                {hasUnsavedChanges && (
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-orange-600 border-orange-600">
                                            <Zap className="h-3 w-3 mr-1" />
                                            Draft Mode
                                        </Badge>
                                    </div>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Search and Bulk Actions */}
                            <div className="flex gap-4 mb-6 w-full">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder="Search items..."
                                        value={pricingSearchTerm}
                                        onChange={(e) => setPricingSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => setOpenBulkPricingDialog(true)}
                                    disabled={filteredQuoteItems.length === 0}
                                >
                                    Bulk Set Pricing ({filteredQuoteItems.length} items)
                                </Button>
                            </div>

                            {/* Tags Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-foreground mb-3">Filter by Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {pricingTags.map((tag) => (
                                        <Button
                                            key={tag}
                                            variant={selectedPricingTags.includes(tag) ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => handlePricingTagToggle(tag)}
                                            className="text-xs"
                                        >
                                            <Tag className="h-3 w-3 mr-1" />
                                            {tag}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h4 className="text-sm font-medium text-foreground mb-3">Price Range</h4>
                                <div className="flex gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Min:</span>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={pricingPriceRange.min}
                                            onChange={(e) => setPricingPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                            className="w-24"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Max:</span>
                                        <Input
                                            type="number"
                                            placeholder="999.99"
                                            value={pricingPriceRange.max}
                                            onChange={(e) => setPricingPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                            className="w-24"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Filter Summary and Clear */}
                            <div className="flex items-center justify-between pt-2 border-t border-border mb-6">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        {filteredQuoteItems.length} of {quoteRequest.quote_request_items.length} items
                                    </span>
                                    {hasPricingFilters && (
                                        <Badge variant="secondary" className="text-xs">
                                            Filtered
                                        </Badge>
                                    )}
                                </div>
                                {hasPricingFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearPricingFilters}
                                        className="text-xs"
                                    >
                                        Clear All Filters
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {filteredQuoteItems.map((item: QuoteRequestItem) => {
                                    const currentPrice = item.quoted_price || item.product?.default_price || 0
                                    const purchaseCost = item.product?.default_price || 0
                                    const markup = purchaseCost > 0 ? ((currentPrice - purchaseCost) / purchaseCost * 100) : 0
                                    const originalPrice = originalPrices[item.id] || 0
                                    const hasPriceChanged = Math.abs(currentPrice - originalPrice) > 0.01

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
                                                    <h3 className="font-medium">{item.product?.name || item.product_name}</h3>
                                                    {item.product?.description && (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            {item.product.description.slice(0, 100)}...
                                                        </p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-2">
                                                        <span className="text-sm text-muted-foreground">
                                                            Quantity: {item.quantity}
                                                        </span>
                                                        {item.product?.default_price && (
                                                            <span className="text-sm text-muted-foreground">
                                                                Purchase Price: ${item.product.default_price.toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {item.notes && (
                                                        <p className="text-sm text-muted-foreground mt-2">
                                                            <strong>Notes:</strong> {item.notes}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-end space-y-2">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm text-muted-foreground">$</span>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={currentPrice}
                                                            onChange={(e) => {
                                                                const newPrice = parseFloat(e.target.value) || 0
                                                                updateItemPrice(item.id, newPrice)
                                                            }}
                                                            className={`w-24 ${hasPriceChanged ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : ''}`}
                                                            placeholder="0.00"
                                                        />
                                                        {hasPriceChanged && (
                                                            <div className="flex flex-col items-center text-xs">
                                                                <span className="text-orange-600 font-medium">
                                                                    {currentPrice > originalPrice ? '+' : ''}${(currentPrice - originalPrice).toFixed(2)}
                                                                </span>
                                                                <span className="text-muted-foreground">
                                                                    {originalPrice.toFixed(2)}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => openMarkupCalculator(item)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Tag className="h-4 w-4" />
                                                        Markup
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Purchase Cost and Markup Section */}
                                            <div className="flex items-center justify-between bg-muted/50 rounded-lg p-3 mt-3">
                                                <div className="flex items-center space-x-4">
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Purchase Cost:</span>
                                                        <span className="ml-2 font-medium text-foreground">${purchaseCost.toFixed(2)}</span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Current Markup:</span>
                                                        <span className={`ml-2 font-medium ${markup > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                            {markup.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className="text-muted-foreground">Total Value:</span>
                                                        <span className="ml-2 font-medium text-foreground">${(currentPrice * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div>
                                <div className="flex items-center justify-end mt-4">
                                    <span className="text-sm text-muted-foreground mr-2">Total Value:</span>
                                    <span className="text-lg font-semibold text-foreground">
                                        ${getTotalValue().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <div className="text-sm text-muted-foreground">
                                        {filteredQuoteItems.length} of {quoteRequest.quote_request_items.length} items priced
                                        {hasUnsavedChanges && (
                                            <span className="ml-2 text-orange-600 font-medium">
                                                • {quoteRequest.quote_request_items.filter((item: QuoteRequestItem) => {
                                                    const currentPrice = item.quoted_price || item.product?.default_price || 0
                                                    const originalPrice = originalPrices[item.id] || 0
                                                    return Math.abs(currentPrice - originalPrice) > 0.01
                                                }).length} items modified
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={clearPricingFilters} disabled={isSavingPricing}>
                                            Clear Filters
                                        </Button>
                                        {/* <Button variant="outline" onClick={debugPricingState} size="sm">
                                            Debug
                                        </Button> */}
                                        {hasUnsavedChanges && (
                                            <Button variant="outline" onClick={resetToOriginalPrices} disabled={isSavingPricing}>
                                                Reset Prices
                                            </Button>
                                        )}
                                        {hasUnsavedChanges && (
                                            // <Button onClick={saveAllPricing} disabled={isSavingPricing}>
                                            //     {isSavingPricing ? (
                                            //         <>
                                            //             <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            //             Saving...
                                            //         </>
                                            //     ) : (
                                            //         "Save All Prices"
                                            //     )}
                                            // </Button>
                                            <Button
                                                size="sm"
                                                onClick={saveAllPricing}
                                                disabled={isSavingPricing}
                                                className="bg-orange-600 hover:bg-orange-700"
                                            >
                                                {isSavingPricing ? (
                                                    <>
                                                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="h-3 w-3 mr-1" />
                                                        Save Changes
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline/Audit Log */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Comment Input */}
                            <div className="mb-6">
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center text-white text-sm font-medium">
                                        TS
                                    </div>
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Leave a comment..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            className="min-h-[80px]"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center space-x-2">
                                                <button className="p-1 hover:bg-muted rounded">
                                                    <Smile className="h-4 w-4" />
                                                </button>
                                                <button className="p-1 hover:bg-muted rounded">
                                                    <AtSign className="h-4 w-4" />
                                                </button>
                                                <button className="p-1 hover:bg-muted rounded">
                                                    <Hash className="h-4 w-4" />
                                                </button>
                                                <button className="p-1 hover:bg-muted rounded">
                                                    <Paperclip className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={handlePostComment}
                                                disabled={!comment.trim()}
                                            >
                                                <Send className="h-4 w-4 mr-2" />
                                                Post
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Only you and other staff can see comments
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Events */}
                            <div className="space-y-4">
                                {auditLog.map((entry, index) => (
                                    <div key={entry.id} className="relative">
                                        {/* Timeline line */}
                                        {index < auditLog.length - 1 && (
                                            <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />
                                        )}

                                        <div className="flex items-start space-x-3">
                                            {/* Timeline dot */}
                                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-gray-600 dark:bg-gray-400 rounded-full" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                            {entry.user}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {entry.action}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatTime(entry.timestamp)}
                                                    </span>
                                                </div>

                                                {/* Special handling for email events */}
                                                {entry.type === 'email_sent' && (
                                                    <button className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                                        View email
                                                    </button>
                                                )}

                                                {/* Expandable details for certain events */}
                                                {(entry.type === 'payment' || entry.type === 'order_action') && (
                                                    <button className="mt-1 text-xs text-muted-foreground hover:text-foreground">
                                                        ▼
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Bulk Pricing Dialog */}
            <Dialog open={openBulkPricingDialog} onOpenChange={setOpenBulkPricingDialog}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-primary" />
                            Bulk Set Pricing
                        </DialogTitle>
                        <DialogDescription>
                            Set pricing for all {filteredQuoteItems.length} visible items
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Mode Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Pricing Mode
                            </label>
                            <div className="flex space-x-2">
                                <Button
                                    variant={bulkPricingMode === 'fixed' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPricingMode('fixed')}
                                >
                                    Fixed Price
                                </Button>
                                <Button
                                    variant={bulkPricingMode === 'markup' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPricingMode('markup')}
                                >
                                    Markup from Cost
                                </Button>
                                <Button
                                    variant={bulkPricingMode === 'markup-current' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setBulkPricingMode('markup-current')}
                                >
                                    Markup from Current
                                </Button>
                            </div>
                        </div>

                        {/* Fixed Price Mode */}
                        {bulkPricingMode === 'fixed' && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Price per Item
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={bulkPricingValue}
                                    onChange={(e) => {
                                        setBulkPricingValue(e.target.value)
                                        setBulkPricingError('')
                                    }}
                                    placeholder="0.00"
                                    className={bulkPricingError ? 'border-red-500' : ''}
                                />
                                {bulkPricingError && (
                                    <p className="text-sm text-red-500 mt-1">{bulkPricingError}</p>
                                )}
                            </div>
                        )}

                        {/* Markup Mode */}
                        {(bulkPricingMode === 'markup' || bulkPricingMode === 'markup-current') && (
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Markup Percentage
                                </label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        step="0.1"
                                        value={bulkPricingValue}
                                        onChange={(e) => {
                                            setBulkPricingValue(e.target.value)
                                            setBulkPricingError('')
                                        }}
                                        placeholder="20"
                                        className="flex-1"
                                    />
                                    <span className="text-sm text-muted-foreground">%</span>
                                </div>
                                <div className="flex space-x-2 mt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBulkPricingValue('10')}
                                    >
                                        10%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBulkPricingValue('20')}
                                    >
                                        20%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBulkPricingValue('50')}
                                    >
                                        50%
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setBulkPricingValue('100')}
                                    >
                                        100%
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {bulkPricingMode === 'markup'
                                        ? 'Markup will be applied to each item\'s purchase cost'
                                        : 'Markup will be applied to each item\'s current quoted price'
                                    }
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setOpenBulkPricingDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBulkPricingSet}
                            disabled={!bulkPricingValue || !!bulkPricingError || isSavingPricing}
                        >
                            {isSavingPricing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Applying...
                                </>
                            ) : (
                                `Apply to ${filteredQuoteItems.length} Items`
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Markup Calculator Dialog */}
            <Dialog open={openMarkupDialog} onOpenChange={setOpenMarkupDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            Markup Calculator
                        </DialogTitle>
                        <DialogDescription>
                            Calculate sale price based on purchase cost for {selectedItemForMarkup?.product_name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Product Info */}
                        {selectedItemForMarkup && (
                            <div className="bg-muted/50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    {selectedItemForMarkup.product?.imageSrc && (
                                        <img
                                            src={selectedItemForMarkup.product.imageSrc}
                                            alt={selectedItemForMarkup.product_name}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <h4 className="font-medium text-foreground">{selectedItemForMarkup.product_name}</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Purchase Cost: <span className="font-medium">${selectedItemForMarkup.product?.default_price?.toFixed(2) || '0.00'}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Markup Percentage */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Markup Percentage
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={markupPercentage}
                                    onChange={(e) => {
                                        setMarkupPercentage(e.target.value)
                                        if (e.target.value && selectedItemForMarkup) {
                                            const percentage = parseFloat(e.target.value)
                                            const newPrice = calculateMarkupPrice(selectedItemForMarkup.product?.default_price || 0, percentage)
                                            setMarkupMultiplier((newPrice / (selectedItemForMarkup.product?.default_price || 1)).toFixed(2))
                                        }
                                    }}
                                    placeholder="20"
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">%</span>
                            </div>
                            {markupPercentage && selectedItemForMarkup && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale Price: <span className="font-medium text-green-600">
                                        ${calculateMarkupPrice(selectedItemForMarkup.product?.default_price || 0, parseFloat(markupPercentage)).toFixed(2)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Markup Multiplier */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Markup Multiplier
                            </label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={markupMultiplier}
                                    onChange={(e) => {
                                        setMarkupMultiplier(e.target.value)
                                        if (e.target.value && selectedItemForMarkup) {
                                            const multiplier = parseFloat(e.target.value)
                                            const newPrice = calculateMultiplierPrice(selectedItemForMarkup.product?.default_price || 0, multiplier)
                                            setMarkupPercentage(((newPrice - (selectedItemForMarkup.product?.default_price || 0)) / (selectedItemForMarkup.product?.default_price || 1) * 100).toFixed(1))
                                        }
                                    }}
                                    placeholder="1.2"
                                    className="flex-1"
                                />
                                <span className="text-sm text-muted-foreground">×</span>
                            </div>
                            {markupMultiplier && selectedItemForMarkup && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale Price: <span className="font-medium text-green-600">
                                        ${calculateMultiplierPrice(selectedItemForMarkup.product?.default_price || 0, parseFloat(markupMultiplier)).toFixed(2)}
                                    </span>
                                </p>
                            )}
                        </div>

                        {/* Quick Markup Buttons */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-2">
                                Quick Markup Options
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('10')
                                        setMarkupMultiplier('1.1')
                                    }}
                                >
                                    10% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('20')
                                        setMarkupMultiplier('1.2')
                                    }}
                                >
                                    20% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('50')
                                        setMarkupMultiplier('1.5')
                                    }}
                                >
                                    50% Markup
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setMarkupPercentage('100')
                                        setMarkupMultiplier('2.0')
                                    }}
                                >
                                    2× Price
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setOpenMarkupDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={applyMarkupPrice}>
                            Apply Markup
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 