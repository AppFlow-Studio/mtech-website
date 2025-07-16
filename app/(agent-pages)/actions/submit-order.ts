'use server'
import { createClient } from "@/utils/supabase/server"

export async function submitOrder(order_id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').update({ status: 'submitted' }).eq('id', order_id)
    if (error) {
        return new Error(error.message)
    }
    return data
}