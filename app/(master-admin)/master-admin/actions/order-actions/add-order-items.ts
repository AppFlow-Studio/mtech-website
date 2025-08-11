'use server'

import { createClient } from "@/utils/supabase/server";
type OrderItem = {
    order_id: string,
    product_id: string,
    quantity: number,
    price_at_order: number
};
export async function AddOrderItems(items: OrderItem[], user_name: string) {
    // Email Trigger
    const supabase = await createClient();
    const { data, error } = await supabase.from('order_items').insert(items.map(item => ({
        order_id: item.order_id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order,
    })));

    // Audit Log
    const { data: auditLog, error: auditLogError } = await supabase.from('order_audit_log').insert({
        order_id: items[0].order_id,
        event_type: 'ORDER_UPDATED_ADD',
        user_name: user_name,
        message: `${items.length} order item(s) added by ${user_name}`,
        details: {
            'ORDER_UPDATED_ADD': items,
        }
    })
    console.log(auditLog)

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