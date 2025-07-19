'use server'
import { createClient } from "@/utils/supabase/server"

export async function updateTierPrices(tierId: string, productPrices: { id: string, price: number }[]) { 
    // id of product in agent_product_prices table 
    // price is the price of the product for the tier
    const supabase = await createClient()
    const { data, error } = await supabase.from('agent_product_prices').upsert({...productPrices, agent_tier_id: tierId}, {
        onConflict: 'id'
    })
    if (error) {
        throw error
    }
    return data
}