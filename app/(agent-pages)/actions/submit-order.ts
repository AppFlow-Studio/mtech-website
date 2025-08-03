'use server'
import { createClient } from "@/utils/supabase/server"
import { Profile, useProfile } from "@/lib/hooks/useProfile"
import { OrderSubmissionEmail } from "@/utils/emails/OrderSubmissionEmail"
import { Resend } from "resend"
import { sendOrderSubmissionEmail } from "@/utils/emails/actions/send-email"
import { OrderItems } from "@/lib/types"


export async function submitOrder(order_id: string, profile: Profile | null, order_name: string, notes: string, order_items: OrderItems[], order_confirmation_number: string) {
    if(!profile) {
        return new Error('Profile not found')
    }

    const supabase = await createClient()
    const { data, error } = await supabase.from('orders').update({ status: 'submitted' }).eq('id', order_id).select('*').single()

    if (error instanceof Error) {
        return new Error(error.message)
    }
    // Trigger Audit Log -- SYSTEM_ACTION -- 
    const { data: auditLog, error: auditLogError } = await supabase.from('order_audit_log').insert({
        order_id: order_id,
        event_type: 'SYSTEM_ACTION',
        user_name: 'MTech Distributors',
        message: `Order ${order_name} submitted by ${profile?.first_name} ${profile?.last_name}`,
        author_id: profile?.id,
        details: {
            SYSTEM_ACTION: {
                action_type: 'SUBMISSION',
                action_details: `Order ${order_name} submitted by ${profile?.first_name} ${profile?.last_name}`
            },
        }
    })

    if( auditLogError instanceof Error) {
        return new Error(auditLogError.message)
    }

    const totalAmount = order_items?.reduce((acc, item) => acc + item.price_at_order * item.quantity, 0)
    // Trigger Email -- OrderSubmissionEmail -- 
    const SendEmailResponse = await sendOrderSubmissionEmail({
        customerEmail: profile.email || '',
        customerName: profile.first_name + ' ' + profile.last_name,
        orderId: order_confirmation_number,
        orderName: order_name,
        notes: notes,
        items: order_items.map((item) => ({
            id: item.product_id,
            product_id: item.product_id,
            product_name: item.products.name,
            quantity: item.quantity,
            price_at_order: item.price_at_order,
            product: item.products,
        })),
        agentName: profile?.first_name || '',
        agentEmail: profile?.email || '',
        totalAmount: totalAmount || 0
    })
    if( SendEmailResponse instanceof Error) {
        return new Error(SendEmailResponse.message)
    }

    // Trigger Audit Log -- EMAIL_SENT -- 
    const { data: AuditLogEmail, error: AuditLogEmailError } = await supabase.from('order_audit_log').insert({
        order_id: order_id,
        event_type: 'EMAIL_SENT',
        user_name: 'MTech Distributors',
        message: `Order submission email sent to ${profile.first_name} ${profile.last_name} (${profile.email}) for order ${order_name}`,
        author_id: profile?.id,
        details: {
            EMAIL_SENT: {
                "sent_email_id": SendEmailResponse?.id,
                "recipient_email": profile.email,
            }
        }
    })

    if( AuditLogEmailError instanceof Error) {
        return new Error(AuditLogEmailError.message)
    }
    
    
    return data
}