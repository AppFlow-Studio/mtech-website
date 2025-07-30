'use server'
import { createClient } from '@/utils/supabase/server'

export async function GetQuoteInfo(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').select(`
        *,
        quote_request_items(
            *,
            product:products(
                id,
                name,
                description,
                default_price,
                imageSrc
            )
        ),
        profiles( * )
    `).eq('id', id).single()
    if (error) {
        return new Error(error.message)
    }
    return data
}