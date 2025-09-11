import { NextRequest, NextResponse } from 'next/server';
import { sendContactFormEmails } from '@/utils/emails/actions/send-email';
import { contactFormSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate the form data
        const validatedData = contactFormSchema.parse(body);

        // Generate a unique submission ID
        const submissionId = `CF-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Send both emails
        const result = await sendContactFormEmails({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message,
            submissionId,
        });

        if (result.success) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Contact form submitted successfully',
                    submissionId
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to send emails'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Contact form API error:', error);

        if (error instanceof Error && error.name === 'ZodError') {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid form data',
                    details: error.message
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error'
            },
            { status: 500 }
        );
    }
}
