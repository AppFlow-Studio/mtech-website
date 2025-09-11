'use server'

import { Resend } from 'resend'
import { QuoteSubmissionEmail } from '../QuoteOrderConfirmationEmail'
import { QuoteApprovalEmail } from '../QuoteApprovalEmail'
import { QuoteCartItem } from '@/lib/quote-cart-store'
import { createClient } from '@/utils/supabase/server'
import { PriceUpdateEmail } from '../PriceUpdateEmail'
import OrderSubmissionEmail, { OrderItem } from '../OrderSubmissionEmail'
import { OrderItems } from '@/lib/types'
import { ContactThankYouEmail } from '../ContactThankYouEmail'
import { ContactFormSubmissionEmail } from '../ContactFormSubmissionEmail'
import { WarrantyRequestSubmissionEmail } from '../WarrantyRequestSubmissionEmail'
import { WarrantyRequestThankYouEmail } from '../WarrantyRequestThankYouEmail'
import { AgentApplicationSubmissionEmail } from '../AgentApplicationSubmissionEmail'
import { AgentApplicationThankYouEmail } from '../AgentApplicationThankYouEmail'

const resend = new Resend(process.env.RESEND_KEY)

interface EmailData {
    to: string
    subject: string
    html: string
    from?: string
}

export async function sendEmail({ to, subject, html, from = 'MTech Distributors <support@mtechdistributor.com>' }: EmailData) {
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
            from: 'MTech Distributors <support@mtechdistributor.com>',
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
            from: 'MTech Distributors <support@mtechdistributor.com>',
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
            from: 'MTech Distributors <support@mtechdistributor.com>',
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
        totalAmount: number
    }) {
    const subject = 'Your order has been submitted! - Order:' + orderId

    try {
        const { data, error } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
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

export async function sendContactFormEmails({
    firstName,
    lastName,
    email,
    phone,
    message,
    submissionId
}: {
    firstName: string
    lastName: string
    email: string
    phone: string
    message: string
    submissionId?: string
}) {
    const submittedAt = new Date().toISOString()
    const fullName = `${firstName} ${lastName}`

    try {
        // Send thank you email to customer
        const thankYouSubject = 'Thank you for contacting MTech Distributors!'
        const { data: thankYouData, error: thankYouError } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
            to: email,
            subject: thankYouSubject,
            react: ContactThankYouEmail({
                firstName,
                lastName,
                email,
                submittedAt,
            }),
        })

        if (thankYouError) {
            console.error('Error sending thank you email:', thankYouError)
            return { success: false, error: thankYouError.message }
        }

        // Send notification email to company
        const notificationSubject = `New Contact Form Submission from ${fullName}`
        const { data: notificationData, error: notificationError } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
            to : 'support@mtechdistributors.com',
            subject: notificationSubject,
            react: ContactFormSubmissionEmail({
                firstName,
                lastName,
                email,
                phone,
                message,
                submittedAt,
                submissionId,
            }),
        })

        if (notificationError) {
            console.error('Error sending notification email:', notificationError)
            return { success: false, error: notificationError.message }
        }

        // // Log the contact form submission to database if needed
        // try {
        //     const supabase = await createClient()
        //     const { error: dbError } = await supabase.from('contact_submissions').insert({
        //         first_name: firstName,
        //         last_name: lastName,
        //         email,
        //         phone,
        //         message,
        //         submission_id: submissionId || `CF-${Date.now()}`,
        //         submitted_at: submittedAt,
        //         thank_you_email_sent: true,
        //         notification_email_sent: true,
        //     })

        //     if (dbError) {
        //         console.error('Error saving contact submission to database:', dbError)
        //         // Don't fail the email sending if database logging fails
        //     }
        // } catch (dbError) {
        //     console.error('Error with database logging:', dbError)
        //     // Don't fail the email sending if database logging fails
        // }

        return {
            success: true,
            data: {
                thankYouEmailId: thankYouData?.id,
                notificationEmailId: notificationData?.id
            }
        }
    } catch (error) {
        console.error('Error sending contact form emails:', error)
        return { success: false, error: 'Failed to send contact form emails' }
    }
}

