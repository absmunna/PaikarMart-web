import { Bell, Search, ShoppingBag, Palette, Menu, User, LayoutDashboard, X, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "@/modules/cart";
import { SideNavDrawer } from "@/design-system/components/navigation/UnifiedSidebar";

export default function Header() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#141624]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full max-w-7xl mx-auto gap-4">

          {/* Left Section: Menu & Logo */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => setIsSideNavOpen(true)}
              className="text-gray-300 hover:text-white transition-colors p-1.5 rounded-xl hover:bg-white/10"
              title="Open Navigation Menu"
            >
              <Menu className="h-6 w-6 text-[var(--pm-accent)]" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-[var(--pm-accent)]">Paikar</span>
              <span className="text-xl font-bold tracking-tight text-white">Mart</span>
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <button
              onClick={() => navigate('/search')}
              className="text-gray-400 hover:text-[var(--pm-accent)] transition-colors md:hidden"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/messages"
              className="text-gray-400 hover:text-[var(--pm-accent)] transition-colors relative"
              title="Messages"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-[#141624]" />
            </Link>

            <button
              onClick={() => setIsSideNavOpen(true)}
              className="hidden sm:block text-gray-400 hover:text-[var(--pm-accent)] transition-colors"
              title="Website Settings & Themes"
            >
              <Palette className="h-5 w-5" />
            </button>

            <Link to="/cart" className="relative text-gray-400 hover:text-[var(--pm-accent)] transition-colors block" title="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--pm-accent)] text-[10px] font-bold text-white border-2 border-[#141624] shadow-sm animate-in zoom-in">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/notifications" className="relative text-gray-400 hover:text-[var(--pm-accent)] transition-colors block" title="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#141624]">
                    3
                  </span>
                </Link>

                <Link to="/profile" className="flex items-center" title="Profile">
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center border-2 border-[var(--pm-accent)] overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-white">{getInitials(user?.name || "User")}</span>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <Link to="/login" className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-600 hover:border-[var(--pm-accent)] transition-colors text-gray-400 hover:text-[var(--pm-accent)]" title="Sign In">
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Advanced Facebook-style Side Navigation Drawer */}
      <SideNavDrawer isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
    </>
  );
}
