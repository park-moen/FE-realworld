import { z } from 'zod';

export const UserSchema = z.object({
  email: z.email(),
  token: z.jwt(),
  username: z.string().nonempty(),
  bio: z.string().nullable(),
  image: z.string().nullable(),
});
