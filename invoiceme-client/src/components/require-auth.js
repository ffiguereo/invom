import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../context/auth-context';

export function RequireAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/sign-in" state={{ from: location }} />;
  }

  return children;
}
