'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateApprovedQuote(quoteRequestId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({ status: 'approved' }).eq('id', quoteRequestId)
    return data
}