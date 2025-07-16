"use server";
import { createClient } from "@/utils/supabase/server";

export default async function getAgentOrders(agentId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("orders").select(`
        *,
        order_items (
            *,
            products(
                *
            )
        )
    `).eq("agent_id", agentId);

    if (error) {
        return Error(error.message);
    }
    return data;
}