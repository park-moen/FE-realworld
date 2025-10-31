import { z } from 'zod';

export const RegisterUserSchema = z.object({
  username: z.string().min(5, { error: 'Username must be at least 5 characters long' }),
  email: z.email({
    error:
      'Oops! The email address you entered is invalid. Please double-check and make sure it follows the format: example@domain.com',
  }),
  password: z.string().min(8, { error: 'Your password must be at least 8 characters longs. Please try again.' }),
});

export type RegisterUser = z.infer<typeof RegisterUserSchema>;
