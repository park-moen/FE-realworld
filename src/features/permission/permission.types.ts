interface ArticlePermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  like: boolean;
  dislike: boolean;
  [key: string]: boolean | undefined;
}

interface ProfilePermission {
  follow: boolean;
  unfollow: boolean;
  update: boolean;
  [key: string]: boolean | undefined;
}

interface CommentPermission {
  create: boolean;
  read: boolean;
  delete: boolean;
  [key: string]: boolean | undefined;
}

export interface PermissionGroup {
  article: ArticlePermission;
  profile: ProfilePermission;
  comment: CommentPermission;
}

export interface ArticleContext {
  articleAuthorId: string;
}
export interface CommentContent {
  commentAuthorId: string;
}
export interface ProfileContext {
  profileOwnerId: string;
}
export type Context = ArticleContext | CommentContent | ProfileContext;

export type Action = keyof ArticlePermission | keyof ProfilePermission | keyof CommentPermission;
export type Resource = keyof PermissionGroup;

export interface SessionPermission {
  guest: PermissionGroup;
  user: PermissionGroup;
  author: PermissionGroup;
  commenter: PermissionGroup;
  owner: PermissionGroup;
}

export type ContextRequirement<T extends Action> = T extends 'delete' | 'update' ? Context : never;
