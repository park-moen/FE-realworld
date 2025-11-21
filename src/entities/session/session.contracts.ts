import { z } from 'zod';

export const UserSchema = z.object({
  email: z.email(),
  token: z.jwt(),
  username: z.string().min(1),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});
