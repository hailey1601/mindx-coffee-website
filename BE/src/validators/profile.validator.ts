import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(100).optional().or(z.literal('')),
  bio: z.string().trim().max(200).optional().or(z.literal('')),
  phone: z.string().trim().min(7).max(20).optional().or(z.literal(''))
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

