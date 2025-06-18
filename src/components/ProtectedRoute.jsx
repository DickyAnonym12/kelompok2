import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isAdmin, isUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required, check if user has permission
  if (allowedRoles.length > 0) {
    const hasRole = allowedRoles.some(role => {
      if (role === 'admin') return isAdmin();
      if (role === 'user') return isUser();
      return false;
    });

    if (!hasRole) {
      // Redirect based on user role
      if (isAdmin()) {
        return <Navigate to="/" replace />;
      } else if (isUser()) {
        return <Navigate to="/guest" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute; 