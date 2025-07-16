"use server"
import { createClient } from "@/utils/supabase/server"

export async function assignOrderItems(orders_items: {
    order_id: string,
    product_id: string,
    quantity: number,
    price_at_order : number

}[]) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('order_items').upsert(orders_items,
        {
            onConflict: 'product_id,order_id',
        }
    )
    if (error) {
        console.log('Error', error)
        return new Error(error.message)
    }
    return data
}