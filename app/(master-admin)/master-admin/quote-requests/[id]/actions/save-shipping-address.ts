'use server'

import { createClient } from '@/utils/supabase/server'

export async function saveShippingAddress(quoteRequestId: string, address: any) {
    const supabase = await createClient()

    const { data, error } = await supabase.from('quote_requests').update({
        shipping_address: address
    }).eq('id', quoteRequestId)

    if (error) {
        return new Error(error.message)
    }

    return data
}