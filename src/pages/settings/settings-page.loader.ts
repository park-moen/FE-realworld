import { redirect } from 'react-router-dom';
import { queryClient } from '~shared/queryClient';
import { pathKey } from '~shared/router';
import { store } from '~shared/store';
import { sessionQueryOptions } from '~entities/session/session.api';

export default function SettingsPageLoader() {
  if (store.getState().session?.token) {
    queryClient.prefetchQuery(sessionQueryOptions);

    return null;
  }

  return redirect(pathKey.login);
}
