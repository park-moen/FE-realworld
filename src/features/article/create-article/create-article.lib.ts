import type { CreateArticleDto } from '~shared/api/api.schemas';
import type { CreateArticle } from './create-article.type';

export function transformCreateArticleToCreateArticleDto(createArticle: CreateArticle): CreateArticleDto {
  const { title, description, body, tagList } = createArticle;

  return {
    article: {
      title,
      description,
      body,
      tagList: tagList?.split(', ').filter(Boolean),
    },
  };
}
