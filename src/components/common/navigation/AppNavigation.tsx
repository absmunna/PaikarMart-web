import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Palette, Globe, Shield, UserCheck, LogIn, LogOut, ChevronRight, FileText,
  Layers, Briefcase, LayoutDashboard, Settings, LayoutGrid, Store, HelpCircle,
  MessageSquare, User, Activity, Sparkles, CheckCircle2, RefreshCw
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { useTheme } from "@/features/theme/ThemeContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { cn } from "@/lib/utils";
import { MAIN_NAV, COMMERCE_HUBS, PERSONAL_NAV } from "@/constants/navigation";

// --- Shared Sub-components ---

function NavLink({ item, isActive, onClick, isCollapsed = false, badge, index = 0 }: { item: any, isActive: boolean, onClick?: () => void, isCollapsed?: boolean, badge?: React.ReactNode, index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.005 }}
    >
      <Link
        to={item.href || item.path}
        onClick={onClick}
        className={cn(
          "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group relative border border-transparent mb-0.5",
          isActive 
            ? "bg-zinc-800/80 text-[#FF7A00] border-white/5" 
            : "text-zinc-400 hover:bg-zinc-800/40 hover:text-white"
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-1.5 rounded-lg transition-all shrink-0 duration-300",
            isActive 
              ? "bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/20" 
              : "bg-zinc-900/60 text-zinc-500 group-hover:bg-zinc-800 group-hover:text-zinc-200"
          )}>
            <item.icon className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className={cn(
              "truncate transition-all duration-300",
              isActive ? "font-bold text-white" : ""
            )}>
              {item.label}
            </span>
          )}
        </div>
        {!isCollapsed && badge && (
          <div className="shrink-0">{badge}</div>
        )}
      </Link>
    </motion.div>
  );
}

