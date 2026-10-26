import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { meetsRoleRequirement } from "@/permissions/accessControl";
import type { AppRole } from "@/permissions/roles";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function AdminGuard({ children }: { children: ReactNode }) {
  const { role, isAuthenticated } = useAuth();

  const isAdmin = isAuthenticated && meetsRoleRequirement(role as AppRole, "admin");

  if (!isAdmin) {
    return (
      <GlassCard className="py-16 flex flex-col items-center justify-center text-center border border-purple-500/10 max-w-sm mx-auto">
        <ShieldCheck className="h-10 w-10 text-purple-400/50 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Admin Access Required</h3>
        <p className="text-sm text-white/45 mb-5">
          এই পেজটি শুধুমাত্র Admin-দের জন্য। Admin অ্যাকাউন্ট দিয়ে লগইন করুন।
        </p>
        <Link to="/auth/login">
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-semibold hover:from-purple-400 transition-all">
            লগইন করুন
          </button>
        </Link>
      </GlassCard>
    );
  }

  return <>{children}</>;
}
