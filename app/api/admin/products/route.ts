import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.from('products').select('*')

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Ensure data is serializable
        const serializedData = data?.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            imageSrc: product.image_src || product.imageSrc,
            link: product.link,
            inStock: product.in_stock || product.inStock,
            tags: product.tags || [],
            price: product.price,
            default_price: product.default_price,
            createdAt: product.created_at,
            updatedAt: product.updated_at
        })) || []

        return NextResponse.json(serializedData)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('products')
            .insert([body])
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data[0])
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
} 