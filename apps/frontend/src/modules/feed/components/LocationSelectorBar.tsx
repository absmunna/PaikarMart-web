import React from 'react';
import { MapPin, Compass, Navigation } from 'lucide-react';
import { useLocationStore } from '@/modules/location';

interface LocationSelectorBarProps {
  currentLocation?: string;
  onSelectLocation?: (loc: string) => void;
  nearbyCount?: number;
}

export const LocationSelectorBar: React.FC<LocationSelectorBarProps> = ({
  nearbyCount
}) => {
  const { 
    formattedAddress, 
    city, 
    area,
    isAutoDetected, 
    openLocationModal 
  } = useLocationStore();

  const displayLocation = formattedAddress || area || city || 'ঢাকা';

  return (
    <div className="relative z-20">
      <div className="flex items-center justify-between gap-3 bg-[var(--pm-surface)]/90 backdrop-blur-md border border-[var(--pm-border)] p-2.5 sm:p-3 rounded-2xl shadow-sm">
        {/* Left location indicator */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-[var(--pm-accent)] shrink-0">
            <MapPin className={`w-4 h-4 ${isAutoDetected ? 'text-emerald-400 animate-pulse' : 'text-[var(--pm-accent)] animate-bounce'}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[var(--pm-text-muted)]">
                স্মার্ট রিকমেন্ডেশন লোকেশন
              </span>
              <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                {isAutoDetected ? 'লাইভ GPS' : 'কাছাকাছি সেলার'}
              </span>
            </div>
            <p className="text-xs font-black text-white truncate">
              {displayLocation}
            </p>
          </div>
        </div>

        {/* Change location button -> opens unified GlobalLocationModal */}
        <button
          onClick={openLocationModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--pm-surface-hover)] hover:bg-[var(--pm-accent)] hover:text-white active:scale-95 text-zinc-200 text-xs font-bold rounded-xl border border-[var(--pm-border)] transition-all shrink-0 cursor-pointer shadow-xs"
        >
          <Compass className="w-3.5 h-3.5 text-[var(--pm-accent)] group-hover:text-white" />
          <span>লোকেশন পরিবর্তন</span>
        </button>
      </div>
    </div>
  );
};

export default LocationSelectorBar;
