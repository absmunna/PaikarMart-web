import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Navigation, Search, Check, X, Building2, Store, 
  Home, Briefcase, Sparkles, Loader2, ArrowRight, Compass, ShieldCheck 
} from 'lucide-react';
import { useLocationStore, SavedAddress } from '../store/locationStore';
import { useGeolocation } from '../hooks/useGeolocation';
import { BANGLADESH_DIVISIONS, POPULAR_COMMERCIAL_HUBS, CommercialHub } from '@/shared/constants/bangladeshLocations';
import { toast } from 'sonner';

export const GlobalLocationModal: React.FC = () => {
  const { 
    isLocationModalOpen, 
    closeLocationModal, 
    formattedAddress, 
    city, 
    area,
    division, 
    isAutoDetected, 
    lat, 
    lng,
    setDetailedLocation,
    savedAddresses,
    selectSavedAddress
  } = useLocationStore();

  const { detectLocation, isLoading } = useGeolocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivisionTab, setSelectedDivisionTab] = useState<string>('all');
  const [customAddressInput, setCustomAddressInput] = useState('');

  // Filtered hubs based on search query and division tab
  const filteredHubs = useMemo(() => {
    return POPULAR_COMMERCIAL_HUBS.filter((hub) => {
      const matchDivision = selectedDivisionTab === 'all' || hub.divisionId === selectedDivisionTab;
      if (!matchDivision) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        hub.nameBn.toLowerCase().includes(q) ||
        hub.nameEn.toLowerCase().includes(q) ||
        hub.areaBn.toLowerCase().includes(q) ||
        hub.districtBn.toLowerCase().includes(q) ||
        hub.tag.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedDivisionTab]);

  // Handle GPS detection
  const handleAutoDetect = async () => {
    const success = await detectLocation();
    if (success) {
      toast.success('আপনার লাইভ জিপিএস লোকেশন সফলভাবে শনাক্ত ও সেট হয়েছে!');
      closeLocationModal();
    } else {
      toast.info('ডিফল্ট ঢাকা কেন্দ্রীয় এলাকা নির্বাচন করা হয়েছে');
    }
  };

  // Select commercial hub
  const handleSelectHub = (hub: CommercialHub) => {
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
    toast.success(`লোকেশন আপডেট হয়েছে: ${hub.nameBn}`);
    closeLocationModal();
  };

  // Select division
  const handleSelectDivision = (div: typeof BANGLADESH_DIVISIONS[0]) => {
    setDetailedLocation({
      city: div.nameBn.replace(' বিভাগ', ''),
      district: div.nameBn.replace(' বিভাগ', ''),
      division: div.id,
      area: div.nameBn,
      formattedAddress: div.nameBn,
      lat: div.lat,
      lng: div.lng,
      isAutoDetected: false
    });
    toast.success(`লোকেশন সেট হয়েছে: ${div.nameBn}`);
    closeLocationModal();
  };

  // Submit custom address
  const handleCustomAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customAddressInput.trim()) return;

    setDetailedLocation({
      city: city || 'ঢাকা',
      area: customAddressInput.trim(),
      formattedAddress: customAddressInput.trim(),
      lat: lat || 23.8103,
      lng: lng || 90.4125,
      isAutoDetected: false
    });
    toast.success(`কাস্টম ঠিকানা সংরক্ষিত হয়েছে: ${customAddressInput}`);
    setCustomAddressInput('');
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
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-50 text-[var(--pm-text)]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[var(--pm-border)]/60 flex items-center justify-between bg-[var(--pm-surface-hover)]/40 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-[var(--pm-accent)]/30 flex items-center justify-center text-[var(--pm-accent)] shadow-xs">
                <MapPin className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-black text-white flex items-center gap-2">
                  <span>ডেলিভারি ও হাইপারলোকাল লোকেশন</span>
                  <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    লাইভ
                  </span>
                </h2>
                <p className="text-[11px] text-[var(--pm-text-muted)] mt-0.5">
                  নিকটস্থ দোকান, দ্রুত ডেলিভারি ও আঞ্চলিক আড়ত পণ্যের সুবিধা উপভোগ করুন
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

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-5 space-y-4">
            
            {/* 1. Current Active Location Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[var(--pm-surface-hover)] via-[var(--pm-surface)] to-[var(--pm-surface-hover)] border border-[var(--pm-border)] flex items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--pm-text-muted)]">
                    বর্তমান সক্রিয় অবস্থান
                  </p>
                  <p className="text-sm font-black text-white truncate">
                    {formattedAddress || city || 'ঢাকা'}
                  </p>
                </div>
              </div>

              {isAutoDetected ? (
                <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                  <Navigation className="w-3 h-3 animate-spin" /> জিপিএস অন
                </span>
              ) : (
                <span className="text-[10px] font-bold text-zinc-400 bg-white/5 px-2 py-1 rounded-lg shrink-0 border border-white/5">
                  ম্যানুয়াল
                </span>
              )}
            </div>

            {/* 2. Primary Action: Auto GPS Detect Button */}
            <button
              onClick={handleAutoDetect}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:brightness-105 active:scale-98 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>লাইভ জিপিএস লোকেশন শনাক্ত করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>আমার বর্তমান অবস্থান লাইভ ডিটেক্ট করুন (Auto GPS)</span>
                </>
              )}
            </button>

            {/* 3. Saved Quick Addresses Row */}
            {savedAddresses && savedAddresses.length > 0 && (
              <div>
                <p className="text-[11px] font-black uppercase tracking-wider text-[var(--pm-text-muted)] mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                  সংরক্ষিত প্রিয় ঠিকানা সমূহ
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {savedAddresses.map((saved) => (
                    <button
                      key={saved.id}
                      onClick={() => selectSavedAddress(saved.id)}
                      className="p-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 text-left transition-all active:scale-95 group cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[var(--pm-accent)]">
                        {saved.type === 'home' && <Home className="w-3.5 h-3.5" />}
                        {saved.type === 'shop' && <Store className="w-3.5 h-3.5" />}
                        {saved.type === 'office' && <Briefcase className="w-3.5 h-3.5" />}
                        <span className="text-[10px] font-black text-white">{saved.labelBn}</span>
                      </div>
                      <p className="text-[10px] text-[var(--pm-text-muted)] truncate group-hover:text-zinc-300">
                        {saved.address}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Real-time Search Box */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-text-muted)]" />
              <input
                type="text"
                placeholder="থানা, বাণিজ্যিক এলাকা বা মোকাম খুঁজুন (যেমন: মিরপুর, ইসলামপুর, খাতুনগঞ্জ)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 5. Division Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => setSelectedDivisionTab('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedDivisionTab === 'all'
                    ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                    : 'bg-white/5 text-[var(--pm-text-muted)] hover:text-white border border-white/5'
                }`}
              >
                সকল অঞ্চল
              </button>
              {BANGLADESH_DIVISIONS.map((div) => (
                <button
                  key={div.id}
                  onClick={() => setSelectedDivisionTab(div.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                    selectedDivisionTab === div.id
                      ? 'bg-[var(--pm-accent)] text-white shadow-sm'
                      : 'bg-white/5 text-[var(--pm-text-muted)] hover:text-white border border-white/5'
                  }`}
                >
                  {div.nameBn}
                </button>
              ))}
            </div>

            {/* 6. Popular Commercial & Hyperlocal Hubs List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-black uppercase tracking-wider text-[var(--pm-text-muted)] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                  বাণিজ্যিক মোকাম ও হাইপারলোকাল জোন ({filteredHubs.length})
                </p>
              </div>

              <div className="max-h-52 overflow-y-auto no-scrollbar space-y-1.5 pr-0.5">
                {filteredHubs.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[var(--pm-text-muted)]">
                    কোনো অঞ্চল পাওয়া যায়নি। অন্য বানান বা বিভাগ ট্রাই করুন।
                  </div>
                ) : (
                  filteredHubs.map((hub) => (
                    <button
                      key={hub.id}
                      onClick={() => handleSelectHub(hub)}
                      className="w-full p-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]/60 hover:border-[var(--pm-accent)]/40 flex items-center justify-between transition-all group cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-[var(--pm-accent)] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white group-hover:text-[var(--pm-accent)] transition-colors truncate">
                            {hub.nameBn}
                          </p>
                          <p className="text-[10px] text-[var(--pm-text-muted)]">
                            {hub.areaBn}, {hub.districtBn} • <span className="text-amber-400/90 font-medium">{hub.tag}</span>
                          </p>
                        </div>
                      </div>

                      <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* 7. Manual Custom Address Entry Form */}
            <form onSubmit={handleCustomAddressSubmit} className="pt-2 border-t border-[var(--pm-border)]/50">
              <p className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-text-muted)] mb-1.5">
                নির্দিষ্ট বাড়ি বা রোড নম্বর লিখুন
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="যেমন: বাড়ি ১২, রোড ৫, সেক্টর ৩, উত্তরা..."
                  value={customAddressInput}
                  onChange={(e) => setCustomAddressInput(e.target.value)}
                  className="flex-1 bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] rounded-xl px-3 py-2 text-xs text-white placeholder-[var(--pm-text-muted)] focus:outline-none focus:border-[var(--pm-accent)] transition-all"
                />
                <button
                  type="submit"
                  disabled={!customAddressInput.trim()}
                  className="px-3.5 py-2 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] active:scale-95 text-white font-bold text-xs rounded-xl transition-all disabled:opacity-40 cursor-pointer shrink-0"
                >
                  সেট করুন
                </button>
              </div>
            </form>

          </div>

          {/* Footer note */}
          <div className="p-3 bg-[var(--pm-surface-hover)]/30 border-t border-[var(--pm-border)]/40 flex items-center justify-between text-[10px] text-[var(--pm-text-muted)] shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              লোকেশন অনুযায়ী ডেলিভারি চার্জ ও নিকটস্থ দোকান ফিল্টার হবে
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalLocationModal;
