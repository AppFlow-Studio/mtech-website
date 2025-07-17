'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetOrderInfo(order_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select(
        `
        *,
        profiles ( 
        *,
        agent_tiers ( * )
        ),
        order_items (
            *,
            products (
                *
            )
        )
        `
    ).eq('id', order_id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}