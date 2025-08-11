'use server'
import { createClient } from "@/utils/supabase/server";

export async function completePickup(fulfillmentId: string) {
    const supabase = await createClient();

    try {
        // Step 1: Update pickup record
        const { error: pickupError } = await supabase
            .from('pickups')
            .update({
                status: 'COMPLETED',
                picked_up_at: new Date().toISOString()
            })
            .eq('fulfillment_id', fulfillmentId);

        if (pickupError) {
            throw new Error(`Failed to update pickup status: ${pickupError.message}`);
        }

        // Step 2: Update fulfillment status
        const { error: fulfillmentError } = await supabase
            .from('fulfillments')
            .update({
                status: 'COMPLETE'
            })
            .eq('id', fulfillmentId);

        if (fulfillmentError) {
            throw new Error(`Failed to update fulfillment status: ${fulfillmentError.message}`);
        }

        // Step 3: Update order items status
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .update({
                order_status: 'COMPLETED'
            })
            .eq('fulfillment_id', fulfillmentId);

        if (orderItemsError) {
            throw new Error(`Failed to update order items status: ${orderItemsError.message}`);
        }

        return {
            success: true,
            message: 'Pickup completed successfully'
        };

    } catch (error) {
        console.error('Error completing pickup:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}
