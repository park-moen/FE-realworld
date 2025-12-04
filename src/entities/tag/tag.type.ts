import { z } from 'zod';
import type { TagsSchema } from './tag.contracts';

export type Tags = z.infer<typeof TagsSchema>;
