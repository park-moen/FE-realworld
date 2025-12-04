import type { ArticleDto, ArticlesDto, FilterQueryDto } from '~shared/api/api.schemas';
import type { Article, Articles, FilterQuery } from './article.type';

export function transformArticleDtoToArticle(articleDto: ArticleDto): Article {
  const { article } = articleDto;

  return {
    ...article,
    favorited: article.favorited ?? false,
    favoritesCount: article.favoritesCount ?? 0,
    author: {
      ...article.author,
      image: article.author.image ?? '',
      bio: article.author.bio ?? '',
    },
  };
}

export function transformArticlesDtoToArticles(articlesDto: ArticlesDto): Articles {
  const { articles, articlesCount } = articlesDto;

  return {
    articles: Object.fromEntries(articles.map((article) => [article.slug, transformArticleDtoToArticle({ article })])),
    articlesCount,
  };
}

export function transformFilterQueryToFilterQueryDto(filterQuery: FilterQuery): FilterQueryDto {
  const { page, limit, source, ...otherParams } = filterQuery;
  const offset = (page - 1) * limit;

  return {
    ...otherParams,
    offset,
    limit,
  };
}
