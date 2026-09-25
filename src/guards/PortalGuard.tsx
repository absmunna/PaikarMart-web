import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../modules/auth/store/authStore';

export const PortalGuard = ({ 
  children, 
  allowedPortal 
}: { 
  children: React.ReactNode;
  allowedPortal: string;
}) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  // Example logic for portal access control
  const hasAccess = user?.portals?.includes(allowedPortal);
  
  return hasAccess ? <>{children}</> : <Navigate to="/unauthorized" replace />;
};
