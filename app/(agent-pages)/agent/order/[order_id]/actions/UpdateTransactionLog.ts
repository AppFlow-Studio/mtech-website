'use server'

import { createClient } from "@/utils/supabase/server";
import { TransactionsLog } from "@/lib/types";
export async function UpdateTransactionsLog(transactionsLogId: string, status: "PENDING" | "SUCCESS" | "FAILED", transactionId: string, log: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('transactions_log').update({ status: status, transaction_id: transactionId, log: log }).eq('id', transactionsLogId);
    if (error) {
        return new Error(error.message);
    }
    return data;
}