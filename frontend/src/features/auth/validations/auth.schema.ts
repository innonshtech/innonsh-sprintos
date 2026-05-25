import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
  role: z.string().min(1, 'Role is required.'),
  department: z.string().min(1, 'Department is required.'),
  rememberMe: z.boolean().default(false),
});

export type SignInFormValues = z.infer<typeof signInSchema>;

