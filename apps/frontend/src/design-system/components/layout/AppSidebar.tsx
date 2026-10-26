import React from 'react';
import {
  Home,
  Store,
  ShoppingBag,
  Package,
  Heart,
  Layers,
  Settings,
  Info,
  LogOut,
  User,
  ShieldCheck,
  Palette,
  Check,
  Zap,
  Rocket,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { useAuth } from '@/app/context/AuthContext';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/Badge/Badge';
import { Separator } from '../ui/separator';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const AppSidebar: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useNavUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  // Strict dynamic role detection from active authentication context
  const rawRole = String(user?.role || '').trim();
  const lowerRole = rawRole.toLowerCase();
  const pkShopRole = String((user as any)?.pk_shop_role || '').trim().toUpperCase();

  const isSuperAdmin =
    rawRole === 'SUPER_ADMIN' ||
    lowerRole === 'super_admin' ||
    lowerRole === 'admin' ||
    (user?.roles || []).some(r => String(r).toLowerCase().includes('admin'));

  const isSeller =
    rawRole === 'SELLER' ||
    lowerRole === 'seller' ||
    lowerRole.includes('seller') ||
    lowerRole === 'business' ||
    lowerRole === 'factory';

  const isPKShopStaff =
    pkShopRole === 'STORE_MANAGER' ||
    pkShopRole === 'MODERATOR' ||
    lowerRole === 'moderator' ||
    Boolean((user as any)?.pk_shop_role);

  const isBuyer =
    rawRole === 'BUYER' ||
    lowerRole === 'buyer' ||
    lowerRole === 'user' ||
    lowerRole === 'guest' ||
    (!isSuperAdmin && !isSeller && !isPKShopStaff);

  const menuItems = [
    { icon: Home, label: 'Home Feed', path: '/' },
    { icon: User, label: 'My Profile', path: '/profile', authRequired: true },
    { icon: ShoppingBag, label: 'Shop Marketplace', path: '/marketplace' },
    { icon: Package, label: 'My Orders', path: '/orders', authRequired: true },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', authRequired: true },
    { icon: Layers, label: 'Portal Hub', path: '/portals' },
  ];

  const secondaryItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Info, label: 'Help & Support', path: '/faq' },
  ];

  const themeColors = [
    { id: 'deepDark', class: 'bg-[#0f111a] border border-white/20', label: 'অবসিডিয়ান (Obsidian)' },
    { id: 'colourful', class: 'bg-rose-500', label: 'ভাইব্রেন্ট (Vibrant)' },
    { id: 'nakshiLight', class: 'bg-amber-100 border border-amber-300', label: 'হেরিটেজ (Heritage)' },
    { id: 'greenField', class: 'bg-emerald-800', label: 'এভারগ্রিন (Evergreen)' },
  ];

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
      <SheetContent side="left" className="w-[320px] bg-black border-r border-[var(--pm-border)] p-0 flex flex-col">
        <SheetHeader className="p-6 text-left border-b border-[var(--pm-border)]">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 border-2 border-[var(--pm-accent)]">
                <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-[var(--pm-surface)] text-[var(--pm-text)]">
                  {user?.fullName?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <SheetTitle className="text-base font-black text-white leading-none mb-1 truncate">
                  {user?.fullName || user?.name || 'Paikar User'}
                </SheetTitle>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge className={cn(
                    "text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border-none",
                    isSuperAdmin
                      ? "bg-cyan-500 text-black font-extrabold"
                      : isSeller
                        ? "bg-amber-500 text-black font-extrabold"
                        : isPKShopStaff
                          ? "bg-purple-500 text-white font-extrabold"
                          : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  )}>
                    {isSuperAdmin ? 'Super Admin' : isSeller ? 'Seller' : isPKShopStaff ? 'Staff' : 'Buyer'}
                  </Badge>
                  {user?.email && (
                    <span className="text-[10px] text-[var(--pm-muted)] truncate max-w-[130px]">
                      {user.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--pm-accent)] text-white font-black">
                  P
                </div>
                <span className="text-xl font-black tracking-tighter text-white">
                  Paikar<span className="text-[var(--pm-accent)]">Mart</span>
                </span>
              </div>
              <p className="text-xs text-[var(--pm-muted)]">
                Log in to sync your profile, manage orders, and unlock partner portals.
              </p>
              <Link
                to="/auth/login"
                onClick={handleLinkClick}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--pm-accent)] px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                Login / Register
              </Link>
            </div>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {/* =========================================================================
              EXCLUSIVE RBAC ENTRY POINT (Strict Hard Enforcement)
              All administrative, management, and seller dashboard entry points ONLY reside here.
             ========================================================================= */}
          {isAuthenticated && (
            <div className="p-2.5 rounded-2xl bg-zinc-950/70 border border-white/10 space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Exclusive Control Panel
                </span>
                <span className="text-[9px] font-bold text-zinc-500 uppercase">
                  RBAC Active
                </span>
              </div>

              {/* ⚡ Super Admin Control Center */}
              {isSuperAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-cyan-950/80 to-blue-950/60 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-900/40 transition-all shadow-lg shadow-cyan-950/60 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                      <Zap className="w-5 h-5 fill-cyan-400/20" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                        ⚡ Super Admin Control Center
                      </div>
                      <div className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider">
                        Full Governance & RBAC
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              {/* 🏪 Seller Central Dashboard */}
              {isSeller && (
                <Link
                  to="/seller/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/60 border border-emerald-500/40 text-emerald-300 hover:border-emerald-400 hover:bg-emerald-900/40 transition-all shadow-lg shadow-emerald-950/60 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                        🏪 Seller Central Dashboard
                      </div>
                      <div className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-wider">
                        Catalog, Orders & Payouts
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              {/* 🛍️ PK Shop Manager Portal */}
              {isPKShopStaff && (
                <Link
                  to="/portals/pk-shop/admin"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-purple-950/80 to-pink-950/60 border border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-900/40 transition-all shadow-lg shadow-purple-950/60 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
                        🛍️ PK Shop Manager Portal
                      </div>
                      <div className="text-[10px] text-purple-400/80 font-bold uppercase tracking-wider">
                        Official Flagship Sourcing
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-400/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}

              {/* 🚀 Become a Seller / Open Store */}
              {isBuyer && (
                <Link
                  to="/seller/onboarding"
                  onClick={handleLinkClick}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/80 to-orange-950/60 border border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-900/40 transition-all shadow-lg shadow-amber-950/60 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                      <Rocket className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                        🚀 Become a Seller / Open Store
                      </div>
                      <div className="text-[10px] text-amber-400/80 font-bold uppercase tracking-wider">
                        Reach 1M+ Wholesale Buyers
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400/70 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
          )}

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              if (item.authRequired && !isAuthenticated) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group",
                    isActive
                      ? "bg-[var(--pm-accent)]/10 text-[var(--pm-accent)]"
                      : "text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-white"
                  )}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform group-hover:scale-110",
                    isActive ? "stroke-[2.5px]" : "stroke-2"
                  )} />
                  <span className="text-sm font-bold tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--pm-accent)] shadow-[0_0_8px_var(--pm-accent)]" />}
                </Link>
              );
            })}
          </div>

          <Separator className="bg-[var(--pm-border)] mx-3" />

          <div className="space-y-1">
            {secondaryItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-3 py-3 rounded-xl text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-white transition-all group"
              >
                <item.icon className="h-5 w-5 stroke-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </Link>
            ))}

            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all group cursor-pointer"
              >
                <LogOut className="h-5 w-5 stroke-2 group-hover:translate-x-1 transition-transform" />
                <span className="text-sm font-bold tracking-tight">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Theme Switcher */}
        <div className="p-5 border-t border-[var(--pm-border)] bg-[var(--pm-surface)]/50">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--pm-muted)]">
              <Palette className="h-3 w-3" />
              <span>রঙিন থিমস (Themes)</span>
            </div>
            <div className="flex items-center gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setTheme(color.id as any)}
                  className={cn(
                    "h-7 w-7 rounded-full transition-all hover:scale-125 cursor-pointer relative flex items-center justify-center ring-offset-2 ring-offset-black",
                    color.class,
                    theme === color.id ? "ring-2 ring-[var(--pm-accent)] shadow-lg shadow-[var(--pm-accent)]/20" : "hover:ring-1 hover:ring-white"
                  )}
                  title={color.label}
                >
                  {theme === color.id && (
                    <Check className="w-3.5 h-3.5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
