'use server'

import { createClient } from "@/utils/supabase/server"

export async function getQuoteNotes(quote_request_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_request_notes').select('*, profiles(first_name, last_name)').eq('quote_request_id', quote_request_id)

    if (error) {
        return new Error(error.message)
    }

    return data
}