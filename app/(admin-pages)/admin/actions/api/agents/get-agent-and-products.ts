'use server'
import { createClient } from "@/utils/supabase/server"

export async function getAgentAndProducts(id: string) {
    if(!id) {
        throw new Error('Agent ID is required')
    }
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select(`
        *,
        agent_tiers( *,
                agent_product_prices( *,
                    products( * )
                )
         )
    `).eq('id', id).single()
    if(error) {
        throw new Error(error.message)
    }
    return data
}