import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  X, ShoppingBag, Factory, MapPin, 
  Rss, Wrench, Laptop, Wallet, 
  Truck, Package, FileText, Star,
  Grid
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortalsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PORTALS = [
  { id: 'retail', nameEn: 'PK Shop', nameBn: 'পিকে শপ', domain: 'RETAIL', icon: ShoppingBag, route: '/portals/retail', color: 'from-orange-400 to-orange-600', descriptionEn: 'B2C Retail E-commerce', descriptionBn: 'খুচরা কেনাকাটা' },
  { id: 'wholesale', nameEn: 'Market', nameBn: 'মহাজন হাট', domain: 'WHOLESALE', icon: Factory, route: '/portals/wholesale', color: 'from-indigo-400 to-indigo-600', descriptionEn: 'B2B Bulk Wholesale', descriptionBn: 'পাইকারি বাজার' },
  { id: 'nearby', nameEn: 'Nearby', nameBn: 'নিয়ারবাই', domain: 'NEARBY', icon: MapPin, route: '/portals/nearby', color: 'from-emerald-400 to-emerald-600', descriptionEn: 'Hyperlocal Stores', descriptionBn: 'নিকটবর্তী দোকান' },
  { id: 'feed', nameEn: 'Feed', nameBn: 'ফিড', domain: 'FEED', icon: Rss, route: '/feed', color: 'from-pink-400 to-pink-600', descriptionEn: 'Social & Commerce', descriptionBn: 'সামাজিক যোগাযোগ' },
  { id: 'services', nameEn: 'Services', nameBn: 'সার্ভিস', domain: 'SERVICE', icon: Wrench, route: '/portals/services', color: 'from-purple-400 to-purple-600', descriptionEn: 'Local Technicians', descriptionBn: 'সেবা ও মেরামত' },
  { id: 'digital', nameEn: 'Digital', nameBn: 'ডিজিটাল', domain: 'DIGITAL', icon: Laptop, route: '/portals/digital', color: 'from-violet-400 to-violet-600', descriptionEn: 'OTT & Subscriptions', descriptionBn: 'ডিজিটাল সামগ্রী' },
  { id: 'wallet', nameEn: 'Wallet', nameBn: 'ওয়ালেট', domain: 'WALLET', icon: Wallet, route: '/wallet', color: 'from-amber-400 to-amber-600', descriptionEn: 'Balance & Escrow', descriptionBn: 'টাকা ও লেনদেন' },
  { id: 'logistics', nameEn: 'Logistics', nameBn: 'লজিস্টিকস', domain: 'LOGISTICS', icon: Truck, route: '/portals/logistics', color: 'from-blue-400 to-blue-600', descriptionEn: 'Parcel & Delivery', descriptionBn: 'পার্সেল সার্ভিস' },
  { id: 'orders', nameEn: 'Orders', nameBn: 'অর্ডার', domain: 'ORDERS', icon: Package, route: '/user/orders', color: 'from-rose-400 to-rose-600', descriptionEn: 'Unified Tracking', descriptionBn: 'অর্ডার ট্র্যাকিং' },
  { id: 'rfq', nameEn: 'RFQ', nameBn: 'আরএফকিউ', domain: 'RFQ', icon: FileText, route: '/portals/rfq', color: 'from-cyan-400 to-cyan-600', descriptionEn: 'Custom Requests', descriptionBn: 'সরাসরি রিকোয়েস্ট' },
];

export const PortalsModal: React.FC<PortalsModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handlePortalClick = (route: string) => {
    navigate(route);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#0c101c] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                  <Grid className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter">Super Hubs</h3>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Select a portal to continue</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 sm:grid-cols-5 gap-4">
              {PORTALS.map((portal) => {
                const Icon = portal.icon;
                return (
                  <motion.button
                    key={portal.id}
                    whileHover={{ y: -5, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePortalClick(portal.route)}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-[22px] bg-gradient-to-br flex items-center justify-center shadow-xl border border-white/10 transition-all relative overflow-hidden",
                      portal.color
                    )}>
                      <Icon className="w-7 h-7 text-white relative z-10" strokeWidth={2.5} />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-center">
                      <span className="block text-[11px] font-black text-white uppercase tracking-tight">{portal.nameEn}</span>
                      <span className="block text-[10px] font-bold text-zinc-500 group-hover:text-orange-400 transition-colors">{portal.nameBn}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="p-6 bg-white/[0.02] border-t border-white/5">
              <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-orange-500 uppercase tracking-widest">PaikarMart Ecosystem</h5>
                  <p className="text-[9px] text-zinc-500 mt-1 leading-relaxed font-bold">
                    Switch between portals seamlessly. Your cart and wallet are unified across all hubs.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
