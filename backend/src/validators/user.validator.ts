import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    role: z.enum(['ADMIN', 'PRODUCT_MANAGER', 'PRODUCT_OWNER', 'DEVELOPER', 'MARKETING', 'HR', 'QA']),
    department: z.string().min(1, 'Department is required'),
    avatar: z.string().url().optional().or(z.string().length(0)).optional(),
  }),
});
