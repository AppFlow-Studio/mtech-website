import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('quote_requests')
            .select(`
                *,
                quote_request_items(
                    *,
                    product:products(
                        id,
                        name,
                        description,
                        default_price,
                        imageSrc
                    )
                )
            `)
            .eq('id', params.id)
            .single()

        if (error) {
            console.error('Error fetching quote request:', error)
            return NextResponse.json(
                { error: 'Failed to fetch quote request' },
                { status: 500 }
            )
        }

        if (!data) {
            return NextResponse.json(
                { error: 'Quote request not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in quote request API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Handle agent assignment - if agent_id is empty string, set to null
        if (body.agent_id === '') {
            body.agent_id = null
        }

        const { data, error } = await supabase
            .from('quote_requests')
            .update(body)
            .eq('id', params.id)
            .select(`
                *,
                quote_request_items(
                    *,
                    product:products(
                        id,
                        name,
                        description,
                        default_price,
                        imageSrc
                    )
                ),
                agent:agents(
                    id,
                    first_name,
                    last_name,
                    email,
                    phone_number,
                    agent_tiers(
                        name
                    )
                )
            `)
            .single()

        if (error) {
            console.error('Error updating quote request:', error)
            return NextResponse.json(
                { error: 'Failed to update quote request' },
                { status: 500 }
            )
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Error in quote request update API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('quote_requests')
            .delete()
            .eq('id', params.id)

        if (error) {
            console.error('Error deleting quote request:', error)
            return NextResponse.json(
                { error: 'Failed to delete quote request' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error in quote request delete API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 