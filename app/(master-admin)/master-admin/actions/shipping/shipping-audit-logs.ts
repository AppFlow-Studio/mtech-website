'use server'

import { createClient } from "@/utils/supabase/server";

export async function addShippingAuditLog(
    { fulfillmentId, profileId, user_name, carrier, trackingNumber, itemsInShipment, weightAndSize, cost }:
        { fulfillmentId: string, profileId: string, user_name: string, carrier: string, trackingNumber: string, itemsInShipment: string[], weightAndSize: string, cost: string }) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('order_audit_log')
        .insert({
            user_name: user_name,
            order_id: fulfillmentId,
            event_type: 'SHIPMENT_CREATED',
            message: `created a shipment for ${itemsInShipment.length} items. ( ${carrier} : ${trackingNumber} )`,
            details: {
                SHIPMENT_CREATED: {
                    carrier: carrier,
                    tracking_number: trackingNumber,
                    items_in_shipment: itemsInShipment.join(', '),
                    weight_and_size: weightAndSize,
                    cost: cost
                }
            },
            author_id: profileId
        });

    if (error) {
        console.warn('Failed to add audit log:', error.message);
    }
}

