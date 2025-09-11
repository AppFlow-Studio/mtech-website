import { z } from 'zod';

export const agentApplicationSchema = z.object({
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phoneCode: z.string().min(1, 'Phone code is required'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    voidCheck: z.array(z.instanceof(File)).optional(),
    photoId: z.array(z.instanceof(File)).optional(),
    ein: z.array(z.instanceof(File)).optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
        message: 'You must accept the terms and conditions',
    }),
});

export type AgentApplicationValues = z.infer<typeof agentApplicationSchema>;
