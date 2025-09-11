import { NextRequest, NextResponse } from 'next/server';
import { sendAgentApplicationEmails } from '@/utils/emails/actions/send-email';
import { agentApplicationSchema } from '@/lib/validations/agent';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract form fields
        const formFields = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            companyName: formData.get('companyName') as string,
            email: formData.get('email') as string,
            phoneCode: formData.get('phoneCode') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            acceptTerms: formData.get('acceptTerms') === 'true',
        };

        // Extract files
        const voidCheckFiles: File[] = [];
        const photoIdFiles: File[] = [];
        const einFiles: File[] = [];

        const voidCheckEntries = formData.getAll('voidCheck') as File[];
        for (const file of voidCheckEntries) {
            if (file && file.size > 0) {
                voidCheckFiles.push(file);
            }
        }

        const photoIdEntries = formData.getAll('photoId') as File[];
        for (const file of photoIdEntries) {
            if (file && file.size > 0) {
                photoIdFiles.push(file);
            }
        }

        const einEntries = formData.getAll('ein') as File[];
        for (const file of einEntries) {
            if (file && file.size > 0) {
                einFiles.push(file);
            }
        }

        // Validate the form data
        const validatedData = agentApplicationSchema.parse({
            ...formFields,
            voidCheck: voidCheckFiles.length > 0 ? voidCheckFiles : undefined,
            photoId: photoIdFiles.length > 0 ? photoIdFiles : undefined,
            ein: einFiles.length > 0 ? einFiles : undefined,
        });

        // Generate a unique submission ID
        const submissionId = `AA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Send both emails
        const result = await sendAgentApplicationEmails({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            companyName: validatedData.companyName,
            phoneCode: validatedData.phoneCode,
            phoneNumber: validatedData.phoneNumber,
            voidCheck: validatedData.voidCheck,
            photoId: validatedData.photoId,
            ein: validatedData.ein,
            submissionId,
        });

        if (result.success) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Agent application submitted successfully',
                    submissionId: submissionId,
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.error || 'Failed to submit agent application',
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Error processing agent application:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Invalid form data or validation error',
            },
            { status: 400 }
        );
    }
}
