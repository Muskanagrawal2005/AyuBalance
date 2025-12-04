import { useAuth } from '../../context/AuthContext'; // Fix import path if needed
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Or a spinner component

  if (!user) {
    // Not logged in -> Redirect to Login
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in but wrong role -> Unauthorized
    return <div className="p-8 text-red-500">Access Denied: You are not authorized to view this page.</div>;
  }

  // Authorized -> Render the child routes
  return <Outlet />;
};

export default ProtectedRoute;