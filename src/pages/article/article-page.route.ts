import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const articlePageRoute = {
  path: `${pathKey.article.root}:slug`,
  lazy: {
    loader: () => import('./article-page.loader').then((module) => module.default),
    Component: () => import('./article-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
