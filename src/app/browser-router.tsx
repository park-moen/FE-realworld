import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { BaseRegisterForm } from '~features/session/register/register.ui';
import { HomePage } from '~pages/home/Homepage';
import { Layout } from '~pages/layouts/Layout';

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
        Component: BaseRegisterForm,
      },
    ],
  },
]);
