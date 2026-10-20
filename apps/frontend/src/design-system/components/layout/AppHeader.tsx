import React from 'react';
import { Menu, Search, ShoppingCart, Bell, User, LogIn } from 'lucide-react';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { useAuth } from '@/app/context/AuthContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/Badge/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { LocationPicker } from '../navigation/LocationPicker';
import { ThemeLangSwitcher } from '../navigation/ThemeLangSwitcher';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '@/modules/cart';
import { useCartDrawerStore } from '@/modules/cart/store/cartDrawerStore';

export const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const { setSidebarOpen, setSearchOpen, setCartOpen } = useNavUIStore();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCartStore();
  const openCartDrawer = useCartDrawerStore((state) => state.open);
  
  // Real dynamic cart count
  const cartCount = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--pm-border)] bg-black/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left: Hamburger + Logo + Global Location Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-[var(--pm-muted)] hover:text-[var(--pm-text)] shrink-0"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <span className="hidden xs:inline-block text-lg font-black tracking-tight text-[var(--pm-text)]">
              Paikar<span className="text-[var(--pm-accent)]">Mart</span>
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
            onClick={() => {
              setSearchOpen(true);
              navigate('/search');
            }}
            title="সার্চ করুন"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Global Location Selector (Moved from banner) */}
          <div className="shrink-0 mx-1">
            <LocationPicker />
          </div>

          {/* Global Theme & Language Picker (Hidden on mobile UI) */}
          <div className="shrink-0 mx-1 hidden sm:block">
            <ThemeLangSwitcher />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-[var(--pm-muted)] hover:text-[var(--pm-text)]"
            onClick={() => {
              setCartOpen(true);
              openCartDrawer();
            }}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 p-0 flex items-center justify-center bg-[var(--pm-accent)] text-[10px] border-black">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Link 
            to="/notifications"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)] transition-colors"
          >
            <Bell className="h-5 w-5" />
          </Link>

          <div className="ml-2 border-l border-[var(--pm-border)] pl-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9 border border-[var(--pm-border)] transition-transform hover:scale-105">
                      <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                      <AvatarFallback className="bg-[var(--pm-surface)] text-[var(--pm-muted)]">
                        {user?.fullName?.charAt(0) || <User className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-text)]">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.fullName}</p>
                      <p className="text-xs leading-none text-[var(--pm-muted)]">
                        {user?.email || user?.phone}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[var(--pm-border)]" />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[var(--pm-border)]" />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500"
                    onClick={() => logout()}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link 
                to="/auth/login"
                className="inline-flex h-9 items-center justify-center rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-bold px-4 gap-2 transition-colors uppercase tracking-widest shrink-0"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden xs:inline">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
