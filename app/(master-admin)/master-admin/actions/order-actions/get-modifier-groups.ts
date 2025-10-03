'use server'

import { createClient } from "@/utils/supabase/server"

export const getModifierGroups = async () => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('modifier_groups').select(
        `
        *,
        modifiers(
            *
        )
        `
    )
    if (error) {
        throw new Error(error.message)
    }
    return data
}