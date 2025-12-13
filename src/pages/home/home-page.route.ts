import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const homePageRoute = {
  path: pathKey.home,
  lazy: {
    loader: () => import('./home-page.loader').then((module) => module.default),
    Component: () => import('./home-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
