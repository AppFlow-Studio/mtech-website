'use server'

import { createClient } from "@/utils/supabase/server"

export async function getProductInfo(slug: string) {
    const supabase = await createClient()
    const { data: product, error } = await supabase.from('products').select('*').eq('link', slug).order('created_at', { ascending: false }).limit(1).single()
    if (error) {
        throw new Error(error.message)
    }
    return product
}