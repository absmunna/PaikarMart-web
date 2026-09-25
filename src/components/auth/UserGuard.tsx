import React from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { ShieldAlert, ArrowLeft, RefreshCcw, Lock } from "lucide-react";
import { motion } from "motion/react";

interface UserGuardProps {
  children: React.ReactNode;
  /**
   * Roles allowed to access the guarded route/component.
   * Can be 'user', 'seller', 'admin', or any other valid role.
   */
  allowedRoles?: string[];
  /**
   * Capabilities or permissions required to access.
   */
  requiredCapabilities?: any;
  /**
   * Custom URL to redirect to if authorization fails.
   * If not provided and showFallbackUI is false, redirects to '/'.
   */
  fallbackUrl?: string;
  /**
   * Whether to show a fully-styled permission denied panel inside the view
   * instead of an immediate page redirect. Highly recommended for dashboard components.
   */
  showFallbackUI?: boolean;
}

/**
 * UserGuard manages route and component-level permissions by verifying the user's
 * active roles and capability flags against their Firestore profile linked via
 * the existing Firebase Auth UID.
 */
export const UserGuard: React.FC<UserGuardProps> = ({
  children,
  allowedRoles,
  requiredCapabilities,
  fallbackUrl,
  showFallbackUI = true
}) => {
  const { user, firebaseUser, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Loading State - Render a beautiful premium spinner
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <div className="relative flex items-center justify-center">
          {/* Pulse circles */}
          <div className="absolute h-16 w-16 rounded-full border border-[#FF7A00]/20 animate-ping" />
          <div className="h-12 w-12 rounded-full border-2 border-t-[#FF7A00] border-r-transparent border-b-[#FF7A00] border-l-transparent animate-spin" />
        </div>
        <p className="mt-4 text-xs font-black tracking-widest text-zinc-500 uppercase">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // 2. Authentication Check - Redirect to login with previous path state
  if (!isAuthenticated || !firebaseUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Double-verify UID consistency (ensuring session belongs strictly to currently loaded Firestore doc)
  if (user && firebaseUser && user.id !== firebaseUser.uid) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <RefreshCcw className="h-10 w-10 text-orange-500 animate-spin mb-4" />
        <h3 className="text-sm font-black text-white">Identity Drift Detected</h3>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Synchronizing credentials securely. Please wait a moment...
        </p>
      </div>
    );
  }

  // 3. Role-based checks
  let hasRoleAccess = true;
  if (allowedRoles && allowedRoles.length > 0) {
    hasRoleAccess = user?.roles?.some(role => allowedRoles.includes(role)) ?? false;
  }

  // 4. Capability-based checks
  let hasCapabilityAccess = true;
  if (requiredCapabilities && user?.permissions) {
    hasCapabilityAccess = Object.entries(requiredCapabilities).every(
      ([key, requiredValue]) => {
        return user.permissions.includes(key);
      }
    );
  }

  const isAuthorized = hasRoleAccess && hasCapabilityAccess;

  // 5. Unauthorised Fallback handling
  if (!isAuthorized) {
    // If redirecting instead of displaying visual UI:
    if (!showFallbackUI) {
      return <Navigate to={fallbackUrl || "/"} replace />;
    }

    // Otherwise render a high-contrast elegant feedback panel
    return (
      <motion.div 
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md mx-auto p-6 my-12"
      >
        <div className="bg-[#141624] border border-white/5 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          {/* Subtle Orange Light Source */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-[#FF7A00]/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-orange-600/10 rounded-full blur-2xl" />

          {/* Locked Badge Icon */}
          <div className="h-14 w-14 bg-zinc-900 border border-white/5 text-[#FF7A00] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Lock className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-black tracking-tight text-white mb-2">
            Restricted Section
          </h2>
          
          <p className="text-xs text-zinc-400 leading-relaxed mb-6">
            Your profile does not satisfy the role or capability privileges required to access this portal. 
            {allowedRoles && allowedRoles.length > 0 && (
              <span className="block mt-2 font-bold text-zinc-500">
                Requires: {allowedRoles.join(", ")}
              </span>
            )}
          </p>

          <div className="space-y-2.5">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all border border-white/5 active:scale-95"
            >
              <ArrowLeft className="h-4 w-4 text-[#FF7A00]" /> Go Back
            </button>
            
            {user?.roles?.includes("user") && !user?.roles?.includes("seller") && (
              <button
                onClick={() => navigate("/register/seller")}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black transition-all shadow-lg shadow-[#FF7A00]/20 active:scale-95"
              >
                Become a Seller
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // 6. Access Granted
  return <>{children}</>;
};
