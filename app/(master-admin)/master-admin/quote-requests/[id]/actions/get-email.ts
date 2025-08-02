'use server'

import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_KEY);

//RESPONSE FORMAT FROM RESEND {
//     "object": "email",
//     "id": "4ef9a417-02e9-4d39-ad75-9611e0fcc33c",
//     "to": ["delivered@resend.dev"],
//     "from": "Acme <onboarding@resend.dev>",
//     "created_at": "2023-04-03T22:13:42.674981+00:00",
//     "subject": "Hello World",
//     "html": "Congrats on sending your <strong>first email</strong>!",
//     "text": null,
//     "bcc": [null],
//     "cc": [null],
//     "reply_to": [null],
//     "last_event": "delivered"
//   }

export async function getEmail(emailId: string) {
    const response = await resend.emails.get(emailId)
    if (response.error) {
        throw new Error(response.error.message)
    }
    return response
}