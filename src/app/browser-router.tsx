import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { homePageRoute } from '~pages/home/home-page.route';
import { loginPageRoute } from '~pages/login/login-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    lazy: async () => ({
      loader: (await import('~pages/layouts/layout.loader')).default,
      Component: (await import('~pages/layouts/layout.ui')).default,
    }),
    children: [homePageRoute, registerPageRoute, loginPageRoute],
  },
] satisfies RouteObject[]);
