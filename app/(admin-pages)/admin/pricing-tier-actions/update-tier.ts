'use server'
import { createClient } from "@/utils/supabase/server"

export async function updateTier(tierId: string, updates: { name: string; description: string; commission_rate: number }) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('agent_tiers')
        .update(updates)
        .eq('id', tierId)
    if (error) {
        throw error
    }
    return data
} 