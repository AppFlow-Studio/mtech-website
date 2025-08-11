'use server'

import { getFedExToken } from "@/lib/fedex-auth";

interface FedExCancelResponse {
    success: boolean;
    error?: string;
    message?: string;
}

export async function cancelFedExShipment(trackingNumber: string): Promise<FedExCancelResponse> {
    try {
        // FedEx Ship API endpoint for cancellation
        const fedexApiUrl = 'https://apis-sandbox.fedex.com/ship/v1/shipments/cancel';
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
            return {
                success: false,
                error: `FedEx API Error: ${errorData.message || cancelResponse.statusText}`
            };
        }

        const cancelData = await cancelResponse.json();

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

