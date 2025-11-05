import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { HomePage } from '~pages/home/Homepage';
import { Layout } from '~pages/layouts/Layout';
import LoginPage from '~pages/login/login-page.ui';
import { RegisterPage } from '~pages/register/register-page.ui';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      {
        path: pathKey.register,
        Component: RegisterPage,
      },
      {
        path: pathKey.login,
        Component: LoginPage,
      },
    ],
  },
]);
