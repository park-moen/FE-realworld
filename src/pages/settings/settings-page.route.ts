import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const settingsPageRoute = {
  path: pathKey.settings,
  lazy: {
    loader: () => import('./settings-page.loader').then((module) => module.default),
    Component: () => import('./settings-page.ui').then((module) => module.default),
  },
} satisfies RouteObject;
