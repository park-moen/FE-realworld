import { useMutation, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { createArticle } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import type { Article } from '~entities/article/article.type';
import { transformCreateArticleToCreateArticleDto } from './create-article.lib';
import type { CreateArticle } from './create-article.type';

export function useCreateArticleMutation(
  options: Pick<UseMutationOptions<Article, DefaultError, CreateArticle>, 'mutationKey' | 'onSuccess'> = {},
) {
  const { mutationKey = [], onSuccess } = options;

  return useMutation({
    mutationKey: ['article', 'create', ...mutationKey],

    mutationFn: async (createArticleData: CreateArticle) => {
      const createArticleDto = transformCreateArticleToCreateArticleDto(createArticleData);
      const data = await createArticle(createArticleDto);
      const article = transformArticleDtoToArticle(data);

      return article;
    },

    onSuccess: async (data, variables, onMutateResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY }),
        onSuccess?.(data, variables, onMutateResult, context),
      ]);
    },
  });
}
