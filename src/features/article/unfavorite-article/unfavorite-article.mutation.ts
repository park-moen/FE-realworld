import { useMutation, useQueryClient, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { unfavoriteArticle } from '~shared/api/api.service';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { updateArticleInCache } from '~entities/article/article.cache';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import type { Article } from '~entities/article/article.type';

export function useUnfavoriteArticleMutation(
  options: Pick<UseMutationOptions<Article, DefaultError, string, { previousArticle: unknown }>, 'mutationKey'> = {},
) {
  const { mutationKey = [] } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['article', 'unfavorite', ...mutationKey],

    async mutationFn(slug: string) {
      const data = await unfavoriteArticle(slug);
      const article = transformArticleDtoToArticle(data);

      return article;
    },

    async onMutate(slug) {
      await queryClient.cancelQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY });

      const previousArticles = queryClient.getQueriesData({
        queryKey: ARTICLES_ROOT_QUERY_KEY,
      });

      queryClient.setQueriesData({ queryKey: ARTICLES_ROOT_QUERY_KEY }, (rawData: unknown) =>
        updateArticleInCache(rawData, slug, (article) => ({
          ...article,
          favorited: false,
          favoritesCount: article.favoritesCount !== 0 ? (article.favoritesCount || 0) - 1 : 0,
        })),
      );

      return { previousArticles };
    },

    async onError(_unusedError, _unusedVariables, onMutateResult) {
      queryClient.setQueriesData({ queryKey: ARTICLES_ROOT_QUERY_KEY }, onMutateResult?.previousArticles);
    },

    async onSettled() {
      await queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY });
    },
  });
}
