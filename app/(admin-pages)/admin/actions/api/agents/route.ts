import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

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