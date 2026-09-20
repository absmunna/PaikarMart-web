import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import type { AppRole } from "@/permissions/roles";
import { canAccessPortal } from "@/permissions/accessControl";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldOff, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ROLE_LABELS } from "@/permissions/roles";

interface PortalGuardProps {
  children: ReactNode;
  portal: string;
  /** CTA link if user needs to upgrade/register */
  upgradeHref?: string;
  upgradeLabel?: string;
}

export function PortalGuard({ children, portal, upgradeHref, upgradeLabel }: PortalGuardProps) {
  const { role, isAuthenticated } = useAuth();

  if (!isAuthenticated || !canAccessPortal(role as AppRole, portal)) {
    const currentLabel = isAuthenticated ? ROLE_LABELS[role as AppRole] : "Guest";
    return (
      <GlassCard className="py-16 flex flex-col items-center justify-center text-center border border-cyan-500/10 max-w-sm mx-auto">
        <ShieldOff className="h-10 w-10 text-cyan-400/40 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Portal Access Required</h3>
        <p className="text-sm text-white/45 mb-1">
          এই পোর্টালটি নির্দিষ্ট ভূমিকার জন্য সীমাবদ্ধ।
        </p>
        <p className="text-xs text-white/30 mb-5">
          তোমার বর্তমান role: <span className="text-white/55">{currentLabel}</span>
        </p>
        {upgradeHref ? (
          <Link to={upgradeHref}>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold shadow-[0_0_16px_rgba(34,211,238,0.2)] hover:from-cyan-400 transition-all">
              {upgradeLabel ?? "আপগ্রেড করুন"} <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        ) : (
          <Link to="/auth/login">
            <button className="px-5 py-2.5 rounded-xl border border-cyan-500/25 text-cyan-300 text-sm hover:bg-cyan-500/8 transition-all">
              লগইন করুন
            </button>
          </Link>
        )}
      </GlassCard>
    );
  }

  return <>{children}</>;
}
