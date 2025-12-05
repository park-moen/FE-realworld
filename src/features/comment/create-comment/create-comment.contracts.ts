import { z } from 'zod';

export const CreateCommentSchema = z.object({
  slug: z.string().min(1),
  body: z.string().min(1, { error: 'The Comment body must contain at least 1 character' }),
});
