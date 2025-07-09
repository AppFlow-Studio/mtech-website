'use server'
import { createClient } from "@/utils/supabase/server"

export async function getAgentById(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select(`
        *,
        agent_tiers( * )
    `).eq('id', id).single()
    if(error) {
        throw new Error(error.message)
    }
    return data
}