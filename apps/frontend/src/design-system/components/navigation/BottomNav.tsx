import React from 'react';
import { 
  Home, Newspaper, LayoutGrid, MessageSquare, User, LogIn, PlayCircle, Store, Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@/core/lib/i18n';
import { useAuth } from '@/modules/auth';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';
import { cn } from '@/lib/utils';

const BangladeshMapIcon = ({ className, strokeWidth = 1.5, ...props }: any) => (
  <svg 
    viewBox="0 0 800 900" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth={strokeWidth * 30} // Adjusted for larger viewBox
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    {...props}
  >
    {/* High-fidelity Bangladesh Map Silhouette */}
    <path 
      d="M380,40 C395,45 410,50 425,65 C440,70 460,75 465,90 C470,105 485,110 500,115 C515,120 530,125 540,140 C550,155 565,160 575,175 C585,185 595,190 605,205 C615,220 620,235 635,245 C650,255 660,270 675,280 C690,290 705,305 710,320 C715,335 730,345 735,360 C740,375 750,390 755,405 C760,420 755,435 750,450 C745,465 735,475 725,490 C715,505 700,515 690,530 C680,545 670,560 655,570 C640,580 625,595 615,610 C605,625 595,640 580,650 C565,660 550,670 540,685 C530,700 520,715 505,725 C490,735 480,750 465,760 C450,770 435,785 420,790 C405,795 390,805 375,810 C360,815 345,805 330,800 C315,795 300,785 290,775 C280,765 270,750 255,745 C240,740 225,730 215,720 C205,710 195,695 185,685 C175,675 160,670 150,655 C140,640 130,625 125,610 C120,595 110,585 105,570 C100,555 90,545 85,530 C80,515 75,500 70,485 C65,470 60,455 65,440 C70,425 80,415 85,400 C90,385 100,375 105,360 C110,345 120,335 125,320 C130,305 140,295 150,285 C160,275 170,265 180,255 C190,245 200,235 210,225 C220,215 225,200 235,190 C245,180 255,165 265,155 C275,145 290,140 300,130 C310,120 320,105 335,100 C350,95 365,80 375,65 Z" 
      fill="currentColor" 
      fillOpacity="0.15"
    />
    {/* Iconic central sun from Bangladesh flag represented as a stylized point */}
    <circle cx="410" cy="420" r="45" fill="currentColor" fillOpacity="0.8" stroke="none" />
  </svg>
);

export const BottomNav = ({ isVisible }: { isVisible?: boolean }) => {
  const location = useLocation();
  const { t, lang } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const isNavVisibleStore = useNavSettingsStore((s) => s.isNavVisible);
  const navBehavior = useNavSettingsStore((s) => s.navBehavior);

  const shouldShow = navBehavior === 'fixed' ? true : (isVisible !== undefined ? isVisible : isNavVisibleStore);

  const isPortalActive = location.pathname === '/portals' || 
                         location.pathname === '/apps' || 
                         location.pathname === '/hub' || 
                         location.pathname === '/portal-hub' ||
                         location.pathname.startsWith('/portals/');

  const isVideoActive = location.pathname === '/video' || 
                        location.pathname.startsWith('/video/') || 
                        location.pathname === '/reels';

  const isActive = (path: string) => {
    if (path === '/portals') return isPortalActive;
    if (path === '/messages') return location.pathname.startsWith('/messages');
    return location.pathname === path;
  };

  const profilePath = isAuthenticated ? '/profile' : '/login';
  const profileLabel = isAuthenticated ? t('profile') : (lang === 'BN' ? 'লগইন' : 'Login');
  const ProfileIcon = isAuthenticated ? User : LogIn;

  const navItems = [
    { label: lang === 'BN' ? 'এক্সপ্লোর' : 'Explore', icon: Compass, path: '/portals' },
    { label: lang === 'BN' ? 'মার্কেট' : 'Market', icon: Store, path: '/market' },
    { label: lang === 'BN' ? 'হোম' : 'Home', icon: Home, path: '/', isCenter: true },
    { label: lang === 'BN' ? 'ভিডিও' : 'Video', icon: PlayCircle, path: '/video' },
    { label: profileLabel, icon: ProfileIcon, path: profilePath },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 glass h-[68px] w-full border-t border-white/5 pb-safe shadow-[0_-8px_30px_rgb(0,0,0,0.5)] flex items-center select-none transition-transform duration-300 ease-in-out ${
      shouldShow ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="w-full h-full flex items-center justify-around px-2 relative">
        {navItems.map((item) => (
          item.isCenter ? (
            <motion.div
              key={item.path}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.05 }}
              className="relative z-50 -mt-10"
            >
              <Link 
                to={item.path}
                className={cn(
                  "relative w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-4",
                  isActive(item.path) 
                  ? "border-white bg-[#006a4e] scale-110" 
                  : "border-white/20 bg-[#006a4e] hover:border-white/40"
                )}
                title={item.label}
              >
                {/* Home icon with Red interior to represent Bangladesh Flag */}
                <item.icon 
                  className="w-8 h-8 text-white z-10" 
                  fill="#f42a41" // Bangladesh Flag Red
                  strokeWidth={2.5}
                />
                
                {/* Pulse effect for center button */}
                <span className="absolute inset-0 rounded-full bg-white/10 animate-ping" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key={item.label}
              whileTap={{ scale: 0.92 }}
              className="flex-1"
            >
              <Link 
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center w-full min-h-[56px] gap-1 transition-all duration-200",
                  isActive(item.path)
                  ? "text-[var(--pm-accent)]" 
                  : "text-zinc-500 hover:text-white"
                )}
              >
                {item.path === '/profile' && user && (user.avatar || user.avatarUrl) ? (
                  <div className={cn(
                    "w-6 h-6 rounded-full overflow-hidden border-2",
                    isActive(item.path) ? "border-[var(--pm-accent)]" : "border-transparent"
                  )}>
                    <img 
                      src={user.avatar || user.avatarUrl} 
                      alt="P" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <item.icon 
                    className={cn(
                      "w-5.5 h-5.5 transition-all",
                      isActive(item.path) ? "stroke-[2.5px] scale-110" : "stroke-[2px]"
                    )} 
                  />
                )}
                <span className={cn(
                  "text-[9px] font-black uppercase tracking-tighter",
                  isActive(item.path) ? "opacity-100" : "opacity-60"
                )}>
                  {item.label}
                </span>
              </Link>
            </motion.div>
          )
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
