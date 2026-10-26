import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { UserRole } from "../../permissions/roles";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Higher-order component to protect routes from unauthenticated access.
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user, firebaseUser } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (location.pathname.startsWith("/auth")) {
      return <>{children}</>;
    }
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Get email verification status from direct firebaseUser or Firestore user object
  const emailVerified = firebaseUser ? firebaseUser.emailVerified : user?.emailVerified;
  const isGuest = user?.role === "guest" || firebaseUser?.isAnonymous;

  // Check for email verification (only for non-guest users)
  if (firebaseUser && !isGuest && !emailVerified) {
    if (location.pathname === "/verify-email") {
      return <>{children}</>;
    }
    return <Navigate to="/verify-email" replace />;
  }

  // If user is verified (or guest) and tries to access verify-email, redirect home
  if (firebaseUser && (emailVerified || isGuest) && location.pathname === "/verify-email") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Higher-order component to restrict access based on user roles.
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth" replace />;
  }

  const userRoles: string[] = Array.isArray((user as any).roles) ? (user as any).roles : [user.role];
  const hasAccess = userRoles.some(role => allowedRoles.includes(role as UserRole));

  if (!hasAccess) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="h-10 w-10 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-8">
            You don't have the required permissions to view this section. 
            If you're a seller, please ensure you're logged into your seller account.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
