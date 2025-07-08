'use server'
import { createClient } from "@/utils/supabase/server";

export async function deleteProduct(productId: string) {

    const supabase = await createClient();
    const { data, error } = await supabase.from('products').delete().eq('id', productId);
    const { data : DeletedProductImg, error : DeletedProductError } = await supabase
    .storage
    .from('products')
    .remove([productId])
    
    if (error) {
        return error;
    }
    return data;
}