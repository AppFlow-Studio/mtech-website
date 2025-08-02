'use server'

import { createClient } from '@/utils/supabase/server'

export async function verifyQuoteAccess(order_confirmation_number: string, email: string) {
    try {
        if (!order_confirmation_number || !email) {
            return { success: false, error: 'Order confirmation number and email are required' }
        }

        const supabase = await createClient()

        // Find the quote request with matching order confirmation number and email
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
            .eq('order_confirmation_number', order_confirmation_number)
            .eq('customer_email', email)
            .eq('status', 'approved')
            .single()

        if (quoteError || !quoteRequest) {
            return { success: false, error: 'Invalid credentials or quote not found' }
        }

        // Get notes for this quote request
        const { data: notes, error: notesError } = await supabase
            .from('quote_notes')
            .select(`
                id,
                quote_request_id,
                profile_id,
                content,
                created_at,
                is_customer_note,
                profiles (
                    first_name,
                    last_name
                )
            `)
            .eq('quote_request_id', quoteRequest.id)
            .order('created_at', { ascending: false })

        if (notesError) {
            console.error('Error fetching notes:', notesError)
        }

        return {
            success: true,
            quoteRequest,
            notes: notes || []
        }

    } catch (error) {
        console.error('Error in verify-access:', error)
        return { success: false, error: 'Internal server error' }
    }
} 