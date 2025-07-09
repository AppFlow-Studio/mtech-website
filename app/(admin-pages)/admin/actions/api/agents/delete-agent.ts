'use server'
import { createClient } from "@/utils/supabase/server"

export async function deleteAgent(id: string) {
    const supabase = await createClient() 
    const { data, error } = await supabase.from('agents').delete().eq('id', id)
    return { data, error }
}   