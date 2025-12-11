import { z } from 'zod';
import type { UpdateUserSchema } from './update.contracts';

export type UpdateUser = z.infer<typeof UpdateUserSchema>;
