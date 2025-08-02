'use server'

import { createClient } from "@/utils/supabase/server"

export async function addToOrderAuditLog({ orderId, action, details }: { orderId: string, action: string, details: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('order_audit_log').insert({ order_id: orderId, action: action, details: details })
    if (error) {
        console.error(error)
    }
}

export async function addToQuoteRequestAuditLog({ quoteRequestId, action, details }: { quoteRequestId: string, action: string, details: string }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_request_audit_log').insert({ quote_request_id: quoteRequestId, action: action, details: details })
    if (error) {
        console.error(error)
    }
}