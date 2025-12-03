import { z } from 'zod';

export const ArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  favorited: z.boolean().nullable(),
  favoritesCount: z.number().nullable(),
  tags: z.string().array(),
  author: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    // following: z.boolean(),
  }),
});
