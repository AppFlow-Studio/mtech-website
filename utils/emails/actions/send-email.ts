'use server'

import { Resend } from 'resend'
import { QuoteSubmissionEmail } from '../QuoteOrderConfirmationEmail'
import { QuoteApprovalEmail } from '../QuoteApprovalEmail'
import { QuoteCartItem } from '@/lib/quote-cart-store'

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

export async function sendQuoteSubmissionEmail(customerEmail: string, customerName: string, notes: string, items: QuoteCartItem[]) {
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
