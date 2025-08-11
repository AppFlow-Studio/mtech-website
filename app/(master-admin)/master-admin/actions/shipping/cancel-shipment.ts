'use server'
import { createClient } from "@/utils/supabase/server";

export async function cancelShipment(fulfillmentId: string, profileId: string) {
    const supabase = await createClient();
    if (!profileId) {
        return {
            success: false,
            error: 'Error Fetching Profile'
        };
    }
    try {
        // Step 1: Get shipment details for audit log
        const { data: fulfillmentData, error: fetchError } = await supabase
            .from('fulfillments')
            .select(`
                *,
                shipments (*)
            `)
            .eq('id', fulfillmentId)
            .single();

        if (fetchError) {
            throw new Error(`Failed to fetch fulfillment data: ${fetchError.message}`);
        }

        // Step 2: Update fulfillment status to cancelled
        const { error: fulfillmentError } = await supabase
            .from('fulfillments')
            .update({
                status: 'CANCELLED',
                cancelled_at: new Date().toISOString()
            })
            .eq('id', fulfillmentId);

        if (fulfillmentError) {
            throw new Error(`Failed to update fulfillment status: ${fulfillmentError.message}`);
        }

        // Step 3: Update order items to remove fulfillment_id and reset status
        const { error: orderItemsError } = await supabase
            .from('order_items')
            .update({
                fulfillment_id: null,
                order_status: 'PENDING',
                fulfillment_type: null
            })
            .eq('fulfillment_id', fulfillmentId);

        if (orderItemsError) {
            throw new Error(`Failed to update order items: ${orderItemsError.message}`);
        }

        // Step 4: Update shipments to mark as cancelled instead of deleting
        const { error: shipmentError } = await supabase
            .from('shipments')
            .update({
                status: 'CANCELLED',
                cancelled_at: new Date().toISOString()
            })
            .eq('fulfillment_id', fulfillmentId);

        if (shipmentError) {
            console.warn('Failed to update shipments:', shipmentError.message);
        }

        // Step 5: Add to audit log
        const { error: auditError } = await supabase
            .from('order_audit_log')
            .insert({
                order_id: fulfillmentData.order_id,
                action: 'SHIPMENT_CANCELLED',
                details: {
                    fulfillment_id: fulfillmentId,
                    shipment_details: fulfillmentData.shipments,
                    cancelled_at: new Date().toISOString()
                },
                author_id: profileId // This should be the actual admin ID
            });

        if (auditError) {
            console.warn('Failed to add audit log:', auditError.message);
        }

        return {
            success: true,
            message: 'Shipment cancelled successfully'
        };

    } catch (error) {
        console.error('Error cancelling shipment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}
