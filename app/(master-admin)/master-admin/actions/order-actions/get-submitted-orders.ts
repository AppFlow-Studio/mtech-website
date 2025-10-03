'use server'
import { Profile } from "@/lib/hooks/useProfile"
import { OrderItems } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"

export interface SubmittedOrder {
    id: string
    order_name: string
    order_items: OrderItems[]
    profiles: { first_name?: string; last_name?: string }
    payment_status: string
    status: string
    created_at: string
    updated_at: string
    agent_id: string
    admin_assigned: string
    order_confirmation_number: string
    quickbooks_invoice_img: string
    quickbooks_invoice_number: string 
    shipping_address: {
        city: string
        state: string
        zip_code: string
        country: string
        phone: string
        formatted_address: string
        apartment_suite: string
    }
    
}

// Add A Trigger on this to send an email to the agent 

export async function getSubmittedOrders() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').select(
        `
         *,
        order_items (
            *,
            products(
                *
            )
        ),
        profiles!agent_id ( first_name, last_name )
        `
    ).neq('status', 'draft')
    if (error) {
        return new Error(error.message)
    }
    return data
}