export async function sendWarrantyRequestEmails({
    firstName,
    lastName,
    email,
    businessName,
    customerPO,
    phoneCode,
    phoneNumber,
    hasWarranty,
    manufacturer,
    repairTypes,
    partsSerialNumber,
    atmSerialNumber,
    message,
    issueDescription,
    files,
    submissionId
}: {
    firstName: string
    lastName: string
    email: string
    businessName: string
    customerPO: string
    phoneCode: string
    phoneNumber: string
    hasWarranty: string
    manufacturer: string
    repairTypes: string[]
    partsSerialNumber: string
    atmSerialNumber: string
    message: string
    issueDescription: string
    files?: File[]
    submissionId?: string
}) {
    const submittedAt = new Date().toISOString()
    const fullName = `${firstName} ${lastName}`

    try {
        // Send thank you email to customer
        const thankYouSubject = 'Warranty Request Received - MTech Distributors'
        const { data: thankYouData, error: thankYouError } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
            to: email,
            subject: thankYouSubject,
            react: WarrantyRequestThankYouEmail({
                firstName,
                lastName,
                email,
                businessName,
                customerPO,
                manufacturer,
                submittedAt,
            }),
        })

        if (thankYouError) {
            console.error('Error sending warranty thank you email:', thankYouError)
            return { success: false, error: thankYouError.message }
        }

        // Prepare attachments if files are provided
        const attachments = files && files.length > 0 ? await Promise.all(
            files.map(async (file) => {
                const buffer = await file.arrayBuffer();
                return {
                    filename: file.name,
                    content: Buffer.from(buffer),
                };
            })
        ) : undefined;

        // Send notification email to company
        const notificationSubject = `New Warranty Request from ${fullName} - ${businessName}${files && files.length > 0 ? ` (${files.length} attachment${files.length > 1 ? 's' : ''})` : ''}`
        const { data: notificationData, error: notificationError } = await resend.emails.send({
            from: 'MTech Distributors <support@mtechdistributor.com>',
            to : 'support@mtechdistributors.com',
            subject: notificationSubject,
            react: WarrantyRequestSubmissionEmail({
                firstName,
                lastName,
                email,
                businessName,
                customerPO,
                phoneCode,
                phoneNumber,
                hasWarranty,
                manufacturer,
                repairTypes,
                partsSerialNumber,
                atmSerialNumber,
                message,
                issueDescription,
                submittedAt,
                submissionId,
                files: files ? files.map(f => f.name) : undefined,
            }),
            attachments,
        })

        if (notificationError) {
            console.error('Error sending warranty notification email:', notificationError)
            return { success: false, error: notificationError.message }
        }

        // Log the warranty request to database if needed
        try {
            const supabase = await createClient()
            const { error: dbError } = await supabase.from('warranty_requests').insert({
                first_name: firstName,
                last_name: lastName,
                email,
                business_name: businessName,
                customer_po: customerPO,
                phone_code: phoneCode,
                phone_number: phoneNumber,
                has_warranty: hasWarranty,
                manufacturer,
                repair_types: repairTypes,
                parts_serial_number: partsSerialNumber,
                atm_serial_number: atmSerialNumber,
                message,
                issue_description: issueDescription,
                files_uploaded: files ? files.map(f => f.name) : [],
                files_count: files ? files.length : 0,
                submission_id: submissionId || `WR-${Date.now()}`,
                submitted_at: submittedAt,
                thank_you_email_sent: true,
                notification_email_sent: true,
            })

            if (dbError) {
                console.error('Error saving warranty request to database:', dbError)
                // Don't fail the email sending if database logging fails
            }
        } catch (dbError) {
            console.error('Error with database logging:', dbError)
            // Don't fail the email sending if database logging fails
        }

        return {
            success: true,
            data: {
                thankYouEmailId: thankYouData?.id,
                notificationEmailId: notificationData?.id
            }
        }
    } catch (error) {
        console.error('Error sending warranty request emails:', error)
        return { success: false, error: 'Failed to send warranty request emails' }
    }
}

