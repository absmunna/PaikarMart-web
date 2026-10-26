import React, { useState } from 'react';
import { MapPin, ChevronDown, Check, Navigation, Loader2 } from 'lucide-react';
import { useLocationStore } from '../../modules/location/locationStore';
import { useGeolocation } from '../../modules/location/useGeolocation';
import { motion, AnimatePresence } from 'framer-motion';

const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Gazipur'];

export const LocationPicker = () => {
  const { city, setLocation, isAutoDetected } = useLocationStore();
  const [isOpen, setIsOpen] = useState(false);
  const { detectLocation, isLoading, error } = useGeolocation();

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--pm-bg)]/40 border border-[var(--pm-border)]/50 hover:border-[var(--pm-accent)]/50 transition-all group"
      >
        <MapPin className={`w-3.5 h-3.5 ${isAutoDetected ? 'text-green-500 animate-pulse' : 'text-[var(--pm-accent)]'}`} />
        <span className="text-[10px] font-bold text-[var(--pm-text)] truncate max-w-[80px]">{city}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--pm-text-muted)] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 w-52 glass border border-[var(--pm-border)]/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2 flex flex-col gap-1.5">
                {/* Auto Detect Button */}
                <button
                  onClick={async () => {
                    detectLocation();
                  }}
                  disabled={isLoading}
                  className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-bold bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 hover:bg-[var(--pm-accent)]/20 active:scale-98 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>{isLoading ? 'শনাক্ত করা হচ্ছে...' : 'লোকেশন অটো-ডিটেক্ট'}</span>
                </button>

                {error && (
                  <p className="text-[9px] text-red-500 px-2 font-medium">
                    এরর: {error}
                  </p>
                )}

                <div className="h-[1px] bg-[var(--pm-border)]/50 my-0.5" />

                <p className="text-[9px] uppercase tracking-wider text-[var(--pm-text-muted)] font-black px-2">
                  অন্যান্য শহর
                </p>

                <div className="max-h-48 overflow-y-auto space-y-1">
                  {cities.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setLocation(c);
                        setIsOpen(false);
                      }}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        city === c && !isAutoDetected
                        ? 'bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/20' 
                        : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] hover:bg-white/5'
                      }`}
                    >
                      {c}
                      {city === c && !isAutoDetected && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
