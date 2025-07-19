'use server'

import { createClient } from "@/utils/supabase/server";

export async function DeleteOrderItem(order_id: string, item_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('order_items').delete().eq('id', item_id).eq('order_id', order_id);
    if (error) {
        return new Error(error.message);
    }
    return data;
}