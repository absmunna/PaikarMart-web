import React from 'react';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';

interface RoleBasedShellProps {
  children: React.ReactNode;
}

export const RoleBasedShell: React.FC<RoleBasedShellProps> = ({ children }) => {
  const { role } = useAuth();

  // This shell can inject role-specific themes or visual markers
  return (
    <div className={cn(
        "contents",
        role === 'admin' && "admin-theme-active", // Theoretical class for global CSS targeting
        role === 'seller' && "seller-theme-active",
        (role as string) === 'business' && "business-theme-active"
    )}>
       {children}
    </div>
  );
};
