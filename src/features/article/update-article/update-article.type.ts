import type { z } from 'zod';
import type { UpdateArticleSchema } from './update-article.contracts';

export type UpdateArticle = z.infer<typeof UpdateArticleSchema>;
