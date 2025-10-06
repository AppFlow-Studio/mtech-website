import { OrderItem } from "@/utils/emails/OrderSubmissionEmail";
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export async function addItemsWithModifiers({ order_info }: {
    order_info: {
        p_agent_id: string,
        p_order_name: string,
        p_notes: string,
        items_payload: {
            product_id: string,
            quantity: number,
            price_at_order: number,
            selected_modifiers: {
                modifierId: number;
                groupName: string;
                modifierName: string;
                priceAdjustment: number;
            }[]
        }[]
    }
}) {
    const { data, error } = await supabase.rpc('create_new_order', { p_agent_id: order_info.p_agent_id, p_order_name: order_info.p_order_name, p_notes: order_info.p_notes, items_payload: {items : order_info.items_payload} });
    if (error) {
        console.error('Error adding items with modifiers:', error)
        throw error
    }
    console.log('Data', data)
    return data
}