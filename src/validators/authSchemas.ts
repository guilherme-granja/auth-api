import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z
      .email({ message: 'Invalid email' })
      .min(1, { message: 'Email is required' })
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .email({ message: 'Invalid email' })
      .min(1, { message: 'Email is required' })
      .toLowerCase()
      .trim(),
    password: z.string().min(1, { message: 'Password is required' }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
  }),
});

export const logoutSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' }),
  }),
});
