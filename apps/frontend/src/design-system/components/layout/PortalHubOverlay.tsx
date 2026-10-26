import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag,
  Factory,
  Sparkles,
  Award,
  MapPin,
  Activity,
  Store,
  Wrench,
  Laptop,
  Briefcase,
  X
} from 'lucide-react';
import { useNavUIStore } from '@/app/AppShell/useNavUIStore';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'marketplace', icon: ShoppingBag, label: 'All Products', path: '/marketplace', color: 'bg-orange-500' },
  { id: 'wholesale', icon: Factory, label: 'Wholesale', path: '/wholesale', color: 'bg-indigo-500' },
  { id: 'pk-store', icon: Sparkles, label: 'PK Store', path: '/pk-shop', color: 'bg-amber-500' },
  { id: 'brands', icon: Award, label: 'Brands', path: '/brands', color: 'bg-pink-500' },
  { id: 'nearby', icon: MapPin, label: 'Nearby Shops', path: '/nearby', color: 'bg-emerald-500' },
  { id: 'pharmacy', icon: Activity, label: 'Pharmacy', path: '/pharmacy', color: 'bg-teal-500' },
  { id: 'grocery', icon: Store, label: 'Grocery', path: '/grocery', color: 'bg-orange-600' },
  { id: 'services', icon: Wrench, label: 'Services', path: '/services', color: 'bg-purple-500' },
  { id: 'digital', icon: Laptop, label: 'Digital', path: '/digital', color: 'bg-blue-500' },
  { id: 'become-seller', icon: Briefcase, label: 'Sell Now', path: '/become-seller', color: 'bg-zinc-600' },
];

export const PortalHubOverlay: React.FC = () => {
  const { isAppLauncherOpen, closeAppLauncher } = useNavUIStore();

  return (
    <AnimatePresence>
      {isAppLauncherOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAppLauncher}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[70] max-h-[85vh] bg-[var(--pm-surface)] border-t border-[var(--pm-border)] rounded-t-[32px] p-6 pb-12 overflow-y-auto shadow-2xl"
          >
            <div className="max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex flex-col">
                  <h2 className="text-xl font-black text-white tracking-tight">Portal Hub</h2>
                  <p className="text-xs text-[var(--pm-muted)] uppercase tracking-widest font-bold">10-Module Super Hub</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/5 text-[var(--pm-muted)] hover:text-white"
                  onClick={closeAppLauncher}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {modules.map((m, idx) => (
                  <Link
                    key={m.id}
                    to={m.path}
                    onClick={closeAppLauncher}
                    className="group flex flex-col items-center gap-3 transition-transform active:scale-95"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-all group-hover:rotate-3 group-active:rotate-0",
                        m.color,
                        "relative overflow-hidden"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
                      <m.icon className="h-7 w-7 text-white relative z-10" />
                    </motion.div>
                    <span className="text-[10px] font-black uppercase tracking-tight text-[var(--pm-muted)] group-hover:text-white text-center line-clamp-1">
                      {m.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
