import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const loginPageRoute: RouteObject = {
  path: pathKey.login,

  lazy: {
    loader: () => import('./login-page.loader').then((module) => module.default),
    Component: () => import('./login-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
