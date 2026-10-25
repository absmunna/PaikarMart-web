import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Pill, Utensils, Zap, Briefcase, Users, MapPin, 
  Search, SlidersHorizontal, ChevronDown, Clock, ShieldCheck, 
  AlertCircle, ArrowRight, Heart, Star, Grid, Layout, Navigation,
  MessageSquare, Loader2, Store
} from 'lucide-react';
import { HomeHeader } from '@/components/home/HomeHeader';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { cn } from '@/lib/utils';
import { NeighborhoodFeed } from '../components/NeighborhoodFeed';
import { LocalServices } from '../components/LocalServices';
import { LocalEvents } from '../components/LocalEvents';
import { useLanguage } from '@/modules/language';
import { useLocationStore, useGeolocation } from '@/modules/location';
import { ChatModal } from '@/modules/chat';
import { toast } from 'sonner';

interface NearbyStore {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  rating: number;
  reviewCount: number;
  activeProductsCount?: number;
  isVerified: boolean;
  category: string;
  storeType: string;
  serviceRadiusKm: number;
  distance: number;
  deliveryTime: string;
  isInstantDeliveryEligible: boolean;
  isOpen: boolean;
  address: string;
}

const RADIUS_OPTIONS = [
  { label: '১ কিমি (1 KM)', value: 1 },
  { label: '৩ কিমি (3 KM)', value: 3 },
  { label: '৫ কিমি (5 KM)', value: 5 },
  { label: '৮ কিমি (8 KM)', value: 8 },
  { label: '১০ কিমি (10 KM)', value: 10 },
  { label: 'পুরো শহর (20 KM)', value: 20 },
];

