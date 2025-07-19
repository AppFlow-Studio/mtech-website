'use server'
import { createClient } from "@/utils/supabase/server"
export async function getAgents() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select(`
        *,
        agent_tiers( * )
        `).eq('role', 'AGENT')

    if (error) {
        throw new Error('Failed to fetch agents')
    }

    return data
}