'use server'
import { createClient } from "@/utils/supabase/server";

async function saveLabelToStorage(labelUrl: string, encodedLabel: string | null, trackingNumber: string): Promise<string> {
    const supabase = await createClient();

    try {
        let fileContent: ArrayBuffer;
        let fileName: string;
        let contentType: string;

        if (encodedLabel) {
            // If we have an encoded label, decode it and save as PDF
            fileContent = Buffer.from(encodedLabel, 'base64').buffer;
            fileName = `shipping-label-${trackingNumber || Date.now()}.pdf`;
            contentType = 'application/pdf';
        } else if (labelUrl) {
            // If we have a URL, fetch the content
            const response = await fetch(labelUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch label from URL: ${response.statusText}`);
            }
            fileContent = await response.arrayBuffer();
            fileName = `shipping-label-${trackingNumber || Date.now()}.pdf`;
            contentType = response.headers.get('content-type') || 'application/pdf';
        } else {
            throw new Error('No label content provided');
        }

        // Upload to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('shipping-labels')
            .upload(fileName, fileContent, {
                contentType: contentType,
                upsert: false
            });

        if (uploadError) {
            throw new Error(`Failed to upload to storage: ${uploadError.message}`);
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from('shipping-labels')
            .getPublicUrl(fileName);

        return urlData.publicUrl;

    } catch (error) {
        console.error('Error saving label to storage:', error);
        // Fallback to original URL if storage fails
        return labelUrl;
    }
}

export async function saveShippingOrder(
    fulfillment_id: string,
    tracking_number: string,
    label_url: string,
    service_type: string,
    delivery_commitment: string | null,
    encoded_label?: string | null,
) {
    const supabase = await createClient();

    // Save label to storage and get public URL
    const storedLabelUrl = await saveLabelToStorage(label_url, encoded_label || null, tracking_number);

    const { data, error } = await supabase.from('shipments').insert({
        fulfillment_id: fulfillment_id,
        tracking_number: tracking_number,
        label_url: storedLabelUrl,
        service_type: service_type,
        delivery_commitment: delivery_commitment ? new Date(delivery_commitment).toISOString() : null,
    });

  

    if (error) {
        console.error('Error saving shipping order:', error);
        return new Error("Failed to save shipping order", {
            cause: error.message
        });
    }

    return data;
}

export default saveShippingOrder;