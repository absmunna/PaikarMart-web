import React from 'react';
import { 
  ShoppingBag, Sparkles, Factory, Award, MapPin, 
  Activity, Store, Wrench, Laptop, Layers
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const SUB_PORTALS = [
  { id: 'all', nameBn: 'সব প্রোডাক্ট', nameEn: 'All Feed', icon: Layers, path: '/marketplace', gradient: 'from-amber-500 via-orange-600 to-rose-600' },
  { id: 'wholesale', nameBn: 'পাইকারি আড়ত', nameEn: 'Wholesale B2B', icon: Factory, path: '/wholesale', gradient: 'from-indigo-600 to-blue-700' },
  { id: 'retail', nameBn: 'খুচরা মার্কেট', nameEn: 'Retail Store', icon: ShoppingBag, path: '/b2c', gradient: 'from-blue-600 to-cyan-700' },
  { id: 'pk-shop', nameBn: 'পিকে স্টোর', nameEn: 'PK Store', icon: Sparkles, path: '/pk-shop', gradient: 'from-amber-400 to-orange-500' },
  { id: 'brands', nameBn: 'ব্র্যান্ড শোরুম', nameEn: 'Official Brands', icon: Award, path: '/brands', gradient: 'from-fuchsia-600 to-pink-700' },
  { id: 'nearby', nameBn: 'লোকাল শপ', nameEn: 'Local Nearby', icon: MapPin, path: '/nearby', gradient: 'from-emerald-500 to-teal-600' },
  { id: 'pharmacy', nameBn: 'অনলাইন ফার্মেসি', nameEn: 'Pharmacy', icon: Activity, path: '/pharmacy', gradient: 'from-teal-600 to-emerald-700' },
  { id: 'grocery', nameBn: 'গ্রোসারি বাজার', nameEn: 'Grocery Farm', icon: Store, path: '/grocery', gradient: 'from-amber-600 to-orange-600' },
  { id: 'services', nameBn: 'ডিজিটাল সার্ভিস', nameEn: 'Digital Services', icon: Wrench, path: '/services', gradient: 'from-purple-600 to-indigo-700' },
  { id: 'digital', nameBn: 'ডিজিটাল প্রোডাক্ট', nameEn: 'Digital Goods', icon: Laptop, path: '/digital', gradient: 'from-violet-600 to-purple-700' }
];

export const SubPortalNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePortalClick = (portal: typeof SUB_PORTALS[0]) => {
    navigate(portal.path);
    toast.success(`"${portal.nameBn}" পোর্টালে স্বাগত!`);
  };

  return (
    <div className="sticky top-[64px] z-40 bg-[var(--pm-bg)]/80 backdrop-blur-md border-b border-[var(--pm-border)]">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-3 px-4">
        {SUB_PORTALS.map((portal) => {
          // Check if path matches exactly or is a subroute
          const isSelected = location.pathname === portal.path || 
                             (portal.path !== '/marketplace' && location.pathname.startsWith(portal.path));
          
          const Icon = portal.icon;
          return (
            <button
              key={portal.id}
              onClick={() => handlePortalClick(portal)}
              className={`flex flex-col items-center gap-1.5 p-1 rounded-2xl shrink-0 transition-all active:scale-95 outline-none cursor-pointer group`}
            >
              <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center transition-all duration-300 relative overflow-hidden ${
                isSelected 
                  ? 'bg-gradient-to-br ' + portal.gradient + ' shadow-lg shadow-orange-500/20' 
                  : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] group-hover:border-white/20'
              }`}>
                {/* Glow effect for selected */}
                {isSelected && (
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${
                  isSelected ? 'text-white scale-110' : 'text-zinc-400 group-hover:text-zinc-200 group-hover:scale-105'
                }`} />
              </div>
              <span className={`text-[9px] font-black tracking-tight transition-colors duration-300 ${
                isSelected ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
              }`}>
                {portal.nameBn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
