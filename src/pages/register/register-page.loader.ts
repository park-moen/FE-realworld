import { redirect, type LoaderFunctionArgs } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { store } from '~shared/store';

export default async function registerPageLoader(args: LoaderFunctionArgs) {
  if (store.getState().session?.token) {
    return redirect(pathKey.home);
  }

  return args;
}
