import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { HomePage } from '~pages/home/Homepage';
import { loginPageRoute } from '~pages/login/login-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    lazy: {
      loader: async () => (await import('~pages/layouts/layout.loader')).default,
      Component: async () => (await import('~pages/layouts/layout.ui')).default,
    },
    children: [
      {
        index: true,
        Component: HomePage,
      },
      registerPageRoute,
      loginPageRoute,
    ],
  },
] satisfies RouteObject[]);
