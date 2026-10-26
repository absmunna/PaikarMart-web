import React, { useState, useEffect, useRef } from 'react';
import { Home, ShoppingBag, LayoutGrid, MessageSquare, User, ArrowLeft, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';

// Paths where BottomNav should be completely hidden
const HIDDEN_PATHS = ['/reels'];

export const BottomNav = ({ onMenuClick, isSidebarOpen }: { onMenuClick?: () => void; isSidebarOpen?: boolean }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    { label: 'হোম', enLabel: 'Home', icon: Home, path: '/' },
    { label: 'মার্কেটপ্লেস', enLabel: 'Marketplace', icon: ShoppingBag, path: '/marketplace' },
    { label: 'অ্যাপস', enLabel: 'Apps', icon: LayoutGrid, path: '/portals' },
    { label: 'মেসেজ', enLabel: 'Message', icon: MessageSquare, path: '/messages' },
    { label: 'প্রোফাইল', enLabel: 'Profile', icon: User, path: '/profile' },
  ];

  return (
    <>
      <nav className={cn(
      "fixed bottom-0 left-0 right-0 z-[600] pointer-events-none transition-all duration-300 lg:hidden",
      isSidebarOpen 
        ? "translate-y-[150%] opacity-0" 
        : (isVisible ? "translate-y-0 opacity-100" : "translate-y-[calc(100%-6px)] opacity-100")
    )}>
      <div className="w-full bg-[#04070f]/95 backdrop-blur-3xl pb-[env(safe-area-inset-bottom)] shadow-[0_-15px_40px_rgba(0,0,0,0.5)] flex items-center justify-between relative pointer-events-auto h-[58px] border-t border-white/5">
        {/* Subtle Background Inner Glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.02] to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transition-all duration-300" />
        
        <div className="w-full max-w-[520px] mx-auto flex items-center justify-between px-1 h-full relative">
          {/* Back Button */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex flex-col items-center justify-center text-zinc-500 hover:text-cyan-400 transition-all gap-0.5 active:scale-75"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[6px] font-black uppercase tracking-tighter opacity-50">Back</span>
          </motion.button>

          <div className="flex flex-1 items-center justify-around px-1">
            {navItems.map((item) => (
              <button 
                key={item.label}
                onClick={() => {
                  if (item.path === '/portals') {
                    toggleAppLauncher();
                  } else {
                    navigate(item.path);
                  }
                }}
                className={cn(
                  "flex flex-col items-center gap-0.5 transition-all duration-300 py-1 rounded-xl relative group pointer-events-auto min-w-[44px]",
                  (isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen)) ? "text-cyan-400" : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                <div className="relative">
                  <item.icon className={cn(
                    "w-4 h-4 transition-all duration-500",
                    (isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen)) ? "stroke-[2.2px] drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]" : "stroke-[1.8px]"
                  )} />
                  {(isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen)) && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute -inset-1 bg-cyan-500/[0.05] rounded-full -z-10"
                    />
                  )}
                </div>
                
                <div className="flex flex-col items-center pointer-events-none">
                  <span className={cn(
                    "text-[8px] font-bold tracking-tighter transition-all duration-300",
                    (isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen)) ? "opacity-100" : "opacity-60"
                  )}>
                    {item.label}
                  </span>
                </div>

                {(isActive(item.path) || (item.path === '/portals' && isAppLauncherOpen)) && (
                  <motion.div 
                    layoutId="active-dot-indicator"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" 
                  />
                )}
              </button>
            ))}
          </div>

          {/* Forward Button */}
          <motion.button 
            whileTap={{ scale: 0.8 }}
            onClick={() => navigate(1)}
            className="w-10 h-10 flex flex-col items-center justify-center text-zinc-500 hover:text-cyan-400 transition-all gap-0.5 active:scale-75"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="text-[6px] font-black uppercase tracking-tighter opacity-50">Next</span>
          </motion.button>
        </div>
      </div>
    </nav>
    </>
  );
};

