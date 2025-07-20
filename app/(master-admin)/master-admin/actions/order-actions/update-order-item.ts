'use server'

import { OrderItems } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

export async function UpdateOrderItem(order_id: string, item_id: string, order_item: Partial<OrderItems>) {
    const supabase = await createClient();
    // Update the order item
    const { data, error } = await supabase.from('order_items').update(order_item).eq('id', item_id).eq('order_id', order_id);
    // Change the order status to submitted
    const { data: order, error: orderError } = await supabase.from('orders').update({ status: 'submitted' }).eq('id', order_id);
    if (orderError) {
        return new Error(orderError.message);
    }
    if (error) {
        return new Error(error.message);
    }
    return data;
}