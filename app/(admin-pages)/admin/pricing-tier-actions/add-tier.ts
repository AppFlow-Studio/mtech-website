'use server'
import { createClient } from "@/utils/supabase/server"
import { Tier } from "./SetProductPrices"

export async function addTier(tier: {
    name: string;
    description: string;
    commission_rate: number;
    }) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('agent_tiers').insert(tier)
    if (error) {
        throw error
    }
    return data
}