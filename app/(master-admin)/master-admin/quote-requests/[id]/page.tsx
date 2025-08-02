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
    User,
    Search,
    Tag,
    Filter,
    Loader2,
    Zap,
    Trash2,
    MessageSquare,
    AtSign,
    Smile,
    Hash,
    Paperclip,
    Send,
    MapPin,
    Edit3,
    CheckCircle,
    LockOpen,
    Truck,
    Clock,
    Copy,
    Printer
} from 'lucide-react'
import { sendPriceUpdateEmail } from '@/utils/emails/actions/send-email'
import { toast } from 'sonner'
import { GetQuoteInfo } from '../../actions/get-quote-info'
import { useQueryClient, useSuspenseQuery, useQuery } from '@tanstack/react-query'
import { GetAdminProfiles } from '../../actions/order-actions/get-admin-profiles'
import { AssignAdmin } from './actions/assign-admin'
import { updateQuoteOrderItemsPrice } from './actions/update-quote-order-items-price'
import { saveShippingAddress } from './actions/save-shipping-address'
import { saveBillingAddress } from './actions/save-billing-address'
import { approveQuote, updateQuoteOrder } from './actions/approve-quote'
import AddressDisplay from '@/components/AddressDisplay'
import AddressEditModal from '@/components/AddressEditModal'
import ApproveOrderModal from '@/components/ApproveOrderModal'
import QuoteNotes from './components/QuoteNotes'
import { sendQuoteApprovalEmail } from '@/utils/emails/actions/send-email'
import { useProfile } from '@/lib/hooks/useProfile'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { updateFulfillmentType } from './actions/update-fulfillment-type'
import { getAuditLog } from './actions/get-audit-log'
import { getEmail } from './actions/get-email'
import { ResendEmail } from './actions/resend-email'
import { PriceUpdateEmail } from '@/utils/emails/PriceUpdateEmail'
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

interface QuoteAuditLogEntry {
    id: string
    quote_request_id: string
    event_type: 'PAYMENT_PROCESSED' | 'NOTE_ADDED' | 'EMAIL_SENT' | 'SYSTEM_ACTION'
    user_id: string
    user_name: string
    message: string
    details: {
        PAYMENT_PROCESSED?: {
            amount: number
            currency: string
            gateway: string
            status: string
            type: string
            payment_id: string
        }
        NOTE_ADDED?: {
            note_text: string
        }
        EMAIL_SENT?: {
            sent_email_id: string
            recipient_email: string
        }
        SYSTEM_ACTION?: {
            action_type: string
            action_details: string
        }
    }
    created_at: string
}

