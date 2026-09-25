import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/authStore';

interface SubscriptionGuardProps {
  children: React.ReactNode;
  fallbackPath?: string;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ 
  children, 
  fallbackPath = '/settings' 
}) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Active or trial subscription verification
  const hasActiveSubscription = user?.isVerified ?? true;

  if (!hasActiveSubscription) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
