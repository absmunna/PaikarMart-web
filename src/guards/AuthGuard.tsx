import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/authStore';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
