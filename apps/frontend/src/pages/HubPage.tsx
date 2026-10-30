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

const ALL_PORTALS: PortalHub[] = [
  { id: 'video', name: 'Video Commerce', banglaTitle: 'ভিডিও পোর্টাল', href: '/video', gradient: 'from-rose-500 to-red-600', icon: PlayCircle },
  { id: 'pk-shop', name: 'PK Shop', banglaTitle: 'পিকে শপ', href: '/pk-shop', gradient: 'from-purple-500 to-indigo-600', icon: Star },
  { id: 'retail', name: 'Retail Market', banglaTitle: 'খুচরা মার্কেট', href: '/shop', gradient: 'from-orange-400 to-orange-600', icon: ShoppingBag },
  { id: 'wholesale', name: 'Wholesale B2B', banglaTitle: 'পাইকারি আড়ত', href: '/wholesale', gradient: 'from-indigo-400 to-indigo-600', icon: Building2 },
  { id: 'nearby', name: 'Nearby Stores', banglaTitle: 'লোকাল শপ', href: '/nearby', gradient: 'from-emerald-400 to-emerald-600', icon: MapPin },
  { id: 'feed', name: 'Home', banglaTitle: 'হোম (ফিড)', href: '/', gradient: 'from-pink-400 to-pink-600', icon: Newspaper },
  { id: 'services', name: 'Services Hub', banglaTitle: 'সার্ভিস হাব', href: '/services', gradient: 'from-purple-400 to-purple-600', icon: Wrench },
  { id: 'digital', name: 'Digital & OTT', banglaTitle: 'ডিজিটাল গুডস', href: '/digital', gradient: 'from-violet-400 to-violet-600', icon: Monitor },
  { id: 'wallet', name: 'Super Wallet', banglaTitle: 'সুপার ওয়ালেট', href: '/wallet', gradient: 'from-amber-400 to-amber-600', icon: Wallet },
  { id: 'ride', name: 'Logistics & Ride', banglaTitle: 'রাইড ও পার্সেল', href: '/ride', gradient: 'from-blue-400 to-blue-600', icon: Car },
  { id: 'orders', name: 'Track Orders', banglaTitle: 'অর্ডার ট্র্যাকিং', href: '/orders', gradient: 'from-rose-400 to-rose-600', icon: Package },
];

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
