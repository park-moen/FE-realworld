export interface ArticlePermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
  like: boolean;
  dislike: boolean;
}

export interface ProfilePermission {
  follow: boolean;
  unfollow: boolean;
  update: boolean;
}

export interface CommentPermission {
  create: boolean;
  read: boolean;
  delete: boolean;
}

export interface PermissionGroup {
  article: ArticlePermission;
  profile: ProfilePermission;
  comment: CommentPermission;
}
// 🎯 핵심: 리소스와 액션을 매핑

export interface ResourceActionMap {
  article: keyof ArticlePermission;
  profile: keyof ProfilePermission;
  comment: keyof CommentPermission;
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

export type Resource = keyof PermissionGroup;

type Action = ResourceActionMap[Resource];

export interface SessionPermission {
  guest: PermissionGroup;
  user: PermissionGroup;
  author: PermissionGroup;
  commenter: PermissionGroup;
  owner: PermissionGroup;
}

export type ContextRequirement<T extends Action> = T extends 'delete' | 'update' ? Context : never;
