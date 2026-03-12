import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .email({ message: 'Invalid email' })
      .min(1, { message: 'Email is required' })
      .toLowerCase()
      .trim(),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, { message: 'Reset token is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  }),
});
