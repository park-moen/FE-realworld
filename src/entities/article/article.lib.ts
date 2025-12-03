import type { ArticleDto } from '~shared/api/api.schemas';
import type { Article } from './article.type';

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
