import React, { useState, useEffect, useRef } from 'react';
import { Home, ShoppingBag, LayoutGrid, MessageSquare, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { useAuth } from '@/features/auth/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Paths where BottomNav should be completely hidden
const HIDDEN_PATHS = ['/reels'];

export const BottomNav = ({ isSidebarOpen }: { isSidebarOpen?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { navBehavior } = useNavSettingsStore();
  const { toggleAppLauncher, isAppLauncherOpen } = useNavUIStore();
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollYRef = useRef(window.scrollY);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => location.pathname === path;
  const isHiddenPage = HIDDEN_PATHS.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSidebarOpen) {
      setIsVisible(true);
      return;
    }

    if (navBehavior === 'fixed' || isHiddenPage) {
      if (!isHiddenPage) setIsVisible(true);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const prevScrollY = lastScrollYRef.current;
          
          if (currentScrollY < 15) {
            setIsVisible(true);
          } else {
            const delta = currentScrollY - prevScrollY;
            if (delta > 20) {
              setIsVisible(false);
            } else if (delta < -20) {
              setIsVisible(true);
            }
          }
          
          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [navBehavior, isHiddenPage, isSidebarOpen]);

  if (isHiddenPage) return null;

  const navItems = [
    { id: 'home', label: 'হোম', enLabel: 'Home', icon: Home, path: '/' },
    { id: 'market', label: 'মার্কেটপ্লেস', enLabel: 'Market', icon: ShoppingBag, path: '/marketplace' },
    { id: 'apps', label: 'অ্যাপস', enLabel: 'Apps', icon: LayoutGrid, path: '/portals', isCenter: true },
    { id: 'messages', label: 'মেসেজ', enLabel: 'Messages', icon: MessageSquare, path: '/messages' },
    { id: 'profile', label: 'প্রোফাইল', enLabel: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <>
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-[600] pointer-events-none transition-all duration-300 lg:hidden",
        isSidebarOpen 
          ? "translate-y-[150%] opacity-0" 
          : (isVisible ? "translate-y-0 opacity-100" : "translate-y-[calc(100%-6px)] opacity-100")
      )}>
        <div className="w-full bg-[#141624] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.3)] flex items-center justify-around relative pointer-events-auto h-16 border-t border-white/5">
          <div className="w-full max-w-[520px] mx-auto flex items-center justify-around px-1 h-full relative">
            {navItems.map((item) => {
              const active = isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen);
              const Icon = item.icon;

              if (item.isCenter) {
                return (
                  <button
                    key={item.label}
                    onClick={() => toggleAppLauncher()}
                    className="relative -top-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#1e2136] border-[3px] border-[#141624] shadow-lg transition-transform active:scale-95 pointer-events-auto"
                  >
                    <div className={cn(
                      "flex h-full w-full items-center justify-center rounded-full border transition-all",
                      active ? "border-[var(--pm-accent)] text-[var(--pm-accent)] bg-[var(--pm-accent)]/10" : "border-[var(--pm-accent)]/30 text-[var(--pm-accent)]"
                    )}>
                      <Icon className="h-6 w-6" strokeWidth={2.5} />
                    </div>
                  </button>
                );
              }

              return (
                <button 
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 py-1 rounded-xl relative group pointer-events-auto min-w-[44px]",
                    active ? "text-[var(--pm-accent)]" : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  <div className="relative">
                    {item.id === 'profile' && isAuthenticated && user ? (
                      <div className={cn(
                        "w-6 h-6 rounded-full overflow-hidden border-2 transition-all duration-300",
                        active ? "border-[var(--pm-accent)] shadow-[0_0_8px_var(--pm-accent)]" : "border-gray-500/30"
                      )}>
                        <img 
                          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <Icon className={cn(
                        "w-5 h-5 transition-all duration-500",
                        active ? "stroke-[2.5px] drop-shadow-[0_0_6px_var(--pm-accent)]" : "stroke-[2px]"
                      )} />
                    )}
                  </div>
                  
                  <span className={cn(
                    "text-[10px] font-medium leading-none transition-all duration-300",
                    active ? "opacity-100" : "opacity-60"
                  )}>
                    {item.enLabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
};

