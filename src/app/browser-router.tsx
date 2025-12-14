import { useEffect, useState } from 'react';
import { createBrowserRouter, RouterProvider, type RouteObject } from 'react-router-dom';
import { persistor } from '~shared/store';
import { Spinner } from '~shared/ui/spinner/spinner.ui';
import { articlePageRoute } from '~pages/article/article-page.route';
import { editorPageRoute } from '~pages/editor/editor-page.route';
import { homePageRoute } from '~pages/home/home-page.route';
import { layoutRoute } from '~pages/layouts/layout.route';
import { loginPageRoute } from '~pages/login/login-page.route';
import { profilePageRoute } from '~pages/profile/profile-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';
import { settingsPageRoute } from '~pages/settings/settings-page.route';

export function BootstrappedRouter() {
  const [router, setRouter] = useState<typeof browserRouter | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRouter(browserRouter);
    }, 5000);

    if (persistor.getState().bootstrapped) {
      clearTimeout(timeout);
      setRouter(browserRouter);
    } else {
      const unsubscribe = persistor.subscribe(() => {
        if (persistor.getState().bootstrapped) {
          clearTimeout(timeout);
          setRouter(browserRouter);
          unsubscribe();
        }
      });
      return () => {
        clearTimeout(timeout);
        unsubscribe();
      };
    }
  }, []);

  if (!router) {
    return <Spinner />;
  }

  return <RouterProvider router={router} />;
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
