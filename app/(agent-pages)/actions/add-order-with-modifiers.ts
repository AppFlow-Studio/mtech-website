'use server'

import { createClient } from "@/utils/supabase/server"
import { Order } from "../agent/OrderCard"

export async function addOrderWithModifiers(order: Order) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').insert(order).select().single()
    if (error) {
        throw new Error(error.message)
    }
    return data
}