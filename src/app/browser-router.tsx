import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { homePageRoute } from '~pages/home/home-page.route';
import { layoutRoute } from '~pages/layouts/layout.route';
import { loginPageRoute } from '~pages/login/login-page.route';
import { profilePageRoute } from '~pages/profile/profile-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    children: [
      {
        ...layoutRoute,
        children: [homePageRoute, registerPageRoute, loginPageRoute, profilePageRoute],
      },
    ],
  },
] satisfies RouteObject[]);
