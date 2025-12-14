import type { RouteObject } from 'react-router-dom';
import { pathKey } from '~shared/router';

export const editorPageRoute = {
  path: pathKey.editor.root,
  children: [
    {
      index: true,
      lazy: {
        loader: () => import('./editor-page.loader').then((module) => module.editorCreatePageLoader),
        Component: () => import('./editor-page.ui').then((module) => module.CreateEditorPage),
      },
    },
    {
      path: ':slug',
      lazy: {
        loader: () => import('./editor-page.loader').then((module) => module.editorUpdatePageLoader),
        Component: () => import('./editor-page.ui').then((module) => module.UpdateEditorPage),
      },
    },
  ],
} satisfies RouteObject;