const LOCAL_CATEGORIES = [
  { id: 'all', name: 'All Shops', nameBn: 'সব দোকান', icon: MapPin, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'grocery', name: 'Grocery', nameBn: 'মুদিখানা', icon: ShoppingBag, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'pharmacy', name: 'Pharmacy', nameBn: 'ঔষধ / ফার্মেসি', icon: Pill, color: 'text-teal-400', bg: 'bg-teal-500/10' },
  { id: 'food', name: 'Food / Cafe', nameBn: 'খাবার ও রেস্টুরেন্ট', icon: Utensils, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { id: 'services', name: 'Technicians', nameBn: 'মিস্ত্রি ও হোম সার্ভিস', icon: Briefcase, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { id: 'community', name: 'Community', nameBn: 'কমিউনিটি হাব', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
];

const FALLBACK_SHOPS: NearbyStore[] = [
  {
    id: 'store-food-01',
    name: 'সুলতান ডাইন চিলিং কিচেন (Food)',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop',
    rating: 4.9,
    reviewCount: 3400,
    isVerified: true,
    category: 'Food',
    storeType: 'food',
    serviceRadiusKm: 5.0,
    distance: 0.8,
    deliveryTime: '১৫-২০ মিনিট',
    isInstantDeliveryEligible: true,
    isOpen: true,
    address: 'বাড়ি ৮, রোড ১১, বনানী, ঢাকা'
  },
  {
    id: 'store-groc-02',
    name: 'স্বপ্ন এক্সপ্রেস মুদিখানা (Grocery)',
    avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop',
    rating: 4.8,
    reviewCount: 2150,
    isVerified: true,
    category: 'Grocery',
    storeType: 'grocery',
    serviceRadiusKm: 4.0,
    distance: 1.2,
    deliveryTime: '২০-২৫ মিনিট',
    isInstantDeliveryEligible: true,
    isOpen: true,
    address: 'ব্লক ডি, বসুন্ধরা আর/এ, ঢাকা'
  },
  {
    id: 'store-pharm-03',
    name: 'ভাই ভাই ডিজিটাল ফার্মেসি (Pharmacy)',
    avatar: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=100&h=100&fit=crop',
    rating: 4.9,
    reviewCount: 890,
    isVerified: true,
    category: 'Pharmacy',
    storeType: 'pharmacy',
    serviceRadiusKm: 6.0,
    distance: 1.5,
    deliveryTime: '১০-১৫ মিনিট',
    isInstantDeliveryEligible: true,
    isOpen: true,
    address: 'ধানমন্ডি ২৭, ঢাকা'
  }
];

type HubTab = 'explore' | 'feed' | 'services' | 'events';

export const LocalHubHome: React.FC = () => {
  const { t, isBn } = useLanguage();
  const [radius, setRadius] = useState<number>(5);
  const [isRadiusOpen, setIsRadiusOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<HubTab>('explore');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Global Location state
  const { 
    lat, 
    lng, 
    formattedAddress, 
    city, 
    isAutoDetected, 
    openLocationModal 
  } = useLocationStore();
  const { detectLocation, isLoading: isDetectingGps } = useGeolocation();

  // GPS Coordinates state derived from global location store
  const userCoords = { lat: lat || 23.8103, lng: lng || 90.4125 };
  const locationName = formattedAddress || city || 'ঢাকা কেন্দ্রীয় এলাকা (Dhaka Central)';

  // Live shops state
  const [shops, setShops] = useState<NearbyStore[]>(FALLBACK_SHOPS);
  const [isLoadingShops, setIsLoadingShops] = useState(false);

  // Chat Modal State
  const [chatTargetShop, setChatTargetShop] = useState<{ id: string; name: string } | null>(null);

  // Detect GPS Location
  const handleDetectGps = async () => {
    const success = await detectLocation();
    if (success) {
      toast.success('আপনার লাইভ জিপিএস লোকেশন সনাক্ত হয়েছে!');
    }
  };

  // Fetch shops from backend /api/v1/nearby
  useEffect(() => {
    let isMounted = true;
    async function fetchNearbyStores() {
      setIsLoadingShops(true);
      try {
        const queryParams = new URLSearchParams({
          lat: userCoords.lat.toString(),
          lng: userCoords.lng.toString(),
          radius: radius.toString(),
        });
        if (selectedCategory !== 'all') {
          queryParams.append('category', selectedCategory);
        }

        const response = await fetch(`/api/v1/nearby?${queryParams.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (isMounted && Array.isArray(data)) {
            setShops(data);
          }
        }
      } catch (err) {
        console.warn('Fetch nearby shops fallback to offline catalog:', err);
        if (isMounted) {
          setShops(FALLBACK_SHOPS);
        }
      } finally {
        if (isMounted) setIsLoadingShops(false);
      }
    }

    fetchNearbyStores();
    return () => { isMounted = false; };
  }, [radius, selectedCategory, userCoords]);

  const tabs = [
    { id: 'explore', label: isBn ? 'দোকান সমূহ' : 'Explore', icon: Grid },
    { id: 'feed', label: isBn ? 'এলাকার ফিড' : 'Feed', icon: Layout },
    { id: 'services', label: isBn ? 'লোকাল মিস্ত্রি' : 'Services', icon: Briefcase },
    { id: 'events', label: isBn ? 'হাট ও ইভেন্ট' : 'Events', icon: Users },
  ];

  const filteredShops = shops.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || 
                       s.category.toLowerCase() === selectedCategory.toLowerCase() ||
                       s.storeType.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24 p-4 space-y-6">
      <HomeHeader />
      <PortalIconBar />

      <main className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header & Hyperlocal GPS Geofence Terminal */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <MapPin className="w-6 h-6 text-cyan-400" /> 
                {isBn ? "পার্শ্ববর্তী লোকাল হাব" : "Nearby Local Hub"}
              </h1>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mt-0.5">
                {isBn ? "হাইপারলোকাল পাড়া-মহল্লা ইকোসিস্টেম" : "Hyperlocal Neighbourhood Ecosystem"}
              </p>
            </div>
            
            {/* Geofence Radius Selector */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetectingGps}
                className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-2xl text-xs font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="Detect GPS"
              >
                {isDetectingGps ? <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" /> : <Navigation className="w-3.5 h-3.5 text-cyan-400" />}
                <span className="hidden sm:inline">{isBn ? "জিপিএস খুঁজুন" : "GPS"}</span>
              </button>

              <div className="relative">
                <button 
                  onClick={() => setIsRadiusOpen(!isRadiusOpen)}
                  className="flex items-center gap-2 px-3.5 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl hover:bg-cyan-500/20 transition-colors cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-black text-white">{radius} KM রেডিয়াস</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-cyan-400 transition-transform ${isRadiusOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isRadiusOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-[#0e1017] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                    >
                      {RADIUS_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setRadius(opt.value); setIsRadiusOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors ${
                            radius === opt.value ? 'bg-cyan-400 text-black font-black' : 'text-slate-300 hover:bg-white/5'
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
          </div>

          {/* Location indicator bar */}
          <div className="p-2.5 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-2 truncate min-w-0">
              <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isAutoDetected ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span className="text-zinc-300 font-medium truncate text-xs">
                অবস্থান: <strong className="text-white font-black">{locationName}</strong>
              </span>
            </div>
            <button
              onClick={openLocationModal}
              className="text-[10px] font-black text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-2.5 py-1 rounded-xl border border-cyan-500/20 transition-all shrink-0 cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <MapPin className="w-3 h-3" />
              <span>লোকেশন পরিবর্তন</span>
            </button>
          </div>

          {/* Hub Navigation Tabs */}
          <div className="flex gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as HubTab)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <tab.icon size={14} />
                <span>{tab.label}</span>
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
              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isBn ? "নিকটস্থ দোকান, ফার্মেসি, মুদিখানা বা মিস্ত্রি খুঁজুন..." : "Search nearby shops, groceries, medicines..."}
                    className="w-full h-12 pl-11 pr-4 bg-black/40 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors text-xs"
                  />
                </div>

                {/* Local Categories Filter Pill Bar */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-black text-white uppercase tracking-wider">
                      {isBn ? "ক্যাটাগরি অনুযায়ী দোকান" : "Local Categories"}
                    </h2>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {LOCAL_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "group cursor-pointer flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all text-center",
                          selectedCategory === cat.id 
                            ? "bg-cyan-500/10 border-cyan-400 text-white shadow-md shadow-cyan-400/10" 
                            : "bg-black/30 border-white/5 hover:border-white/15 text-zinc-400"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-all", cat.bg)}>
                          <cat.icon className={cn("w-5 h-5", cat.color)} />
                        </div>
                        <span className="text-[11px] font-bold text-white truncate max-w-full">{cat.nameBn}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Nearby Stores Feed */}
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <Store className="w-5 h-5 text-cyan-400" />
                        {isBn ? "আপনার চারপাশের সক্রিয় দোকানসমূহ" : "Shops Around You"}
                      </h2>
                      <p className="text-[11px] text-zinc-400">
                        {isBn ? `${radius} কিমি ব্যাসার্ধের মধ্যে ফলাফল প্রদর্শিত হচ্ছে` : `Showing results within ${radius} KM radius`}
                      </p>
                    </div>
                  </div>
                  
                  {isLoadingShops ? (
                    <div className="py-12 flex items-center justify-center gap-2 text-zinc-400">
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                      <span className="text-xs font-bold">দোকান তথ্য লোড হচ্ছে...</span>
                    </div>
                  ) : filteredShops.length === 0 ? (
                    <div className="p-8 text-center bg-black/20 border border-white/5 rounded-3xl text-zinc-400 space-y-2">
                      <p className="text-sm font-bold">এই রেডিয়াসে কোনো দোকান পাওয়া যায়নি।</p>
                      <p className="text-xs text-zinc-500">দয়া করে উপরের রেডিয়াস অপশন বাড়িয়ে ৩ বা ৫ কিমি নির্বাচন করুন।</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {filteredShops.map((shop) => (
                        <div 
                          key={shop.id} 
                          className="bg-black/40 border border-white/5 rounded-3xl p-4 flex gap-4 hover:border-cyan-400/30 transition-all text-left group"
                        >
                          <div className="w-20 h-20 rounded-2xl overflow-hidden relative shrink-0 border border-white/5 bg-zinc-900">
                            <img src={shop.avatar} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 rounded border border-white/10 text-[9px] font-black text-cyan-400 flex items-center gap-0.5">
                              <MapPin className="w-2.5 h-2.5" /> {shop.distance} কিমি
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex items-start justify-between gap-1">
                                <h3 className="font-bold text-sm text-white truncate leading-tight">{shop.name}</h3>
                                {shop.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                              </div>
                              <p className="text-[10px] text-zinc-400 truncate mt-0.5">{shop.address}</p>
                              
                              <div className="flex items-center gap-2 text-[10px] mt-1.5 flex-wrap">
                                <span className={cn(
                                  "px-2 py-0.5 rounded font-black uppercase text-[9px]",
                                  shop.isOpen ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500"
                                )}>
                                  {shop.isOpen ? "খোলা আছে (Open)" : "বন্ধ"}
                                </span>
                                <span className="text-zinc-500 font-bold">•</span>
                                <span className="text-zinc-300 font-bold">{shop.category}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                              <div className="flex items-center gap-1 text-[10px] font-medium text-cyan-300">
                                <Clock className="w-3 h-3 text-cyan-400" />
                                <span>{shop.deliveryTime}</span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setChatTargetShop({ id: shop.id, name: shop.name })}
                                className="px-3 py-1.5 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-300 border border-cyan-400/25 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition-all cursor-pointer"
                              >
                                <MessageSquare className="w-3 h-3" />
                                চ্যাট করুন
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {activeTab === 'feed' && <NeighborhoodFeed />}
            {activeTab === 'services' && <LocalServices />}
            {activeTab === 'events' && <LocalEvents />}
          </motion.div>
        </AnimatePresence>

        {/* Live Chat Modal with Local Shop Keeper */}
        {chatTargetShop && (
          <ChatModal
            isOpen={Boolean(chatTargetShop)}
            onClose={() => setChatTargetShop(null)}
            vendorId={chatTargetShop.id}
            vendorName={chatTargetShop.name}
            productName="নিকটস্থ শপ ইনকোয়ারি ও হোম ডেলিভারি অর্ডার"
          />
        )}
      </main>
    </div>
  );
};
