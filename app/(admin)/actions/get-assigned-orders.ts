'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetAssignedOrders(adminId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select(`
        *,
        agent:profiles!agent_id (
            *
        ),
        admin:profiles!admin_assigned (
            *
        ),
        order_items (
           *
        )
        )
    `).eq('admin_assigned', adminId).order('created_at', { ascending: false });

    if (error) {
        throw new Error(error.message);
    }
    return data;
} 