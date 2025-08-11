'use server'

import { createClient } from "@/utils/supabase/server";

export async function DeleteOrderItem(order_id: string, item_id: string, item_name: string, user_name: string, quantity: number) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('order_items').delete().eq('id', item_id).eq('order_id', order_id);

    // Audit Log
    const { data: auditLog, error: auditLogError } = await supabase.from('order_audit_log').insert({
        order_id: order_id,
        event_type: 'ORDER_UPDATED_DELETE',
        message: `${quantity} order item(s) deleted by ${user_name}`,
        user_name: user_name,
        details: {
            'ORDER_UPDATED_DELETE': {
                item_name: item_name,
                quantity: quantity
            }
        }
    })

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