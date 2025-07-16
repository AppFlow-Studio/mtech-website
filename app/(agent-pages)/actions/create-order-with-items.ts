"use server"
import { createClient } from "@/utils/supabase/server"

export async function createOrderWithItems(profile_id: string, order_name: string, notes: string, order_items: {
    product_id: string,
    quantity: number,
    price_at_order: number
}[]) {
    const supabase = await createClient()
    const { data : InsertedOrder, error } = await supabase.from('orders').insert({
        agent_id: profile_id,
        order_name,
        notes,
    }).select('id').single()
    if (error) {
        return new Error(error.message)
    }
    else{
        const order_items_with_order_id = order_items.map((item) => ({
            ...item,
            order_id: InsertedOrder.id
        }))
        const { data: InsertedOrderItems, error: InsertedOrderItemsError } = await supabase.from('order_items').insert(order_items_with_order_id)
        if (InsertedOrderItemsError) {
            return new Error(InsertedOrderItemsError.message)
        }
        return InsertedOrderItems
    }
}