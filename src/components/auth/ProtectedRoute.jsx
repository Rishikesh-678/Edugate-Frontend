import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ForbiddenPage from '../../pages/public/ForbiddenPage';

/**
 * A component to protect routes based on user authentication and role.
 * @param {object} props
 * @param {string[]} props.allowedRoles - Array of roles allowed to access this route.
 */
function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuth();

  // 1. Check if user is logged in
  if (!user) {
    // Not logged in, redirect to home page
    return <Navigate to="/" replace />;
  }

  // 2. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role. Show 403 Forbidden page.
    return <ForbiddenPage />;
  }

  // 3. User is logged in and has the correct role
  return <Outlet />;
}

export default ProtectedRoute;