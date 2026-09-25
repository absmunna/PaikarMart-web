import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/authStore';
import { UserRole } from '../permissions/roles';

export const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user && allowedRoles.includes(user.role as string)) return <>{children}</>;
  
  return <Navigate to="/dashboard" replace />; // Redirect unauthorized users to basic dashboard or home
};
