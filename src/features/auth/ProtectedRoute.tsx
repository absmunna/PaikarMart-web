import { ReactNode } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { AppRole as UserRole, RoleGroup } from "@/config/roles.config";

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

interface RoleRouteProps extends ProtectedRouteProps {
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}

export function RoleRoute({ children, allowedRoles, redirectTo = "/" }: RoleRouteProps) {
  const { user, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

/**
 * 🏷️ RoleGroupRoute: Protect routes based on role groups ('customer' | 'vendor' | 'admin')
 */
export function RoleGroupRoute({ 
  children, 
  allowedGroups, 
  redirectTo = "/" 
}: { 
  children: ReactNode; 
  allowedGroups: RoleGroup | RoleGroup[]; 
  redirectTo?: string;
}) {
  const { isAuthenticated, hasRoleGroup } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!hasRoleGroup(allowedGroups)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export function SellerOwnerRoute({ children, redirectTo = "/" }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const { handle } = useParams();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userHandle = user.handle || "";

  if (handle !== userHandle.replace("@", "")) {
    return <Navigate to={`/seller/${userHandle.replace("@", "")}`} replace />;
  }

  return <>{children}</>;
}
