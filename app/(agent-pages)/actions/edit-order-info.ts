'use server'

import { createClient } from "@/utils/supabase/server"

export async function editOrderInfo(order_id: string, order_name: string, notes: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').update({ order_name, notes }).eq('id', order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
}