'use server'

import { createClient } from "@/utils/supabase/server";
type OrderItem = {
    order_id: string,
    product_id: string,
    quantity: number,
    price_at_order: number
};
export async function AddOrderItems(items: OrderItem[]) {
    // Email Trigger
    const supabase = await createClient();
    const { data, error } = await supabase.from('order_items').insert(items);
    if (error) {
        return new Error(error.message);
    }
    return data;
}