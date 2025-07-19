'use server';
import { createClient } from "@/utils/supabase/server";
//
export async function AssignOrder(order_id: string, assigned_to: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').update({
        admin_assigned: assigned_to,
    }).eq('id', order_id).select('*');
    if (error) {
        throw new Error(error.message);
    }
    return data;
} 