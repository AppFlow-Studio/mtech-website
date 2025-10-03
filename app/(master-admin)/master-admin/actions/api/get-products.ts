'use server'
import { createClient } from "@/utils/supabase/server"

export interface Product {
    id: string
    name: string
    description: string
    imageSrc: string
    link: string
    inStock: boolean
    tags: string[]
    default_price: number
    createdAt: string
    updatedAt: string
    product_tags: {
        id: string
        tag_id: string
        product_id: string
        name: string
        tags: {
            id: string
            name: string
            description: string
        }[]
    }[]
    products_modifiers: {
        id: string
        product_id: string
        modifier_group_id: string
        modifiers: {
            id: string
            name: string
            desc: string
            price_adjustment: number
        }[]
    }[]
}

export async function getProducts() {
    const supabase = await createClient()

    // Get products with their modifiers
    const { data: products, error: productsError } = await supabase.from('products').select(`
        *,
        product_tags( *, tags( * ) ),
        products_modifiers( *, modifier_groups( *, modifiers( * ) ) )
        `)
    if (productsError) {
        throw new Error(productsError.message)
    }
    console.log(products?.[0])

    // // Get modifiers for all products
    // const { data: modifiers, error: modifiersError } = await supabase
    //     .from('product_modifiers')
    //     .select('*')

    // if (modifiersError) {
    //     console.error('Error fetching modifiers:', modifiersError)
    //     // Don't fail if modifiers can't be fetched
    // }

    // // Attach modifiers to their respective products
    // const productsWithModifiers = products?.map(product => ({
    //     ...product,
    //     modifiers: modifiers?.filter(modifier => modifier.product_id === product.id) || []
    // })) || []

    return products 
}