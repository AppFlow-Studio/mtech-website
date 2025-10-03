'use server'
import { createClient } from '@/utils/supabase/server'

export async function getAgentCardInfo(agentId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('card_payment_info').select('*').eq('user_id', agentId).single()
    if (error) {
        return new Error(error.message)
    }
    return data
}