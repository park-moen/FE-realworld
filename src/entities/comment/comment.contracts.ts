import { z } from 'zod';
import { CommentDtoSchema } from '~shared/api/api.schemas';

export const CommentSchema = CommentDtoSchema.shape.comment;
export const CommentsSchema = z.array(CommentSchema);
