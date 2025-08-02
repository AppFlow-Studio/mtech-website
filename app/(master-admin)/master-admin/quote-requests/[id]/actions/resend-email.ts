'use server'

import { Resend } from 'resend';    
import { createClient } from '@/utils/supabase/server'
import { Profile } from '@/lib/hooks/useProfile';

const resend = new Resend(process.env.RESEND_KEY);

export async function ResendEmail(emailTo: string, emailSubject: string, emailBody: string, quoteRequestId: string, profile: Partial<Profile>) {
    const response = await resend.emails.send({
        from: 'MTech Distributor <no-reply@mtechdistributor.com>',
        to: emailTo,
        subject: emailSubject,
        html: emailBody
    })
    if (response.error) {
        throw new Error(response.error.message)
    }
    // Add to audit log
    const supabase = await createClient()
    const { data, error } = await supabase.from('quote_audit_log').insert({
        quote_request_id: quoteRequestId,
        event_type: 'EMAIL_SENT',
        user_id: profile?.id || 'system',
        user_name: profile ? `${profile.first_name} ${profile.last_name}` : 'MTech Team',
        details: { EMAIL_SENT: { sent_email_id: response.data.id, recipient_email: emailTo } },
        message: `Resent "${emailSubject}" Email to ${emailTo}`,
    })
    if (error) {
        throw new Error(error.message)
    }

    return response
}