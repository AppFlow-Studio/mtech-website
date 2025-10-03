'use server'

import { createClient } from "@/utils/supabase/server";

export async function InsertTransactionsLog(userId: string, reason: "PAYMENT" | "REFUND" | "ADD_PAYMENT_CARD" ) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('transactions_log').insert({ user_id: userId, reason: reason }).select('id').single();
    if (error) {
        return new Error(error.message);
    }
    return data.id;
}