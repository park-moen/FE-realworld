import { queryOptions } from '@tanstack/react-query';
import { getAllCommentsBySlug } from '~shared/api/api.service';
import { transformCommentsDtoToComments } from './comment.lib';

export const commentsQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['comments', slug],

    queryFn: async ({ signal }) => {
      const data = await getAllCommentsBySlug(slug, { signal });
      const comments = transformCommentsDtoToComments(data);

      return comments;
    },
  });
