'use server'
import { Product } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";


export async function updateProductImage(productId: string, file: File) {
    const supabase = await createClient();
    const { data, error } = await supabase
    .storage
    .from('products')
    .update(productId, file, {
      cacheControl: '3600',
      upsert: true
    })
    if (error) {
        return error;
    }
    return data;
}

export async function updateProduct(productId: string, product: {
    name: string;
    description: string;
    imageSrc: string | File;
    link: string;
    inStock: boolean;
    tags?: string[];
    default_price: number;
}, imageurl: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('products').update({...product, imageSrc: imageurl}).eq('id', productId).select().single();
    if(product.imageSrc instanceof File){

        const UpdatedProductImage = await updateProductImage(productId, product.imageSrc);
        if(UpdatedProductImage instanceof Error){
            return UpdatedProductImage;
        }

    }
    if (error) {
        return error;
    }
    return data;
}