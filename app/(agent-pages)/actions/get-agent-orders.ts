"use server";
import { createClient } from "@/utils/supabase/server";

export default async function getAgentOrders(agentId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("orders").select(`
        *,
        order_items (
            *,
            order_item_modifiers (
                *,
                modifiers (
                    *,
                    modifier_groups (
                     name
                    )
                )
            ),
            products(
                *
            )
        )
    `).eq("agent_id", agentId).order("created_at", { ascending: false });

    if (error) {
        return Error(error.message);
    }
    return data;
}