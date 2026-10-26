import React, { useState } from 'react';
import { Bell, Search, Menu, ShoppingBag, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SearchBar } from './SearchBar';
import { useCartStore } from '../../modules/cart/cartStore';
import { useCartDrawerStore } from '../../modules/cart/cartDrawerStore';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuthStore } from '../../modules/auth/store/authStore';

export const Navbar = ({ onMenuClick }: { onMenuClick?: () => void }) => {
  const [showSearch, setShowSearch] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const openCart = useCartDrawerStore((state) => state.open);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const themes = ['deepDark', 'colourful', 'nakshiLight', 'greenField'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme as any);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 glass h-[60px] md:h-[64px] w-full border-b border-[var(--pm-border)]/50">
      <nav className="w-full mx-auto px-4 h-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 text-[var(--pm-text)] active:bg-[var(--pm-surface-hover)] rounded-full transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="lg:hidden font-black text-xl flex items-center gap-0.5 tracking-tight">
            <span className="text-[var(--pm-accent)]">Paikar</span>
            <span className="text-[var(--pm-text)]">Mart</span>
          </div>
        </div>

        <div className="hidden sm:block sm:flex-1 sm:max-w-md">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="sm:hidden p-2 text-[var(--pm-accent)] hover:opacity-80 active:scale-95 transition-all"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] rounded-full transition-all"
            title="Toggle Theme"
          >
            <Palette className="w-5 h-5" />
          </button>

          {/* Cart Icon with badge */}
          <div 
            onClick={openCart}
            className="relative p-2 text-[var(--pm-text-muted)] cursor-pointer hover:text-[var(--pm-text)] transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--pm-accent)] text-white text-[8px] font-black rounded-full flex items-center justify-center border border-[var(--pm-surface)] animate-pulse">
                {totalItems}
              </span>
            )}
          </div>

          <div className="relative p-2 text-[var(--pm-text-muted)] cursor-pointer hover:text-[var(--pm-text)] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--pm-surface)]" />
          </div>

          <Link
            to="/profile"
            className="p-1 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden w-8 h-8 shrink-0 hover:scale-110 transition-transform flex items-center justify-center bg-[var(--pm-surface)]"
          >
            <img
              src={useAuthStore.getState().user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Munna"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      </nav>

      {/* Mobile Search Overlay */}
      {showSearch && (
        <div className="absolute top-full left-0 w-full p-4 glass border-b border-[var(--pm-border)] sm:hidden animate-in fade-in slide-in-from-top-2 duration-500">
          <SearchBar />
        </div>
      )}
    </header>
  );
};

