'use server'
import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from 'next/server'

export async function updateAgent(body : {
    id: string
    first_name: string
    last_name: string
    email?: string
    password?: string
    tier?: number | undefined
}) {

       const supabase = await createClient()
       const { data,error } = await supabase.from('profiles').update({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        tier: body.tier ? Number(body.tier) : null
       }).eq('id', body.id)
       if (error) {
        throw new Error(error.message)
       }
       return data
}