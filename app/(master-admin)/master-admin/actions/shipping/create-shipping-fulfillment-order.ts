'use server'
import { createClient } from "@/utils/supabase/server";

export async function createShippingFulfillmentOrder(orderId: string, orderItems: any[], additionalFee: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from('fulfillments').insert({
        order_id: orderId,
        fulfillment_type: 'SHIPPING',
        status: 'SHIPPED',
        additional_fee : Number(additionalFee),
    }).select('id').single();
    if(error) {
        return new Error("Failed to create shipping fulfillment order", {
            cause: error.message
        });
    }

    // update the order items with the fulfillment id
 
        const { data: orderItemsData, error: orderItemsError } = await supabase.from('order_items').upsert(orderItems.map((item) => ({
            id : item.id,
            fulfillment_id: data.id,
            fulfillment_type: 'SHIPPING',
            order_status: 'SHIPPED',
        })))

        if(orderItemsError) {
            return new Error("Failed to update order items with fulfillment id", {
                cause: orderItemsError.message
            });
        }   
   

    // Audit log
    return data;
}   