import type { LoaderFunctionArgs } from 'react-router-dom';
import { z } from 'zod';
import { queryClient } from '~shared/queryClient';
import { store } from '~shared/store';
import { articleQueryOptions } from '~entities/article/article.api';
import { commentsQueryOptions } from '~entities/comment/comment.api';
import { sessionQueryOptions } from '~entities/session/session.api';

export default function articlePageLoader(args: LoaderFunctionArgs) {
  const parsedArgs = ArticleLoaderArgsSchema.parse(args);
  const {
    params: { slug },
  } = parsedArgs;

  queryClient.prefetchQuery(articleQueryOptions(slug));
  queryClient.prefetchQuery(commentsQueryOptions(slug));

  if (store.getState().session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);
  }

  return parsedArgs;
}

const ArticleLoaderArgsSchema = z.object({
  request: z.custom<Request>(),
  params: z.object({ slug: z.string() }),
  context: z.any(),
});

export type ArticleLoaderArgs = z.infer<typeof ArticleLoaderArgsSchema>;
