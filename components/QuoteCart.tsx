"use client"

import { useState, useEffect } from 'react'
import { X, Trash2, Plus, Minus, FileText, Download } from 'lucide-react'
import { useQuoteCartStore, QuoteCartItem } from '@/lib/quote-cart-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { submitQuoteRequest } from './actions/submit-quote-request'
import { sendQuoteSubmissionEmail } from '@/utils/emails/actions/send-email'

interface QuoteRequestForm {
    customer_name: string
    customer_last_name: string
    email: string
    phone: string
    company?: string
    message?: string
}

export function QuoteCart() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        updateNotes,
        clearCart,
        getTotalItems,
        getTotalValue
    } = useQuoteCartStore()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [formData, setFormData] = useState<QuoteRequestForm>({
        customer_name: '',
        customer_last_name: '',
        email: '',
        phone: '',
        company: '',
        message: ''
    })

    // Handle animation timing
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true)
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300)
            return () => clearTimeout(timer)
        }
    }, [isOpen])

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    const handleQuantityChange = (item: QuoteCartItem, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(item.product.id)
        } else {
            updateQuantity(item.product.id, newQuantity)
        }
    }

    const handleSubmitQuote = async (e: React.FormEvent) => {
        e.preventDefault()

        if (items.length === 0) {
            toast.error('Your quote cart is empty')
            return
        }

        if (!formData.customer_name || !formData.customer_last_name || !formData.email || !formData.phone) {
            toast.error('Please fill in all required fields')
            return
        }

        setIsSubmitting(true)

        try {
            // TODO: Replace with actual API endpoint
            const response = await submitQuoteRequest(formData, items)

            if (response instanceof Error) {
                toast.error('Failed to submit quote request', { description: response.message })
            } else {
                toast.success('Quote request submitted successfully! We will contact you soon.')
                await sendQuoteSubmissionEmail(formData.email, `${formData.customer_name} ${formData.customer_last_name}`, items)
                clearCart()
                closeCart()
            }

            // if (response.ok) {
            //     toast.success('Quote request submitted successfully! We will contact you soon.')
            //     clearCart()
            //     closeCart()
            //     setFormData({ name: '', email: '', phone: '', company: '', message: '' })
            // } else {
            //     throw new Error('Failed to submit quote request')
            // }
        } catch (error) {
            console.error('Error submitting quote request:', error)
            toast.error('Failed to submit quote request. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ease-in-out ${isOpen ? 'bg-opacity-50' : 'bg-opacity-0'
                    }`}
                onClick={closeCart}
            />

            {/* Cart Sidebar */}
            <div
                className={`absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Quote Cart ({getTotalItems()})
                        </h2>
                        <button
                            onClick={closeCart}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400">Your quote cart is empty</p>
                                <p className="text-sm text-gray-400 dark:text-gray-500">
                                    Add products to get a quote
                                </p>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <div className="flex items-start space-x-3">
                                        <img
                                            src={item.product.imageSrc}
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {item.product.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.product.description.slice(0, 50)}...
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center space-x-2 mt-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity - 1)}
                                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </button>
                                                <span className="text-sm font-medium w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item, item.quantity + 1)}
                                                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </button>
                                            </div>

                                            {/* Notes */}
                                            <Textarea
                                                placeholder="Add notes (optional)"
                                                value={item.notes || ''}
                                                onChange={(e) => updateNotes(item.product.id, e.target.value)}
                                                className="mt-2 text-xs"
                                                rows={2}
                                            />
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.product.id)}
                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>


                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                            {/* Quote Request Form */}
                            <form onSubmit={handleSubmitQuote} className="space-y-3">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    Request Quote
                                </h3>

                                <div className='grid grid-cols-2 gap-4'>
                                    <Input
                                        placeholder="First Name *"
                                        value={formData.customer_name}
                                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                                        required
                                    />

                                    <Input
                                        placeholder="Last Name *"
                                        value={formData.customer_last_name}
                                        onChange={(e) => setFormData({ ...formData, customer_last_name: e.target.value })}
                                        required
                                    />
                                </div>

                                <Input
                                    type="email"
                                    placeholder="Email Address *"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />

                                <Input
                                    type="tel"
                                    placeholder="Phone Number *"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />

                                <Input
                                    placeholder="Company (optional)"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                />

                                <Textarea
                                    placeholder="Additional message (optional)"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={3}
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}

                                    className="w-full bg-gradient-to-b from-[#662CB2] to-[#2C134C] hover:from-[#7a35d1] hover:to-[#3c1963] text-white"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 mr-2" />
                                            Request Quote
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 