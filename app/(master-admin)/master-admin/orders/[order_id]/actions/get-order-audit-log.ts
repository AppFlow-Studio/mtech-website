"use server";
import { createClient } from "@/utils/supabase/server";

export const getOrderAuditLog = async (orderId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("order_audit_log")
        .select(`
            *,
            profiles ( id, first_name, last_name, role )
        `)
        .eq("order_id", orderId)
        .order("created_at", { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}; 