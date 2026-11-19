import React, { useState } from 'react';
import { CommerceItem, ServiceBooking } from '@/types';
import { 
  Wrench, 
  Plus, 
  Clock, 
  Calendar, 
  MapPin, 
  User, 
  CheckCircle2,
  X,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ServicesSubDashboardProps {
  services: CommerceItem[];
  bookings?: ServiceBooking[];
}

export const ServicesSubDashboard: React.FC<ServicesSubDashboardProps> = ({
  services,
  bookings = []
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeTab, setActiveTab] = useState<'offerings' | 'appointments'>('offerings');

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-5 rounded-3xl border border-[var(--pm-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-success)] text-white flex items-center justify-center font-black shadow-md shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'টেকনিশিয়ান ও সার্ভিস এ্যাপয়েন্টমেন্ট সেন্টার' : 'Services & Appointments Hub'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'সার্ভিস ক্যাটাগরি, ঘণ্টার রেট এবং কাস্টমার এ্যাপয়েন্টমেন্ট শিডিউল পরিচালনা করুন' : 'Manage service rates, technician availability & scheduled customer bookings'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 p-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('offerings')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'offerings' ? 'bg-[var(--pm-card)] text-[var(--pm-success)] border border-[var(--pm-border)] shadow-xs font-black' : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            {isBn ? 'সার্ভিস ক্যাটালগ' : 'Service Listings'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appointments')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'appointments' ? 'bg-[var(--pm-card)] text-[var(--pm-success)] border border-[var(--pm-border)] shadow-xs font-black' : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            {isBn ? 'কাস্টমার বুকিং' : 'Bookings'} ({bookings.length})
          </button>
        </div>
      </div>

      {/* Main Tab View */}
      {activeTab === 'offerings' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-4 shadow-xs space-y-3 hover:border-[var(--pm-success)]/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2">
                <img
                  src={s.imageUrl}
                  alt={s.title}
                  className="w-12 h-12 rounded-xl object-cover border border-[var(--pm-border)]"
                />
                <span className="text-[10px] font-black uppercase text-[var(--pm-success)] bg-[var(--pm-success-soft)] px-2 py-0.5 rounded-md">
                  Active Service
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[var(--pm-text)]">{s.title}</h4>
                <p className="text-[11px] text-[var(--pm-muted)] line-clamp-2 mt-0.5">{s.description}</p>
              </div>

              <div className="pt-2 border-t border-[var(--pm-border)] flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-[var(--pm-muted)]">Hourly Rate:</span>
                <span className="text-[var(--pm-success)]">${s.price}/hr</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.length > 0 ? (
            bookings.map((b) => (
              <div
                key={b.id}
                className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[var(--pm-text)]">{b.serviceTitle}</span>
                    <span className="text-xs text-[var(--pm-muted)] font-mono">#{b.id}</span>
                  </div>
                  <p className="text-[11px] text-[var(--pm-muted)]">
                    Customer: <strong className="text-[var(--pm-text)]">{b.customerName}</strong> ({b.customerPhone})
                  </p>
                  <p className="text-[11px] text-[var(--pm-muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--pm-success)]" />
                    <span>{b.date} at {b.timeSlot}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[var(--pm-success)] font-mono">${b.totalEstimate.toFixed(2)}</span>
                  <a
                    href={`tel:${b.customerPhone}`}
                    className="px-3 py-1.5 rounded-xl bg-[var(--pm-success)] text-white text-xs font-bold flex items-center gap-1 hover:opacity-90 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call Customer</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-2xl p-12 text-center text-xs text-[var(--pm-muted)]">
              No service appointment bookings scheduled yet.
            </div>
          )}
        </div>
      )}

    </div>
  );
};
