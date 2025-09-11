'use server'
import { ContactThankYouEmail } from "@/utils/emails/ContactThankYouEmail"
import { ContactFormSubmissionEmail } from "@/utils/emails/ContactFormSubmissionEmail"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_KEY)

export async function sendContactForm(formData: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    message: string,
}) {

    const response = await resend.emails.send({
        from: 'MTech Distributors <support@mtechdistributor.com>',
        to: 'temur@appflowstudio.io',
        subject: 'Contact Form Submission',
        react: ContactFormSubmissionEmail({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
            submittedAt: new Date().toISOString(),
        }),
    })

    if (response.error) {
        return new Error(response.error.message)
    }

    return response
}

export async function sendContactFormToCustomer(formData: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    message: string,
}) {

    const response = await resend.emails.send({
        from: 'MTech Distributors <support@mtechdistributor.com>',
        to: formData.email,
        subject: 'Contact Form Submission',
        react: ContactThankYouEmail({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            submittedAt: new Date().toISOString(),
        }),
    })
    return response
}