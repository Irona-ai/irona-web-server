import { z } from 'zod'

export type RegisterPayload = z.infer<typeof RegisterSchema>
export const RegisterSchema = z
    .object({
        firstname: z.string().trim(),
        lastname: z.string().trim(),
        email: z.string().trim().email(),
        password: z.string().trim(),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
    })

export type LoginPayload = z.infer<typeof LoginSchema>
export const LoginSchema = z.object({
    email: z.string().email().trim(),
    password: z.string().trim(),
})
