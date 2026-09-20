import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Store,
  ShieldCheck,
  BarChart3,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSeller } from "../SellerContext";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/seller/products", label: "Products", icon: Package },
  { href: "/seller/orders", label: "Orders", icon: ShoppingBag },
  { href: "/seller/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/seller/profile", label: "Shop Profile", icon: Store },
  { href: "/seller/verification", label: "Verification", icon: ShieldCheck },
];

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { profile, verificationStatus } = useSeller();

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
      <aside className="md:w-64 shrink-0">
        <div className="md:sticky md:top-32 flex flex-col gap-4">
          <div className="glass-card rounded-xl p-4 flex items-center gap-3">
            <img
              src={profile.avatarUrl}
              alt={profile.shopName}
              className="h-12 w-12 rounded-full object-cover border border-white/10"
            />
            <div className="min-w-0">
              <div className="text-white font-semibold truncate">{profile.shopName}</div>
              <div className="text-xs text-white/50 truncate capitalize">
                {profile.type.replace("_", " ")} · {verificationStatus}
              </div>
            </div>
          </div>

          <Link to="/seller/products/new">
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>

          <nav
            className="glass-card rounded-xl p-2 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible no-scrollbar"
            aria-label="Seller navigation"
          >
            {NAV.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors shrink-0",
                    active
                      ? "bg-primary/20 text-primary"
                      : "text-white/70 hover:text-white hover:bg-white/5",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
