'use server'
import { createClient } from "@/utils/supabase/server";

export async function updateFulfillmentType(fulfillmentId: string, newType: 'SHIPPING' | 'PICKUP') {
    const supabase = await createClient();

    try {
        // Step 1: Update fulfillment type
        const { error: fulfillmentError } = await supabase
            .from('fulfillments')
            .update({
                fulfillment_type: newType,
                status: newType === 'SHIPPING' ? 'PENDING' : 'READY_FOR_PICKUP'
            })
            .eq('id', fulfillmentId);

        if (fulfillmentError) {
            throw new Error(`Failed to update fulfillment type: ${fulfillmentError.message}`);
        }

        // Step 2: Update order items
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .update({
                fulfillment_type: newType,
                order_status: newType === 'SHIPPING' ? 'PENDING' : 'READY_FOR_PICKUP'
            })
            .eq('fulfillment_id', fulfillmentId);

        if (orderItemsError) {
            throw new Error(`Failed to update order items: ${orderItemsError.message}`);
        }

        // Step 3: Handle type-specific cleanup
        if (newType === 'SHIPPING') {
            // Delete pickup records if converting to shipping
            const { error: pickupError } = await supabase
                .from('pickups')
                .delete()
                .eq('fulfillment_id', fulfillmentId);

            if (pickupError) {
                console.warn('Failed to delete pickup records:', pickupError.message);
            }
        } else if (newType === 'PICKUP') {
            // Delete shipment records if converting to pickup
            const { error: shipmentError } = await supabase
                .from('shipments')
                .delete()
                .eq('fulfillment_id', fulfillmentId);

            if (shipmentError) {
                console.warn('Failed to delete shipment records:', shipmentError.message);
            }

            // Create new pickup record
            const pickupCode = generatePickupCode();
            const { error: pickupError } = await supabase
                .from('pickups')
                .insert({
                    fulfillment_id: fulfillmentId,
                    pickup_code: pickupCode,
                    status: 'READY_FOR_PICKUP'
                });

            if (pickupError) {
                throw new Error(`Failed to create pickup record: ${pickupError.message}`);
            }
        }

        return {
            success: true,
            message: `Fulfillment updated to ${newType} successfully`
        };

    } catch (error) {
        console.error('Error updating fulfillment type:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

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
