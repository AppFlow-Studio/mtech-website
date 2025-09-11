import { z } from 'zod';

export const warrantyRequestSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    businessName: z.string().min(2, 'Business name must be at least 2 characters'),
    customerPO: z.string().min(1, 'Customer PO is required'),
    phoneCode: z.string().min(1, 'Phone code is required'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    hasWarranty: z.enum(['yes', 'no'], {
        required_error: 'Please select warranty status',
    }),
    manufacturer: z.string().min(1, 'Please select a manufacturer'),
    repairTypes: z.array(z.string()).min(1, 'Please select at least one repair type'),
    partsSerialNumber: z.string().min(1, 'Parts serial number is required'),
    atmSerialNumber: z.string().min(1, 'ATM serial number is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    issueDescription: z.string().min(10, 'Issue description must be at least 10 characters'),
    files: z.array(z.instanceof(File)).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
});

export type WarrantyRequestValues = z.infer<typeof warrantyRequestSchema>;
