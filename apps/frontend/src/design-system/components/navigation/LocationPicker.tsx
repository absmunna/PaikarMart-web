import React from 'react';
import { MapPin, ChevronDown, Navigation } from 'lucide-react';
import { useLocationStore } from '@/modules/location';

export const LocationPicker: React.FC = () => {
  const { 
    formattedAddress, 
    city, 
    area,
    isAutoDetected, 
    openLocationModal 
  } = useLocationStore();

  const displayLocation = area || formattedAddress || city || 'ঢাকা';

  return (
    <button
      onClick={openLocationModal}
      className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[var(--pm-surface)]/90 hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)]/50 active:scale-95 transition-all group cursor-pointer shadow-xs select-none"
      title="ডেলিভারি ও নিকটস্থ দোকান লোকেশন পরিবর্তন করুন"
    >
      <div className="relative flex items-center justify-center">
        <MapPin 
          className={`w-3.5 h-3.5 transition-colors ${
            isAutoDetected 
              ? 'text-emerald-400 animate-pulse' 
              : 'text-[var(--pm-accent)] group-hover:scale-110'
          }`} 
        />
        {isAutoDetected && (
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
        )}
      </div>

      <span className="text-[11px] font-black text-[var(--pm-text)] truncate max-w-[70px] sm:max-w-[110px] md:max-w-[150px] tracking-tight">
        {displayLocation}
      </span>

      <ChevronDown className="w-3 h-3 text-[var(--pm-text-muted)] group-hover:text-white transition-colors" />
    </button>
  );
};

export default LocationPicker;
