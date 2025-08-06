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
    isSubscription?: boolean;
    subscriptionInterval?: string;
    subscriptionPrice?: number;
    modifiers?: any[];
    brochure?: File;
    brochureUrl?: string;
    weight?: number;
}, imageurl: string) {
    const supabase = await createClient();
    
    // Extract subscription, modifier, and brochure fields
    const { modifiers, subscriptionInterval, subscriptionPrice, isSubscription, brochure, ...productDataWithoutModifiers } = product;
    
    // Prepare the update data
    const updateData = {
        ...productDataWithoutModifiers,
        imageSrc: imageurl,
        subscription: isSubscription,
        subscription_interval: subscriptionInterval || null,
        subscription_price: subscriptionPrice || null,
        weight: product.weight || null
    };
    
    const { data, error } = await supabase.from('products').update(updateData).eq('id', productId).select().single();
    
    // Handle image upload
    if (product.imageSrc instanceof File) {
        const UpdatedProductImage = await updateProductImage(productId, product.imageSrc);
        if (UpdatedProductImage instanceof Error) {
            return UpdatedProductImage;
        }
    }
    
    // Handle brochure upload
    if (brochure) {
        const { uploadBrochure } = await import('./upload-brochure');
        const brochureResult = await uploadBrochure(productId, brochure);
        if (brochureResult instanceof Error) {
            console.error('Error uploading brochure:', brochureResult);
            // Don't fail the entire operation if brochure upload fails
        } else {
            // Update the product with the new brochure URL
            await supabase.from('products').update({
                brochureUrl: brochureResult
            }).eq('id', productId);
        }
    }
    if (error) {
        return error;
    }

    // Handle modifiers
    if (modifiers !== undefined) {
        // Delete existing modifiers for this product
        const { error: deleteError } = await supabase
            .from('product_modifiers')
            .delete()
            .eq('product_id', productId);
        
        if (deleteError) {
            console.error('Error deleting existing modifiers:', deleteError);
        }

        // Insert new modifiers if any exist
        if (modifiers && modifiers.length > 0) {
            const modifierData = modifiers.map(modifier => ({
                product_id: productId,
                name: modifier.name,
                description: modifier.description,
                additional_cost: modifier.additional_cost,
                weight: modifier.weight
            }));

            const { error: modifierError } = await supabase
                .from('product_modifiers')
                .insert(modifierData);

            if (modifierError) {
               throw new Error(modifierError.message);
                // Don't fail the entire operation if modifiers fail
            }
        }
    }

    return data;
}