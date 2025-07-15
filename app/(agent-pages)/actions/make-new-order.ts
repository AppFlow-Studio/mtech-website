"use server";
import { createClient } from "@/utils/supabase/server";

export default async function makeNewOrder(order: any) {
    const supabase = await createClient();

    const { data, error } = await supabase.from("orders").insert(order).select();

    if (error) {
        return Error(error.message);
    }
    return data;
}