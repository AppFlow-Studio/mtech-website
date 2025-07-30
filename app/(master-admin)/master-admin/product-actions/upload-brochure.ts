'use server'
import { createClient } from "@/utils/supabase/server";

export async function uploadBrochure(productId: string, file: File) {
    const supabase = await createClient();

    // Generate a unique filename for the brochure
    const fileExtension = file.name.split('.').pop();
    const filename = `${productId}-brochure.${fileExtension}`;

    const { data, error } = await supabase.storage
        .from('brochures')
        .upload(filename, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) {
        return error;
    }

    // Get the public URL for the uploaded brochure
    const { data: urlData } = supabase.storage
        .from('brochures')
        .getPublicUrl(filename);

    return urlData.publicUrl;
}

export async function deleteBrochure(productId: string) {
    const supabase = await createClient();

    // Try to delete the brochure file
    const { error } = await supabase.storage
        .from('brochures')
        .remove([`${productId}-brochure.pdf`, `${productId}-brochure.PDF`]);

    if (error) {
        console.error('Error deleting brochure:', error);
        // Don't fail if file doesn't exist
    }

    return true;
} 