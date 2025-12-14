import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { z } from 'zod';
import { queryClient } from '~shared/queryClient';
import { pathKey } from '~shared/router';
import { store } from '~shared/store';
import { articleQueryOptions } from '~entities/article/article.api';
import { sessionQueryOptions } from '~entities/session/session.api';

export async function editorCreatePageLoader() {
  if (!store.getState().session?.token) {
    return redirect(pathKey.login);
  }

  queryClient.prefetchQuery(sessionQueryOptions);

  return null;
}

export async function editorUpdatePageLoader(args: LoaderFunctionArgs) {
  if (!store.getState().session?.token) {
    return redirect(pathKey.login);
  }

  const parsedArgs = EditorLoaderArgsSchema.parse(args);
  const {
    params: { slug },
  } = parsedArgs;

  queryClient.prefetchQuery(sessionQueryOptions);
  queryClient.prefetchQuery(articleQueryOptions(slug));

  return parsedArgs;
}

const EditorLoaderArgsSchema = z.object({
  request: z.custom<Request>(),
  params: z.object({ slug: z.string() }),
  context: z.any(),
});

export type EditorLoaderArgs = z.infer<typeof EditorLoaderArgsSchema>;
