import { z } from 'zod';
import { CreateArticleSchema } from './create-article.contracts';

export type CreateArticle = z.infer<typeof CreateArticleSchema>;
