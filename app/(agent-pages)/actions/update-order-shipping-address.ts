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

export async function UpdateOrderShippingAddress(orderId: string, address: Address) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("orders")
        .update({
            shipping_address: address,
        })
        .eq("id", orderId)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
} 