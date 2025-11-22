import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const registerPageRoute: RouteObject = {
  path: pathKey.register,

  lazy: {
    loader: () => import('./register-page.loader').then((module) => module.default),
    Component: () => import('./register-page.ui').then((module) => module.default),
  },
};
