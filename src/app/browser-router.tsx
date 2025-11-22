import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from '~pages/home/Homepage';
import { Layout } from '~pages/layouts/Layout';
import { loginPageRoute } from '~pages/login/login-page.route';
import { registerPageRoute } from '~pages/register/register-page.route';

export function BootstrappedRouter() {
  return <RouterProvider router={browserRouter} />;
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [{ index: true, Component: HomePage }, registerPageRoute, loginPageRoute],
  },
]);
