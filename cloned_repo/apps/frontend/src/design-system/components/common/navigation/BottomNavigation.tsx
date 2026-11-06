import { Home, ShoppingBag, MessageSquare, User, LayoutGrid } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: ShoppingBag, label: "Market", href: "/marketplace" },
  { icon: LayoutGrid, label: "Apps", href: "/portals", isCenter: true },
  { icon: MessageSquare, label: "Messages", href: "/messages" },
  { icon: User, label: "Profile", href: "/profile" },
];

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-white/5 bg-[#141624] pb-safe pt-1 md:hidden shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
        const Icon = item.icon;

        if (item.isCenter) {
          return (
            <Link
              key={item.label}
              to={item.href}
              className="relative -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e2136] border-[3px] border-[#141624] shadow-lg transition-transform active:scale-95"
            >
              <div className={cn(
                "flex h-full w-full items-center justify-center rounded-full border transition-all",
                isActive ? "border-[#FF7A00] text-[#FF7A00] bg-[#FF7A00]/10" : "border-[#FF7A00]/30 text-[#FF7A00]"
              )}>
                <Icon className="h-6 w-6" strokeWidth={2.5} />
              </div>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
              isActive ? "text-[#FF7A00]" : "text-gray-500 hover:text-gray-300"
            )}
          >
            <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] font-medium leading-none">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
