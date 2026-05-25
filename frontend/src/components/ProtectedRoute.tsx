import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';

export default function ProtectedRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (user?.role === 'ADMIN' && (location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard/'))) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
