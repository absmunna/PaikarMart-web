import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import type { ReactNode } from "react";
import type { AppRole } from "@/permissions/roles";
import { meetsRoleRequirement } from "@/permissions/accessControl";
import type { Permission } from "@/permissions/permissions";
import { hasPermission } from "@/permissions/permissions";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldOff } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  /** Minimum role level required */
  minRole?: AppRole;
  /** Specific roles allowed (OR logic) */
  roles?: AppRole[];
  /** Permission required */
  permission?: Permission;
  /** Show inline access-denied instead of redirect */
  inline?: boolean;
}

export function RoleGuard({ children, minRole, roles, permission, inline }: RoleGuardProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, isAuthenticated } = useAuth();

  const appRoles = (user?.roles || [role ?? "guest"]) as AppRole[];

  const allowed =
    isAuthenticated &&
    (!minRole || appRoles.some(r => meetsRoleRequirement(r, minRole))) &&
    (!roles || appRoles.some(r => roles.includes(r))) &&
    (!permission || appRoles.some(r => hasPermission(r, permission)));

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/auth/login?from=${encodeURIComponent(location.pathname)}`);
    } else if (!allowed && !inline) {
      navigate("/");
    }
  }, [isAuthenticated, allowed, inline, location.pathname, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated || (!allowed && !inline)) return null;

  if (!allowed && inline) {
    return (
      <GlassCard className="py-16 flex flex-col items-center justify-center text-center border border-rose-500/15">
        <ShieldOff className="h-10 w-10 text-rose-400/50 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Access Denied</h3>
        <p className="text-sm text-white/45 max-w-xs mb-4">
          তোমার বর্তমান role ({role}) এই পেজটি দেখার অনুমতি নেই।
        </p>
        <Link to="/">
          <button className="px-5 py-2 rounded-xl border border-white/15 text-white/60 text-sm hover:border-white/30 transition-all">
            হোমে ফিরে যাও
          </button>
        </Link>
      </GlassCard>
    );
  }

  return <>{children}</>;
}
