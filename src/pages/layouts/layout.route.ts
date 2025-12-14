import type { RouteObject } from 'react-router-dom';

export const layoutRoute = {
  lazy: {
    loader: () => import('./layout.loader').then((module) => module.default),
    Component: () => import('./layout.ui').then((module) => module.default),
  },
} satisfies RouteObject;
