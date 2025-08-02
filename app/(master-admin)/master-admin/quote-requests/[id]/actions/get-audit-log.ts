'use server'

import { createClient } from '@/utils/supabase/server'

export async function getAuditLog(quoteRequestId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_audit_log').select('*').eq('quote_request_id', quoteRequestId).order('created_at', { ascending: false })
    return data
}