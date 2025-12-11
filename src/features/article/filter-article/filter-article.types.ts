import { z } from 'zod';
import type {
  BaseLoaderArgsSchema,
  PrimaryLoaderArgsSchema,
  SecondaryLoaderArgsSchema,
} from './filter-article.contracts';

export type BaseLoaderArgs = z.infer<typeof BaseLoaderArgsSchema>;
export type PrimaryLoaderArgs = z.infer<typeof PrimaryLoaderArgsSchema>;
export type SecondaryLoaderArgs = z.infer<typeof SecondaryLoaderArgsSchema>;
