import React from 'react';
import {
  Star, ShoppingBag, Building2, MapPin, Newspaper,
  Wrench, Monitor, Wallet, Car, Package,
  ChevronRight, Sparkles, FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface PortalHub {
  id: string;
  name: string;
  banglaTitle: string;
  href: string;
  gradient: string;
  icon: React.ElementType;
}

const ALL_PORTALS: PortalHub[] = [
  { id: 'retail', name: 'PK Shop', banglaTitle: 'পিকে শপ', href: '/portals/retail', gradient: 'from-orange-400 to-orange-600', icon: ShoppingBag },
  { id: 'wholesale', name: 'Market', banglaTitle: 'মহাজন হাট', href: '/portals/wholesale', gradient: 'from-indigo-400 to-indigo-600', icon: Building2 },
  { id: 'nearby', name: 'Nearby', banglaTitle: 'নিয়ারবাই', href: '/portals/nearby', gradient: 'from-emerald-400 to-emerald-600', icon: MapPin },
  { id: 'feed', name: 'Feed', banglaTitle: 'ফিড', href: '/feed', gradient: 'from-pink-400 to-pink-600', icon: Newspaper },
  { id: 'services', name: 'Services', banglaTitle: 'সার্ভিস', href: '/portals/services', gradient: 'from-purple-400 to-purple-600', icon: Wrench },
  { id: 'digital', name: 'Digital', banglaTitle: 'ডিজিটাল', href: '/portals/digital', gradient: 'from-violet-400 to-violet-600', icon: Monitor },
  { id: 'wallet', name: 'Wallet', banglaTitle: 'ওয়ালেট', href: '/wallet', gradient: 'from-amber-400 to-amber-600', icon: Wallet },
  { id: 'ride', name: 'Ride', banglaTitle: 'রাইড', href: '/portals/logistics', gradient: 'from-blue-400 to-blue-600', icon: Car },
  { id: 'orders', name: 'Orders', banglaTitle: 'অর্ডার', href: '/user/orders', gradient: 'from-rose-400 to-rose-600', icon: Package },
  { id: 'rfq', name: 'RFQ', banglaTitle: 'আরএফকিউ', href: '/portals/rfq', gradient: 'from-cyan-400 to-cyan-600', icon: FileText },
];

export const HubPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full text-[var(--pm-text)] p-4 sm:p-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            <span>সব পোর্টাল ও আড়ত হাব</span>
            <Sparkles className="w-4 h-4 text-[var(--pm-accent)]" />
          </h1>
          <p className="text-xs text-[var(--pm-muted)] mt-1 font-medium">পাইকারমার্ট সুপার অ্যাপের সকল ইকোসিস্টেম পোর্টাল</p>
        </div>
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-full bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] hover:border-[var(--pm-accent)]/30 active:scale-95 transition-all">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
      </div>

      {/* Grid of Portals */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-8 gap-x-4">
        {ALL_PORTALS.map((portal) => (
          <motion.div
            key={portal.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(portal.href)}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[22px] bg-gradient-to-br ${portal.gradient} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 group-hover:brightness-110 transition-all border border-white/10`}>
              <portal.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2px]" />
            </div>
            <span className="text-[11px] sm:text-xs font-black text-center text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors">
              {portal.banglaTitle}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HubPage;
