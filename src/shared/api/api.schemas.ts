import { z } from 'zod';

export const RegisterUserDtoSchema = z.object({
  user: z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

export const LoginUserDtoSchema = z.object({
  user: z.object({
    email: z.email(),
    password: z.string().min(8),
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

export const RefreshResponseDtoSchema = z.object({
  user: z.object({
    token: z.jwt(),
  }),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type RefreshResponseDto = z.infer<typeof RefreshResponseDtoSchema>;
