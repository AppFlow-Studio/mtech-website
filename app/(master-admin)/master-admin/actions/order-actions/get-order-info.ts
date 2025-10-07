'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetOrderInfo(order_id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('orders').select(
        `
        *,
         agent:profiles!agent_id ( 
      *,
      agent_tiers ( * )
    ),
    admin:profiles!admin_assigned ( * ),
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
            products (
                *
            ),
            fulfillments (
                *,
                shipments (
                    *
                ),
                pickups (
                    *
                )
            )
        ),
        fulfillments (
            *,
            shipments (
                *
            ),
            pickups (
                *
            ),
            order_items (
                *,
                order_item_modifiers (
                    *,
                    modifiers (
                        *
                    )
                ),
                products (
                    *
                )
            )
        )
        `
    ).eq('id', order_id).single();
    if (error) {
        throw new Error(error.message);
    }
    return data;
}