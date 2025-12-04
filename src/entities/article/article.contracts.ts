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

export const ArticlesSchema = z.object({
  articles: z.record(z.string(), ArticleSchema),
  articlesCount: z.number(),
});

export const FilterQuerySchema = z.object({
  page: z.coerce.number().int().positive({ error: 'Page must be a positive number' }),
  limit: z.coerce.number().int().positive().max(100).default(20),
  source: z.enum(['user', 'global']),

  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});
