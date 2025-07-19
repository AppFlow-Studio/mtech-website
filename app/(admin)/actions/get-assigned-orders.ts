'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetAssignedOrders(adminId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select(`
        *,
        profiles (
            id,
            first_name,
            last_name,
            email,
            phone_number
        ),
        order_items (
            id,
            quantity,
            price_at_order,
            products (
                id,
                name,
                description
            )
        )
    `).eq('assigned_to', adminId).order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
} 