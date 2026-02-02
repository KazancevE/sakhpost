import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProtectedRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export function AdminRoute() {
  const { user, isAdmin, initializing } = useAuth();

  if (initializing) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  return user && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}
