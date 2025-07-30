'use server'
import { createClient } from '@/utils/supabase/server'

export async function AssignAdmin(id: string, adminId: string | null) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_requests').update({ admin_assigned: adminId }).eq('id', id)
    if (error) {
        return new Error(error.message)
    }
    return data
}