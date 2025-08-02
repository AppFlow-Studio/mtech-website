"use server";
import { createClient } from "@/utils/supabase/server";

export const getOrderNotes = async (orderId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("order_notes")
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