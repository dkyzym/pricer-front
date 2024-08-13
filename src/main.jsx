import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Home } from '@pages/Home';

import './index.css';

import AppProviders from '@context/AppProviders';
import { Auth } from '@pages/Auth';
import { ErrorPage } from '@pages/ErrorPage';
import App from './App';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'auth',
        element: <Auth />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
