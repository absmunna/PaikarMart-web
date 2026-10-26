import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Wallet, Search, User, ChevronDown, Check, X } from 'lucide-react';
import { useWalletStore } from '@/modules/wallet';
import { useAuth } from '@/modules/auth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const LOCATIONS = [
  { id: 'dhaka', name: 'ঢাকা (Dhaka)', district: 'Dhaka Central' },
  { id: 'gazipur', name: 'গাজীপুর (Gazipur)', district: 'Dhaka Division' },
  { id: 'narayanganj', name: 'নারায়ণগঞ্জ (Narayanganj)', district: 'Dhaka Division' },
  { id: 'chattogram', name: 'চট্টগ্রাম (Chattogram)', district: 'Chattogram' },
  { id: 'sylhet', name: 'সিলেট (Sylhet)', district: 'Sylhet' },
  { id: 'rajshahi', name: 'রাজশাহী (Rajshahi)', district: 'Rajshahi' },
  { id: 'khulna', name: 'খুলনা (Khulna)', district: 'Khulna' },
  { id: 'bogura', name: 'বগুড়া (Bogura)', district: 'Rajshahi Division' },
];

export const HomeHeader: React.FC = () => {
  const navigate = useNavigate();
  const { balance } = useWalletStore();
  const { user, isAuthenticated } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(() => {
    try {
      return localStorage.getItem('pm_user_city') || 'Dhaka, Bangladesh';
    } catch {
      return 'Dhaka, Bangladesh';
    }
  });
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  // Close location menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (locName: string) => {
    setSelectedLocation(locName);
    try {
      localStorage.setItem('pm_user_city', locName);
    } catch {}
    setIsLocationOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/search');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  return (
    <div className="sticky top-0 z-40 bg-[var(--pm-bg)]/85 backdrop-blur-xl border-b border-white/[0.04] px-3.5 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 sm:gap-4 select-none">
      {/* Left: User & Location (Unboxed approach) */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-orange-500/20 to-rose-600/20 p-0.5 cursor-pointer outline-none"
          title={isAuthenticated ? (user?.fullName || 'প্রোফাইল') : 'লগইন করুন'}
        >
          <div className="w-full h-full rounded-2xl bg-[var(--pm-surface)] flex items-center justify-center overflow-hidden border border-white/10">
            {user?.avatar || user?.avatarUrl ? (
              <img
                src={user.avatar || user.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
            )}
          </div>
        </motion.button>

        {/* Location Dropdown Trigger */}
        <div ref={locationMenuRef} className="relative flex flex-col">
          <button
            type="button"
            onClick={() => setIsLocationOpen(!isLocationOpen)}
            className="flex flex-col text-left group cursor-pointer outline-none"
          >
            <div className="flex items-center gap-1 opacity-60">
              <span className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.15em]">ডেলিভারি লোকেশন</span>
              <ChevronDown className={`w-2.5 h-2.5 text-zinc-500 transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span className="text-xs sm:text-[13px] font-black text-white tracking-tight group-hover:text-orange-400 transition-colors truncate max-w-[130px] sm:max-w-[180px]">
                {selectedLocation}
              </span>
            </div>
          </button>

          {/* Location Selection Dropdown */}
          <AnimatePresence>
            {isLocationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-56 sm:w-64 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-2xl p-2 z-50 overflow-hidden"
              >
                <div className="px-2.5 py-1.5 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">ডেলিভারি এলাকা নির্বাচন</span>
                  <button
                    onClick={() => setIsLocationOpen(false)}
                    className="p-1 text-zinc-500 hover:text-white rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5">
                  {LOCATIONS.map((loc) => {
                    const isSelected = selectedLocation.includes(loc.name.split(' ')[0]);
                    return (
                      <button
                        key={loc.id}
                        type="button"
                        onClick={() => handleSelectLocation(`${loc.name.split(' ')[0]}, বাংলাদেশ`)}
                        className={`w-full text-left px-2.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-orange-500/15 text-orange-400'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-bold">{loc.name}</p>
                          <p className="text-[10px] text-zinc-500">{loc.district}</p>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-orange-400" />}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Center: Search Trigger (Desktop unboxed search bar) */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex-1 max-w-sm hidden lg:flex items-center bg-white/[0.03] border border-white/[0.06] rounded-2xl px-3.5 h-10 focus-within:border-orange-500/50 focus-within:bg-white/[0.05] transition-all"
      >
        <button type="submit" className="text-zinc-500 hover:text-orange-400 mr-2 transition-colors cursor-pointer">
          <Search className="w-3.5 h-3.5" />
        </button>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="পণ্য, পাইকারি প্রস্তুতকারক বা শপ খুঁজুন..."
          className="bg-transparent border-none outline-none text-xs font-semibold text-white w-full placeholder:text-zinc-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-zinc-500 hover:text-white rounded"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </form>

      {/* Right: Wallet & Notifications (Zero-pill glass approach) */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wallet')}
          className="flex flex-col items-end cursor-pointer group"
          title="ওয়ালেটে যান"
        >
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-zinc-400 uppercase tracking-widest opacity-80">ওয়ালেট ব্যালেন্স</span>
              <span className="text-xs sm:text-[13px] font-black text-white tabular-nums group-hover:text-orange-400 transition-colors">
                ৳{balance ? balance.toLocaleString('bn-BD') : '০'}
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/20 transition-all">
              <Wallet className="w-4 h-4 text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
