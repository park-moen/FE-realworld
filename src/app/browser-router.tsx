import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { articlePageRoute } from '~pages/article/article-page.route';
import { editorPageRoute } from '~pages/editor/editor-page.route';
import { homePageRoute } from '~pages/home/home-page.route';
import { layoutRoute } from '~pages/layouts/layout.route';
import { loginPageRoute } from '~pages/login/login-page.route';
import { profilePageRoute } from '~pages/profile/profile-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';
import { settingsPageRoute } from '~pages/settings/settings-page.route';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    children: [
      {
        ...layoutRoute,
        children: [
          homePageRoute,
          registerPageRoute,
          loginPageRoute,
          articlePageRoute,
          editorPageRoute,
          profilePageRoute,
          settingsPageRoute,
        ],
      },
    ],
  },
] satisfies RouteObject[]);
