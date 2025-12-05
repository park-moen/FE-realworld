import { useMutation, type UseMutationOptions } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { createComment } from '~shared/api/api.service';
import { queryClient } from '~shared/queryClient';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import { transformCommentDtoToComment } from '~entities/comment/comment.lib';
import type { Comment } from '~entities/comment/comment.type';
import { transformCreateCommentToCreateCommentDto } from './create-comment.lib';
import type { CreateComment } from './create-comment.type';

export function useCreateCommentMutation(
  options: Pick<
    UseMutationOptions<Comment, AxiosError, CreateComment>,
    'mutationKey' | 'onMutate' | 'onSuccess' | 'onError' | 'onSettled'
  > = {},
) {
  const { mutationKey = [], onMutate, onSuccess, onError, onSettled } = options;

  return useMutation({
    mutationKey: ['comment', 'create', ...mutationKey],

    mutationFn: async (createCommentData: CreateComment) => {
      const createCommentDto = transformCreateCommentToCreateCommentDto(createCommentData);
      const data = await createComment(createCommentData.slug, createCommentDto);
      const comment = transformCommentDtoToComment(data);

      return comment;
    },

    onMutate,

    onSuccess: async (comment, createCommentData, onMutationResult, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: commentsQueryOptions(createCommentData.slug).queryKey }),
        onSuccess?.(comment, createCommentData, onMutationResult, context),
      ]);
    },

    onError,

    onSettled,
  });
}
