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
    // Change the order status to submitted
    const { data: order, error: orderError } = await supabase.from('orders').update({ status: 'submitted' }).eq('id', items[0].order_id);
    if (orderError) {
        return new Error(orderError.message);
    }
    if (error) {
        return new Error(error.message);
    }
    return data;
}