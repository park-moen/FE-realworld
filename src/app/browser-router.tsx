import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { BaseRegisterForm } from '~features/session/register/register.ui';
import { MainLayout } from '~pages/layouts';
import { HomePage } from '~pages/main';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: pathKey.register,
        Component: BaseRegisterForm,
      },
    ],
  },
]);
