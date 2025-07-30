import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { customer, items, totalValue, totalItems } = body

        // Validate required fields
        if (!customer?.name || !customer?.email || !customer?.phone) {
            return NextResponse.json(
                { error: 'Missing required customer information' },
                { status: 400 }
            )
        }

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in quote request' },
                { status: 400 }
            )
        }

        const supabase = await createClient()

        // Create the quote request
        const { data: quoteRequest, error: quoteError } = await supabase
            .from('quote_requests')
            .insert({
                customer_name: customer.name,
                customer_email: customer.email,
                customer_phone: customer.phone,
                customer_company: customer.company || null,
                customer_message: customer.message || null,
                total_value: totalValue,
                total_items: totalItems,
                status: 'pending'
            })
            .select()
            .single()

        if (quoteError) {
            console.error('Error creating quote request:', quoteError)
            return NextResponse.json(
                { error: 'Failed to create quote request' },
                { status: 500 }
            )
        }

        // Create quote request items
        const quoteItems = items.map((item: any) => ({
            quote_request_id: quoteRequest.id,
            product_id: item.productId,
            product_name: item.productName,
            quantity: item.quantity,
            notes: item.notes || null,
            price: item.price
        }))

        const { error: itemsError } = await supabase
            .from('quote_request_items')
            .insert(quoteItems)

        if (itemsError) {
            console.error('Error creating quote request items:', itemsError)
            // Don't fail the entire request if items fail to insert
        }

        // TODO: Send email notification to sales team
        // TODO: Send confirmation email to customer

        return NextResponse.json({
            success: true,
            quoteRequestId: quoteRequest.id,
            message: 'Quote request submitted successfully'
        })

    } catch (error) {
        console.error('Error processing quote request:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: quoteRequests, error } = await supabase
            .from('quote_requests')
            .select(`
        *,
        quote_request_items (*)
      `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching quote requests:', error)
            return NextResponse.json(
                { error: 'Failed to fetch quote requests' },
                { status: 500 }
            )
        }

        return NextResponse.json(quoteRequests)

    } catch (error) {
        console.error('Error fetching quote requests:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 