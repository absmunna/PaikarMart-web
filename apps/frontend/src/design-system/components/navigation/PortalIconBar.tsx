import React from 'react';
import {
  ShoppingBag, Factory, Sparkles, Award, MapPin,
  Activity, Store, Wrench, Laptop, Briefcase
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const PortalIconBar: React.FC<{ context?: string }> = () => {
  const location = useLocation();
  const portals = [
    { id: 'marketplace', icon: ShoppingBag, label: 'সব প্রোডাক্ট', path: '/marketplace', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { id: 'wholesale', icon: Factory, label: 'পাইকারি', path: '/wholesale', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'pk-shop', icon: Sparkles, label: 'পিকে স্টোর', path: '/pk-shop', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'brands', icon: Award, label: 'ব্র্যান্ড', path: '/brands', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 'nearby', icon: MapPin, label: 'লোকাল শপ', path: '/nearby', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'pharmacy', icon: Activity, label: 'ফার্মেসি', path: '/pharmacy', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { id: 'grocery', icon: Store, label: 'গ্রোসারি', path: '/grocery', color: 'text-amber-500 bg-amber-600/10 border-amber-600/20' },
    { id: 'services', icon: Wrench, label: 'সার্ভিস', path: '/services', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'digital', icon: Laptop, label: 'ডিজিটাল', path: '/digital', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
    { id: 'seller', icon: Briefcase, label: 'সেলার হন', path: '/become-seller', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto py-5 px-4 no-scrollbar bg-[var(--pm-bg)] select-none">
      {portals.map((p) => {
        const Icon = p.icon;
        const isActive = location.pathname === p.path;
        return (
          <Link
            key={p.id}
            to={p.path}
            className={`flex flex-col items-center gap-2.5 flex-shrink-0 transition-all active:scale-95 group`}
          >
            <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg transition-all duration-300 ${
              isActive
                ? 'bg-[var(--pm-accent)] border-[var(--pm-accent)] shadow-md shadow-[var(--pm-accent)]/25'
                : 'bg-[var(--pm-surface)] border-[var(--pm-border)] group-hover:border-[var(--pm-border)]/80'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'text-white bg-transparent' : p.color} transition-colors duration-300`}>
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : ''}`} />
              </div>
            </div>
            <span className={`text-[11px] font-black uppercase tracking-tight transition-colors duration-300 whitespace-nowrap ${
              isActive ? 'text-[var(--pm-accent)] font-extrabold' : 'text-[var(--pm-muted)] group-hover:text-[var(--pm-text)]'
            }`}>
              {p.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};
