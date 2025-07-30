'use server'
import { createClient } from "@/utils/supabase/server"

export async function getProducts() {
    const supabase = await createClient()

    // Get products with their modifiers
    const { data: products, error: productsError } = await supabase.from('products').select('*')
    if (productsError) {
        throw new Error(productsError.message)
    }

    // Get modifiers for all products
    const { data: modifiers, error: modifiersError } = await supabase
        .from('product_modifiers')
        .select('*')

    if (modifiersError) {
        console.error('Error fetching modifiers:', modifiersError)
        // Don't fail if modifiers can't be fetched
    }

    // Attach modifiers to their respective products
    const productsWithModifiers = products?.map(product => ({
        ...product,
        modifiers: modifiers?.filter(modifier => modifier.product_id === product.id) || []
    })) || []

    return productsWithModifiers
}