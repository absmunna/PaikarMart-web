import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, Search, Check, X, 
  Loader2, ArrowRight, Compass, Building2
} from 'lucide-react';
import { useLocationStore } from '../store/locationStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { BANGLADESH_DIVISIONS, POPULAR_COMMERCIAL_HUBS } from '@/shared/constants/bangladeshLocations';
import { toast } from 'sonner';

export const GlobalLocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    formattedAddress, 
    city, 
    area,
    isAutoDetected, 
    setDetailedLocation
  } = useLocationStore();

  const { detectLocation, isLoading } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const activeLocationText = area || formattedAddress || city || 'ঢাকা';

  // Filtered hubs/areas based on search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return POPULAR_COMMERCIAL_HUBS.slice(0, 10);
    }
    const q = searchQuery.toLowerCase().trim();
    return POPULAR_COMMERCIAL_HUBS.filter(
      hub => hub.nameBn.toLowerCase().includes(q) || 
             hub.areaBn.toLowerCase().includes(q) || 
             hub.districtBn.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // One-tap Auto GPS Detection
  const handleAutoDetect = async () => {
    const success = await detectLocation();
    if (success) {
      toast.success('আপনার লাইভ জিপিএস লোকেশন সেট করা হয়েছে!');
      closeLocationModal();
    } else {
      toast.info('ডিফল্ট অবস্থান (ঢাকা) নির্বাচন করা হয়েছে');
    }
  };

  // Quick Division Select
  const handleSelectDivision = (div: typeof BANGLADESH_DIVISIONS[0]) => {
    const cityName = div.nameBn.replace(' বিভাগ', '');
    setDetailedLocation({
      city: cityName,
      district: cityName,
      division: div.id,
      area: div.nameBn,
      formattedAddress: div.nameBn,
      lat: div.lat,
      lng: div.lng,
      isAutoDetected: false
    });
    toast.success(`লোকেশন সেট করা হয়েছে: ${div.nameBn}`);
    closeLocationModal();
  };

  // Quick Hub / Area Select
  const handleSelectHub = (hub: typeof POPULAR_COMMERCIAL_HUBS[0]) => {
    setDetailedLocation({
      city: hub.districtBn,
      district: hub.districtBn,
      division: hub.divisionId,
      area: hub.areaBn,
      formattedAddress: `${hub.nameBn}, ${hub.districtBn}`,
      lat: hub.lat,
      lng: hub.lng,
      isAutoDetected: false
    });
    toast.success(`লোকেশন সেট করা হয়েছে: ${hub.nameBn}`);
    closeLocationModal();
  };

  // Submit Custom Address
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    setDetailedLocation({
      city: city || 'ঢাকা',
      area: customInput.trim(),
      formattedAddress: customInput.trim(),
      lat: 23.8103,
      lng: 90.4125,
      isAutoDetected: false
    });
    toast.success(`ঠিকানা সংরক্ষণ করা হয়েছে: ${customInput}`);
    setCustomInput('');
    closeLocationModal();
  };

  if (!isLocationModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeLocationModal}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-50 text-[var(--pm-text)]"
        >
          {/* Simple Header */}
          <div className="p-4 border-b border-[var(--pm-border)]/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--pm-accent)]/15 border border-[var(--pm-accent)]/30 flex items-center justify-center text-[var(--pm-accent)]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">ডেলিভারি লোকেশন সিলেক্ট করুন</h2>
                <p className="text-[11px] text-[var(--pm-text-muted)]">
                  বর্তমান: <strong className="text-white font-bold">{activeLocationText}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={closeLocationModal}
              className="p-2 rounded-xl text-[var(--pm-text-muted)] hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
            
            {/* 1. Primary Auto GPS Button */}
            <button
              onClick={handleAutoDetect}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[var(--pm-accent)] to-amber-500 hover:brightness-105 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[var(--pm-accent)]/20 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>জিপিএস দিয়ে সন্ধান করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4.5 h-4.5" />
                  <span>অটোমেটিক জিপিএস লোকেশন সেট করুন (Auto GPS)</span>
                </>
              )}
            </button>

            {/* 2. Quick Division Badges */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-black uppercase text-[var(--pm-text-muted)] tracking-wider">
                বিভাগ বা প্রধান শহর
              </p>
              <div className="flex flex-wrap gap-1.5">
                {BANGLADESH_DIVISIONS.map((div) => (
                  <button
                    key={div.id}
                    onClick={() => handleSelectDivision(div)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--pm-bg)] hover:bg-[var(--pm-accent)] hover:text-white border border-[var(--pm-border)] text-xs font-bold text-zinc-300 transition-all cursor-pointer active:scale-95"
                  >
                    {div.nameBn.replace(' বিভাগ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Realtime Search Input */}
            <div className="space-y-2 pt-1">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="এলাকা বা বাণিজ্যিক মোকাম অনুসন্ধান করুন (যেমন: মিরপুর, উত্তরা, ইসলামপুর)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                />
              </div>

              {/* Suggestions List */}
              <div className="space-y-1 max-h-40 overflow-y-auto no-scrollbar">
                {filteredLocations.map((hub) => (
                  <button
                    key={hub.id}
                    onClick={() => handleSelectHub(hub)}
                    className="w-full p-2.5 rounded-xl bg-[var(--pm-bg)]/60 hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/40 hover:border-[var(--pm-accent)]/30 flex items-center justify-between transition-all group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
                      <span className="text-xs font-bold text-white truncate group-hover:text-[var(--pm-accent)]">
                        {hub.nameBn}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium shrink-0 ml-2">
                      {hub.districtBn}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Simple Custom Address Input */}
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-[var(--pm-border)]/60 space-y-1.5">
              <p className="text-[11px] font-black uppercase text-[var(--pm-text-muted)] tracking-wider">
                বা কাস্টম ঠিকানা লিখুন
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="যেমন: রোড ১২, সেক্টর ৪, উত্তরা..."
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  className="flex-1 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                />
                <button
                  type="submit"
                  disabled={!customInput.trim()}
                  className="px-4 py-2 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] active:scale-95 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer shrink-0"
                >
                  সেট
                </button>
              </div>
            </form>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalLocationModal;
