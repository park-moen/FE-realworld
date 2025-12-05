import { z } from 'zod';

export const RegisterUserDtoSchema = z.object({
  user: z.object({
    username: z.string(),
    email: z.string(),
    password: z.string(),
  }),
});

export const LoginUserDtoSchema = z.object({
  user: z.object({
    email: z.email(),
    password: z.string().min(8),
  }),
});

export const UserDtoSchema = z.object({
  user: z.object({
    username: z.string(),
    email: z.string(),
    token: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
  }),
});

export const RefreshResponseDtoSchema = z.object({
  user: z.object({
    token: z.jwt(),
  }),
});

export const ProfileDtoSchema = z.object({
  profile: z.object({
    username: z.string(),
    bio: z.string().nullable(),
    image: z.string().nullable(),
    following: z.boolean(),
  }),
});

export const ArticleDtoSchema = z.object({
  article: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string(),
    body: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    favorited: z.boolean().nullable(),
    favoritesCount: z.number().nullable(),
    tags: z.string().array(),
    author: z.object({
      username: z.string(),
      bio: z.string().nullable(),
      image: z.string().nullable(),
      // following: z.boolean(),
    }),
  }),
});

export const ArticlesDtoSchema = z.object({
  articles: z.array(ArticleDtoSchema.shape.article),
  articlesCount: z.number(),
});

export const FilterQueryDtoSchema = z.object({
  limit: z.number().optional().default(20),
  offset: z.number().optional().default(0),
  tag: z.string().optional(),
  author: z.string().optional(),
  favorited: z.string().optional(),
});

export const CommentDtoSchema = z.object({
  comment: z.object({
    id: z.uuid(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
    body: z.string(),
    author: ProfileDtoSchema.shape.profile,
  }),
});

export const CommentsDtoSchema = z.object({
  comments: z.array(CommentDtoSchema.shape.comment),
});

export const CreateCommentDtoSchema = z.object({
  comment: z.object({
    body: z.string().min(1),
  }),
});

export const TagsDtoSchema = z.object({
  tags: z.array(z.string()),
});

export type RegisterUserDto = z.infer<typeof RegisterUserDtoSchema>;
export type LoginUserDto = z.infer<typeof LoginUserDtoSchema>;
export type UserDto = z.infer<typeof UserDtoSchema>;
export type RefreshResponseDto = z.infer<typeof RefreshResponseDtoSchema>;

export type ProfileDto = z.infer<typeof ProfileDtoSchema>;

export type ArticleDto = z.infer<typeof ArticleDtoSchema>;
export type ArticlesDto = z.infer<typeof ArticlesDtoSchema>;
export type FilterQueryDto = z.infer<typeof FilterQueryDtoSchema>;

export type CommentDto = z.infer<typeof CommentDtoSchema>;
export type CommentsDto = z.infer<typeof CommentsDtoSchema>;
export type CreateCommentDto = z.infer<typeof CreateCommentDtoSchema>;

export type TagsDto = z.infer<typeof TagsDtoSchema>;
