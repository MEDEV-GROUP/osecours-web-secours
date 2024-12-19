import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from './AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const isProtected = import.meta.env.VITE_PROTECTED_ROUTES === 'true';


  

  if (isProtected && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
