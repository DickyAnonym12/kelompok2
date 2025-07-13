import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // If the user does not have the required role, redirect them.
    // For example, redirect to a generic dashboard or an error page.
    // Here, we'll just redirect to the main page for simplicity.
    return <Navigate to="/" replace />;
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default ProtectedRoute; 