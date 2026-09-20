import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { GlassCard } from "@/components/ui/GlassCard";
import { Store, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function SellerGuard({ children }: { children: ReactNode }) {
  const { role, isAuthenticated } = useAuth();

  const isSeller = ["seller", "wholesale", "factory", "rural", "nearby_shop",
    "digital_seller", "service_provider", "admin", "super_admin"].includes(role);

  if (!isAuthenticated || !isSeller) {
    return (
      <GlassCard className="py-16 flex flex-col items-center justify-center text-center border border-cyan-500/10 max-w-sm mx-auto">
        <Store className="h-10 w-10 text-cyan-400/50 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Seller Access Only</h3>
        <p className="text-sm text-white/45 mb-5">
          এই পেজটি দেখতে সেলার অ্যাকাউন্ট প্রয়োজন।
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/auth/seller-register">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-600 text-white text-sm font-semibold hover:from-cyan-400 transition-all">
              Seller হন <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
          <Link to="/auth/login">
            <button className="px-4 py-2 rounded-xl border border-white/15 text-white/55 text-sm hover:border-white/30 transition-all">
              লগইন
            </button>
          </Link>
        </div>
      </GlassCard>
    );
  }

  return <>{children}</>;
}
