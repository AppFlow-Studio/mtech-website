"use server";
import { createClient } from "@/utils/supabase/server";
import { addToOrderAuditLog } from "@/utils/add-to-order-audit-log";

export const addOrderNote = async (orderId: string, userId: string, note: string, userName: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("order_notes")
        .insert({
            order_id: orderId,
            user_id: userId,
            user_name: userName,
            note: note
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    // Add to audit log
    await addToOrderAuditLog({
        orderId,
        action: "Note added",
        details: `Added note: ${note.substring(0, 100)}${note.length > 100 ? '...' : ''} by ${userName}`
    });

    return data;
}; 