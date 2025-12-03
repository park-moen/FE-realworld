import { queryOptions } from '@tanstack/react-query';
import { getArticleBySlug } from '~shared/api/api.service';
import { transformArticleDtoToArticle } from './article.lib';

export const articleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['articles', slug],

    queryFn: async ({ signal }) => {
      const data = await getArticleBySlug(slug, { signal });
      const article = transformArticleDtoToArticle(data);

      return article;
    },
  });
