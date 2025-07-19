'use server'
import { Product } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";

/// Upload product image, get the url, and add it to the product

export async function uploadProductImage(filename: string, file: File) {
    const supabase = await createClient();
    const { data, error } = await supabase.storage.from('products').upload(filename, file,
        {
            cacheControl: '3600',
            upsert: false
        }
    );
    if (error) {
        return error;
    }
    return data.path;
}

export async function addProduct(product: {
    name: string,
    description: string
    link: string,
    inStock: boolean,
    tags: string[],
    default_price: number,
    imageSrc: File
}) {
    const supabase = await createClient();
        
        const { data : productData , error } = await supabase.from('products').insert({
            ...product,
            imageSrc: ''
        }).select().single()

        if (error) {
            return error;
        }
        else{
            const uploadimg = await uploadProductImage(productData.id, product.imageSrc);

            if(uploadimg instanceof Error) {
                return uploadimg;
            }
            
            else{
                const { data } = supabase
                .storage
                .from('products')
                .getPublicUrl(productData.id)
                const imageUrl = data.publicUrl;
                const { data : UpdatedProductData, error } = await supabase.from('products').update({
                    imageSrc: imageUrl
                }).eq('id', productData.id).select().single()
                if (error) {
                    return error;
                }
            }
        }
        return productData;
}