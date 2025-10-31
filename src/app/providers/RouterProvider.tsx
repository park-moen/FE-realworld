import { Navigate, useRoutes } from 'react-router-dom';
import { pathKey } from '~shared/router';
import { MainLayout } from '~pages/layouts';
import { HomePage } from '~pages/main';
import { RegisterPage } from '~pages/register/register-page.ui';

export function Router() {
  return useRoutes([
    {
      element: <MainLayout />,
      children: [
        { element: <HomePage />, index: true },
        { path: pathKey.register, element: <RegisterPage /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
