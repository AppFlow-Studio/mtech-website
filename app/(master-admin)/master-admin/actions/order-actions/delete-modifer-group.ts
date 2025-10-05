'use server'

import { createClient } from "@/utils/supabase/server"

export async function deleteModifierGroup(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('modifier_groups').delete().eq('id', id)
    if (error) {
        return new Error(error.message)
    }
}
