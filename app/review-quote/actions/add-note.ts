'use server'

import { createClient } from '@/utils/supabase/server'

export async function addQuoteNote(quoteRequestId: string, content: string) {
    try {
        if (!content.trim()) {
            return { success: false, error: 'Note content is required' }
        }

        const supabase = await createClient()

        const { data: note, error } = await supabase
            .from('quote_notes')
            .insert({
                quote_request_id: quoteRequestId,
                content: content.trim(),
                is_customer_note: true,
                created_at: new Date().toISOString()
            })
            .select(`
                id,
                quote_request_id,
                profile_id,
                content,
                created_at,
                is_customer_note,
                profiles (
                    first_name,
                    last_name
                )
            `)
            .single()

        if (error) {
            console.error('Error adding note:', error)
            return { success: false, error: 'Failed to add note' }
        }

        return { success: true, note }

    } catch (error) {
        console.error('Error in add note:', error)
        return { success: false, error: 'Internal server error' }
    }
} 