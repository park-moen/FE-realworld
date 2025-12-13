import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const page404Route = {
  path: pathKey.page404,
  lazy: {
    Component: () => import('./page-404.ui').then((module) => module.default),
  },
} satisfies RouteObject;