function NavigationContent({ onClose }: { onClose?: () => void }) {
  const { user, isAuthenticated, hasRole, roleGroup } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  // Determine dynamic seller/merchant status
  const isApprovedSeller = user?.roles?.includes('seller') || user?.role === 'seller';
  const applicationStatus = user?.verification?.status as any;

  const userAvatar = user?.avatarUrl || user?.avatar;

  return (
    <div className="space-y-6">
      {/* 1. Profile / Shortcuts (Facebook Style Top) */}
      {isAuthenticated && user && (
        <div className="space-y-1">
          <p className="px-3 mb-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">Shortcuts</p>
          <Link
            to="/profile"
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-zinc-800/40 text-zinc-300 hover:text-white mb-1",
              pathname === "/profile" ? "bg-zinc-800/80 text-white font-bold" : ""
            )}
          >
            <div className="relative shrink-0">
              <div className="h-7 w-7 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] border border-white/5 flex items-center justify-center font-black overflow-hidden text-xs">
                {userAvatar ? (
                  <img src={userAvatar} alt={user.name || user.fullName} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span>{(user.name || user.fullName)?.[0].toUpperCase() || "U"}</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 border border-[#0f111a]" />
            </div>
            <span className="truncate">{user.name || user.fullName}</span>
          </Link>
        </div>
      )}

      {/* 2. Business Hub / Onboarding Section */}
      {isAuthenticated && (
        <nav className="space-y-1 bg-zinc-900/20 p-2 rounded-2xl border border-white/5">
          <p className="px-1.5 mb-1.5 text-[10px] font-black uppercase tracking-wider text-[#FF7A00]">Merchant Portal</p>
          
          {isApprovedSeller ? (
            <NavLink 
              item={{ label: 'Business Hub', icon: Briefcase, href: '/seller-dashboard' }} 
              isActive={pathname.startsWith("/seller-dashboard")} 
              onClick={onClose} 
              badge={
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase tracking-wider">
                  Active
                </span>
              }
            />
          ) : applicationStatus === 'submitted' || applicationStatus === 'under_review' ? (
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold bg-orange-500/5 border border-orange-500/10 text-orange-400">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400 shrink-0">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                </div>
                <div>
                  <p className="font-bold text-white text-[11px]">KYC Reviewing</p>
                  <p className="text-[9px] text-zinc-500">Wait for approval</p>
                </div>
              </div>
            </div>
          ) : (
            <NavLink 
              item={{ label: 'Become a Seller', icon: Store, href: '/register/seller' }} 
              isActive={pathname === "/register/seller"} 
              onClick={onClose} 
              badge={
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] font-black uppercase tracking-wider">
                  Apply
                </span>
              }
            />
          )}
        </nav>
      )}

      {/* 3. System Management Section */}
      {isAuthenticated && (hasRole("admin") || hasRole("super_admin") || roleGroup === 'vendor') && (
        <nav className="space-y-1">
          <p className="px-3 mb-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">Command Center</p>
          {(hasRole("admin") || hasRole("super_admin")) && (
            <NavLink 
              item={{ label: 'Admin Hub', icon: Shield, href: '/admin' }} 
              isActive={pathname.startsWith("/admin")} 
              onClick={onClose} 
            />
          )}
        </nav>
      )}

      {/* 4. Social Commerce Feed */}
      <nav className="space-y-1">
        <p className="px-3 mb-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">Social Commerce</p>
        {MAIN_NAV.map((item, i) => (
          <NavLink key={item.label} item={item} isActive={pathname === item.href} onClick={onClose} index={i} />
        ))}
      </nav>

      {/* 5. Central Hubs App Launcher Grid */}
      <div className="space-y-2">
        <p className="px-3 mb-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">Commerce Hubs</p>
        <div className="grid grid-cols-2 gap-2 px-3">
          {COMMERCE_HUBS.map((hub) => {
            const isActive = pathname.startsWith(hub.href);
            return (
              <button 
                key={hub.label} 
                onClick={() => handleNavigation(hub.href)} 
                className={cn(
                  "flex items-center gap-2 p-2 rounded-xl transition-all text-left border text-[11px] font-bold truncate",
                  isActive 
                    ? "bg-zinc-800 text-white border-white/5" 
                    : "text-zinc-400 bg-zinc-950/20 border-transparent hover:bg-zinc-800/40 hover:text-white"
                )}
              >
                <hub.icon className="h-3.5 w-3.5 text-[#FF7A00]" />
                <span className="truncate">{hub.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Personal Customer Navigation */}
      {isAuthenticated && (
        <nav className="space-y-1">
          <p className="px-3 mb-1 text-[10px] font-black uppercase tracking-wider text-zinc-500">My PaikarMart</p>
          {PERSONAL_NAV.map((item, i) => (
            <NavLink 
              key={item.label} 
              item={item} 
              isActive={pathname.startsWith(item.href)} 
              onClick={onClose}
              index={i + MAIN_NAV.length} 
            />
          ))}
        </nav>
      )}
    </div>
  );
}

// --- Component 1: DesktopSidebar ---

export function DesktopSidebar() {
  const { user, isAuthenticated } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-[calc(100vh-64px)] sticky top-16 border-r border-white/5 bg-[#0f111a] overflow-y-auto custom-scrollbar p-4 gap-6 shrink-0">
      <NavigationContent />

      <div className="mt-auto pt-4 border-t border-white/5">
        <div className="px-3 flex items-center justify-between text-[9px] font-black text-zinc-600 uppercase tracking-widest">
          <span>PAIKARMART BD v3.0</span>
          <Globe className="h-3 w-3" />
        </div>
      </div>
    </aside>
  );
}

// --- Component 2: SideNavDrawer ---

interface SideNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideNavDrawer: React.FC<SideNavDrawerProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setMode, presets } = useTheme();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"menu" | "settings">("menu");

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full sm:w-[320px] bg-[#141624] border-r border-white/5 text-white flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-[#0f111a]">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-[#FF7A00] flex items-center justify-center font-black text-white text-xs shadow-md">PM</div>
                <h2 className="text-xs font-black tracking-wider uppercase text-white">
                  PaikarMart <span className="text-[8px] px-1 rounded bg-[#FF7A00]/20 text-[#FF7A00] font-black">BD v3.0</span>
                </h2>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Profile Bar */}
            <div className="px-4 py-3 bg-[#0f111a] border-b border-white/5">
              {isAuthenticated && user ? (
                <div onClick={() => handleNavigation("/profile")} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden border border-[#141624]">
                      {user.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" /> : <span>{user.name?.[0].toUpperCase()}</span>}
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border border-[#141624]" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="text-xs font-bold text-white truncate group-hover:text-[#FF7A00] transition-colors">{user.name}</h3>
                    <p className="text-[10px] text-zinc-500 truncate">Manage Account</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00]/10 to-transparent border border-[#FF7A00]/15 text-left space-y-2.5">
                  <h4 className="text-xs font-bold text-zinc-300">Discover wholesale and retail listings across Bangladesh.</h4>
                  <button onClick={() => handleNavigation("/login")} className="w-full py-2 px-3 rounded-lg bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-bold transition-colors shadow-md flex items-center justify-center gap-2">
                    <LogIn className="h-4 w-4" /> Sign In / Register
                  </button>
                </div>
              )}
            </div>

            {/* Hub Selector tabs */}
            <div className="flex bg-[#0f111a] border-b border-white/5 px-2">
              {[ { id: "menu", label: "Menu", icon: LayoutGrid }, { id: "settings", label: "Preferences", icon: Settings } ].map((tab: any) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-colors",
                    activeTab === tab.id ? "border-[#FF7A00] text-[#FF7A00]" : "border-transparent text-zinc-500 hover:text-white"
                  )}
                >
                  <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Menu contents */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-[#141624]">
              {activeTab === "menu" ? (
                <NavigationContent onClose={onClose} />
              ) : (
                <div className="space-y-6">
                  {/* Theme presets */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-wider px-2"><Palette className="h-3 w-3 text-[#FF7A00]" /> Visual Themes</div>
                    <div className="grid grid-cols-2 gap-2">
                      {presets.map((p) => (
                        <button key={p.id} onClick={() => setMode(p.id as any)} className={cn("p-2 rounded-xl border text-left transition-all text-xs", theme === p.id ? "bg-[#FF7A00]/10 border-[#FF7A00] text-white font-bold" : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10 hover:text-white")}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Language Switcher */}
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-wider px-2"><Globe className="h-3 w-3 text-[#FF7A00]" /> Switch Language</div>
                    <div className="grid grid-cols-2 gap-2">
                      {["en", "bn"].map((l) => (
                        <button key={l} onClick={() => setLanguage(l as any)} className={cn("py-2 px-3 rounded-xl text-xs font-bold transition-all border", language === l ? "bg-[#FF7A00] border-[#FF7A00] text-white" : "bg-white/5 border-transparent text-zinc-400 hover:bg-white/10")}>{l === "en" ? "English" : "বাংলা"}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Signout */}
            <div className="p-4 bg-[#0f111a] border-t border-white/5">
              {isAuthenticated && (
                <button onClick={async () => { await logout(); onClose(); navigate("/login"); }} className="w-full py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-rose-500/20">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
