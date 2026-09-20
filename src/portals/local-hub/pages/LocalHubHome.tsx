import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Pill, Utensils, Zap, Briefcase, Users, MapPin, 
  Search, SlidersHorizontal, ChevronDown, Clock, ShieldCheck, 
  AlertCircle, ArrowRight, Heart, BellRing, Star, Grid, Layout
} from 'lucide-react';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { cn } from '@/lib/utils';
import { NeighborhoodFeed } from '../components/NeighborhoodFeed';
import { LocalServices } from '../components/LocalServices';
import { LocalEvents } from '../components/LocalEvents';

const RADIUS_OPTIONS = [
  { label: '500m', value: 0.5 },
  { label: '1 KM', value: 1 },
  { label: '3 KM', value: 3 },
  { label: '5 KM', value: 5 },
  { label: 'Entire City', value: 20 },
];

const LOCAL_CATEGORIES = [
  { id: 'nearby', name: 'Nearby', nameBn: 'কাছের শপ', icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
  { id: 'grocery', name: 'Grocery', nameBn: 'মুদিখানা', icon: ShoppingBag, color: 'text-green-500', bg: 'bg-green-500/10' },
  { id: 'pharmacy', name: 'Pharmacy', nameBn: 'ফার্মেসি', icon: Pill, color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { id: 'food', name: 'Restaurant', nameBn: 'রেস্টুরেন্ট', icon: Utensils, color: 'text-rose-500', bg: 'bg-rose-500/10' },
  { id: 'services', name: 'Services', nameBn: 'সার্ভিস', icon: Briefcase, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'community', name: 'Community', nameBn: 'কমিউনিটি', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
];

const MOCK_LOCAL_SHOPS = [
  {
    id: 's1',
    name: 'Rahim General Store',
    category: 'Grocery',
    distance: '400m',
    time: '15 Min',
    queue: 'Fast',
    status: 'Open Now',
    stock: 'In Stock',
    rating: 4.8,
    reviews: 124,
    verified: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
  },
  {
    id: 's2',
    name: 'Bhai Bhai Pharmacy',
    category: 'Pharmacy',
    distance: '800m',
    time: '20 Min',
    queue: 'Normal',
    status: 'Closing in 30m',
    stock: 'Low Stock',
    rating: 4.9,
    reviews: 312,
    verified: true,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=400&q=80'
  }
];

type HubTab = 'explore' | 'feed' | 'services' | 'events';

export const LocalHubHome: React.FC = () => {
  const [radius, setRadius] = useState<number>(3);
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HubTab>('explore');

  const tabs = [
    { id: 'explore', label: 'Explore', icon: Grid },
    { id: 'feed', label: 'Feed', icon: Layout },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'events', label: 'Events', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-[#020604] pb-24">
      {/* 1. StoryBar (Mandatory Order) */}
      <StoryBar context="local" />

      {/* 2. PortalIconBar (Mandatory Order) */}
      <PortalIconBar context="local" />

      <main className="p-4 max-w-7xl mx-auto space-y-8">
        
        {/* Top Header & Radius Selector */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Local Hub</h1>
              <p className="text-sm text-cyan-400 font-bold uppercase tracking-widest">Hyperlocal Ecosystem</p>
            </div>
            
            {/* Radius Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsRadiusOpen(!isRadiusOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full hover:bg-cyan-500/20 transition-colors"
              >
                <MapPin className="w-4 h-4 text-cyan-500" />
                <span className="text-sm font-bold text-white">Within {radius} KM</span>
                <ChevronDown className={`w-4 h-4 text-cyan-500 transition-transform ${isRadiusOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isRadiusOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-zinc-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {RADIUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setRadius(opt.value); setIsRadiusOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${
                          radius === opt.value ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hub Navigation Tabs */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as HubTab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                  activeTab === tab.id 
                    ? "bg-cyan-500 text-black shadow-lg" 
                    : "text-zinc-500 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'explore' && (
              <div className="space-y-8">
                {/* Search Bar with Emergency Filter */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input 
                      type="text" 
                      placeholder="Search shops, pharmacies, electricians..." 
                      className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <button className="w-12 h-12 flex items-center justify-center bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 hover:bg-rose-500/20 transition-colors">
                    <AlertCircle className="w-5 h-5" />
                  </button>
                </div>

                {/* Local Categories Grid */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-white">Explore Local</h2>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {LOCAL_CATEGORIES.map((cat) => (
                      <div key={cat.id} className="group cursor-pointer flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl border border-white/5 flex items-center justify-center transition-all group-hover:scale-105 group-hover:border-cyan-500/50",
                          cat.bg
                        )}>
                          <cat.icon className={cn("w-7 h-7", cat.color)} />
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-white leading-tight">{cat.nameBn}</p>
                          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{cat.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* AI Smart Reorder */}
                <section className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-500/30">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-white">Smart Reorder</h3>
                        <span className="px-2 py-0.5 bg-blue-500 text-black text-[10px] font-black uppercase rounded-full tracking-wider">AI Suggestion</span>
                      </div>
                      <p className="text-sm text-blue-200 mb-3">
                        You usually buy <span className="font-bold text-white">Miniket Rice 5kg</span> around this time of the month. Order now?
                      </p>
                      <button className="px-4 py-2 bg-white text-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-blue-50 transition-colors">
                        Order in 1 Click
                      </button>
                    </div>
                  </div>
                </section>

                {/* Nearby Shops */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-black text-white">Shops Around You</h2>
                      <p className="text-xs text-slate-400">Showing results within {radius} KM</p>
                    </div>
                    <button className="text-cyan-400 text-sm font-bold flex items-center gap-1 hover:text-cyan-300">
                      See All <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {MOCK_LOCAL_SHOPS.map((shop) => (
                      <div key={shop.id} className="bg-zinc-900 border border-white/5 rounded-3xl p-3 flex gap-4 hover:border-cyan-500/30 transition-colors group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden relative shrink-0">
                          <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white uppercase flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-cyan-400" /> {shop.distance}
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-between py-1">
                          <div>
                            <div className="flex items-start justify-between">
                              <h3 className="font-bold text-white leading-tight mb-1">{shop.name}</h3>
                              <button className="text-zinc-500 hover:text-rose-500 transition-colors">
                                <Heart className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded">{shop.status}</span>
                              <span className="text-slate-400">{shop.category}</span>
                              {shop.verified && <ShieldCheck className="w-3 h-3 text-blue-400" />}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-[11px] font-medium mt-2">
                            <div className="flex items-center gap-1 text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-cyan-500" />
                              {shop.time} Guaranteed
                            </div>
                            <div className="flex items-center gap-1 text-yellow-400">
                              <Star size={14} className="fill-yellow-400" />
                              {shop.rating} ({shop.reviews})
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Live Local Deals */}
                <section className="bg-cyan-950/20 border border-cyan-500/10 rounded-3xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-black text-cyan-400 flex items-center gap-2">
                      <Zap className="w-5 h-5" /> Live Local Deals
                    </h2>
                  </div>
                  <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="text-rose-400 font-black text-xl mb-1">20% OFF</div>
                      <div className="text-sm font-bold text-white">Rahim General Store</div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Valid till 10:00 PM Tonight
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-cyan-500 text-black text-xs font-black uppercase tracking-wider rounded-xl hover:bg-cyan-400 transition-colors">
                      Claim Now
                    </button>
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'feed' && <NeighborhoodFeed />}
            {activeTab === 'services' && <LocalServices />}
            {activeTab === 'events' && <LocalEvents />}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
};


