import { z } from 'zod';

export type UserPayload = z.infer<typeof UserSchema>;
export const UserSchema = z.object({
    userId: z.string().trim(),
    primaryEmailAddress: z.string().trim().email(),
});

export type ApiTokenPayload = z.infer<typeof ApiTokenSchema>;
export const ApiTokenSchema = z.object({
    name: z.string().trim(),
    secretToken: z.string().trim(),
    userId: z.string().trim(),
});
