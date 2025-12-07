import { useMutation, type DefaultError, type UseMutationOptions } from '@tanstack/react-query';
import { deleteComment } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { commentsQueryOptions } from '~entities/comment/comment.api';

export function useDeleteCommentMutation(
  options: Pick<
    UseMutationOptions<unknown, DefaultError, { slug: string; commentId: string }>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [] } = options;

  return useMutation({
    mutationKey: ['comment', 'delete', ...mutationKey],

    mutationFn: ({ slug, commentId }: { slug: string; commentId: string }) => deleteComment(slug, commentId),

    onSuccess: async (_unusedTData, createComment) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commentsQueryOptions(createComment.slug).queryKey }),
      ]);
    },
  });
}
