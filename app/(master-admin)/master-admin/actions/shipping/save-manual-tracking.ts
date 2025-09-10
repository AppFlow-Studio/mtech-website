'use server'

import { createClient } from '@/utils/supabase/server'

interface SaveManualTrackingRequest {
    fulfillmentId: string
    trackingNumber: string
    carrier: string
    serviceType?: string
    trackingHistory: any[]
    trackingStatus: any
    labelUrl?: string
}

export async function saveManualTracking({
    fulfillmentId,
    trackingNumber,
    carrier,
    serviceType,
    trackingHistory,
    trackingStatus,
    labelUrl
}: SaveManualTrackingRequest) {
    try {
        const supabase = await createClient()

        // Insert into shipments table
        const { data, error } = await supabase
            .from('shipments')
            .insert({
                fulfillment_id: fulfillmentId,
                tracking_number: trackingNumber,
                carrier: carrier,
                service_type: serviceType || 'Manual Entry',
                label_url: labelUrl,
                tracking_history: trackingHistory,
                tracking_status: trackingStatus,
                created_at: new Date().toISOString()
            })
            .select()
            .single()

        if (error) {
            console.error('Error saving manual tracking:', error)
            return {
                success: false,
                error: error.message
            }
        }

        return {
            success: true,
            data: data
        }

    } catch (error) {
        console.error('Error in saveManualTracking:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }
    }
}
