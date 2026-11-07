import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLocationStore } from '@/modules/location';

export const LocationPicker: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { 
    area,
    city,
    formattedAddress,
    isAutoDetected, 
    openLocationModal 
  } = useLocationStore();

  const displayLocation = area || city || formattedAddress?.split(',')[0] || 'ঢাকা';

  return (
    <button
      onClick={openLocationModal}
      className="flex items-center gap-1.5 p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer relative active:scale-95 shrink-0 group"
      title={`বর্তমান লোকেশন: ${displayLocation} (লোকেশন সিলেক্ট করতে ট্যাপ করুন)`}
      aria-label="Select Delivery Location"
    >
      <div className="relative shrink-0">
        <MapPin 
          className={`w-5 h-5 transition-colors ${
            isAutoDetected 
              ? 'text-emerald-400' 
              : 'text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)]'
          }`} 
        />
        {isAutoDetected && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        )}
      </div>
      
      {!compact && (
        <div className="hidden xs:flex flex-col items-start leading-none pr-1">
          <span className="text-[7px] font-black text-[var(--pm-text-secondary)] uppercase tracking-wider mb-0.5">লোকেশন</span>
          <div className="flex items-center gap-0.5">
            <span className="text-[11px] sm:text-xs font-black text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors truncate max-w-[80px] sm:max-w-[120px]">
              {displayLocation}
            </span>
            <ChevronDown className="w-2.5 h-2.5 opacity-50 group-hover:text-[var(--pm-accent)]" />
          </div>
        </div>
      )}
    </button>
  );
};

export default LocationPicker;

