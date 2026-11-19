import React from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeHandle } from '@paikarmart/shared';
import {
  Scissors,
  Hotel,
  Settings,
  Zap,
  Droplets,
  ShoppingBag,
  Heart,
  Wrench,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  MessageCircle
} from 'lucide-react';
import { CommerceItem } from '@/types';
import type { ComputedHyperlocalMeta } from '@/features/logistics';

interface ServiceCardProps {
  service: CommerceItem;
  onClick: (service: CommerceItem) => void;
  hyperlocalMeta?: ComputedHyperlocalMeta;
}

export const getServiceIcon = (subCat?: string) => {
  switch (subCat) {
    case 'salon':
      return <Scissors className="w-4 h-4" />;
    case 'hotel':
      return <Hotel className="w-4 h-4" />;
    case 'repair':
      return <Settings className="w-4 h-4" />;
    case 'electrician':
      return <Zap className="w-4 h-4" />;
    case 'plumber':
      return <Droplets className="w-4 h-4" />;
    case 'grocery':
      return <ShoppingBag className="w-4 h-4" />;
    case 'pharmacy':
      return <Heart className="w-4 h-4" />;
    default:
      return <Wrench className="w-4 h-4" />;
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onClick, hyperlocalMeta }) => {
  const navigate = useNavigate();
  const isOpen = hyperlocalMeta?.isOpen ?? service.isOpen ?? true;
  const distanceLabel = hyperlocalMeta
    ? `${hyperlocalMeta.distanceKm.toFixed(1)} km`
    : service.proximityDistance || 'Nearby';
  const etaLabel = hyperlocalMeta
    ? `${hyperlocalMeta.totalEtaMin} min (Prep ${hyperlocalMeta.estimatedPrepMin}m + Transit ${hyperlocalMeta.estimatedTransitMin}m)`
    : service.deliveryEta || 'Same Day';

  return (
    <div
      onClick={() => onClick(service)}
      className="group bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer hover:border-[var(--pm-accent)] hover:shadow-xl transition-all duration-300 active:scale-[0.99]"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 shadow-sm bg-[var(--pm-surface)]">
        <img
          src={service.imageUrl}
          alt={service.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold">
          <span className="text-[var(--pm-success)] uppercase tracking-wider flex items-center gap-1">
            {getServiceIcon(service.subCategory)}
            <span>{service.subCategory || 'Pro Service'}</span>
          </span>
          <span aria-hidden="true" className="text-[var(--pm-muted)]">·</span>
          <span className="text-[var(--pm-text)] flex items-center gap-1 tabular-nums">
            <MapPin className="w-3 h-3 text-[var(--pm-danger)]" />
            <span>{distanceLabel}</span>
          </span>
          <span aria-hidden="true" className="text-[var(--pm-muted)]">·</span>
          <span className={isOpen ? 'text-[var(--pm-success)]' : 'text-[var(--pm-danger)]'}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
          {service.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[var(--pm-muted)] font-medium">
          <span className="flex items-center gap-1 font-bold text-[var(--pm-text)]">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>{service.rating}</span>
          </span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/u/${normalizeHandle(service.storeHandle || service.storeName)}`);
            }}
            className="flex items-center gap-1 text-[var(--pm-accent)] hover:underline font-bold cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{service.storeName}</span>
          </button>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1 text-[var(--pm-muted)]">
            <Clock className="w-3 h-3 text-[var(--pm-success)]" />
            <span>{etaLabel}</span>
          </span>
        </div>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[var(--pm-border)]">
        <div className="sm:text-right">
          <div className="text-lg sm:text-xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            ৳{service.price.toLocaleString()}
          </div>
          <span className="text-[10px] text-[var(--pm-muted)] uppercase font-bold tracking-tight">Visit Fee · 5% off via Wallet</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            title="Message Storekeeper / Technician"
            onClick={(e) => {
              e.stopPropagation();
              navigate('/portal/messages');
            }}
            className="p-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] cursor-pointer transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-[11px] font-bold tracking-wide shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {getServiceIcon(service.subCategory)}
            <span>Book Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
