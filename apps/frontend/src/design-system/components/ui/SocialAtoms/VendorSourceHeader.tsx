import React from 'react';
import { Store, MapPin, Clock } from 'lucide-react';

interface Props {
  vendorName: string;
  location: string;
  timeAgo: string;
}

export const VendorSourceHeader: React.FC<Props> = ({ vendorName, location, timeAgo }) => {
  return (
    <div className="flex items-center gap-3 text-[10px] text-[var(--pm-text-secondary)] mb-2 group">
      <div className="h-6 w-6 rounded-full bg-[var(--pm-surface)] flex items-center justify-center border border-[var(--pm-border)]">
        <Store className="h-3 w-3 text-[var(--pm-accent)]" />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-[var(--pm-text)]">{vendorName}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{location}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5" />{timeAgo}</span>
        </div>
      </div>
    </div>
  );
};
