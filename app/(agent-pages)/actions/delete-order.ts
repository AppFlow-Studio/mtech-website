'use server'

import { createClient } from "@/utils/supabase/server"

export async function deleteOrder(order_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').delete().eq('id', order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
}