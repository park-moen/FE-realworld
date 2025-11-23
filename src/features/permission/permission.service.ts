import { useSelector } from 'react-redux';
import { store } from '~shared/store';
import { selectSession } from '~entities/session/session.model';
import type { User } from '~entities/session/session.type';
import type {
  SessionPermission,
  Context,
  ArticleContext,
  CommentContent,
  ProfileContext,
  PermissionGroup,
  Resource,
  ResourceActionMap,
} from './permission.types';

const DEFAULT_PERMISSION = {
  article: {
    create: false,
    read: true,
    update: false,
    delete: false,
    like: false,
    dislike: false,
  },
  profile: {
    follow: false,
    unfollow: false,
    update: false,
  },
  comment: {
    create: false,
    read: false,
    delete: false,
  },
} as const;

function extendPermissions(
  base: PermissionGroup,
  overrides: Partial<{
    article: Partial<PermissionGroup['article']>;
    profile: Partial<PermissionGroup['profile']>;
    comment: Partial<PermissionGroup['comment']>;
  }>,
): PermissionGroup {
  return {
    article: { ...base.article, ...overrides.article },
    profile: { ...base.profile, ...overrides.profile },
    comment: { ...base.comment, ...overrides.comment },
  };
}

const GUEST_PERMISSIONS: PermissionGroup = {
  ...DEFAULT_PERMISSION,
  article: { ...DEFAULT_PERMISSION.article, read: true },
};

const USER_PERMISSIONS: PermissionGroup = extendPermissions(GUEST_PERMISSIONS, {
  article: { create: true, like: true, dislike: true },
  profile: { follow: true, unfollow: true },
  comment: { create: true, read: true },
});

const AUTHOR_PERMISSIONS: PermissionGroup = extendPermissions(USER_PERMISSIONS, {
  article: { update: true, delete: true },
});

const COMMENT_PERMISSIONS: PermissionGroup = extendPermissions(USER_PERMISSIONS, {
  comment: { delete: true },
});

const OWNER_PERMISSIONS: PermissionGroup = extendPermissions(USER_PERMISSIONS, {
  profile: { update: true },
});

const sessionPermission: SessionPermission = {
  guest: GUEST_PERMISSIONS,
  user: USER_PERMISSIONS,
  author: AUTHOR_PERMISSIONS,
  commenter: COMMENT_PERMISSIONS,
  owner: OWNER_PERMISSIONS,
};

function hasProperty<T extends Context, K extends keyof T>(context: Context, key: K): context is T {
  return key in context;
}

function isArticleContext(context: Context): context is ArticleContext {
  return hasProperty<ArticleContext, 'articleAuthorId'>(context, 'articleAuthorId');
}

function isCommentContext(context: Context): context is CommentContent {
  return hasProperty<CommentContent, 'commentAuthorId'>(context, 'commentAuthorId');
}

function isProfileContext(context: Context): context is ProfileContext {
  return hasProperty<ProfileContext, 'profileOwnerId'>(context, 'profileOwnerId');
}

function getRole(session: User | null | undefined, context?: Context): keyof SessionPermission {
  if (!session) return 'guest';
  if (!context) return 'user';

  if (isArticleContext(context) && context.articleAuthorId === session.username) {
    return 'author';
  }

  if (isCommentContext(context) && context.commentAuthorId === session.username) {
    return 'commenter';
  }

  if (isProfileContext(context) && context.profileOwnerId === session.username) {
    return 'owner';
  }

  return 'user';
}

export function useCanPerformAction<R extends Resource>(
  action: ResourceActionMap[R],
  resource: R,
  context?: Context,
): boolean {
  const session = useSelector(selectSession);
  const role = getRole(session, context);
  const permissions = sessionPermission[role];

  const resourcePermissions = permissions[resource] as any;
  return resourcePermissions[action] ?? false;
}

export function canPerformAction<R extends Resource>(
  action: ResourceActionMap[R],
  resource: R,
  context?: Context,
): boolean {
  const { session } = store.getState();
  const role = getRole(session, context);
  const permissions = sessionPermission[role];

  const resourcePermissions = permissions[resource] as any;
  return resourcePermissions[action] ?? false;
}
