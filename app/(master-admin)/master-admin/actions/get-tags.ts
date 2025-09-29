'use server'

import { createClient } from "@/utils/supabase/server"

export const getTags = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('tags').select(`
            *,
            product_tags( * )
        `)
    return data
}