'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export interface UpdateFulfillmentData {
    fulfillment_type: 'SHIPPING' | 'PICKUP'
    shipping_address?: any
    custom_shipping_address?: any
}

export async function updateOrderItemFulfillment(
    orderItemId: string,
    data: UpdateFulfillmentData
) {
    const supabase = await createClient()

    try {
        const updates: any = {
            fulfillment_type: data.fulfillment_type,
            updated_at: new Date().toISOString()
        }

        const { data: updatedItem, error } = await supabase
            .from('order_items')
            .update(updates)
            .eq('id', orderItemId)
            .select()
            .single()

        if (error) {
            console.error('Update order item fulfillment error:', error)
            throw new Error(`Failed to update fulfillment method: ${error.message}`)
        }

        // Revalidate the order page
        revalidatePath('/agent/order/[order_id]', 'page')

        return {
            success: true,
            data: updatedItem,
            message: 'Fulfillment method updated successfully'
        }

    } catch (error) {
        console.error('Update order item fulfillment error:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unknown error occurred'
        }
    }
}
