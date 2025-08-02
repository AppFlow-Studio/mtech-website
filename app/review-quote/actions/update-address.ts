'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateQuoteAddress(quoteRequestId: string, type: 'shipping' | 'billing', address: any) {
    try {
        if (!type || !address) {
            return { success: false, error: 'Type and address are required' }
        }

        if (!['shipping', 'billing'].includes(type)) {
            return { success: false, error: 'Type must be either shipping or billing' }
        }

        const supabase = await createClient()

        // Update the appropriate address field
        const updateField = type === 'shipping' ? 'shipping_address' : 'billing_address'

        const { error } = await supabase
            .from('quote_requests')
            .update({ [updateField]: address })
            .eq('id', quoteRequestId)

        if (error) {
            console.error('Error updating address:', error)
            return { success: false, error: 'Failed to update address' }
        }

        return { success: true }

    } catch (error) {
        console.error('Error in address update:', error)
        return { success: false, error: 'Internal server error' }
    }
} 