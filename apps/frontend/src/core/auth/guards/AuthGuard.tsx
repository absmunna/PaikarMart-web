import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
