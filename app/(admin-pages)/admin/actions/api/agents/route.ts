import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createUser, deleteUser } from './supabaseauthadmin'
export async function GET(request: NextRequest) {
    try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').select(`
        *
    `).eq('role', 'AGENT')

     if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

    return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        if(!body.email || !body.password || !body.first_name || !body.last_name || !body.tier) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }
        const response = await createUser(body)

        if (response.error) {
            return NextResponse.json({ error: response.error }, { status: 500 })
        }

        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json()
        const response = await deleteUser(body.id)
        if (response.error) {
            return NextResponse.json({ error: response.error }, { status: 500 })
        }
        return NextResponse.json(response)
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}