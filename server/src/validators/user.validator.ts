import { z } from 'zod';

export type UserPayload = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
    userId: z.string().trim(),
    primaryEmailAddress: z.string().trim().email(),
});
