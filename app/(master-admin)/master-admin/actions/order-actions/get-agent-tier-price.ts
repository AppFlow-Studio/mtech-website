'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetAgentTierPrice(agentTierId: string, productId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('agent_product_prices')
        .select('price')
        .eq('agent_tier_id', agentTierId)
        .eq('product_id', productId)
        .single();

    if (error) {
        // If no price found, return null
        if (error.code === 'PGRST116') {
            return null;
        }
        throw new Error(error.message);
    }

    return data?.price || null;
} 