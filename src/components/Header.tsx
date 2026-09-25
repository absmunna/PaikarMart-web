import { Bell, Search, ShoppingBag, Palette, Menu, User, LayoutDashboard, X, Languages } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { SearchBar } from "./SearchBar";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCartStore } from "../modules/cart/cartStore";
import { SideNavDrawer } from "./common/AppNavigation";
import { useLanguage } from "@/features/language/LanguageContext";

export default function Header() {
  const { user, isAuthenticated, hasRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isSideNavOpen, setIsSideNavOpen] = useState(false);
  const cartItemCount = useCartStore((state) => state.getTotalItems());

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

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
              <Menu className="h-6 w-6 text-[#FF7A00]" />
            </button>
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-[#FF7A00]">Paikar</span>
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
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className={`text-gray-400 hover:text-[#FF7A00] transition-colors md:hidden ${isMobileSearchOpen ? 'text-[#FF7A00]' : ''}`}
            >
              <Search className="h-5 w-5" />
            </button>

            <button 
              onClick={toggleLanguage}
              className="text-gray-400 hover:text-[#FF7A00] transition-colors flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest border border-white/5 px-2 py-1 rounded-lg hover:bg-white/5"
              title="Change Language"
            >
              <Languages className="h-4 w-4" />
              {language === 'bn' ? 'ENG' : 'বাংলা'}
            </button>
            
            <button 
              onClick={() => setIsSideNavOpen(true)}
              className="text-gray-400 hover:text-[#FF7A00] transition-colors" 
              title="Website Settings & Themes"
            >
              <Palette className="h-5 w-5" />
            </button>
            
            <Link to="/cart" className="relative text-gray-400 hover:text-[#FF7A00] transition-colors block" title="Cart">
              <ShoppingBag className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF7A00] text-[10px] font-bold text-white border-2 border-[#141624] shadow-sm animate-in zoom-in">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                {hasRole("seller") && (
                  <Link to="/seller-central" className="text-gray-400 hover:text-[#FF7A00] transition-colors hidden md:block" title="Seller Hub">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <Link to="/notifications" className="relative text-gray-400 hover:text-[#FF7A00] transition-colors block" title="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white border-2 border-[#141624]">
                    3
                  </span>
                </Link>

                <Link to="/profile" className="flex items-center" title="Profile">
                  <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center border-2 border-[#FF7A00] overflow-hidden">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-white">{getInitials(user?.name || "User")}</span>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              <Link to="/auth" className="flex items-center justify-center h-8 w-8 rounded-full border-2 border-gray-600 hover:border-[#FF7A00] transition-colors text-gray-400 hover:text-[#FF7A00]" title="Sign In">
                <User className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/5 bg-[#141624] overflow-hidden"
            >
              <div className="p-4 flex items-center gap-3">
                <div className="flex-1">
                  <SearchBar />
                </div>
                <button 
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="p-2 text-gray-400"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Advanced Facebook-style Side Navigation Drawer */}
      <SideNavDrawer isOpen={isSideNavOpen} onClose={() => setIsSideNavOpen(false)} />
    </>
  );
}
