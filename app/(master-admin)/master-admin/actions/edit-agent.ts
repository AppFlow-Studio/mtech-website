import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from 'next/server'

export async function editAgent(body: {
    first_name: string
    last_name: string
    email?: string
    password?: string
    tier?: string
}) {
    try {
        const response = await fetch('/master-admin/actions/api/agents', {
            method: 'PUT',
            body: JSON.stringify(body)
        })
        if (!response.ok) {
            throw new Error('Failed to add agent')
        }
        return response.json()
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}