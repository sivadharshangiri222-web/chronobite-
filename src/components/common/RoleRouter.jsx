import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRouter() {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/app" replace />;
  }

  switch (role) {
    case 'restaurant':
      return <Navigate to="/restaurant" replace />;
    case 'delivery_partner':
      return <Navigate to="/delivery" replace />;
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'customer':
    default:
      return <Navigate to="/app" replace />;
  }
}
