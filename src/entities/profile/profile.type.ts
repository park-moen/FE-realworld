import { z } from 'zod';
import type { ProfileSchema } from './profile.contracts';

export type Profile = z.infer<typeof ProfileSchema>;
