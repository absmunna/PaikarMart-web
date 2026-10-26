import React, { useState } from 'react';
import {
  Home, Newspaper, LayoutGrid, MessageSquare, User, X,
  Star, ShoppingBag, Building2, MapPin, Wrench, Monitor, Wallet, Car, Package, Sparkles
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/core/lib/i18n';
import { useAuth } from '@/modules/auth';
import { PortalsModal } from '@/modules/portals';

interface SuperHubItem {
  id: string;
  name: string;
  nameBn: string;
  path: string;
  icon: React.ElementType;
  gradient: string;
  badge?: string;
}

const SUPER_HUBS: SuperHubItem[] = [
  { id: 'pk-shop', name: 'PK Shop', nameBn: 'পিকে শপ', path: '/pk-shop', icon: Star, gradient: 'from-purple-600 to-indigo-600', badge: 'VIP' },
  { id: 'b2c', name: 'Retail Market', nameBn: 'খুচরা মার্কেট', path: '/shop', icon: ShoppingBag, gradient: 'from-orange-500 to-rose-600' },
  { id: 'wholesale', name: 'Wholesale B2B', nameBn: 'পাইকারি আড়ত', path: '/wholesale', icon: Building2, gradient: 'from-blue-600 to-indigo-700', badge: 'MOQ' },
  { id: 'nearby', name: 'Nearby Stores', nameBn: 'লোকাল শপ', path: '/nearby', icon: MapPin, gradient: 'from-emerald-500 to-teal-600' },
  { id: 'feed', name: 'Social Feed', nameBn: 'সোশ্যাল ফিড', path: '/feed', icon: Newspaper, gradient: 'from-cyan-500 to-blue-600' },
  { id: 'services', name: 'Services', nameBn: 'সার্ভিস হাব', path: '/services', icon: Wrench, gradient: 'from-amber-500 to-orange-600' },
  { id: 'digital', name: 'Digital & OTT', nameBn: 'ডিজিটাল গুডস', path: '/digital', icon: Monitor, gradient: 'from-violet-600 to-purple-800' },
  { id: 'wallet', name: 'Super Wallet', nameBn: 'সুপার ওয়ালেট', path: '/wallet', icon: Wallet, gradient: 'from-emerald-600 to-green-700' },
  { id: 'ride', name: 'Logistics & Ride', nameBn: 'রাইড ও লজিস্টিকস', path: '/ride', icon: Car, gradient: 'from-slate-700 to-zinc-900' },
  { id: 'orders', name: 'Track Orders', nameBn: 'অর্ডার ট্র্যাকিং', path: '/orders', icon: Package, gradient: 'from-sky-500 to-cyan-700' }
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isHubModalOpen, setIsHubModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t('home'), icon: Home, path: '/' },
    { label: t('feed'), icon: Newspaper, path: '/feed' },
    { label: t('apps'), icon: LayoutGrid, path: '/portals', isCenter: true },
    { label: t('messages'), icon: MessageSquare, path: '/messages' },
    { label: t('profile'), icon: User, path: '/profile' },
  ];

  const handleCenterClick = () => {
    setIsHubModalOpen(!isHubModalOpen);
  };

  const handleHubSelect = (path: string) => {
    setIsHubModalOpen(false);
    navigate(path);
  };

  return (
    <>
      <PortalsModal isOpen={isHubModalOpen} onClose={() => setIsHubModalOpen(false)} />

      {/* 5-Tab Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 z-40 glass h-[64px] w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] lg:max-w-[640px] border-t border-[var(--pm-border)] pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex items-center select-none">
        <div className="w-full h-full flex items-center justify-around px-2 relative">
          {navItems.map((item) => (
            item.isCenter ? (
              <button
                key={item.path}
                onClick={handleCenterClick}
                className={`relative -mt-6 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 active:scale-95 cursor-pointer ${
                  isHubModalOpen || isActive(item.path)
                  ? 'bg-[var(--pm-accent)] text-white shadow-[var(--pm-accent)]/30 scale-105'
                  : 'bg-[var(--pm-surface)] text-[var(--pm-accent)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]'
                }`}
                title="Super Hubs (10 Modules)"
              >
                <item.icon className={`w-6 h-6 transition-transform duration-300 ${isHubModalOpen ? 'rotate-45' : ''}`} />
              </button>
            ) : (
              <button
                key={item.label}
                onClick={() => {
                  setIsHubModalOpen(false);
                  navigate(item.path);
                }}
                className={`flex flex-col items-center justify-center min-w-[44px] min-h-[44px] px-1 gap-0.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                  isActive(item.path)
                  ? 'text-[var(--pm-accent)]'
                  : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {item.path === '/profile' && user && (user.avatar || user.avatarUrl) ? (
                  <div className={`w-5 h-5 rounded-full overflow-hidden border ${isActive(item.path) ? 'border-[var(--pm-accent)]' : 'border-[var(--pm-border)]'}`}>
                    <img
                      src={user.avatar || user.avatarUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <item.icon className={`w-5 h-5 ${isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                )}
                <span className={`text-[9px] font-bold ${isActive(item.path) ? 'opacity-100 font-black' : 'opacity-70'}`}>
                  {item.label}
                </span>
              </button>
            )
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
