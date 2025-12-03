import type { z } from 'zod';
import type { ArticleSchema, FilterQuerySchema } from './article.contracts';

export type Article = z.infer<typeof ArticleSchema>;
export type FilterQuery = z.infer<typeof FilterQuerySchema>;
