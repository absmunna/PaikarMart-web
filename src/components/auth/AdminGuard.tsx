import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f111a]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-[#FF7A00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !hasRole("admin")) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