export async function sendAgentApplicationEmails({
    firstName,
    lastName,
    email,
    companyName,
    phoneCode,
    phoneNumber,
    voidCheck,
    photoId,
    ein,
    submissionId
}: {
    firstName: string
    lastName: string
    email: string
    companyName: string
    phoneCode: string
    phoneNumber: string
    voidCheck?: File[]
    photoId?: File[]
    ein?: File[]
    submissionId?: string
}) {
    const submittedAt = new Date().toISOString()
    const fullName = `${firstName} ${lastName}`

    try {
        // Send thank you email to applicant
        const thankYouSubject = 'Agent Application Received - MTech Distributors'
        const { data: thankYouData, error: thankYouError } = await resend.emails.send({
            from: 'MTech Distributors <partnerships@mtechdistributor.com>',
            to: email,
            subject: thankYouSubject,
            react: AgentApplicationThankYouEmail({
                firstName,
                lastName,
                email,
                companyName,
                submittedAt,
            }),
        })

        if (thankYouError) {
            console.error('Error sending agent application thank you email:', thankYouError)
            return { success: false, error: thankYouError.message }
        }

        // Prepare attachments if files are provided
        const allFiles = [...(voidCheck || []), ...(photoId || []), ...(ein || [])];
        const attachments = allFiles.length > 0 ? await Promise.all(
            allFiles.map(async (file) => {
                const buffer = await file.arrayBuffer();
                return {
                    filename: file.name,
                    content: Buffer.from(buffer),
                };
            })
        ) : undefined;

        // Send notification email to company
        const notificationSubject = `New Agent Application from ${fullName} - ${companyName}${allFiles.length > 0 ? ` (${allFiles.length} attachment${allFiles.length > 1 ? 's' : ''})` : ''}`
        const { data: notificationData, error: notificationError } = await resend.emails.send({
            from: 'MTech Distributors <partnerships@mtechdistributor.com>',
            to : 'support@mtechdistributors.com',
            subject: notificationSubject,
            react: AgentApplicationSubmissionEmail({
                firstName,
                lastName,
                email,
                companyName,
                phoneCode,
                phoneNumber,
                submittedAt,
                submissionId,
                voidCheck: voidCheck ? voidCheck.map(f => f.name) : undefined,
                photoId: photoId ? photoId.map(f => f.name) : undefined,
                ein: ein ? ein.map(f => f.name) : undefined,
            }),
            attachments,
        })

        if (notificationError) {
            console.error('Error sending agent application notification email:', notificationError)
            return { success: false, error: notificationError.message }
        }

        // // Log the agent application to database if needed
        // try {
        //     const supabase = await createClient()
        //     const { error: dbError } = await supabase.from('agent_applications').insert({
        //         first_name: firstName,
        //         last_name: lastName,
        //         email,
        //         company_name: companyName,
        //         phone_code: phoneCode,
        //         phone_number: phoneNumber,
        //         void_check_files: voidCheck ? voidCheck.map(f => f.name) : [],
        //         photo_id_files: photoId ? photoId.map(f => f.name) : [],
        //         ein_files: ein ? ein.map(f => f.name) : [],
        //         total_files_count: allFiles.length,
        //         submission_id: submissionId || `AA-${Date.now()}`,
        //         submitted_at: submittedAt,
        //         thank_you_email_sent: true,
        //         notification_email_sent: true,
        //     })

        //     if (dbError) {
        //         console.error('Error saving agent application to database:', dbError)
        //         // Don't fail the email sending if database logging fails
        //     }
        // } catch (dbError) {
        //     console.error('Error with database logging:', dbError)
        //     // Don't fail the email sending if database logging fails
        // }

        return {
            success: true,
            data: {
                thankYouEmailId: thankYouData?.id,
                notificationEmailId: notificationData?.id
            }
        }
    } catch (error) {
        console.error('Error sending agent application emails:', error)
        return { success: false, error: 'Failed to send agent application emails' }
    }
}