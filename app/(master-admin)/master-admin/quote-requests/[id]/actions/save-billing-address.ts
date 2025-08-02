'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

interface Address {
    country?: string
    first_name?: string
    last_name?: string
    company?: string
    formatted_address?: string
    apartment_suite?: string
    city?: string
    state?: string
    zip_code?: string
    phone?: string
}

export async function saveBillingAddress(quoteRequestId: string, address: Address) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('quote_requests')
            .update({
                billing_address: address
            })
            .eq('id', quoteRequestId)

        if (error) {
            console.error('Error saving billing address:', error)
            return new Error('Failed to save billing address')
        }

        return { success: true }
    } catch (error) {
        console.error('Error saving billing address:', error)
        return new Error('Failed to save billing address')
    }
} 