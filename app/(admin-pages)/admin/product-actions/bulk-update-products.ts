'use server'

import { createClient } from "@/utils/supabase/server";

export async function bulkUpdateProducts(products: any[]) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('agent_product_prices').upsert(products, {
        onConflict: 'product_id, agent_tier_id'
    });
    if(error) {
        return error;
    }
    return data;
}