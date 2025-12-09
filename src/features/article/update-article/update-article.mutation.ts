import { useMutation, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { updateArticle } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';
import { transformArticleDtoToArticle } from '~entities/article/article.lib';
import type { Article } from '~entities/article/article.type';
import { transformUpdateArticleToUpdateArticleDto } from './update-article.lib';
import type { UpdateArticle } from './update-article.type';

export function useUpdateArticleMutation(
  options: Pick<UseMutationOptions<Article, DefaultError, UpdateArticle>, 'mutationKey' | 'onSuccess'> = {},
) {
  const { mutationKey = [], onSuccess } = options;

  return useMutation({
    mutationKey: ['article', 'update', ...mutationKey],

    async mutationFn(updateArticleData: UpdateArticle) {
      const { slug } = updateArticleData;
      const updateArticleDto = transformUpdateArticleToUpdateArticleDto(updateArticleData);
      const data = await updateArticle(slug, updateArticleDto);
      const article = transformArticleDtoToArticle(data);

      return article;
    },

    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY }),
        onSuccess?.(data, variables, onMutateResult, context),
      ]);
    },
  });
}
