import { 
  Star, ShoppingBag, Building2, MapPin, Newspaper, 
  Wrench, Monitor, Wallet, Car, Package,
  ChevronRight, Sparkles, FileText, ArrowLeft, PlayCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { safeBack } from '@/lib/navigation';

interface PortalHub {
  id: string;
  name: string;
  banglaTitle: string;
  href: string;
  gradient: string;
  icon: React.ElementType;
}

import { ALL_PORTALS, ICON_COMPONENTS_MAP } from '@/portals';

const ALL_HUBS_UI = ALL_PORTALS.slice(0, 15); // Show first 15 for compactness

export const HubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-[var(--pm-text)] p-4 sm:p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button 
          onClick={() => safeBack(navigate, '/')} 
          className="p-2.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]/30 active:scale-95 transition-all cursor-pointer shadow-xs"
          title="ফিরে যান"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>সব পোর্টাল ও আড়ত হাব</span>
            <Sparkles className="w-4 h-4 text-[var(--pm-accent)]" />
          </h1>
          <p className="text-xs text-[var(--pm-muted)] mt-0.5 font-medium">পাইকারমার্ট সুপার অ্যাপের সকল ইকোসিস্টেম পোর্টাল</p>
        </div>
      </div>

      {/* Featured Super Portals (Synced with Home Page) */}
      <div className="mb-10">
        <h2 className="text-[11px] font-black text-[var(--pm-muted)] uppercase tracking-[0.2em] mb-5 px-1">শীর্ষ সুপার পোর্টালসমূহ</h2>
        <div className="grid grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {ALL_PORTALS.filter(p => [
            'pk-shop', 'marketplace', 'wholesale-main', 'nearby', 
            'services', 'digital', 'video', 'demand', 
            'finance', 'logistics', 'reels'
          ].includes(p.id)).slice(0, 10).map((portal) => {
            const Icon = ICON_COMPONENTS_MAP[portal.icon] || ShoppingBag;
            
            // Map gradients based on ID for vibrancy
            const gradientMap: Record<string, string> = {
              'video': 'from-rose-500 to-red-600',
              'reels': 'from-rose-500 to-pink-600',
              'wholesale-main': 'from-blue-600 to-indigo-700',
              'marketplace': 'from-orange-500 to-amber-600',
              'nearby': 'from-emerald-500 to-teal-700',
              'services': 'from-purple-500 to-pink-600',
              'digital': 'from-cyan-500 to-blue-600',
              'pk-shop': 'from-yellow-500 to-amber-600',
              'demand': 'from-red-500 to-orange-600',
              'finance': 'from-violet-500 to-purple-700',
              'logistics': 'from-emerald-600 to-teal-800',
            };

            const gradient = gradientMap[portal.id] || 'from-zinc-800 to-zinc-900';

            return (
              <motion.div
                key={`featured-${portal.id}`}
                whileTap={{ scale: 0.92 }}
                onClick={() => navigate(portal.path)}
                className="flex flex-col items-center gap-2.5 cursor-pointer group"
              >
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg shadow-black/30 group-hover:scale-105 transition-all border border-white/10`}>
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2.2px]" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black text-center text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors leading-tight line-clamp-1">
                  {portal.labelBn}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Additional Portals & Sub-Portals (Filtered to avoid duplicates) */}
      <div className="mb-6 border-t border-[var(--pm-border)] pt-8">
        <h2 className="text-[11px] font-black text-[var(--pm-muted)] uppercase tracking-[0.2em] mb-6 px-1">অন্যান্য পোর্টাল ও সার্ভিসসমূহ</h2>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-y-10 gap-x-4">
          {ALL_PORTALS.filter(p => ![
            'pk-shop', 'marketplace', 'wholesale-main', 'nearby', 
            'services', 'digital', 'video', 'demand', 
            'finance', 'logistics', 'reels'
          ].includes(p.id)).map((portal) => {
            const Icon = ICON_COMPONENTS_MAP[portal.icon] || ShoppingBag;
            return (
              <motion.div
                key={portal.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(portal.path)}
                className="flex flex-col items-center gap-3 cursor-pointer group"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-zinc-900/50 flex items-center justify-center shadow-sm group-hover:scale-105 group-hover:bg-zinc-800 transition-all border border-white/5`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--pm-muted)] group-hover:text-[var(--pm-accent)] transition-colors stroke-[1.8px]" />
                </div>
                <span className="text-[9px] font-bold text-center text-[var(--pm-muted)] group-hover:text-[var(--pm-text)] transition-colors uppercase tracking-tight">
                  {portal.labelBn}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HubPage;
