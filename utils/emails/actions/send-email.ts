'use server'

import { Resend } from 'resend'
import { QuoteSubmissionEmail } from '../QuoteOrderConfirmationEmail'
import { QuoteApprovalEmail } from '../QuoteApprovalEmail'
import { QuoteCartItem } from '@/lib/quote-cart-store'
import { createClient } from '@/utils/supabase/server'
import { PriceUpdateEmail } from '../PriceUpdateEmail'
import OrderSubmissionEmail, { OrderItem } from '../OrderSubmissionEmail'
import { OrderItems } from '@/lib/types'

const resend = new Resend(process.env.RESEND_KEY)

interface EmailData {
    to: string
    subject: string
    html: string
    from?: string
}

export async function sendEmail({ to, subject, html, from = 'MTech Distributors <noreply@mtechdistributor.com>' }: EmailData) {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            html,
        })

        if (error) {
            console.error('Error sending email:', error)
            return { success: false, error: error.message }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error sending email:', error)
        return { success: false, error: 'Failed to send email' }
    }
}

export async function sendQuoteSubmissionEmail(customerEmail: string, customerName: string, notes: string, items: QuoteCartItem[], quoteRequestId: string) {
    const subject = 'Thank you for your quote request - MTech Distributors'

    try {
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <noreply@mtechdistributor.com>',
            to: customerEmail,
            subject,
            react: QuoteSubmissionEmail({ customerName, notes, items }),
        })

        if (error) {
            console.error('Error sending quote submission email:', error)
            return { success: false, error: error.message }
        }
        // Trigger Audit Log -- SYSTEM_ACTION -- 
        // Insert Email Sent to Customer
        const supabase = await createClient()
        const { data: AuditLog, error: AuditLogError } = await supabase.from('quote_audit_log').insert({
            quote_request_id: quoteRequestId,
            event_type: 'EMAIL_SENT',
            user_name: 'MTech Distributors',
            message: 'Submission Email Sent to Customer',
            details: {
                EMAIL_SENT: {
                    sent_email_id: data.id,
                    recipient_email: customerEmail,
                }
            }
        })

        return { success: true, data }
    } catch (error) {
        console.error('Error sending quote submission email:', error)
        return { success: false, error: 'Failed to send email' }
    }
}

export async function sendQuoteApprovalEmail({ customerEmail, customerName, orderId, checkoutLink, items }: { customerEmail: string, customerName: string, quoteId: string, orderId: string, checkoutLink: string, items: QuoteCartItem[] }) {
    const subject = 'Your quote has been approved! - Order:' + orderId

    try {
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <noreply@mtechdistributor.com>',
            to: customerEmail,
            subject,
            react: QuoteApprovalEmail({ customerEmail, customerName, order_confirmation_number: orderId, checkoutLink, items }),
        })

        if (error) {
            console.error('Error sending quote approval email:', error)
            throw new Error(error.message)
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error sending quote approval email:', error)
        throw new Error('Failed to send email')
    }
}

// changedItems: changedItems.map(item => ({
//     id: item.id,
//     product_name: item.product_name,
//     product: item.product,
//     quantity: item.quantity,
//     quoted_price: item.quoted_price,
//     oldPrice: originalPrices[item.id] || item.product?.default_price || 0,
//     newPrice: item.quoted_price || item.product?.default_price || 0
// })),

export async function sendPriceUpdateEmail(emailData: {
    customerEmail: string
    quoteRequestId: string
    customerName: string
    order_confirmation_number: string
    totalAmount: number
    changedItems: {
        id: string
        product_name: string
        product: Partial<QuoteCartItem['product']>
        quantity: number
        quoted_price: number
        oldPrice: number
        newPrice: number
    }[]
}) {
    const subject = 'Price Update for Order #' + emailData.order_confirmation_number

    try {
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <noreply@mtechdistributor.com>',
            to: emailData.customerEmail,
            subject,
            react: PriceUpdateEmail({
                customerName: emailData.customerName,
                order_confirmation_number: emailData.order_confirmation_number,
                changedItems: emailData.changedItems,
                totalAmount: emailData.totalAmount
            }),
        })
        // Trigger Audit Log -- SYSTEM_ACTION -- 
        // Insert Email Sent to Customer
        const supabase = await createClient()
        const { data: AuditLog, error: AuditLogError } = await supabase.from('quote_audit_log').insert({
            quote_request_id: emailData.quoteRequestId,
            event_type: 'EMAIL_SENT',
            user_name: 'MTech Distributors',
            message: `Price Update Email Sent to ${emailData.customerName} (${emailData.customerEmail}) for Order #${emailData.order_confirmation_number}`,
            details: {
                EMAIL_SENT: {
                    sent_email_id: data?.id,
                    recipient_email: emailData.customerEmail,
                }
            }
        })

        if (error) {
            console.error('Error sending price update email:', error)
            throw new Error(error.message)
        }
        return { success: true, data }
    } catch (error) {
        console.error('Error sending price update email:', error)
        throw new Error('Failed to send email')
    }
}

// customerName,
// customerEmail,
// orderConfirmationNumber,
// orderItems,
// orderNotes,
// agentName,
// agentEmail,
// totalAmount,
// submittedAt,

export async function sendOrderSubmissionEmail({ customerEmail,
    customerName,
    orderId,
    orderName,
    notes,
    items,
    agentName,
    agentEmail,
    totalAmount }: { 
        customerEmail: string, 
        customerName: string,
         orderId: string, 
         orderName: string, 
         notes: string, 
         items: OrderItem[], 
         agentName: string, 
         agentEmail: string, 
         totalAmount: number }) {
    const subject = 'Your order has been submitted! - Order:' + orderId

    try {
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <noreply@mtechdistributor.com>',
            to: customerEmail,
            subject,
            react: OrderSubmissionEmail({ customerName, customerEmail, orderConfirmationNumber: orderId, orderItems: items, orderNotes: notes, agentName: agentName, agentEmail: agentEmail, totalAmount: totalAmount, submittedAt: new Date().toISOString() }),
        })
        return data
    } catch (error) {
        console.error('Error sending order submission email:', error)
        return new Error('Failed to send email')
    }
}