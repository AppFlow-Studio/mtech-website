'use server'
import { createClient } from "@/utils/supabase/server"

export async function getTierAndProducts(tierId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('agent_tiers').select(`
        id,
        name,
        description,
        commission_rate,
        agent_product_prices ( *,
            products (
                *
            ) 
        )
    `).eq('id', tierId).single()
    if (error) {
        throw error
    }
    return data
}