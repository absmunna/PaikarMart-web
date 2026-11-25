import React from "react";
import { 
  Home, Store, Zap, PlayCircle, Grid3x3
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "@/core/lib/i18n";
import { useAuth } from "@/modules/auth";
import { useNavSettingsStore } from "@/app/AppShell/useNavSettingsStore";
import { useNavUIStore } from "@/app/AppShell/useNavUIStore";
import { cn } from "@/lib/utils";

/**
 * Mobile bottom navigation (production).
 * Center elevated button opens Portal Hub via useNavUIStore.
 * Keeps isVisible API used by RootLayout / MobileLayout.
 */
export const BottomNav = ({ isVisible }: { isVisible?: boolean }) => {
  const location = useLocation();
  const { t, lang } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isNavVisibleStore = useNavSettingsStore((s) => s.isNavVisible);
  const navBehavior = useNavSettingsStore((s) => s.navBehavior);
  const openAppLauncher = useNavUIStore((s) => s.openAppLauncher);

  const shouldShow = navBehavior === "fixed" ? true : (isVisible !== undefined ? isVisible : isNavVisibleStore);

  const p = location.pathname;
  const isActive = (path: string) => {
    if (path === "/") return p === "/" || p === "/feed" || p === "/social";
    if (path === "/market") return p === "/market" || p.startsWith("/shop") || p.startsWith("/marketplace") || p.startsWith("/product");
    if (path === "/services") return p.startsWith("/services") || p.startsWith("/local");
    if (path === "/video") return p.startsWith("/video") || p === "/reels";
    return false;
  };

  const sideItems = [
    { label: lang === "BN" ? "হোম" : "Home", icon: Home, path: "/" },
    { label: lang === "BN" ? "মার্কেট" : "Market", icon: Store, path: "/market" },
  ] as const;

  const rightItems = [
    { label: lang === "BN" ? "সার্ভিস" : "Service", icon: Zap, path: "/services" },
    { label: lang === "BN" ? "ভিডিও" : "Video", icon: PlayCircle, path: "/video" },
  ] as const;

  const renderItem = (item: { label: string; icon: any; path: string }) => {
    const active = isActive(item.path);
    return (
      <Link
        key={item.path}
        to={item.path}
        aria-label={item.label}
        className={cn(
          "relative flex flex-1 flex-col items-center justify-center gap-1 transition-colors active:scale-95",
          active ? "text-[var(--pm-accent)]" : "text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
        )}
      >
        {active && <span className="absolute top-0 h-[3px] w-8 rounded-b-full bg-[var(--pm-accent)]" />}
        <item.icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 1.8} />
        <span className={cn("text-[11px] leading-none", active ? "font-semibold" : "font-medium")}>
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <nav
      className={cn(
        "fixed md:absolute bottom-0 left-0 right-0 z-40 h-[64px] w-full",
        "border-t border-[var(--pm-border)] bg-[var(--pm-bg)]/95 backdrop-blur-xl pb-safe",
        "flex items-center select-none transition-transform duration-300 ease-in-out",
        shouldShow ? "translate-y-0" : "translate-y-full"
      )}
      aria-label="Mobile bottom navigation"
    >
      <div className="w-full h-full flex items-stretch justify-around px-1">
        {sideItems.map(renderItem)}

        {/* Center Super App Hub */}
        <div className="relative flex flex-1 flex-col items-center justify-end pb-1.5 pointer-events-none">
          <button
            type="button"
            onClick={() => openAppLauncher()}
            className="absolute -top-5 w-12 h-12 rounded-2xl bg-[var(--pm-accent)] text-white flex items-center justify-center shadow-xl pointer-events-auto active:scale-95 ring-4 ring-[var(--pm-bg)] transition-transform"
            aria-label={lang === "BN" ? "সুপার অ্যাপ হাব" : "Super App Hub"}
          >
            <Grid3x3 className="w-6 h-6" strokeWidth={2.2} />
          </button>
          <span className="text-[10px] font-black text-[var(--pm-accent)] leading-none mt-auto">
            {lang === "BN" ? "হাব" : "Hub"}
          </span>
        </div>

        {rightItems.map(renderItem)}
      </div>
    </nav>
  );
};

export default BottomNav;
