'use server'

import { createClient } from "@/utils/supabase/server"
export interface Modifier {
    name: string
    desc: string
    price_adjustment: number

}
interface ModifierGroup {
    name: string
    modifiers: Modifier[]
}
export const createModifierGroup = async (modifierGroup: ModifierGroup, productId?: string) => {
    const supabase = await createClient()
    const { data, error } = await supabase.from('modifier_groups').insert({
        name: modifierGroup.name,
    }).select('id').single()
    if (error) {
        return new 
        Error(error.message)
    }
    const { error: modifierError } = await supabase.from('modifiers').insert(modifierGroup.modifiers.map(modifier => ({
        name: modifier.name,
        desc: modifier.desc,
        price_adjustment: modifier.price_adjustment,
        modifier_group_id: data?.id,
    })))
    if (modifierError) {
        return new Error(modifierError.message)
    }

    if (productId) {
        const { error: productModifierError } = await supabase.from('products_modifiers').insert({
            product_id: productId,
            modifier_group_id: data?.id,
        })
        if (productModifierError) {
            return new Error(productModifierError.message)
        }
    }
    return data
}