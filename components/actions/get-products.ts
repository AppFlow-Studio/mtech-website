'use server'

import { createClient } from "@/utils/supabase/server"
export async function getProducts() {
    const supabase = await createClient()
    const { data: products, error } = await supabase.from('products').select('*')
    if (error) {
        throw new Error(error.message)
    }
    return products
}