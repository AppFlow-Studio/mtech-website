'use server'
import { createClient } from "@/utils/supabase/server"
import { deleteUser } from "./supabaseauthadmin"
export async function deleteAgent(id: string) {
    const supabase = await createClient() 
    const { data, error } = await supabase.from('agents').delete().eq('id', id)
    const { data: authData, error: authError } = await deleteUser(id)
    if (authError) {
        throw new Error(authError)
    }
    return { data, error }
}   