import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { HomePage } from '@pages/Home';

import './index.css';

import AppProviders from '@context/AppProviders';
import { ErrorPage } from '@pages/ErrorPage';
import { LoginPage } from '@pages/LoginPage';
import { LogsPage } from '@pages/LogsPage';
import { OrdersPage } from '@pages/OrdersPage';
import App from './App';
import { ProtectedRoute } from './routes/ProtectedRoute';

const router = createBrowserRouter([
  // Страница логина (открыта для всех)
  {
    path: '/login',
    element: <LoginPage />,
  },

  // Все остальные пути защищены:
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      // Главная (index: true)
      { index: true, element: <HomePage /> },
      { path: 'orders', element: <OrdersPage /> },

      {
        path: 'admin/logs',
        element: (
          <ProtectedRoute requiredRole="admin">
            <LogsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
);
