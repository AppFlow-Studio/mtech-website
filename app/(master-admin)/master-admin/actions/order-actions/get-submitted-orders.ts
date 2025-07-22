'use server'
import { createClient } from "@/utils/supabase/server"


// Add A Trigger on this to send an email to the agent 

export async function getSubmittedOrders() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').select(
        `
         *,
        order_items (
            *,
            products(
                *
            )
        )
        `
    ).neq('status', 'draft')
    if (error) {
        return new Error(error.message)
    }
    return data
}