import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from '@pages/Home';

import './index.css';

import AppProviders from '@context/AppProviders';
import { CartPage } from '@pages/CartPage';
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
        element: <HomePage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
