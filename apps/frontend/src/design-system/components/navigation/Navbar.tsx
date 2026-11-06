import React from 'react';
import { Bell, Menu, Search, ShoppingBag, User, LogIn, Wallet, PlayCircle, MessageSquare } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { useCartStore, useCartDrawerStore } from '@/modules/cart';
import { useAuth } from '@/modules/auth';
import { useNotificationsStore } from '@/modules/notification';
import { LocationPicker } from './LocationPicker';
import { useWalletStore } from '@/modules/wallet';
import { motion } from 'framer-motion';

/**
 * Clean & Unified Super App Header.
 * Consolidates features from the legacy HomeHeader to prevent double-header issues.
 * Provides: Search, Location, Cart, Wallet, Notifications, and Video Hub shortcut.
 */
export const Navbar = ({ onMenuClick, isVisible }: { onMenuClick?: () => void; isVisible?: boolean }) => {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartDrawerStore((state) => state.open);
  const { user, isAuthenticated } = useAuth();
  const { getUnreadCount } = useNotificationsStore();
  const { balance } = useWalletStore();
  const unreadNotifications = getUnreadCount();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show some elements on specific routes if needed
  const isSearchPage = location.pathname === '/search';

  return (
    <header
      className={`absolute top-0 left-0 right-0 z-50 glass h-[60px] md:h-[64px] w-full border-b border-[var(--pm-border)]/60 select-none transition-transform duration-300 ease-in-out ${
        isVisible === false ? '-translate-y-full pointer-events-none shadow-none' : 'translate-y-0'
      }`}
    >
      <nav className="w-full mx-auto px-3 sm:px-4 lg:px-6 h-full flex items-center gap-2 sm:gap-3">
        {/* Left: menu + brand */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] active:bg-[var(--pm-surface-hover)] rounded-xl transition-colors cursor-pointer"
            title="Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <Link to="/" className="font-black text-lg sm:text-xl tracking-tight group shrink-0">
            <span className="text-[var(--pm-accent)]">Paikar</span>
            <span className="text-[var(--pm-text)]">Mart</span>
          </Link>
        </div>

        {/* Center: search (desktop inline, mobile icon) */}
        {!isSearchPage && (
          <>
            <div className="hidden lg:block flex-1 max-w-md xl:max-w-xl mx-auto min-w-0">
              <SearchBar />
            </div>
            <button
              onClick={() => navigate('/search')}
              className="lg:hidden ml-auto p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] active:scale-95 transition-all rounded-xl cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Right: Shortcuts + Wallet + location + cart + notifications + account */}
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-auto lg:ml-0">
          {/* Video Hub Shortcut */}
          <button
            onClick={() => navigate('/video')}
            className="hidden sm:flex items-center gap-1.5 p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer group"
            title="ভিডিও পোর্টাল"
          >
            <PlayCircle className="w-5 h-5 fill-rose-500/10 group-hover:scale-110 transition-transform" />
            <span className="relative flex h-1.5 w-1.5 -ml-1 mt-[-10px]">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-rose-500"></span>
            </span>
          </button>

          {/* Wallet Balance (Consolidated from HomeHeader) */}
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/wallet')}
            className="hidden xs:flex items-center gap-2 px-2.5 py-1.5 hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer group shrink-0"
            title="ওয়ালেট ব্যালেন্স"
          >
            <div className="flex flex-col items-end leading-none">
              <span className="text-[7px] font-black text-[var(--pm-text-secondary)] uppercase tracking-wider">ব্যালেন্স</span>
              <span className="text-[11px] sm:text-xs font-black text-[var(--pm-text)] tabular-nums group-hover:text-[var(--pm-accent)] transition-colors">
                ৳{balance ? balance.toLocaleString('bn-BD') : '০'}
              </span>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
              <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
            </div>
          </motion.button>

          <div className="shrink-0">
            <LocationPicker />
          </div>

          <button
            onClick={openCart}
            className="relative p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--pm-accent)] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[var(--pm-surface)] shadow-xs">
                {totalItems}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {isAuthenticated && unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-[var(--pm-danger)] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[var(--pm-surface)]">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* Account: avatar (signed in) or login pill */}
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/profile')}
              className="ml-1 shrink-0 cursor-pointer"
              title={user?.fullName || 'Profile'}
            >
              {user?.avatarUrl || user?.avatar ? (
                <img
                  src={user.avatarUrl || user.avatar}
                  alt={user?.fullName || 'Profile'}
                  className="w-8 h-8 rounded-full object-cover border border-[var(--pm-border)] hover:border-[var(--pm-accent)] transition-colors"
                />
              ) : (
                <span className="w-8 h-8 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-border)] flex items-center justify-center font-black text-sm hover:border-[var(--pm-accent)] transition-colors">
                  {user?.fullName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                </span>
              )}
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold px-3.5 active:scale-95 transition-all shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

