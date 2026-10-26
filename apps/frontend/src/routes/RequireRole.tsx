import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';

export interface RequireRoleProps {
  role?: string | string[];
  children?: React.ReactNode;
  fallbackPath?: string;
  deniedMessage?: string;
}

/**
 * 🛡️ RequireRole: Hard RBAC Route Guard Component
 * Strictly locks routes to authorized roles (e.g. SUPER_ADMIN).
 * Unauthorized attempts to manually access URL will trigger an error toast
 * and immediately redirect the user to `/unauthorized`.
 */
export const RequireRole: React.FC<RequireRoleProps> = ({
  role = 'SUPER_ADMIN',
  children,
  fallbackPath = '/unauthorized',
  deniedMessage = 'Access Denied: Super Admin privileges required to access this console.'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const requiredRoles = Array.isArray(role) ? role : [role];
  const userRole = String(user?.role || '').toLowerCase();
  const userRoles = (user?.roles || []).map(r => String(r).toLowerCase());

  const hasAccess = requiredRoles.some(reqRole => {
    const r = reqRole.toLowerCase();
    if (r === 'super_admin' || r === 'super-admin' || r === 'admin') {
      return (
        userRole === 'super_admin' ||
        userRole === 'admin' ||
        userRoles.includes('super_admin') ||
        userRoles.includes('admin')
      );
    }
    return userRole === r || userRoles.includes(r);
  });

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasAccess) {
      toast.error(deniedMessage, {
        id: 'rbac-unauthorized-attempt',
        duration: 4000
      });
    }
  }, [isLoading, isAuthenticated, hasAccess, deniedMessage]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
            Verifying Access Privileges...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/auth/login?from=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
