import { Suspense, type ReactNode } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { IoHeart } from 'react-icons/io5';
import { Link, useLoaderData, useNavigate, useSearchParams } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { Avatar } from '~shared/ui/avatar/avatar.ui';
import { Button } from '~shared/ui/button/button.ui';
import { logError } from '~shared/ui/error-handler/error-handler.lib';
import { ErrorHandler } from '~shared/ui/error-handler/error-handler.ui';
import { Stack } from '~shared/ui/stack/stack.ui';
import { articlesQueryOptions } from '~entities/article/article.api';
import type { Article } from '~entities/article/article.type';
import { FavoriteArticleBriefButton } from '~features/article/favorite-article/favorite-article.ui';
import type { BaseLoaderArgs } from '~features/article/filter-article/filter-article.types';
import { UnfavoriteArticleBriefButton } from '~features/article/unfavorite-article/unfavorite-article.ui';
import { useCanPerformAction } from '~features/permission/permission.service';
import { ArticlesFeedSkeleton } from './articles-feed.skeleton';

interface ArticleMetaProps {
  article: Article;
  action?: ReactNode;
}

export function ArticlesFeed() {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler} onError={logError}>
      <Suspense fallback={<ArticlesFeedSkeleton />}>
        <BaseArticlesFeed />
      </Suspense>
    </ErrorBoundary>
  );
}

function BaseArticlesFeed() {
  const {
    context: { filterQuery },
  } = useLoaderData<BaseLoaderArgs>();
  const [, setSearchParams] = useSearchParams();
  const { data } = useSuspenseQuery(articlesQueryOptions(filterQuery));

  const onPageClick = (page: string) => () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', page);

      return next;
    });
  };

  return (
    <>
      {Object.values(data.articles || 0).map((article) => (
        <ArticleMeta key={article.slug} article={article} action={<FavoriteArticleAction article={article} />} />
      ))}

      {data.articlesCount === 0 && <div className="article-preview">No Articles are here... yet.</div>}

      {data.articlesCount > 10 && (
        <ul className="pagination" data-test="pagination">
          {Array(Math.ceil(data.articlesCount / 10))
            .fill(0)
            .map((_, i) => (i + 1).toString())
            .map((page) => (
              <li key={page} className={`page-item ${Number(page) === filterQuery.page ? 'active' : ''}`}>
                <button className="page-link" type="button" onClick={onPageClick(page)}>
                  {page}
                </button>
              </li>
            ))}
        </ul>
      )}
    </>
  );
}

function ArticleMeta({ article, action }: ArticleMetaProps) {
  const { author, updatedAt } = article;

  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(updatedAt));

  return (
    <div className="article-preview">
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

        {action}
      </div>

      <Link to={pathKey.article.bySlug(article.slug)} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tags.map((tag) => (
            <li key={tag} className="tag-default tag-pill tag-outline">
              {tag}
            </li>
          ))}
        </ul>
      </Link>
    </div>
  );
}

function FavoriteArticleAction({ article }: { article: Article }) {
  const canLike = useCanPerformAction('like', 'article');
  const canDislike = useCanPerformAction('dislike', 'article');
  const canLikeArticle = canLike && !article.favorited;
  const canDislikeArticle = canDislike && article.favorited;
  const cannotLikeAndDislikeArticle = !canLike && !canDislike;

  return (
    <>
      {canLikeArticle && (
        <div className="pull-xs-right">
          <FavoriteArticleBriefButton article={article} />
        </div>
      )}

      {canDislikeArticle && (
        <div className="pull-xs-right">
          <UnfavoriteArticleBriefButton article={article} />
        </div>
      )}

      {cannotLikeAndDislikeArticle && (
        <div className="pull-xs-right">
          <NavigateToLoginButton favoritesCount={article.favoritesCount ?? 0} />
        </div>
      )}
    </>
  );
}

function NavigateToLoginButton({ favoritesCount }: { favoritesCount: number }) {
  const navigate = useNavigate();

  const onClick = () => navigate(pathKey.login);

  return (
    <Button color="primary" variant="outline" onClick={onClick}>
      <Stack direction="row" justifyContent="space-evenly">
        <IoHeart size={16} />
        {Boolean(favoritesCount) && favoritesCount}
      </Stack>
    </Button>
  );
}
