"use server";
import { createClient } from "@/utils/supabase/server";

interface Address {
    country?: string;
    first_name?: string;
    last_name?: string;
    company?: string;
    formatted_address?: string;
    apartment_suite?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    phone?: string;
}

interface OrderData {
    order_name: string;
    notes: string;
    agent_id: string;
    shipping_address?: Address | null;
}

export default async function makeNewOrder(orderData: OrderData) {
    const supabase = await createClient();

    // Extract shipping address from order data
    const { shipping_address, ...orderFields } = orderData;

    // Create the order first
    const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderFields)
        .select()
        .single();

    if (orderError) {
        return Error(orderError.message);
    }

    // If shipping address is provided, store it (you might want to create a separate table for addresses)
    if (shipping_address && order) {
        // For now, we'll store the shipping address as JSON in the orders table
        // You might want to create a separate shipping_addresses table in the future
        const { error: updateError } = await supabase
            .from("orders")
            .update({
                shipping_address: shipping_address,
            })
            .eq("id", order.id);

        if (updateError) {
            console.error("Error saving shipping address:", updateError);
            // Don't fail the order creation if address saving fails
        }
    }

    return order;
}