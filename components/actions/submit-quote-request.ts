'use server'
import { createClient } from '@/utils/supabase/server'
import { QuoteCartItem } from '@/lib/quote-cart-store'

export async function submitQuoteRequest(formData: {
    customer_name: string | undefined,
    customer_last_name: string | undefined,
    email: string | undefined,
    phone: string | undefined,
    company?: string | undefined,
    message?: string | undefined
}, items: QuoteCartItem[]) {
    if (!formData.customer_name || !formData.customer_last_name || !formData.email || !formData.phone) {
        return new Error('Please fill in all required fields')
    }

    // Add Email Trigger here
    const name = formData.customer_name
    const last_name = formData.customer_last_name
    const email = formData.email
    const phone = formData.phone
    const company = formData.company
    const message = formData.message

    const supabase = await createClient()
    const { data : QuoteRequestID, error } = await supabase.from('quote_requests').insert({
        customer_name: name,
        customer_last_name: last_name,
        customer_email: email,
        customer_phone: phone,
        customer_company: company,
        customer_message: message,
    }).select('id, order_confirmation_number').single()


    // Insert Quote Request Items
    const { data: QuoteRequestItems, error: QuoteRequestItemsError } = await supabase.from('quote_request_items').insert(items.map(item => ({
        quote_request_id: QuoteRequestID?.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        notes: item.notes,
        quoted_price: item.product.default_price,
    })))

    // Trigger Audit Log -- SYSTEM_ACTION -- 
    // Insert Submission to Audit Log Date, Quote Request ID, User Name,

    const { data: AuditLogQuoteRequest, error: AuditLogQuoteRequestError } = await supabase.from('quote_audit_log').insert({
        quote_request_id: QuoteRequestID?.id,
        event_type: 'SYSTEM_ACTION',
        user_name: 'MTech Distributors',
        message: `${name} ${last_name} Placed a Quote Request ( Quote Request ID: ${QuoteRequestID?.id} )`,
        details: {
            SYSTEM_ACTION: {
                action_type: 'SUBMISSION',
                action_details: 'Quote Request Submitted'
            }
        }
    })

    // Insert Submission Order Confirmation Number,
    const { data: AuditLogOrderConfirmation, error: AuditLogOrderConfirmationError } = await supabase.from('quote_audit_log').insert({
        quote_request_id: QuoteRequestID?.id,
        event_type: 'SYSTEM_ACTION',
        user_name: 'MTech Distributors',
        message: 'Order Confirmation Number: ' + QuoteRequestID?.order_confirmation_number,
        details: {
            SYSTEM_ACTION: {
                action_type: 'ORDER_CONFIRMATION',
                action_details: 'Order Confirmation Number: ' + QuoteRequestID?.order_confirmation_number
            }
        }
    })


    // Send Email to Customer
    
    if (error) {
        return new Error(error.message)
    }

    if (QuoteRequestItemsError) {
        // Delete Quote Request
        await supabase.from('quote_requests').delete().eq('id', QuoteRequestID?.id)
        return new Error(QuoteRequestItemsError.message)
    }

    return QuoteRequestID
}