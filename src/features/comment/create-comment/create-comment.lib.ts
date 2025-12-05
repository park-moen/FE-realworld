import type { CreateCommentDto } from '~shared/api/api.schemas';
import type { CreateComment } from './create-comment.type';

export function transformCreateCommentToCreateCommentDto(createComment: CreateComment): CreateCommentDto {
  return {
    comment: {
      body: createComment.body,
    },
  };
}