export default function QuoteRequestDetailPage({ params }: { params: { id: string } }) {
    const queryClient = useQueryClient()
    const { data: quoteRequest, isLoading, isError, refetch, isFetching } = useSuspenseQuery({
        queryKey: ['quote-request', params.id],
        queryFn: () => GetQuoteInfo(params.id),
    })
    const { data: adminProfiles, isLoading: adminProfilesLoading, refetch: refetchAdminProfiles } = useQuery({
        queryKey: ['admin-profiles'],
        queryFn: GetAdminProfiles,
    });
    const { data: auditLog, isLoading: auditLogLoading, error: auditLogError, refetch: refetchAuditLog } = useQuery({
        queryKey: ['audit-log', params.id],
        queryFn: () => getAuditLog(params.id)
    })

    const { profile } = useProfile()
    const router = useRouter()
    const [comment, setComment] = useState('')
    const [selectedAgentId, setSelectedAgentId] = useState<string>('')
    const [isAssigning, setIsAssigning] = useState(false)
    const [expandedLogEntries, setExpandedLogEntries] = useState<Set<string>>(new Set())


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
    const [markupMode, setMarkupMode] = useState<'cost' | 'current'>('cost')
    const [isSavingPricing, setIsSavingPricing] = useState(false)
    const [itemPricing, setItemPricing] = useState<any>(null)
    const [originalPrices, setOriginalPrices] = useState<Record<string, number>>({})
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
    const [showApprovedOrderDialog, setShowApprovedOrderDialog] = useState(false)
    // Address editing states
    const [addressModalOpen, setAddressModalOpen] = useState(false)
    const [editingAddressType, setEditingAddressType] = useState<'shipping' | 'billing'>('shipping')
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    // Approve order states
    const [approveModalOpen, setApproveModalOpen] = useState(false)
    const [voidOrderModalOpen, setVoidOrderModalOpen] = useState(false)

    // Fulfillment type state
    const [fulfillmentType, setFulfillmentType] = useState<'delivery' | 'pickup'>(quoteRequest?.order_fulfillment_type || 'delivery')
    const [fulfillmentTypeModalOpen, setFulfillmentTypeModalOpen] = useState(false)
    const [pendingFulfillmentType, setPendingFulfillmentType] = useState<'delivery' | 'pickup'>('delivery')
    const [isUpdatingFulfillmentType, setIsUpdatingFulfillmentType] = useState(false)
    const [emailModalOpen, setEmailModalOpen] = useState(false)
    const [emailTo, setEmailTo] = useState<string>('')
    const [emailSubject, setEmailSubject] = useState<string>('')
    const [emailContent, setEmailContent] = useState<string>('')
    const [isLoadingEmail, setIsLoadingEmail] = useState(false)
    const [currentEmailId, setCurrentEmailId] = useState<string>('')
    const [isResendingEmail, setIsResendingEmail] = useState(false)
    const [resendEmailModalOpen, setResendEmailModalOpen] = useState(false)

    // Track original prices and detect changes
    useEffect(() => {
        if (quoteRequest?.quote_request_items && Object.keys(originalPrices).length === 0) {
            const original = quoteRequest.quote_request_items.reduce((acc: Record<string, number>, item: QuoteRequestItem) => {
                // Use the actual quoted_price from database, or default_price if no quoted_price exists
                acc[item.id] = item.quoted_price !== undefined ? item.quoted_price : (item.product?.default_price || 0)
                return acc
            }, {} as Record<string, number>)
            setOriginalPrices(original)
            // console.log('Setting original prices:', original)
        }
    }, [quoteRequest?.quote_request_items, originalPrices, isFetching])

    // Check for unsaved changes
    useEffect(() => {
        if (quoteRequest?.quote_request_items && Object.keys(originalPrices).length > 0) {
            const hasChanges = quoteRequest.quote_request_items.some((item: QuoteRequestItem) => {
                const currentPrice = item.quoted_price || item.product?.default_price || 0
                const originalPrice = originalPrices[item.id] || 0
                return Math.abs(currentPrice - originalPrice) > 0.01 // Account for floating point precision
            })
            setHasUnsavedChanges(hasChanges)
            // console.log('hasUnsavedChanges', hasChanges, 'originalPrices', originalPrices)
        } else {
            setHasUnsavedChanges(false)
        }
    }, [quoteRequest?.quote_request_items, originalPrices, isFetching])

    const handleRefresh = async () => {
        await queryClient.invalidateQueries({ queryKey: ['quote-request', params.id] })
    }
    // TODO: Add comment to audit log
    const handlePostComment = () => {

    }

    const getStatusBadge = (status: QuoteRequest['status']) => {

        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: 'Pending' },
            approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: 'Quoted' },
            closed: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', label: 'Closed' },
            rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: 'Rejected' },
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
        if (!quoteRequest || !quoteRequest.quote_request_items) return 0
        return quoteRequest.quote_request_items.reduce((total: number, item: QuoteRequestItem) => {
            const price = item?.quoted_price || item.product?.default_price || 0
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
            refetch()
            refetchAdminProfiles()
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

    const startEditingAddress = (type: 'shipping' | 'billing') => {
        setEditingAddressType(type)
        setAddressModalOpen(true)
    }

    const saveAddress = async (address: any) => {
        setIsSavingAddress(true)
        let result
        if (editingAddressType === 'shipping') {
            result = await saveShippingAddress(quoteRequest.id, address)
        } else {
            result = await saveBillingAddress(quoteRequest.id, address)
        }

        if (result instanceof Error) {
            toast.error('Failed to save address', {
                description: result.message
            })
        } else {
            toast.success('Address saved successfully')
            await refetch()
            setAddressModalOpen(false)
        }
        setIsSavingAddress(false)
    }

    const handleApproveOrder = async () => {
        const approved_info = {
            approved_date: new Date().toISOString(),
            approved_by: quoteRequest.profiles?.first_name + ' ' + quoteRequest.profiles?.last_name,
            approved_profile_id: profile?.id
        }
        const approveResult = await approveQuote({
            quote_order_id: quoteRequest.id,
            approved_info: approved_info,
            updated_at: new Date().toISOString()
        })
        if (approveResult instanceof Error) {
            toast.error('Failed to approve order', {
                description: approveResult.message
            })
            return
        }
        const result = await sendQuoteApprovalEmail({
            customerEmail: quoteRequest.customer_email,
            customerName: `${quoteRequest.customer_name} ${quoteRequest.customer_last_name}`,
            quoteId: quoteRequest.id,
            orderId: quoteRequest.order_confirmation_number,
            checkoutLink: `https://mtechdistributors.com/quote-requests/${quoteRequest.id}`,
            items: quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
                product: item.product,
                quantity: item.quantity,
                notes: item.notes,
                price: item.quoted_price
            }))
        })
        if (result instanceof Error) {
            toast.error('Failed to approve order', {
                description: result.message
            })
            await updateQuoteOrder({
                quote_order_id: quoteRequest.id,
                status: 'pending'
            })
            await refetch()
            return
        }
        else {
            toast.success('Order approved successfully', {
                description: 'The customer will be notified via email.'
            })
            await refetch()
            setApproveModalOpen(false)
        }
    }

    const handleVoidOrder = async () => {
        try {
            // Update the quote request status to 'closed'
            const response = await fetch(`/api/quote-requests/${quoteRequest.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'closed' }),
            })

            if (response.ok) {
                // Update the query cache
                queryClient.setQueryData(['quote-request', params.id], {
                    ...quoteRequest,
                    status: 'closed'
                })
                toast.success('Order has been closed successfully')
                setVoidOrderModalOpen(false)

                // Add to audit log // TODO: Add comment to audit log


            } else {
                throw new Error('Failed to close order')
            }
        } catch (error) {
            console.error('Error closing order:', error)
            toast.error('Failed to close order')
        }
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

    const filteredQuoteItems = quoteRequest?.quote_request_items?.filter((item: QuoteRequestItem) => {
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
    }) || []

    const openMarkupCalculator = (item: QuoteRequestItem) => {
        setSelectedItemForMarkup(item)
        setOpenMarkupDialog(true)
    }

    const applyMarkupPrice = () => {
        if (!selectedItemForMarkup) return

        const basePrice = markupMode === 'cost'
            ? (selectedItemForMarkup.product?.default_price || 0)
            : (selectedItemForMarkup.quoted_price || selectedItemForMarkup.product?.default_price || 0)

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
                    quoted_price: filteredQuoteItems((fp: QuoteRequestItem) => fp.id === item.id) ? value : item.quoted_price
                }))
            } else if (bulkPricingMode === 'markup') {
                updatedItems = updatedItems.map((item: QuoteRequestItem) => {
                    if (filteredQuoteItems?.some((fp: QuoteRequestItem) => fp.id === item.id)) {
                        const basePrice = item.product?.default_price || 0
                        const newPrice = calculateMarkupPrice(basePrice, value)
                        return { ...item, quoted_price: newPrice }
                    }
                    return item
                })
            } else if (bulkPricingMode === 'markup-current') {
                updatedItems = updatedItems.map((item: QuoteRequestItem) => {
                    if (filteredQuoteItems?.some((fp: QuoteRequestItem) => fp.id === item.id)) {
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

            toast.success(`Updated ${filteredQuoteItems?.length} items`)
            setOpenBulkPricingDialog(false)
            setBulkPricingValue('')
        } catch (error) {
            console.error('Error updating prices:', error)
            toast.error('Failed to update prices')
        } finally {
            setIsSavingPricing(false)
        }
    }

    const performSavePricing = async () => {
        setIsSavingPricing(true)

        try {
            // Get items that have price changes
            const changedItems = quoteRequest.quote_request_items.filter((item: QuoteRequestItem) => {
                const currentPrice = item.quoted_price || item.product?.default_price || 0
                const originalPrice = originalPrices[item.id] || 0
                return Math.abs(currentPrice - originalPrice) > 0.01
            })

            const NewQuoteRequestItems = quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
                id: item.id,
                quote_request_id: quoteRequest.id,
                product_id: item.product_id,
                quoted_price: item.quoted_price
            }))

            const response = await updateQuoteOrderItemsPrice({
                QuoteRequestItems: NewQuoteRequestItems
            })

            if (response instanceof Error) {
                toast.error('Failed to update prices', {
                    description: response.message
                })
                return
            }

            // If there are changed items and the order is approved, send email notification
            if (changedItems.length > 0 && quoteRequest.status === 'approved') {
                try {
                    await onSendPriceUpdateEmail(changedItems)
                    toast.success('Prices updated and customer notified successfully')
                } catch (emailError) {
                    console.error('Error sending price update email:', emailError)
                    toast.error('Prices updated but failed to notify customer', {
                        description: 'Please contact the customer manually'
                    })
                }
            } else {
                toast.success('Prices updated successfully')
            }

            setHasUnsavedChanges(false)
            setOriginalPrices({})
            setOriginalPrices(quoteRequest.quote_request_items.map((item: QuoteRequestItem) => ({
                id: item.id,
                price: item.quoted_price
            })))

            await refetch()
            await refetchAuditLog()
        } catch (error) {
            console.error('Error updating prices:', error)
            toast.error('Failed to update prices')
        } finally {
            setIsSavingPricing(false)
            setShowApprovedOrderDialog(false)
        }
    }

    const saveAllPricing = async () => {
        // Check if order is approved and show confirmation dialog
        if (quoteRequest.status === 'approved') {
            setShowApprovedOrderDialog(true)
            return
        }

        await performSavePricing()
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


    const getEventTypeDisplayText = (eventType: QuoteAuditLogEntry['event_type']) => {
        switch (eventType) {
            case 'NOTE_ADDED':
                return 'added a note'
            case 'EMAIL_SENT':
                return 'sent an email'
            case 'PAYMENT_PROCESSED':
                return 'processed payment'
            case 'SYSTEM_ACTION':
                return 'performed system action'
            default:
                return 'performed an action'
        }
    }

    const toggleLogEntryExpansion = (entryId: string) => {
        setExpandedLogEntries(prev => {
            const newSet = new Set(prev)
            if (newSet.has(entryId)) {
                newSet.delete(entryId)
            } else {
                newSet.add(entryId)
            }
            return newSet
        })
    }

    const handleFulfillmentTypeChange = (type: 'delivery' | 'pickup') => {
        setPendingFulfillmentType(type)
        setFulfillmentTypeModalOpen(true)
    }

    const confirmFulfillmentTypeChange = async () => {
        setIsUpdatingFulfillmentType(true)
        const response = await updateFulfillmentType(quoteRequest.id, pendingFulfillmentType)
        if (response instanceof Error) {
            toast.error('Failed to update fulfillment type', {
                description: response.message
            })
        } else {
            toast.success('Fulfillment type updated successfully')
            setFulfillmentType(pendingFulfillmentType)
            await refetch()
        }
        setIsUpdatingFulfillmentType(false)
        setFulfillmentTypeModalOpen(false)
    }

    const handleViewEmail = async (emailId: string) => {
        setIsLoadingEmail(true)
        setEmailModalOpen(true)
        setCurrentEmailId(emailId)

        try {
            const result = await getEmail(emailId)
            if (result instanceof Error) {
                toast.error('Failed to load email', {
                    description: result.message
                })
                setEmailContent('Failed to load email content')
            } else {
                setEmailTo(result.data?.to[0] || '')
                setEmailContent(result.data?.html || 'No email content available')
                setEmailSubject(result.data?.subject || 'No email subject available')
            }
        } catch (error) {
            console.error('Error loading email:', error)
            toast.error('Failed to load email')
            setEmailContent('Failed to load email content')
        } finally {
            setIsLoadingEmail(false)
        }
    }

    const handlePrintEmail = () => {
        const printWindow = window.open('', '_blank')
        if (printWindow) {
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Email Print</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        .email-header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
                        .email-content { line-height: 1.6; }
                    </style>
                </head>
                <body>
                    <div class="email-header">
                        <h2>Email Content</h2>
                        <p><strong>Email ID:</strong> ${currentEmailId}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="email-content">
                        ${emailContent}
                    </div>
                </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    const handleResendEmail = () => {
        setResendEmailModalOpen(true)
    }

    const confirmResendEmail = async () => {
        setIsResendingEmail(true)

        const response = await ResendEmail(emailTo, emailSubject, emailContent, quoteRequest.id, profile || {})
        if (response instanceof Error) {
            toast.error('Failed to resend email', {
                description: response.message
            })
            setIsResendingEmail(false)
        } else {
            toast.success('Email resent successfully')
            setResendEmailModalOpen(false)
            setIsResendingEmail(false)
            await refetchAuditLog()
        }
    }

    const onUpdateQuoteRequest = async () => {
        await refetch()
    }

    const onSendPriceUpdateEmail = async (changedItems: QuoteRequestItem[]) => {
        if (!quoteRequest || changedItems.length === 0) return

        try {
            // Create email content for price updates
            const emailSubject = `Price Update for Order #${quoteRequest.order_confirmation_number} - MTech Distributors`

            // Prepare data for the React Email component
            const emailData = {
                quoteRequestId: quoteRequest.id,
                customerName: `${quoteRequest.customer_name} ${quoteRequest.customer_last_name}`,
                customerEmail: quoteRequest.customer_email,
                order_confirmation_number: quoteRequest.order_confirmation_number,
                changedItems: changedItems.map(item => ({
                    id: item.id,
                    product_name: item.product_name,
                    product: item.product,
                    quantity: item.quantity,
                    quoted_price: item.quoted_price,
                    oldPrice: originalPrices[item.id] || item.product?.default_price || 0,
                    newPrice: item.quoted_price || item.product?.default_price || 0
                })),
                totalAmount: getTotalValue(),
                reviewLink: 'https://mtechdistributors.com/review-quote'
            }
            const response = await sendPriceUpdateEmail(emailData)
            if (response instanceof Error) {
                toast.error('Failed to send price update email', {
                    description: response.message
                })
                return
            }

            // Send the email using React Email component
           
        } catch (error) {
            console.error('Error sending price update email:', error)
            throw error
        }
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
                    {getStatusBadge(quoteRequest.status)}
                    <Button
                        onClick={() => {
                            if (!quoteRequest.admin_assigned) {
                                toast.error('Please assign an admin to the quote request before approving')
                                return
                            }
                            else {
                                setApproveModalOpen(true)
                            }
                        }}
                        disabled={quoteRequest.status === 'approved'}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        {quoteRequest.status === 'approved' ? 'Already Approved' : 'Approve Order'}
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"

                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reject Order
                    </Button>

                </div>
                {/* Void/Close Order Section */}
                <div className="flex items-center space-x-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                        onClick={() => setVoidOrderModalOpen(true)}
                        disabled={quoteRequest.status === 'voided' || quoteRequest.status === 'closed'}
                    >
                        <LockOpen className="h-4 w-4 mr-2" />
                        {quoteRequest.status === 'voided' || quoteRequest.status === 'closed'
                            ? 'Order Closed'
                            : 'Void/Close Order'}
                    </Button>
                </div>
            </div>

            <section className='flex items-center space-x-2 mt-2'>
                {/* Order Confirmation Number */}
                {quoteRequest.order_confirmation_number && (
                    <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs px-2 py-1">
                            Order Confirmation #: {quoteRequest.order_confirmation_number}
                        </Badge>
                    </div>
                )}

                {quoteRequest.status === 'approved' && (
                    <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-green-600 text-white">
                            Date of Quote: {quoteRequest?.approved_info?.approved_date ? formatDate(quoteRequest.approved_info.approved_date) : 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-green-600 text-white">
                            Quoted by: {quoteRequest?.approved_info?.approved_by || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-xs px-2 py-1 bg-yellow-500 text-white">
                            Status: Waiting for Payment
                        </Badge>
                    </div>
                )}
            </section>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Total Items</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">{quoteRequest.quote_request_items.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Total Value</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">${getTotalValue().toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Days Since Created</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                            {Math.floor((Date.now() - new Date(quoteRequest.created_at).getTime()) / (1000 * 60 * 60 * 24))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Assigned Admin</span>
                        </div>
                        <div className="text-2xl font-bold mt-2">
                            {quoteRequest.profiles ? 'Yes' : 'No'}
                        </div>
                    </CardContent>
                </Card>
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
                                        <span className="text-sm">{quoteRequest.customer_name} {quoteRequest.customer_last_name}</span>
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
                                    <div className='text-sm font-medium'>Customer Notes:</div>
                                    {quoteRequest.customer_message && (
                                        <div className="p-3 bg-muted rounded-lg">
                                            <p className="text-sm">{quoteRequest?.customer_message && quoteRequest?.customer_message !== '' ? quoteRequest.customer_message : 'No notes provided'}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        {/* Fulfillment & Address Information */}
                        <Card className='col-span-1'>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <span>Fulfillment & Address Information</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {/* Fulfillment Type Selection */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-foreground mb-3">
                                        Order Fulfillment Type
                                    </label>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant={fulfillmentType === 'delivery' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFulfillmentTypeChange('delivery')}
                                            className="flex items-center space-x-2"
                                            disabled={isUpdatingFulfillmentType}
                                        >
                                            <Truck className="h-4 w-4" />
                                            <span>Delivery</span>
                                        </Button>
                                        <Button
                                            variant={fulfillmentType === 'pickup' ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handleFulfillmentTypeChange('pickup')}
                                            className="flex items-center space-x-2"
                                            disabled={isUpdatingFulfillmentType}
                                        >
                                            <MapPin className="h-4 w-4" />
                                            <span>Pickup</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-6">
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

                    {/* Agent Assignment */}
                    <section className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                        <Card className='col-span-2'>
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
                        <QuoteNotes quoteRequestId={quoteRequest.id} profile_id={profile?.id || ''} />
                    </section>

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
                                        <Badge variant="outline" className="text-purple-600 border-purple-600">
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
                                    disabled={filteredQuoteItems?.length === 0 || isFetching}
                                >
                                    Bulk Set Pricing ({filteredQuoteItems?.length} items)
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
                                        {filteredQuoteItems?.length} of {quoteRequest?.quote_request_items?.length} items
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
                                {
                                    filteredQuoteItems?.map((item: QuoteRequestItem) => {
                                        const currentPrice = item.quoted_price || item.product?.default_price || 0
                                        const purchaseCost = item.product?.default_price || 0
                                        const markup = purchaseCost > 0 ? ((currentPrice - purchaseCost) / purchaseCost * 100) : 0
                                        const originalPrice = originalPrices[item.id] || 0
                                        // console.log('currentPrice', currentPrice)
                                        // console.log('originalPrice in loop', originalPrice)
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
                                                                <strong>Customer Notes:</strong> {item.notes}
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
                                                                className={`w-24 ${hasPriceChanged ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' : ''}`}
                                                                placeholder="0.00"
                                                            />
                                                            {hasPriceChanged && (
                                                                <div className="flex flex-col items-center text-xs">
                                                                    <span className="text-purple-600 font-medium">
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
                                    })
                                }
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
                                        {filteredQuoteItems?.length} of {quoteRequest?.quote_request_items?.length} items priced
                                        {hasUnsavedChanges && (
                                            <span className="ml-2 text-purple-600 font-medium">
                                                • {quoteRequest?.quote_request_items?.filter((item: QuoteRequestItem) => {
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
                                                className="bg-purple-600 hover:bg-purple-700"
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
                                <Button
                                    onClick={() => setApproveModalOpen(true)}
                                    disabled={quoteRequest.status === 'approved'}
                                    className="bg-green-600 hover:bg-green-700 text-white mt-4"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {quoteRequest.status === 'approved' ? 'Already Approved' : 'Approve Order'}
                                </Button>
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
                                                    <Tooltip>
                                                        <TooltipTrigger><Paperclip className="h-4 w-4" /></TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Attach a file</p>
                                                        </TooltipContent>
                                                    </Tooltip>
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
                                {auditLog?.map((entry, index) => {
                                    const isExpanded = expandedLogEntries.has(entry.id)
                                    const hasDetails = entry.event_type !== 'SYSTEM_ACTION'
                                    return (
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
                                                                {entry.user_name}
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">
                                                                {getEventTypeDisplayText(entry.event_type)}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatTime(entry.created_at)}
                                                        </span>
                                                    </div>

                                                    {/* Event-specific content */}
                                                    {entry.event_type === 'NOTE_ADDED' && entry.details.NOTE_ADDED && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-700">{entry.message}</p>
                                                            <p className="text-sm text-gray-700">{entry.details.NOTE_ADDED.note_text}</p>
                                                        </div>
                                                    )}

                                                    {entry.event_type === 'EMAIL_SENT' && entry.details.EMAIL_SENT && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-700">
                                                                <p className="text-sm text-gray-700">{entry.message}</p>
                                                                <strong>To:</strong> {entry.details.EMAIL_SENT.recipient_email}
                                                            </p>
                                                            {hasDetails && (
                                                                <button
                                                                    className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                                    onClick={() => handleViewEmail(entry.details.EMAIL_SENT.sent_email_id)}
                                                                >
                                                                    View Email
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {entry.event_type === 'PAYMENT_PROCESSED' && entry.details.PAYMENT_PROCESSED && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-700">
                                                                <strong>Amount:</strong> ${entry.details.PAYMENT_PROCESSED.amount} {entry.details.PAYMENT_PROCESSED.currency}
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                <strong>Status:</strong> {entry.details.PAYMENT_PROCESSED.status}
                                                            </p>
                                                            {hasDetails && (
                                                                <button
                                                                    className="mt-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                                                    onClick={() => toggleLogEntryExpansion(entry.id)}
                                                                >
                                                                    {isExpanded ? 'Hide Details' : 'View Details'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {entry.event_type === 'SYSTEM_ACTION' && entry.details.SYSTEM_ACTION && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-700">{entry.message}</p>
                                                        </div>
                                                    )}

                                                    {/* Expandable details */}
                                                    {hasDetails && isExpanded && (
                                                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">Details</h4>
                                                            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                                                {JSON.stringify(entry.details, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
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
                            Set pricing for all {filteredQuoteItems?.length} visible items
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
                                `Apply to ${filteredQuoteItems?.length} Items`
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
                            Calculate sale price for {selectedItemForMarkup?.product_name}
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
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <p>Purchase Cost: <span className="font-medium">${selectedItemForMarkup.product?.default_price?.toFixed(2) || '0.00'}</span></p>
                                            {selectedItemForMarkup.quoted_price && (
                                                <p>Current Price: <span className="font-medium">${selectedItemForMarkup.quoted_price.toFixed(2)}</span></p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Markup Mode Tabs */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Markup Base
                            </label>
                            <div className="flex space-x-2">
                                <Button
                                    variant={markupMode === 'cost' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setMarkupMode('cost')}
                                >
                                    From Purchase Cost
                                </Button>
                                <Button
                                    variant={markupMode === 'current' ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setMarkupMode('current')}
                                    disabled={!selectedItemForMarkup?.quoted_price}
                                >
                                    From Current Price
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                {markupMode === 'cost'
                                    ? 'Markup will be calculated from the purchase cost'
                                    : 'Markup will be calculated from the current quoted price'
                                }
                            </p>
                        </div>

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
                                            const basePrice = markupMode === 'cost'
                                                ? (selectedItemForMarkup.product?.default_price || 0)
                                                : (selectedItemForMarkup.quoted_price || selectedItemForMarkup.product?.default_price || 0)
                                            const newPrice = calculateMarkupPrice(basePrice, percentage)
                                            setMarkupMultiplier((newPrice / basePrice).toFixed(2))
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
                                        ${(() => {
                                            const basePrice = markupMode === 'cost'
                                                ? (selectedItemForMarkup.product?.default_price || 0)
                                                : (selectedItemForMarkup.quoted_price || selectedItemForMarkup.product?.default_price || 0)
                                            return calculateMarkupPrice(basePrice, parseFloat(markupPercentage)).toFixed(2)
                                        })()}
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
                                            const basePrice = markupMode === 'cost'
                                                ? (selectedItemForMarkup.product?.default_price || 0)
                                                : (selectedItemForMarkup.quoted_price || selectedItemForMarkup.product?.default_price || 0)
                                            const newPrice = calculateMultiplierPrice(basePrice, multiplier)
                                            setMarkupPercentage(((newPrice - basePrice) / basePrice * 100).toFixed(1))
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
                                        ${(() => {
                                            const basePrice = markupMode === 'cost'
                                                ? (selectedItemForMarkup.product?.default_price || 0)
                                                : (selectedItemForMarkup.quoted_price || selectedItemForMarkup.product?.default_price || 0)
                                            return calculateMultiplierPrice(basePrice, parseFloat(markupMultiplier)).toFixed(2)
                                        })()}
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

            {/* Address Edit Modal */}
            <AddressEditModal
                open={addressModalOpen}
                onOpenChange={setAddressModalOpen}
                address={editingAddressType === 'shipping' ? (quoteRequest.shipping_address || {}) : (quoteRequest.billing_address || {})}
                type={editingAddressType}
                onSave={saveAddress}
                isSaving={isSavingAddress}
            />

            {/* Approve Order Modal */}
            <ApproveOrderModal
                open={approveModalOpen}
                onOpenChange={setApproveModalOpen}
                quoteRequest={quoteRequest}
                onApprove={handleApproveOrder}
            />

            {/* Void/Close Order Confirmation Dialog */}
            <Dialog open={voidOrderModalOpen} onOpenChange={setVoidOrderModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <LockOpen className="h-5 w-5 text-red-500" />
                            Close Order
                        </DialogTitle>
                        <DialogDescription>
                            You are about to close this order. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                                        Warning: This Action Cannot Be Undone
                                    </h4>
                                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                        <li>• This order will be permanently closed</li>
                                        <li>• The customer will no longer be able to access this quote</li>
                                        <li>• No further changes can be made to this order</li>
                                        <li>• This action will be logged in the audit trail</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Order Details</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Order #: <span className="font-medium text-foreground">{quoteRequest.order_confirmation_number}</span></p>
                                <p>Customer: <span className="font-medium text-foreground">{quoteRequest.customer_name} {quoteRequest.customer_last_name}</span></p>
                                <p>Email: <span className="font-medium text-foreground">{quoteRequest.customer_email}</span></p>
                                <p>Total Value: <span className="font-medium text-foreground">${getTotalValue().toFixed(2)}</span></p>
                                <p>Status: <span className="font-medium text-foreground">{quoteRequest.status}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setVoidOrderModalOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleVoidOrder}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            <LockOpen className="h-4 w-4 mr-2" />
                            Close Order
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Approved Order Price Update Confirmation Dialog */}
            <Dialog open={showApprovedOrderDialog} onOpenChange={setShowApprovedOrderDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-yellow-500" />
                            Update Approved Order Prices
                        </DialogTitle>
                        <DialogDescription>
                            You are updating prices for an approved order. The customer will be notified of these changes.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                        Important Notice
                                    </h4>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <li>• This order has already been approved and sent to the customer</li>
                                        <li>• Price changes will trigger an email notification to the customer</li>
                                        <li>• The customer will receive updated pricing information</li>
                                        <li>• This action cannot be undone</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Order Details</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Order #: <span className="font-medium text-foreground">{quoteRequest.order_confirmation_number}</span></p>
                                <p>Customer: <span className="font-medium text-foreground">{quoteRequest.customer_name} {quoteRequest.customer_last_name}</span></p>
                                <p>Email: <span className="font-medium text-foreground">{quoteRequest.customer_email}</span></p>
                                <p>Items Modified: <span className="font-medium text-foreground">
                                    {quoteRequest?.quote_request_items?.filter((item: QuoteRequestItem) => {
                                        const currentPrice = item.quoted_price || item.product?.default_price || 0
                                        const originalPrice = originalPrices[item.id] || 0
                                        return Math.abs(currentPrice - originalPrice) > 0.01
                                    }).length}
                                </span></p>
                                <p>Email Notification: <span className="font-medium text-green-600">Will be sent automatically</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setShowApprovedOrderDialog(false)}
                            disabled={isSavingPricing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={performSavePricing}
                            disabled={isSavingPricing}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                            {isSavingPricing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Confirm & Update Prices
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Fulfillment Type Change Confirmation Dialog */}
            <Dialog open={fulfillmentTypeModalOpen} onOpenChange={setFulfillmentTypeModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-blue-500" />
                            Change Fulfillment Type
                        </DialogTitle>
                        <DialogDescription>
                            You are about to change the fulfillment type for this order. The customer will be notified of this change.
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
                                        <li>• Changing fulfillment type will notify the customer</li>
                                        <li>• This may affect delivery arrangements and pricing</li>
                                        <li>• The customer will receive an email about this change</li>
                                        <li>• This change will be logged in the order history</li>
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
                            disabled={isUpdatingFulfillmentType}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmFulfillmentTypeChange}
                            disabled={isUpdatingFulfillmentType}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isUpdatingFulfillmentType ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Confirm Change
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Email View Modal */}
            <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
                <DialogContent className="sm:max-w-4xl max-h-[80vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-blue-500" />
                            Email Content
                        </DialogTitle>
                        <DialogDescription>
                            View the email that was sent to the customer
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {isLoadingEmail ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="flex items-center space-x-2">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Loading email content...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg overflow-hidden">
                                <div className="bg-muted/50 p-3 border-b">
                                    <h4 className="font-medium text-sm">Email Preview</h4>
                                    <p className="text-xs text-muted-foreground">
                                        This is how the email appeared to the recipient
                                    </p>
                                </div>
                                <div className="max-h-[60vh] overflow-auto">
                                    <div
                                        className="p-4"
                                        dangerouslySetInnerHTML={{ __html: emailContent }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setEmailModalOpen(false)}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={handlePrintEmail}
                            variant="outline"
                            disabled={isLoadingEmail}
                        >
                            <Printer className="h-4 w-4 mr-2" />
                            Print Email
                        </Button>
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResendingEmail || isLoadingEmail}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isResendingEmail ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Resend Email
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Resend Email Confirmation Dialog */}
            <Dialog open={resendEmailModalOpen} onOpenChange={setResendEmailModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-green-500" />
                            Resend Email
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to resend this email to the customer?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-white text-xs font-bold">!</span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                                        Important Notice
                                    </h4>
                                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                        <li>• This will send a duplicate email to the customer</li>
                                        <li>• The customer may receive multiple copies</li>
                                        <li>• This action will be logged in the audit trail</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="font-medium text-foreground mb-2">Email Details</h4>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p>Email ID: <span className="font-medium text-foreground">{currentEmailId}</span></p>
                                <p>Customer: <span className="font-medium text-foreground">{quoteRequest?.customer_name} {quoteRequest?.customer_last_name}</span></p>
                                <p>Email: <span className="font-medium text-foreground">{quoteRequest?.customer_email}</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            variant="outline"
                            onClick={() => setResendEmailModalOpen(false)}
                            disabled={isResendingEmail}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmResendEmail}
                            disabled={isResendingEmail}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isResendingEmail ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Resending...
                                </>
                            ) : (
                                <>
                                    <Send className="h-4 w-4 mr-2" />
                                    Confirm Resend
                                </>
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 