import { keepPreviousData, queryOptions } from '@tanstack/react-query';
import { getAllArticles, getArticleBySlug } from '~shared/api/api.service';
import {
  transformArticleDtoToArticle,
  transformArticlesDtoToArticles,
  transformFilterQueryToFilterQueryDto,
} from './article.lib';
import type { FilterQuery } from './article.type';

export const articleQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['articles', slug],

    queryFn: async ({ signal }) => {
      const data = await getArticleBySlug(slug, { signal });
      const article = transformArticleDtoToArticle(data);

      return article;
    },
  });

export const articlesQueryOptions = (filter: FilterQuery) => {
  const filterDto = transformFilterQueryToFilterQueryDto(filter);

  return queryOptions({
    queryKey: ['articles', filter],

    queryFn: async ({ signal }) => {
      const config = { signal, params: filterDto };

      const data = await getAllArticles(config);
      const articles = transformArticlesDtoToArticles(data);

      return articles;
    },

    placeholderData: keepPreviousData,
  });
};
