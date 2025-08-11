'use server'
import { createClient } from "@/utils/supabase/server";
import { toast } from "sonner";

// Generate a unique pickup code
function generatePickupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    result += '-';
    for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function createPickupFulfillment(orderId: string, orderItems: any[]) {
    const supabase = await createClient();

    try {
        // Step 1: Create the fulfillment record
        const { data: fulfillmentData, error: fulfillmentError } = await supabase
            .from('fulfillments')
            .insert({
                order_id: orderId,
                fulfillment_type: 'PICKUP',
                status: 'READY_FOR_PICKUP',
                additional_fee: 0, // No additional fee for pickup
            })
            .select('id')
            .single();

        if (fulfillmentError) {
            throw new Error(`Failed to create pickup fulfillment: ${fulfillmentError.message}`);
        }

        // Step 2: Update order items with fulfillment_id
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .upsert(orderItems.map((item) => ({
                id: item.id,
                fulfillment_id: fulfillmentData.id,
                fulfillment_type: 'PICKUP',
                order_status: 'READY_FOR_PICKUP',
            })));

        if (orderItemsError) {
            throw new Error(`Failed to update order items: ${orderItemsError.message}`);
        }

        // Step 3: Generate pickup code and create pickup record
        const pickupCode = generatePickupCode();
        const { data: pickupData, error: pickupError } = await supabase
            .from('pickups')
            .insert({
                fulfillment_id: fulfillmentData.id,
                pickup_code: pickupCode,
                status: 'READY_FOR_PICKUP',
            })
            .select()
            .single();

        if (pickupError) {
            throw new Error(`Failed to create pickup record: ${pickupError.message}`);
        }

        // Step 4: Send notification to customer (placeholder for email/SMS)
        // TODO: Implement customer notification with pickup code

        return {
            success: true,
            data: {
                fulfillment_id: fulfillmentData.id,
                pickup_code: pickupCode,
                pickup_id: pickupData.id
            }
        };

    } catch (error) {
        console.error('Error creating pickup fulfillment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}
