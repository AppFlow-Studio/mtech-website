'use server'

import { QuoteCartItem } from '@/lib/quote-cart-store'
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function approveQuote({quote_order_id, approved_info, updated_at}: {quote_order_id: string, approved_info: any, updated_at: string}) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({
        status: 'approved',
        approved_info: approved_info,
        updated_at: updated_at
    }).eq('id', quote_order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
} 

export async function updateQuoteOrder({quote_order_id, status}: {quote_order_id: string, status: string}) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({
        status: status
    }).eq('id', quote_order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
}