'use server'
import { Order } from "@/app/(agent-pages)/agent/OrderCard";
import { createClient } from "@/utils/supabase/server";

export async function UpdateOrder(order_id: string, order: Partial<Order>) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').update(order).eq('id', order_id);
    if (error) {
        return new Error(error.message);
    }
    return data;
}