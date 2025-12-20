import { Suspense, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Link } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import type { Comment } from '~entities/comment/comment.type';
import { CreateCommentForm } from '~features/comment/create-comment/create-comment.ui';
import { DeleteCommentButton } from '~features/comment/delete-comment/delete-comment.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { CommentsListSkeleton } from './comments-feed.skeleton';

interface CommonCommentsProps {
  slug: string;
}

export function CommentsFeed({ slug }: CommonCommentsProps) {
  const canCreateComment = useCanPerformAction('create', 'comment');

  return (
    <>
      {!canCreateComment && (
        <p>
          <Link to={pathKey.login}>Sign in</Link> or <Link to={pathKey.register}>sign up</Link>
          to add comments on this article.
        </p>
      )}
      {canCreateComment && <CreateCommentForm slug={slug} />}
      <CommentList slug={slug} />
    </>
  );
}

function CommentList({ slug }: CommonCommentsProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<CommentsListSkeleton />}>
        <BaseCommentList slug={slug} />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseCommentList({ slug }: CommonCommentsProps) {
  const { data: comments } = useSuspenseQuery(commentsQueryOptions(slug));

  return (
    <div>
      {Array.from(comments.values())
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            actions={<DeleteCommentAction slug={slug} comment={comment} />}
          />
        ))}
    </div>
  );
}

function CommentCard({ comment, actions }: { comment: Comment; actions?: ReactNode }) {
  const { id: commentId, body, author, updatedAt } = comment;
  const { username, image } = author;
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div key={commentId} className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>

      <div className="card-footer">
        <Link to={pathKey.profile.byUsername(username)} className="comment-author">
          <Avatar src={image} alt={username} size="md" />
        </Link>

        <Link to={pathKey.profile.byUsername(username)} className="comment-author">
          {username}
        </Link>
        <span className="date-posted">{formattedDate}</span>
        {actions}
      </div>
    </div>
  );
}

function DeleteCommentAction({ slug, comment }: { slug: string; comment: Comment }) {
  const { author, id: commentId } = comment;

  const canDeleteComment = useCanPerformAction('delete', 'comment', {
    commentAuthorId: author.username,
  });

  return canDeleteComment && <DeleteCommentButton slug={slug} commentId={commentId} />;
}
