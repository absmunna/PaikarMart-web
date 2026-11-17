import React from 'react';
import { Bike, Truck, Package, Zap, Car } from 'lucide-react';
import { CommerceItem } from '@/types';

interface RideOptionCardProps {
  ride: CommerceItem;
  onClick: (ride: CommerceItem) => void;
}

export const getRideIcon = (subCat?: string) => {
  switch (subCat) {
    case 'bike':
      return <Bike className="w-4 h-4" />;
    case 'pickup':
    case 'truck':
      return <Truck className="w-4 h-4" />;
    case 'parcel':
    case 'sameday':
      return <Package className="w-4 h-4" />;
    case 'quick':
      return <Zap className="w-4 h-4" />;
    default:
      return <Car className="w-4 h-4" />;
  }
};

export const RideOptionCard: React.FC<RideOptionCardProps> = ({ ride, onClick }) => {
  return (
    <div
      onClick={() => onClick(ride)}
      className="group bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2rem] p-4 sm:p-5 flex items-center gap-4 sm:gap-5 cursor-pointer hover:border-[var(--pm-accent)] hover:shadow-lg transition-all duration-200 active-scale"
    >
      <div className="relative w-20 h-16 sm:w-28 sm:h-20 rounded-[1.25rem] bg-[var(--pm-surface)] flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
        <img
          src={ride.imageUrl}
          alt={ride.title}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs text-[var(--pm-accent)] font-bold mb-1">
          {getRideIcon(ride.subCategory)}
          <span>{ride.subCategory || 'Courier'}</span>
          <span aria-hidden="true" className="text-[var(--pm-muted)]">
            ·
          </span>
          <span className="font-mono tabular-nums text-[var(--pm-muted)]">
            {ride.deliveryEta || '5 min away'}
          </span>
        </div>
        <h3 className="text-base font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
          {ride.title}
        </h3>
        <p className="text-xs text-[var(--pm-muted)] truncate leading-relaxed">
          {ride.description}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <div className="text-right">
          <div className="text-lg font-mono tabular-nums font-black text-[var(--pm-text)]">
            ৳{Math.round(ride.price).toLocaleString()}
          </div>
          <span className="text-[11px] text-[var(--pm-muted)] font-medium">Est. Fare</span>
        </div>

        <button
          type="button"
          className="px-4 py-2 rounded-[2rem] bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 whitespace-nowrap active-scale cursor-pointer"
        >
          {getRideIcon(ride.subCategory)}
          <span>Book</span>
        </button>
      </div>
    </div>
  );
};
