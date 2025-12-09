import type { UpdateArticleDto } from '~shared/api/api.schemas';
import type { Article } from '~entities/article/article.type';
import type { UpdateArticle } from './update-article.type';

export function transformUpdateArticleToUpdateArticleDto(updateArticle: UpdateArticle): UpdateArticleDto {
  const { title, description, body, tagList } = updateArticle;

  return {
    article: {
      title,
      description,
      body,
      tagList: tagList?.split(', ').filter(Boolean),
    },
  };
}

export function transformArticleToUpdateArticle(article: Article): UpdateArticle {
  const { slug, title, description, body, tags } = article;

  return {
    slug,
    title,
    description,
    body,
    tagList: tags.join(', '),
  };
}
