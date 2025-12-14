import { redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { pathKey } from '~shared/router';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';

export async function editorCreatePageLoader() {
  if (!store.getState().session?.token) {
    return redirect(pathKey.login);
  }

  queryClient.prefetchQuery(sessionQueryOptions);

  return null;
}
