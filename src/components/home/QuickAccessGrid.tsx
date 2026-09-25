import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Building2, Store, Wrench, Monitor,
  MapPin, Star, Tag, Newspaper, Radio,
  Package, Wallet, User, Bell, Car, PlayCircle
} from 'lucide-react';

interface Tile {
  label: string;
  icon: React.ElementType;
  color: string;
  route: string;
  badge?: number;
}

const tiles: Tile[] = [
  { label: 'PK Shop', icon: Star, color: 'from-indigo-600 to-purple-700', route: '/pk-shop' },
  { label: 'Market', icon: ShoppingBag, color: 'from-orange-400 to-pink-500', route: '/b2c' },
  { label: 'পাইকার', icon: Building2, color: 'from-blue-400 to-indigo-600', route: '/wholesale' },
  { label: 'Nearby', icon: MapPin, color: 'from-rose-400 to-red-600', route: '/portal/nearby' },
  { label: 'Feed', icon: Newspaper, color: 'from-sky-400 to-blue-600', route: '/feed' },
  { label: 'Services', icon: Wrench, color: 'from-amber-400 to-orange-600', route: '/portal/services' },
  { label: 'Digital', icon: Monitor, color: 'from-violet-400 to-purple-600', route: '/portal/digital' },
  { label: 'Wallet', icon: Wallet, color: 'from-green-400 to-emerald-600', route: '/wallet' },
  { label: 'Ride', icon: Car, color: 'from-stone-400 to-stone-600', route: '/portal/ride' },
  { label: 'Orders', icon: Package, color: 'from-cyan-400 to-blue-500', route: '/orders' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export default function QuickAccessGrid() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="grid grid-cols-5 gap-y-6 gap-x-2 px-4 py-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {tiles.map((tile, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center gap-2 cursor-pointer group"
          variants={itemVariants}
          whileTap={{ scale: 0.92 }}
          onClick={() => navigate(tile.route)}
        >
          <div
            className={`relative w-[52px] h-[52px] sm:w-[56px] sm:h-[56px] rounded-[18px] flex items-center justify-center bg-gradient-to-br ${tile.color} shadow-lg shadow-black/10 group-active:shadow-inner transition-all duration-200 ring-1 ring-white/10`}
          >
            <tile.icon className="w-6 h-6 text-white" />
            {tile.badge && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full h-4.5 min-w-[18px] flex items-center justify-center border-2 border-[var(--pm-surface)] shadow-sm">
                {tile.badge}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold text-[var(--pm-text)] text-center w-full leading-tight truncate px-0.5">
            {tile.label}
          </span>
        </motion.div>
      ))}
    </motion.div>
  );
};
