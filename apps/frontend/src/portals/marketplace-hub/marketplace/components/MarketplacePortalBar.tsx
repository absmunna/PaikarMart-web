import React from 'react';
import { 
  BarChart2, ShoppingBag, Truck, MapPin, 
  Settings, Star, Plane, Briefcase, Tag, Layout 
} from 'lucide-react';
import { motion } from 'motion/react';

export type MarketplacePortalType = 'all' | 'retail' | 'b2b' | 'nearby' | 'services' | 'pk-shop' | 'transport' | 'travel' | 'demand' | 'brands';

interface CategoryNavBarProps {
  selected: MarketplacePortalType;
  onChange: (portal: MarketplacePortalType) => void;
}

const portals: { id: MarketplacePortalType; label: string; icon: any; color: string }[] = [
  { id: 'all', label: 'All', icon: Layout, color: 'from-zinc-400 to-zinc-600' },
  { id: 'retail', label: 'Retail', icon: ShoppingBag, color: 'from-cyan-400 to-blue-500' },
  { id: 'b2b', label: 'B2B', icon: BarChart2, color: 'from-indigo-400 to-purple-600' },
  { id: 'nearby', label: 'Nearby', icon: MapPin, color: 'from-cyan-400 to-teal-600' },
  { id: 'services', label: 'Services', icon: Settings, color: 'from-orange-400 to-red-600' },
  { id: 'pk-shop', label: 'PK Shop', icon: Star, color: 'from-yellow-400 to-orange-500' },
  { id: 'transport', label: 'Transport', icon: Truck, color: 'from-blue-400 to-indigo-600' },
  { id: 'travel', label: 'Travel', icon: Plane, color: 'from-sky-400 to-cyan-600' },
  { id: 'demand', label: 'Demand', icon: Briefcase, color: 'from-rose-400 to-pink-600' },
  { id: 'brands', label: 'Brands', icon: Tag, color: 'from-violet-400 to-fuchsia-600' },
];

export const MarketplacePortalBar = ({ selected, onChange }: CategoryNavBarProps) => {
  return (
    <div className="w-full overflow-hidden border-b border-[var(--pm-border)] bg-[var(--pm-bg)]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 px-4 py-3 overflow-x-auto no-scrollbar scroll-smooth">
        {portals.map((portal) => {
          const Icon = portal.icon;
          const isActive = selected === portal.id;
          
          return (
            <button
              key={portal.id}
              onClick={() => onChange(portal.id)}
              className="group flex flex-col items-center gap-1.5 min-w-[64px] md:min-w-[72px] cursor-pointer"
            >
              <div className={`
                w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? `bg-gradient-to-br ${portal.color} shadow-lg shadow-white/5 scale-110` 
                  : 'bg-[var(--pm-surface)]/50 border border-[var(--pm-border)] group-hover:border-white/20'
                }
              `}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`} />
              </div>
              <span className={`
                text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors
                ${isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'}
              `}>
                {portal.label}
              </span>
              
              {isActive && (
                <motion.div 
                  layoutId="portal-active"
                  className="w-6 md:w-8 h-1 bg-cyan-400 rounded-full mt-0.5 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
