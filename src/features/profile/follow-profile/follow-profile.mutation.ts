import { useMutation, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { followProfile } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { ArticleSchema, ArticlesSchema } from '~entities/article/article.contracts';
import { profileQueryOptions } from '~entities/profile/profile.api';
import { transformProfileDtoToProfile } from '~entities/profile/profile.lib';
import type { Profile } from '~entities/profile/profile.type';

export function useFollowProfileMutation(
  options: Pick<
    UseMutationOptions<
      Profile,
      DefaultError,
      string,
      { previousArticles: unknown; previousProfile: Profile | undefined }
    >,
    'mutationKey' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['profile', 'follow', ...mutationKey],

    mutationFn: async (username: string) => {
      const data = await followProfile(username);
      const profile = transformProfileDtoToProfile(data);

      return profile;
    },

    onMutate: async (username) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: articleQueryKey }),
        queryClient.cancelQueries({ queryKey: profileQueryKey }),
      ]);

      const previousArticles = queryClient.getQueriesData({ queryKey: articleQueryKey });
      const previousProfile = queryClient.getQueryData(profileQueryKey);

      if (previousProfile) {
        queryClient.setQueryData(profileQueryKey, {
          ...previousProfile,
          following: true,
        });
      }

      queryClient.setQueriesData({ queryKey: articleQueryKey }, (rawData) => {
        if (!rawData) {
          return rawData;
        }

        const { data: article, ...articleResult } = ArticleSchema.safeParse(rawData);
        if (articleResult.success && article?.author.username === username) {
          return {
            ...article,
            author: { ...article.author, following: true },
          };
        }

        const { data: articlesData, ...articlesResult } = ArticlesSchema.safeParse(rawData);
        if (articlesResult.success && articlesData) {
          const { articles, articlesCount } = articlesData;
          const updatedArticles = Object.fromEntries(
            Object.entries(articles).map(([slug, RawArticle]) => [
              slug,
              RawArticle.author.username === username
                ? { ...RawArticle, author: { ...RawArticle.author, following: true } }
                : RawArticle,
            ]),
          );

          return { articles: updatedArticles, articlesCount };
        }

        return rawData;
      });

      return { previousArticles, previousProfile };
    },

    onSuccess,

    onError: async (error, username, onMutateResult, context) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;
      const { previousArticles, previousProfile } = onMutateResult || {};

      if (previousArticles) {
        queryClient.setQueriesData({ queryKey: articleQueryKey }, previousArticles);
      }

      if (previousProfile) {
        queryClient.setQueryData(profileQueryKey, previousProfile);
      }

      await onError?.(error, username, onMutateResult, context);
    },

    onSettled: async (data, error, username, onMutateResult, context) => {
      const articleQueryKey = ARTICLES_ROOT_QUERY_KEY;
      const profileQueryKey = profileQueryOptions(username).queryKey;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: articleQueryKey }),
        queryClient.invalidateQueries({ queryKey: profileQueryKey }),
        onSettled?.(data, error, username, onMutateResult, context),
      ]);
    },
  });
}
