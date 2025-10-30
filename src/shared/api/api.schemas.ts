import { z } from 'zod';

export const RegisterUserDtoSchema = z.object({
  user: z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

export const UserDtoSchema = z.object({
  user: z.object({
    username: z.string(),
    email: z.string(),
    token: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
