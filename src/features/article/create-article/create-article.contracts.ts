import { z } from 'zod';

export const CreateArticleSchema = z.object({
  title: z.string().min(1, {
    error: 'The article title must contain at least 1 character',
  }),
  description: z.string().min(1, {
    error: 'The article description must contain at least 1 character',
  }),
  body: z.string().min(1, {
    error: 'The article body must contain at least 1 character',
  }),
  tagList: z.string().optional(),
});
