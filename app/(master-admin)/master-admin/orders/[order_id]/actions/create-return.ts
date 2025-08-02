"use server";
import { createClient } from "@/utils/supabase/server";
import { addToOrderAuditLog } from "@/utils/add-to-order-audit-log";

export const createReturn = async (orderId: string, userId: string, returnReason: string, itemsToReturn: any[]) => {
    const supabase = await createClient();

    // Generate unique return number (RMA)
    const timestamp = new Date().getTime();
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const returnNumber = `RMA-${timestamp}-${randomSuffix}`;

    const { data, error } = await supabase
        .from("order_returns")
        .insert({
            order_id: orderId,
            return_number: returnNumber,
            created_by: userId,
            return_reason: returnReason,
            status: "pending",
            items: itemsToReturn
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    // Add to audit log
    await addToOrderAuditLog({
        orderId,
        action: "Return created",
        details: `Return ${returnNumber} created with reason: ${returnReason}`
    });

    return data;
}; 