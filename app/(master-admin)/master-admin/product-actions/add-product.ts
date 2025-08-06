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
    imageSrc: File,
    isSubscription: boolean,
    subscriptionInterval?: string,
    subscriptionPrice?: number,
    modifiers: Array<{
        name: string,
        description: string,
        additional_cost: number,
        weight: number
    }>,
    brochure?: File
}) {
    const supabase = await createClient();

    // Extract modifiers and brochure from product data
    const { modifiers, subscriptionInterval, subscriptionPrice, isSubscription, brochure, ...productDataWithoutModifiers } = product;

    const { data: productData, error } = await supabase.from('products').insert({
        ...productDataWithoutModifiers,
        imageSrc: '',
        brochureUrl: '',
        subscription: product.isSubscription,
        subscription_interval: product.subscriptionInterval || null,
        subscription_price: product.subscriptionPrice || null
    }).select().single()

    if (error) {
        return new Error(error.message);
    }
    else {
        const uploadimg = await uploadProductImage(productData.id, product.imageSrc);

        if (uploadimg instanceof Error) {
            return new Error(uploadimg.message);
        }

        else {
            const { data } = supabase
                .storage
                .from('products')
                .getPublicUrl(productData.id)
            const imageUrl = data.publicUrl;

            // Upload brochure if provided
            let brochureUrl = '';
            if (brochure) {
                const { uploadBrochure } = await import('./upload-brochure');
                const brochureResult = await uploadBrochure(productData.id, brochure);
                if (brochureResult instanceof Error) {
                    console.error('Error uploading brochure:', brochureResult);
                    // Don't fail the entire operation if brochure upload fails
                } else {
                    brochureUrl = brochureResult;
                }
            }

            const { data: UpdatedProductData, error } = await supabase.from('products').update({
                imageSrc: imageUrl,
                brochureUrl: brochureUrl
            }).eq('id', productData.id).select().single()
            if (error) {
                return new Error(error.message || 'Error updating product image');
            }
        }
    }

    // Insert modifiers if any exist
    if (modifiers && modifiers.length > 0) {
        const modifierData = modifiers.map(modifier => ({
            product_id: productData.id,
            name: modifier.name,
            description: modifier.description,
            additional_cost: modifier.additional_cost,
            weight: modifier.weight
        }));

        const { error: modifierError } = await supabase
            .from('product_modifiers')
            .insert(modifierData);

        if (modifierError) {
            console.error('Error inserting modifiers:', modifierError);
            // Don't fail the entire operation if modifiers fail
        }
    }

    return productData;
}