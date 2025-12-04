import type { CommentDto, CommentsDto } from '~shared/api/api.schemas';
import type { Comment, Comments } from './comment.type';

export function transformCommentDtoToComment(commentDto: CommentDto): Comment {
  const { comment } = commentDto;

  return {
    ...comment,
    author: {
      ...comment.author,
      image: comment.author.image ?? '',
      bio: comment.author.bio ?? '',
      following: comment.author.following ?? false,
    },
  };
}

export function transformCommentsDtoToComments(commentsDto: CommentsDto): Comments {
  return commentsDto.comments;
}
