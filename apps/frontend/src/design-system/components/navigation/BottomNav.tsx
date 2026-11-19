import React from 'react';
import { 
  Home, Store, Zap, PlayCircle, Compass
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

  const p = location.pathname;
  const isActive = (path: string) => {
    if (path === '/') return p === '/' || p === '/feed' || p === '/social';
    if (path === '/market') return p === '/market' || p.startsWith('/shop') || p.startsWith('/marketplace') || p.startsWith('/product');
    if (path === '/services') return p.startsWith('/services') || p.startsWith('/local');
    if (path === '/video') return p.startsWith('/video') || p === '/reels';
    if (path === '/portals') return p.startsWith('/portals') || p === '/apps' || p === '/hub' || p === '/portal-hub';
    return false;
  };

  const navItems = [
    { label: lang === 'BN' ? 'হোম' : 'Home', icon: Home, path: '/' },
    { label: lang === 'BN' ? 'মার্কেট' : 'Market', icon: Store, path: '/market' },
    { label: lang === 'BN' ? 'সার্ভিস' : 'Service', icon: Zap, path: '/services' },
    { label: lang === 'BN' ? 'ভিডিও' : 'Video', icon: PlayCircle, path: '/video' },
    { label: lang === 'BN' ? 'এক্সপ্লোর' : 'Explore', icon: Compass, path: '/portals' },
  ];

  return (
    <nav className={`fixed md:absolute bottom-0 left-0 right-0 z-40 h-[64px] w-full border-t border-[var(--pm-border)] bg-[var(--pm-bg)]/95 backdrop-blur-xl pb-safe flex items-center select-none transition-transform duration-300 ease-in-out ${
      shouldShow ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <div className="w-full h-full flex items-stretch justify-around px-1">
        {navItems.map((item) => {
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
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
