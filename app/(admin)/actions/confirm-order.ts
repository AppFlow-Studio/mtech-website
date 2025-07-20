'use server'

import { createClient } from "@/utils/supabase/server"

export async function ConfirmOrder(order_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').update({
        status: 'approved'
    }).eq('id', order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
}