import { Suspense, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoAdd, IoHeart, IoPencil } from 'react-icons/io5';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { articleQueryOptions } from '~entities/article/article.api';
import type { Article } from '~entities/article/article.type';
import type { Profile } from '~entities/profile/profile.type';
import { DeleteArticleButton } from '~features/article/delete-article/delete-article.ui';
import { FavoriteArticleExtendedButton } from '~features/article/favorite-article/favorite-article.ui';
import { UnfavoriteArticleExtendedButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { FollowUserButton } from '~features/profile/follow-profile/follow.profile.ui';
import { UnfollowUserProfile } from '~features/profile/unfollow-profile/unfollow-profile.ui';
import { CommentsFeed } from '~widgets/comments-feed/comments-feed.ui';
import type { ArticleLoaderArgs } from './article-page.loader';
import { ArticlePageSkeleton } from './article-page.skeleton';

export default function ArticlePage() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlePageSkeleton />}>
        <BaseArticlePage />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseArticlePage() {
  const {
    params: { slug },
  } = useLoaderData<ArticleLoaderArgs>();
  const { data: article } = useSuspenseQuery(articleQueryOptions(slug));

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} actions={<ArticleActions article={article} />} />
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div>
              <p>{article.body}</p>
            </div>
            <ul className="tag-list">
              {article.tags.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <ArticleMeta article={article} actions={<ArticleActions article={article} />} />
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <CommentsFeed slug={slug} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleMeta({ article, actions }: { article: Article; actions?: ReactNode }) {
  const { author, updatedAt } = article;
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-meta">
      <Link to={pathKey.profile.byUsername(author.username)}>
        <Avatar src={author.image} alt={author.username} size="md" />
      </Link>

      <div className="info">
        <Link to={pathKey.profile.byUsername(author.username)} className="author">
          {author.username}
        </Link>
        <span className="date">{formattedDate}</span>
      </div>
      {actions}
    </div>
  );
}

function ArticleActions({ article }: { article: Article }) {
  const { author } = article;

  const canUpdateArticle = useCanPerformAction('update', 'article', {
    articleAuthorId: author.username,
  });
  const canDeleteArticle = useCanPerformAction('delete', 'article', {
    articleAuthorId: author.username,
  });

  return (
    <>
      {canUpdateArticle && <EditArticleLink slug={article.slug} />}
      {!canUpdateArticle && <ToggleFollowProfile profile={{ ...author, following: false }} />}
      {canDeleteArticle && <DeleteArticleButton slug={article.slug} />}
      {!canDeleteArticle && <ToggleFavoriteArticle article={article} />}
    </>
  );
}

function ToggleFollowProfile({ profile }: { profile: Profile }) {
  const { following, username } = profile;

  const canFollowProfile = useCanPerformAction('follow', 'profile');
  const canUnfollowProfile = useCanPerformAction('unfollow', 'profile');
  const cannotFollowOrUnfollow = !canFollowProfile || !canUnfollowProfile;

  const canFollow = canFollowProfile && !following;
  const canUnfollow = canUnfollowProfile && following;

  return (
    <>
      {canFollow && <FollowUserButton username={username} />}
      {canUnfollow && <UnfollowUserProfile username={username} />}
      {cannotFollowOrUnfollow && <NavigateToLoginButtonFollow username={profile.username} />}
    </>
  );
}

function ToggleFavoriteArticle({ article }: { article: Article }) {
  const { favorited, favoritesCount } = article;

  const canLikeArticle = useCanPerformAction('like', 'article');
  const canDisLikeArticle = useCanPerformAction('dislike', 'article');
  const cannotLikeOrDislike = !canLikeArticle && !canDisLikeArticle;
  const canLike = canLikeArticle && !favorited;
  const canDislike = canDisLikeArticle && favorited;

  return (
    <>
      {canLike && <FavoriteArticleExtendedButton article={article} />}
      {canDislike && <UnfavoriteArticleExtendedButton article={article} />}
      {cannotLikeOrDislike && <NavigateToLoginButtonFavorite favoritesCount={favoritesCount ?? 0} />}
    </>
  );
}

function EditArticleLink({ slug }: { slug: string }) {
  return (
    <Link to={pathKey.editor.bySlug(slug)} className="btn btn-outline-secondary btn-sm">
      <IoPencil size={16} />
      Edit Article
    </Link>
  );
}

function NavigateToLoginButtonFollow({ username }: { username: string }) {
  const navigate = useNavigate();

  const onClick = () => navigate(pathKey.login);

  return (
    <Button color="secondary" variant="outline" className="action-btn" onClick={onClick}>
      <IoAdd size={16} />
      Follow {username}
    </Button>
  );
}

function NavigateToLoginButtonFavorite({ favoritesCount }: { favoritesCount: number }) {
  const navigate = useNavigate();

  const onClick = () => navigate(pathKey.login);

  return (
    <Button color="primary" variant="outline" onClick={onClick}>
      <IoHeart size={16} />
      Favorite Article
      <span className="counter">({favoritesCount})</span>
    </Button>
  );
}
