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
    tier_id?: string | undefined
}) {

       const supabase = await createClient()
       const { data,error } = await supabase.from('profiles').update({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        tier: body.tier_id,
       }).eq('id', body.id)
       if (error) {
        throw new Error(error.message)
       }
       return data
}

export async function setAgentTier({id, tier}: {
    id: string
    tier?: number | undefined
}) {
    console.log(id, tier)
    const supabase = await createClient()
    const { data, error } = await supabase.from('profiles').update({
        tier: tier
    }).eq('id', id)
    if (error) {
        return new Error(error.message)
    }
    return data
}