import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth';

export const RoleGuard = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && (allowedRoles.includes(user.role) || user.roles.some((role) => allowedRoles.includes(role)))) {
    return <>{children}</>;
  }

  return <Navigate to="/dashboard" replace />; // Redirect unauthorized users to basic dashboard or home
};
