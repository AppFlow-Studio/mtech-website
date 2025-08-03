'use server'

import { createClient } from "@/utils/supabase/server"

export async function addQuoteNote(quote_request_id: string, note: string, profile_id: string, user_name: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_request_notes').insert({ quote_request_id, note, user_id: profile_id})
    // Trigger Audit Log -- SYSTEM_ACTION -- 
    // Insert Quote Request Note
    const { data: AuditLog, error: AuditLogError } = await supabase.from('quote_audit_log').insert({
        quote_request_id,
        event_type: 'NOTE_ADDED',
        user_name: user_name,
        message: ``,
        details: {
            NOTE_ADDED: {
                note_text: note,
                user_id: profile_id,
            }
        }
    })
    if (error) {
        return new Error(error.message)
    }

    return data
}