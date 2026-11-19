import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { UserRole } from '@/permissions/roles';

export const RoleGuard = ({ 
  children, 
  allowedRoles,
  redirectTo = '/unauthorized'
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  const role = (user?.role || (user as any)?.roles?.[0] || 'buyer').toLowerCase();
  const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());

  if (normalizedAllowed.includes(role)) return <>{children}</>;
  
  return <Navigate to={redirectTo} replace />;
};
