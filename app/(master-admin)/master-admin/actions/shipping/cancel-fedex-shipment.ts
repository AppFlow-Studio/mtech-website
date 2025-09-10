'use server'

import { getFedExToken } from "@/lib/fedex-auth";
import { OrderItem } from "@/lib/types";
import { createClient } from "@/utils/supabase/server";
interface FedExCancelResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export async function cancelFedExShipment({trackingNumber, fulfillmentId, orderId, userName, items}: {trackingNumber: string, fulfillmentId: string, orderId: string, userName: string, items: OrderItem[]}): Promise<FedExCancelResponse> {
    try {
        const FEDEX_API_URL = process.env.NEXT_PUBLIC_FEDEX_API_URL;
        // FedEx Ship API endpoint for cancellation
        const fedexApiUrl = `${FEDEX_API_URL}/ship/v1/shipments/cancel`;
        // Get FedEx access token
        const tokenResponse = await getFedExToken();

        if (!tokenResponse) {
            return {
                success: false,
                error: 'Failed to get FedEx access token'
            };
        }

        // Cancel the shipment
        const cancelResponse = await fetch(fedexApiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenResponse}`,
            },
            body: JSON.stringify({
                accountNumber: {
                    value: '740561073'
                },
                trackingNumber: trackingNumber,
            }),
        });
        if (!cancelResponse.ok) {
            const errorData = await cancelResponse.json();
            console.log(errorData);
            return {
                success: false,
                error: `FedEx API Error: ${errorData.message || cancelResponse.statusText}`
            };
        }

        const cancelData = await cancelResponse.json();
        // log cancelation and also log to order_audit_log
        const supabase = await createClient();
        const { data : LogCancelData, error : LogCancelError } = await supabase.from('fulfillments').update({
            status: 'CANCELLED',
            cancelled_at: new Date().toISOString(),
            cancelled_items: items
        }).eq('id', fulfillmentId);
        const { data : LogOrderAuditData, error : LogOrderAuditError } = await supabase.from('order_audit_log').insert({
            order_id: orderId,
            event_type: 'SHIPMENT_CANCELLED',
            user_name: userName,
            details: {
                SHIPMENT_CANCELLED: {
                    tracking_number: trackingNumber
                }
            }
        });
        if (LogCancelError) {
            console.error('Error logging cancelation:', LogCancelError.message);
        }
        if (LogCancelData) {
            console.log('Cancelation logged:', LogCancelData);
        }

        return {
            success: true,
            message: 'FedEx shipment cancelled successfully'
        };

    } catch (error) {
        console.error('Error cancelling FedEx shipment:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
    }
}

