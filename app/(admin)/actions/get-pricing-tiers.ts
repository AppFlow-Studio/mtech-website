'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetPricingTiers() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('agent_tiers').select(`
        id,
        name,
        description,
        commission_rate,
        created_at,
        agent_product_prices (
            id,
            products (
                id,
                name
            )
        )
    `).order('commission_rate', { ascending: true });

    if (error) {
        throw new Error(error.message);
    }
    return data;
} 