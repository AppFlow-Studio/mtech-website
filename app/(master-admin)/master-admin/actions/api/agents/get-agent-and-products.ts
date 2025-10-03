'use server'
import { AgentInfoAndProductTierAndPrices } from "@/lib/types"
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
                    products(
                        *,
                        product_tags( *, tags( * ) ),
                        products_modifiers( *, modifier_groups( *, modifiers( * ) ) )
                    )
                )
         )
    `).eq('id', id).single()
    if(error) {
        throw new Error(error.message)
    }
    return data as AgentInfoAndProductTierAndPrices
}