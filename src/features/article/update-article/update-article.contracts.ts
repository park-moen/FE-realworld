import { z } from 'zod';
import { CreateArticleDtoSchema } from '~shared/api/api.schemas';

export const UpdateArticleSchema = CreateArticleDtoSchema.shape.article.partial().extend({
  slug: z.string().min(1),
  tagList: z.string().optional(),
});
