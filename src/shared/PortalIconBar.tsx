import React from 'react';
import { ShoppingBag, Briefcase, Navigation, MapPin, Sparkles, Store, Film, Tag, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PortalIconBar: React.FC<{ context?: string }> = () => {
  const portals = [
    { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace', path: '/marketplace', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 'wholesale', icon: Briefcase, label: 'Wholesale B2B', path: '/wholesale', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { id: 'video', icon: Film, label: 'Video & Live', path: '/video', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
    { id: 'demand', icon: Tag, label: 'Demand Hub', path: '/demand', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'services', icon: Navigation, label: 'Services', path: '/services', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 'logistics', icon: Truck, label: 'Logistics', path: '/logistic', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { id: 'nearby', icon: MapPin, label: 'Local Shops', path: '/local', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'seller-register', icon: Store, label: 'Become a Seller', path: '/register/seller', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto py-3 px-1 no-scrollbar border-y border-white/5 bg-white/[0.01]">
      {portals.map((p) => {
        const Icon = p.icon;
        return (
          <Link key={p.id} to={p.path} className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex-shrink-0 group">
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${p.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-zinc-200 group-hover:text-white whitespace-nowrap">{p.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
