import { NextRequest, NextResponse } from 'next/server';
import { sendWarrantyRequestEmails } from '@/utils/emails/actions/send-email';
import { warrantyRequestSchema } from '@/lib/validations/warranty';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract form fields
        const formFields = {
            firstName: formData.get('firstName') as string,
            lastName: formData.get('lastName') as string,
            email: formData.get('email') as string,
            businessName: formData.get('businessName') as string,
            customerPO: formData.get('customerPO') as string,
            phoneCode: formData.get('phoneCode') as string,
            phoneNumber: formData.get('phoneNumber') as string,
            hasWarranty: formData.get('hasWarranty') as string,
            manufacturer: formData.get('manufacturer') as string,
            repairTypes: JSON.parse(formData.get('repairTypes') as string || '[]'),
            partsSerialNumber: formData.get('partsSerialNumber') as string,
            atmSerialNumber: formData.get('atmSerialNumber') as string,
            message: formData.get('message') as string,
            issueDescription: formData.get('issueDescription') as string,
            acceptTerms: formData.get('acceptTerms') === 'true',
        };

        // Extract files
        const files: File[] = [];
        const fileEntries = formData.getAll('files') as File[];
        for (const file of fileEntries) {
            if (file && file.size > 0) {
                files.push(file);
            }
        }

        // Validate the form data
        const validatedData = warrantyRequestSchema.parse({
            ...formFields,
            files: files.length > 0 ? files : undefined,
        });

        // Generate a unique submission ID
        const submissionId = `WR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Send both emails
        const result = await sendWarrantyRequestEmails({
            firstName: validatedData.firstName,
            lastName: validatedData.lastName,
            email: validatedData.email,
            businessName: validatedData.businessName,
            customerPO: validatedData.customerPO,
            phoneCode: validatedData.phoneCode,
            phoneNumber: validatedData.phoneNumber,
            hasWarranty: validatedData.hasWarranty,
            manufacturer: validatedData.manufacturer,
            repairTypes: validatedData.repairTypes,
            partsSerialNumber: validatedData.partsSerialNumber,
            atmSerialNumber: validatedData.atmSerialNumber,
            message: validatedData.message,
            issueDescription: validatedData.issueDescription,
            files: validatedData.files,
            submissionId,
        });

        if (result.success) {
            return NextResponse.json(
                {
                    success: true,
                    message: 'Warranty request submitted successfully',
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
        console.error('Warranty request API error:', error);

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
