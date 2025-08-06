"use server"
import { createClient } from "@/utils/supabase/server"
import { useProfile } from "@/lib/hooks/useProfile"

// Define the type for a single order item for clarity
type OrderItem = {
    product_id: string,
    quantity: number,
    price_at_order: number
};

export async function createOrderWithItems(agent_id: string, order_name: string, notes: string, shipping_address: any, items: OrderItem[]) {
    const supabase = await createClient();

    // 1. Create the new order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            order_name: order_name,
            notes: notes,
            agent_id: agent_id,
            shipping_address: shipping_address,
        })
        .select()
        .single();

    if (orderError) {
        console.error('Error creating order:', orderError);
        throw new Error('Could not create order.');
    }

    // If there are no items, return the order
    if (items.length === 0) {
        return order;
    }

    // 2. Add order_id to each item and insert them
    const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price_at_order
    }));

    const { data: orderItemsData, error: insertError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

    if (insertError) {
        console.error('Error inserting order items:', insertError);
        throw new Error('Could not add items to order.');
    }

    return {
        order: order,
        order_items: orderItemsData
    };
}