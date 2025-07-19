import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from 'next/server'

export async function getTiers() {
    const response = await fetch('/master-admin/actions/api/tiers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch tiers')
    }

    return response.json()
}