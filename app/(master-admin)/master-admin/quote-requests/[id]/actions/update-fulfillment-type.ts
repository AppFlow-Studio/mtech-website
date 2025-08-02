'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateFulfillmentType(quoteRequestId: string, fulfillmentType: 'delivery' | 'pickup') {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({ order_fulfillment_type: fulfillmentType }).eq('id', quoteRequestId)
    if(error) {
        return new Error(error.message)
    }
    return data
}