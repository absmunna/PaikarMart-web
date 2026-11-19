import React from 'react';
import { Radio } from 'lucide-react';
import { CommerceItem } from '@/types';

interface DriverMatchingOverlayProps {
  isSearching: boolean;
  selectedRide: CommerceItem | null;
  onCancel: () => void;
}

export const DriverMatchingOverlay: React.FC<DriverMatchingOverlayProps> = ({
  isSearching,
  selectedRide,
  onCancel
}) => {
  if (!isSearching) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="text-center space-y-6">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-[var(--pm-accent-border)]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[var(--pm-accent)] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Radio className="w-10 h-10 text-[var(--pm-accent)] animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Matching Nearest {selectedRide?.subCategory?.toUpperCase()}</h2>
          <p className="text-white/80">Searching for highest-rated professionals in your area...</p>
        </div>
        <button 
          onClick={onCancel}
          className="px-8 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all cursor-pointer"
        >
          Cancel Request
        </button>
      </div>
    </div>
  );
};
