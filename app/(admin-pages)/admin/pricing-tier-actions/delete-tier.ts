'use server'
import { createClient } from "@/utils/supabase/server"

export async function deleteTier(tierId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('agent_tiers').delete().eq('id', tierId)
    if (error) {
        throw error
    }
    return data
}