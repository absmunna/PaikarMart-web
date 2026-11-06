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

      {/* Grid of Portals */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-4">
        {ALL_HUBS_UI.map((portal) => {
          const Icon = ICON_COMPONENTS_MAP[portal.icon] || ShoppingBag;
          return (
            <motion.div
              key={portal.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(portal.path)}
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] bg-zinc-900 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 group-hover:bg-zinc-800 transition-all border border-white/10`}>
                <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--pm-accent)] group-hover:text-white transition-colors stroke-[2px]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-center text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors uppercase tracking-tight">
                {portal.labelBn}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HubPage;
