'use server'

import { createClient } from '@/utils/supabase/server'

export async function updateFulfillmentType(quoteRequestId: string, fulfillmentType: 'delivery' | 'pickup', user_name?: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({ order_fulfillment_type: fulfillmentType }).eq('id', quoteRequestId)
    // Trigger Audit Log -- SYSTEM_ACTION -- 
    // Insert Quote Request Note
    const { data: AuditLog, error: AuditLogError } = await supabase.from('quote_audit_log').insert({
        quote_request_id: quoteRequestId,
        event_type: 'NOTE_ADDED',
        user_name: user_name || 'MTech Distributors',
        details: {
            NOTE_ADDED: {
                note_text: `Fulfillment Type Updated to ${fulfillmentType.toUpperCase()} ${user_name ? `by ${user_name}` : 'by customer'}`,
                user_id: user_name,
            }
        }
    })

    if(error) {
        return new Error(error.message)
    }
    return data
}