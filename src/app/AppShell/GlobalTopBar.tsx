import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Bell,
  MoreVertical,
  Filter,
  ChevronDown,
  MapPin,
  X,
  Rss,
  Clock,
  Check,
  Flame,
  BadgeCheck,
  FileText,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCartStore } from "@/modules/cart/useCartStore";
import { motion, AnimatePresence } from "motion/react";
import { useFeedStore } from "@/modules/social/store/useFeedStore";
import { useLocation as useGeoLocation } from "@/modules/location/hooks/useLocation";
import { Button } from "@ui/button";
import { cn } from "@/lib/utils";
import { MegaSearch } from "@/features/search/components/MegaSearch";

interface GlobalTopBarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const GlobalTopBar: React.FC<GlobalTopBarProps> = ({
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isMegaSearchOpen, setIsMegaSearchOpen] = useState(false);

  const getPageTitle = (path: string) => {
    if (path === "/") return "Discover";
    if (path.startsWith("/auth/")) return "Authentication";
    if (path.startsWith("/portals")) return "App Launcher";
    if (path.startsWith("/messages")) return "Messages";
    if (path === "/cart") return "Your Cart";
    if (path === "/notifications") return "Alerts";
    if (path === "/search") return "Search Results";
    if (path === "/profile") return "My Profile";
    if (path.includes("/comments")) return "Feedback";
    if (path.startsWith("/marketplace")) return "Marketplace";
    if (path.startsWith("/reels")) return "Shorts";
    
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const last = segments[segments.length - 1];
      return last.charAt(0).toUpperCase() + last.slice(1).replace(/-/g, ' ');
    }
    return "PaikarMart";
  };

  const pageTitle = getPageTitle(location.pathname);
  const isHome = location.pathname === "/";

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems?.length || 0;

  // Location & Filter Shared states via useFeedStore
  const locationState = useGeoLocation();
  const {
    city,
    setCity,
    selectedType,
    setSelectedType,
    selectedSector,
    setSelectedSector,
    isFilterOpen,
    setIsFilterOpen,
    isLocationDrawerOpen,
    setIsLocationDrawerOpen,
  } = useFeedStore();

  const [searchQuery, setSearchQuery] = useState("");

  const BANGLADESH_CITIES = [
    "Chattogram", "Dhaka", "Sylhet", "Rajshahi", "Khulna", "Barishal", "Rangpur", "Mymensingh", "Cox's Bazar", "Cumilla",
  ];

  const filteredCities = BANGLADESH_CITIES.filter((c) =>
    c.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    if (locationState.city && locationState.city !== city) {
      setCity(locationState.city);
    }
  }, [locationState.city, city, setCity]);

  useEffect(() => {
    if (city && locationState.city !== city) {
      locationState.setLocation((prev) => ({
        ...prev,
        city,
        loading: false,
      }));
    }
  }, [city]);

  const filterOptions = [
    { id: "all", label: "All Products" },
    { id: "wholesale", label: "Wholesale" },
    { id: "retail", label: "Retail" },
    { id: "grocery", label: "Grocery" },
  ];

  return (
    <>
      <MegaSearch isOpen={isMegaSearchOpen} onClose={() => setIsMegaSearchOpen(false)} />
      
      <header className="fixed top-0 left-0 right-0 z-[500] mx-auto w-full max-w-[1440px] bg-[var(--pm-bg)]/94 backdrop-blur-3xl border-b border-white/[0.03] flex flex-col justify-center shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-2 lg:px-6 h-[64px]">
        {/* Minimal dynamic header */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        
        <div className="w-full h-full flex items-center justify-between gap-4 relative z-10">
          {/* Left section: Dynamic Responsive Branding */}
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onToggleSidebar?.()}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-cyan-400 transition-colors bg-white/[0.03] border border-white/[0.04] rounded-xl relative overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {isSidebarOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="w-5 h-5 text-[var(--pm-accent)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div 
              className="flex items-center cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="flex flex-col items-start leading-none overflow-hidden">
                <div className="flex items-center gap-1.5">
                  <span className={cn(
                    "text-[15px] md:text-[17px] font-black uppercase tracking-tighter transition-all duration-300",
                    isHome ? "text-white" : "text-[var(--pm-accent)]"
                  )}>
                    {isHome ? "PaikarMart" : "PM"}
                  </span>
                  {!isHome && (
                    <motion.div 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <div className="w-[1px] h-3 bg-zinc-800" />
                      <span className="text-[14px] md:text-[16px] font-bold text-white/90 whitespace-nowrap">
                        {pageTitle}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Center section: Search Trigger (Desktop) */}
          <div className="flex-1 max-w-lg px-4 hidden md:block">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              onClick={() => setIsMegaSearchOpen(true)}
              className="w-full h-10 bg-white/[0.02] border border-white/[0.04] rounded-full flex items-center px-4 gap-3 cursor-pointer group hover:bg-white/[0.05] transition-all duration-300"
            >
              <Search className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:text-cyan-400" />
              <span className="text-[11px] font-bold text-[var(--pm-text-muted)] uppercase tracking-widest group-hover:text-zinc-300">Find anything...</span>
              <div className="ml-auto flex items-center gap-2">
                <kbd className="h-5 flex items-center px-1.5 bg-black/40 border border-[var(--pm-border)] rounded text-[8px] font-mono text-zinc-600">
                  ⌘ K
                </kbd>
              </div>
            </motion.div>
          </div>

          {/* Right section: Clean Global Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white/[0.02] border border-white/[0.03] px-2.5 py-1.5 rounded-full mr-1.5">
              <button
                onClick={() => setIsLocationDrawerOpen(true)}
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-all pr-2.5 border-r border-[var(--pm-border)]"
              >
                <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate max-w-[80px]">
                  {city}
                </span>
              </button>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-1.5 hover:text-cyan-400 transition-all ml-1"
              >
                <Filter className="w-3.5 h-3.5 text-[var(--pm-accent)]/80" />
                <ChevronDown className="w-3 h-3 text-zinc-600" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsLocationDrawerOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-[var(--pm-accent)] sm:hidden"
              >
                <MapPin className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMegaSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center text-[var(--pm-text-muted)] md:hidden"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/notifications")}
                className="w-10 h-10 flex items-center justify-center text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] relative"
              >
                <Bell className="w-5 h-5" strokeWidth={2} />
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[var(--pm-accent)] rounded-full shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/cart")}
                className="w-10 h-10 flex items-center justify-center text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] relative"
              >
                <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                {cartCount > 0 && (
                  <span className="absolute top-2 right-2 min-w-[14px] h-[14px] rounded-full bg-[var(--pm-accent)] flex items-center justify-center text-[8px] font-black text-black px-1 border border-black/80">
                    {cartCount}
                  </span>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* ━━━ FILTER BOTTOM DRAWER ━━━ */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[510]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-[var(--pm-bg)] border-t border-[var(--pm-border)] rounded-t-[32px] z-[511] shadow-xl pb-10"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-4" />
              <div className="px-6 pb-6 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Inventory Filters</h3>
                  <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white/5 rounded-full">
                    <X className="w-4 h-4 text-[var(--pm-text-muted)]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-widest">Explore Sectors</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "all", icon: Rss, label: "সব পোস্ট", en: "Feed" },
                      { id: "trending", icon: Flame, label: "জনপ্রিয়", en: "Trending" },
                      { id: "verified", icon: BadgeCheck, label: "যাচাইকৃত", en: "Verified" },
                      { id: "demands", icon: FileText, label: "চাহিদা পত্র", en: "Demands" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSector(item.id as any)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-2xl border transition-all",
                          selectedSector === item.id
                            ? "bg-[var(--pm-accent)]/10 border-[var(--pm-accent)]/30"
                            : "bg-white/[0.02] border-[var(--pm-border)] hover:bg-white/[0.05]"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", selectedSector === item.id ? "bg-[var(--pm-accent)]" : "bg-[var(--pm-accent)]/10")}>
                          <item.icon className={cn("w-4 h-4", selectedSector === item.id ? "text-black" : "text-[var(--pm-accent)]")} />
                        </div>
                        <div className="flex flex-col items-start text-left shrink-0">
                          <span className={cn("text-[10px] font-black", selectedSector === item.id ? "text-white" : "text-white/70")}>{item.label}</span>
                          <span className="text-[8px] font-bold text-[var(--pm-text-muted)] uppercase tracking-widest">{item.en}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[var(--pm-accent)] uppercase tracking-widest">Order Types</label>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedType(opt.id as any)}
                        className={cn(
                          "px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border",
                          selectedType === opt.id
                            ? "bg-[var(--pm-accent)] border-[var(--pm-accent)] text-black shadow-lg"
                            : "bg-white/5 border-[var(--pm-border)] text-[var(--pm-text-muted)]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button onClick={() => setIsFilterOpen(false)} className="w-full bg-[var(--pm-accent)] hover:bg-cyan-400 text-black font-black h-12 rounded-2xl">
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ━━━ LOCATION BOTTOM DRAWER ━━━ */}
      <AnimatePresence>
        {isLocationDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLocationDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[520]"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-[var(--pm-bg)] border-t border-[var(--pm-border)] rounded-t-[40px] z-[521] shadow-xl pb-12"
            >
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto my-5" />
              <div className="px-6 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[var(--pm-accent)]" /> Set Location
                  </h3>
                  <p className="text-[10px] text-[var(--pm-text-muted)] font-bold uppercase tracking-widest">Select area to see local shops & services</p>
                </div>

                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search city or area..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-[var(--pm-border)] rounded-2xl pl-12 pr-4 text-sm font-bold text-white placeholder:text-zinc-700 focus:border-[var(--pm-accent)] outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { locationState.refreshLocation(); setIsLocationDrawerOpen(false); }} className="flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-accent)]/10 border border-[var(--pm-accent)]/20 group transition-all">
                    <div className="w-8 h-8 rounded-full bg-[var(--pm-accent)] flex items-center justify-center text-black shadow-lg">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-black text-white">Current</span>
                      <span className="text-[8px] font-bold text-[var(--pm-accent)] uppercase">Auto Detect</span>
                    </div>
                  </button>
                  <button onClick={() => setIsLocationDrawerOpen(false)} className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 border border-[var(--pm-border)] group transition-all">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-[10px] font-black text-white">Recent</span>
                      <span className="text-[8px] font-bold text-[var(--pm-text-muted)] uppercase">{city}</span>
                    </div>
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-widest">Popular Cities</label>
                  <div className="grid grid-cols-2 gap-3 max-h-[220px] overflow-y-auto no-scrollbar pb-4">
                    {filteredCities.map((cityOpt) => (
                      <button
                        key={cityOpt}
                        onClick={() => { setCity(cityOpt); setIsLocationDrawerOpen(false); }}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border transition-all",
                          city === cityOpt ? "bg-[var(--pm-accent)]/10 border-[var(--pm-accent)] text-[var(--pm-accent)]" : "bg-white/[0.02] border-[var(--pm-border)] text-zinc-400 hover:text-white"
                        )}
                      >
                        <span className="text-[10px] font-black uppercase">{cityOpt}</span>
                        {city === cityOpt && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
