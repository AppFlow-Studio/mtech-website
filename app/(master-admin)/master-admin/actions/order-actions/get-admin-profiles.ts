'use server';
import { createClient } from "@/utils/supabase/server";

export async function GetAdminProfiles() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('profiles').select(`
        id,
        first_name,
        last_name,
        email,
        role,
        created_at
    `).in('role', ['ADMIN', 'MASTER_ADMIN']).order('first_name');

    if (error) {
        throw new Error(error.message);
    }
    return data;
} 