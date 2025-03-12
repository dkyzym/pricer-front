import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Компонент, который защищает дочерние роуты от неавторизованных пользователей.
 * Если передаём requiredRole="admin", то дополнительно проверяем роль.
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isCheckingAuth } = useSelector((state) => state.auth);

  // Пока идёт проверка localStorage, не рендерим Redirect, а показываем «загрузку»
  if (isCheckingAuth) {
    // Можете вернуть Skeleton, Spinner или просто null
    return <div>Загрузка...</div>;
  }

  // Если проверка закончена, но user = null → редирект
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Если надо проверять роль
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};
