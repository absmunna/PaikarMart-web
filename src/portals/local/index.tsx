import { 
  MapPin, Navigation2, Store, Clock, Navigation, 
  Search, Filter, Star, ChevronRight, ShoppingBag,
  Zap, Heart, ShieldCheck, Map as MapIcon,
  Flame, Coffee, Pill, Smartphone, Utensils
} from "lucide-react";
import { motion } from "motion/react";

const LOCAL_CATEGORIES = [
  { id: "pharmacy", label: "Pharmacy", icon: Pill, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "grocery", label: "Grocery", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "food", label: "Restaurants", icon: Utensils, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "electronics", label: "Electronics", icon: Smartphone, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "bakery", label: "Bakery", icon: Coffee, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const NEARBY_SHOPS = [
  { id: 1, name: "City Pharma & Wellness", category: "Pharmacy", distance: "0.4 km", time: "10 mins", rating: 4.8, status: "Open", image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=400" },
  { id: 2, name: "Daily Fresh Supermarket", category: "Grocery", distance: "0.8 km", time: "15 mins", rating: 4.5, status: "Open", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400" },
  { id: 3, name: "Al-Amin Electronics", category: "Gadgets", distance: "1.2 km", time: "20 mins", rating: 4.2, status: "Open", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=400" },
  { id: 4, name: "The Burger Kingdom", category: "Fast Food", distance: "0.5 km", time: "12 mins", rating: 4.9, status: "Closed", image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400" },
  { id: 5, name: "Home Style Kitchen", category: "Homemade Food", distance: "1.5 km", time: "25 mins", rating: 4.7, status: "Open", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" },
  { id: 6, name: "Elite Furniture Mart", category: "Home Decor", distance: "2.0 km", time: "30 mins", rating: 4.3, status: "Open", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400" },
];

export default function LocalHub() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8 min-h-screen pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Nearby Discovery</span>
          </div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic">
            Local <span className="text-emerald-500">Hub</span>
          </h1>
          <div className="flex items-center gap-1.5 text-zinc-500 mt-2 font-medium">
            <MapIcon className="h-4 w-4 text-[#FF7A00]" />
            <span className="text-sm">Banani Model Town, Dhaka 1213</span>
            <button className="text-[#FF7A00] text-sm font-black ml-2 hover:underline tracking-tight uppercase">Change Location</button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search shops or products nearby..." 
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-emerald-500 transition-all font-medium text-sm text-gray-900 dark:text-white" 
            />
          </div>
          <button className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 text-zinc-500 hover:text-emerald-500 transition-all">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Category Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-12">
        {LOCAL_CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-[#121522] border border-gray-100 dark:border-white/10 rounded-3xl p-5 text-center shadow-sm cursor-pointer hover:border-emerald-500/30 group transition-all"
          >
            <div className={`h-14 w-14 rounded-2xl ${cat.bg} ${cat.color} mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <cat.icon className="h-7 w-7" />
            </div>
            <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{cat.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Featured Banner */}
      <div className="relative rounded-[2.5rem] p-8 md:p-12 bg-[#0f111a] overflow-hidden mb-12 border border-white/5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 blur-[80px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-widest border border-amber-500/20">
              <Zap className="h-3 w-3 fill-amber-500" /> Local Spotlight
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight italic">Support Your <span className="text-emerald-500">Local Heroes</span>.</h2>
            <p className="text-zinc-400 font-medium text-sm md:text-base leading-relaxed">
              Order from nearby verified shops and get delivery in as fast as 15 minutes. Support the small businesses in your neighborhood.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-emerald-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20">
                Explore All Shops
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block w-72 h-72 rounded-[3rem] bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 p-6">
            <div className="w-full h-full rounded-[2.5rem] bg-white/5 backdrop-blur-xl border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="h-16 w-16 rounded-full bg-emerald-500 flex items-center justify-center">
                <Navigation2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-xl font-black text-white italic">Live Map</p>
                <p className="text-xs text-zinc-400 font-medium mt-1">Track delivery riders near you in real-time.</p>
              </div>
              <button className="text-emerald-400 text-xs font-black uppercase tracking-widest hover:underline">Open Map</button>
            </div>
          </div>
        </div>
      </div>

      {/* Nearby Shops Grid */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Popular Nearby</h2>
          </div>
          <button className="text-[#FF7A00] text-sm font-black uppercase tracking-widest hover:underline flex items-center gap-1">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {NEARBY_SHOPS.map((shop) => (
            <motion.div 
              key={shop.id}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-[#121522] rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    shop.status === "Open" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-500/10 text-zinc-500 border-zinc-500/20"
                  )}>
                    {shop.status}
                  </span>
                </div>
                <button className="absolute top-4 right-4 h-9 w-9 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-rose-500 hover:border-rose-500 transition-all">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[#FF7A00] uppercase tracking-widest">{shop.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{shop.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors italic leading-none mb-4">{shop.name}</h3>
                
                <div className="flex items-center gap-6 pt-4 border-t border-gray-50 dark:border-white/5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Navigation2 className="h-3.5 w-3.5 text-emerald-500" /> {shop.distance}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-blue-500" /> {shop.time}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Become a Local Partner */}
      <div className="mt-20 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-4xl font-black italic">Grow Your Business.</h3>
            <p className="text-white/80 max-w-lg font-medium text-lg">
              Are you a local shop owner or manufacturer? Join PaikarMart Local and reach more customers in your area instantly.
            </p>
          </div>
          <button className="bg-white text-emerald-700 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl shadow-black/10 shrink-0">
            Register Your Shop <ShieldCheck className="h-5 w-5 inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
