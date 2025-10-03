import { createClient } from "@/utils/supabase/server"

export async function getProductInfo(productId: string) {
    const supabase = await createClient()
    const { data, error } = await supabase.from('products').select(
        `*,
        product_tags( *, tags( * ) ),
        products_modifiers( *, modifier_groups( *, modifiers( * ) ) )
        `
    ).eq('id', productId)
    if (error) {
        console.error(error)
        return null
    }
    return data
}