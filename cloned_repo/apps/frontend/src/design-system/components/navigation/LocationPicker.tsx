import React from 'react';
import { MapPin } from 'lucide-react';
import { useLocationStore } from '@/modules/location';

export const LocationPicker: React.FC = () => {
  const { 
    area,
    city,
    formattedAddress,
    isAutoDetected, 
    openLocationModal 
  } = useLocationStore();

  const displayLocation = area || city || formattedAddress || 'ঢাকা';

  return (
    <button
      onClick={openLocationModal}
      className="p-2 text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)] hover:bg-[var(--pm-surface-hover)] rounded-xl transition-all cursor-pointer relative active:scale-95 shrink-0"
      title={`বর্তমান লোকেশন: ${displayLocation} (লোকেশন সিলেক্ট করতে ট্যাপ করুন)`}
      aria-label="Select Delivery Location"
    >
      <div className="relative">
        <MapPin 
          className={`w-5 h-5 transition-colors ${
            isAutoDetected 
              ? 'text-emerald-400' 
              : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-accent)]'
          }`} 
        />
        {isAutoDetected && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
        )}
      </div>
    </button>
  );
};

export default LocationPicker;
