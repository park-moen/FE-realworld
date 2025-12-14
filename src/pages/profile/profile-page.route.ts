import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const profilePageRoute = {
  path: `${pathKey.profile.root}:username`,
  lazy: {
    loader: () => import('./profile-page.loader').then((module) => module.default),
    Component: () => import('./profile-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
