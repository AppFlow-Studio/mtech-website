'use server'
import { createClient } from "@/utils/supabase/server"

export async function GetQuoteRequests() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').select(`
        *,
        quote_request_items(
            *
        )
    `)
    return data
}