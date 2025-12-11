import { useMutation, useQueryClient, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { deleteArticle } from '~shared/api/api.service';
import { ARTICLES_ROOT_QUERY_KEY } from '~entities/article/article.api';

export function useDeleteArticleMutation(
  options: Pick<UseMutationOptions<void, DefaultError, string>, 'mutationKey' | 'onSuccess'> = {},
) {
  const { mutationKey = [], onSuccess } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['article', 'delete', ...mutationKey],

    async mutationFn(slug: string) {
      await deleteArticle(slug);
    },

    async onSuccess(data, variables, onMutateResult, context) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ARTICLES_ROOT_QUERY_KEY }),
        onSuccess?.(data, variables, onMutateResult, context),
      ]);
    },
  });
}
