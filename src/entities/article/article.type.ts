import type { z } from 'zod';
import type { ArticleSchema } from './article.contracts';

export type Article = z.infer<typeof ArticleSchema>;
