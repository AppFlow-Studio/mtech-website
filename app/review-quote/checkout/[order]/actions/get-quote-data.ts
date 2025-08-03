'use server'

import { createClient } from '@/utils/supabase/server'

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

export async function getQuoteData(orderConfirmationNumber: string, email: string) {
    try {
        const supabase = await createClient()

        // Fetch the quote request
        const { data: quoteRequest, error: quoteError } = await supabase
            .from('quote_requests')
            .select(`
                *,
                quote_request_items (
                    id,
                    product_id,
                    product_name,
                    quantity,
                    notes,
                    quoted_price,
                    product:products (
                        id,
                        name,
                        description,
                        default_price,
                        imageSrc,
                        tags
                    )
                ),
                profiles (
                    id,
                    first_name,
                    last_name,
                    email,
                    phone_number
                )
            `)
            .eq('order_confirmation_number', orderConfirmationNumber)
            .eq('customer_email', email)
            .eq('status', 'approved')
            .single()

        if (quoteError) {
            console.error('Error fetching quote request:', quoteError)
            return {
                success: false,
                error: 'Quote request not found or not approved'
            }
        }

        if (!quoteRequest) {
            return {
                success: false,
                error: 'Quote request not found'
            }
        }

        // Calculate total
        const total = quoteRequest.quote_request_items?.reduce((sum: number, item: QuoteRequestItem) => {
            const price = item.quoted_price || item.product?.default_price || 0
            return sum + (price * item.quantity)
        }, 0) || 0

        return {
            success: true,
            data: {
                orderConfirmationNumber: quoteRequest.order_confirmation_number,
                customerEmail: quoteRequest.customer_email,
                items: quoteRequest.quote_request_items || [],
                fulfillmentType: quoteRequest.order_fulfillment_type || 'delivery',
                shippingAddress: quoteRequest.shipping_address,
                billingAddress: quoteRequest.billing_address,
                total
            }
        }

    } catch (error) {
        console.error('Error in getQuoteData:', error)
        return {
            success: false,
            error: 'Failed to fetch quote data'
        }
    }
} 