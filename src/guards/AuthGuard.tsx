import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: string;
}

/**
 * Redirects unauthenticated users to /auth/login.
 * Preserves the intended path via ?from= query param.
 * Uses useEffect to avoid calling navigate during render.
 */
export function AuthGuard({ children, fallback = "/auth/login" }: AuthGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`${fallback}?from=${encodeURIComponent(location.pathname)}`);
    }
  }, [isAuthenticated, fallback, location.pathname, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
