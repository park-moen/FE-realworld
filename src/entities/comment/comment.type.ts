import { z } from 'zod';
import type { CommentSchema, CommentsSchema } from './comment.contracts';

export type Comment = z.infer<typeof CommentSchema>;
export type Comments = z.infer<typeof CommentsSchema>;
