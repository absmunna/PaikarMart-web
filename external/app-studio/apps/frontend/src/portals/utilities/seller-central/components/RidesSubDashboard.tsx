import React from 'react';
import { Truck, Car, Navigation, ShieldCheck, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const RidesSubDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-5 rounded-3xl border border-[var(--pm-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black shadow-md shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'রাইড শেয়ার ও কুরিয়ার ট্রানজিট ড্রাইভার কনসোল' : 'Rideshare & Express Transit Console'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'যানবাহন পারমিট, রাইড ফেয়ার রেট ও ট্রানজিট ডিসপ্যাচ ড্যাশবোর্ড' : 'Manage registered vehicles, ride fares & live parcel transit dispatches'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] border border-[var(--pm-success)]/30 text-xs font-bold flex items-center gap-1 self-start sm:self-auto">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Driver Permit Active</span>
        </span>
      </div>

      {/* Vehicle Cards & Transit Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Registered Vehicle</span>
            <Car className="w-4 h-4 text-[var(--pm-accent)]" />
          </div>
          <p className="text-sm font-black text-[var(--pm-text)]">Toyota Prius Hybrid (Dhaka Metro-GA 44-1092)</p>
          <p className="text-[11px] text-[var(--pm-muted)] font-mono">Fare Base: $3.50 + $0.80/km</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Completed Trips</span>
            <Navigation className="w-4 h-4 text-[var(--pm-success)]" />
          </div>
          <p className="text-xl font-black text-[var(--pm-text)] font-mono">148 Trips</p>
          <p className="text-[11px] text-[var(--pm-success)] font-bold">99.4% On-time Arrival</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Transit Earnings</span>
            <DollarSign className="w-4 h-4 text-[var(--pm-warning)]" />
          </div>
          <p className="text-xl font-black text-[var(--pm-text)] font-mono">$842.50</p>
          <p className="text-[11px] text-[var(--pm-muted)]">Settled to Wallet</p>
        </div>

      </div>

    </div>
  );
};
