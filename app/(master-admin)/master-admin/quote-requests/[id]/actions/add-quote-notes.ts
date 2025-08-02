'use server'

import { createClient } from "@/utils/supabase/server"

export async function addQuoteNote(quote_request_id: string, note: string, profile_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_request_notes').insert({ quote_request_id, note, user_id: profile_id})

    if (error) {
        return new Error(error.message)
    }

    return data
}