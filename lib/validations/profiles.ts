// src/lib/validations/profile.ts
import * as z from 'zod'

export const profileSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['ADMIN', 'AGENT', 'USER']),
})

export type ProfileFormData = z.infer<typeof profileSchema>