import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Compass, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const BANGLADESH_DIVISIONS = [
  { id: 'all', nameBn: 'সমগ্র বাংলাদেশ', nameEn: 'All Bangladesh' },
  { id: 'Dhaka', nameBn: 'ঢাকা বিভাগ', nameEn: 'Dhaka' },
  { id: 'Chattogram', nameBn: 'চট্টগ্রাম বিভাগ', nameEn: 'Chattogram' },
  { id: 'Sylhet', nameBn: 'সিলেট বিভাগ', nameEn: 'Sylhet' },
  { id: 'Khulna', nameBn: 'খুলনা বিভাগ', nameEn: 'Khulna' },
  { id: 'Rajshahi', nameBn: 'রাজশাহী বিভাগ', nameEn: 'Rajshahi' },
  { id: 'Barishal', nameBn: 'বরিশাল বিভাগ', nameEn: 'Barishal' },
  { id: 'Rangpur', nameBn: 'রংপুর বিভাগ', nameEn: 'Rangpur' },
  { id: 'Mymensingh', nameBn: 'ময়মনসিংহ বিভাগ', nameEn: 'Mymensingh' }
];

interface LocationSelectorBarProps {
  currentLocation: string;
  onSelectLocation: (loc: string) => void;
  nearbyCount?: number;
}

export const LocationSelectorBar: React.FC<LocationSelectorBarProps> = ({
  currentLocation,
  onSelectLocation,
  nearbyCount
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDivision = BANGLADESH_DIVISIONS.find(
    d => d.id.toLowerCase() === currentLocation.toLowerCase() || 
         d.nameBn.includes(currentLocation) ||
         d.nameEn.toLowerCase() === currentLocation.toLowerCase()
  ) || BANGLADESH_DIVISIONS[0];

  return (
    <div className="relative z-20">
      <div className="flex items-center justify-between gap-3 bg-[var(--pm-surface)]/80 backdrop-blur-md border border-[var(--pm-border)] p-2.5 sm:p-3 rounded-2xl shadow-sm">
        {/* Left location indicator */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-[var(--pm-accent)] shrink-0">
            <MapPin className="w-4 h-4 animate-bounce" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-text-muted)]">
                স্মার্ট রিকমেন্ডেশন লোকেশন
              </span>
              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                কাছাকাছি সেলার
              </span>
            </div>
            <p className="text-xs font-black text-white truncate">
              {selectedDivision.nameBn} ({selectedDivision.nameEn})
            </p>
          </div>
        </div>

        {/* Change location button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 active:scale-95 text-zinc-200 text-xs font-bold rounded-xl border border-white/10 transition-all shrink-0 cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>লোকেশন পরিবর্তন</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-30" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-2 z-40 shadow-2xl shadow-black overflow-hidden"
            >
              <div className="p-2 border-b border-[var(--pm-border)] mb-1">
                <p className="text-[11px] font-black text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[var(--pm-accent)]" />
                  লোকেশন ফিল্টারিং ও জিও-ফেন্সিং
                </p>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  আপনার নির্বাচিত অঞ্চলের সেলার ও আড়তের পোস্ট অগ্রাধিকার পাবে
                </p>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-0.5 pr-1">
                {BANGLADESH_DIVISIONS.map((div) => {
                  const isSelected = selectedDivision.id === div.id;
                  return (
                    <button
                      key={div.id}
                      onClick={() => {
                        onSelectLocation(div.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-[var(--pm-accent)] text-white shadow-xs' 
                          : 'text-zinc-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-zinc-500'}`} />
                        <span>{div.nameBn}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-zinc-500'}`}>
                          ({div.nameEn})
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
