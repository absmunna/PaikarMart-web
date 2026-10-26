import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ChevronRight, Sparkles, Wallet, ShoppingBag, Heart,
  HelpCircle, Star, X
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { useWalletStore } from '@/modules/wallet';
import { StoryBar } from '@shared/StoryBar';
import { CategoryNavBar } from '@shared/CategoryNavBar';
import { HUB_REGISTRY, PORTAL_REGISTRY, ICON_COMPONENTS_MAP } from '@/config/portals.config';
import { useLanguage } from '@/features/language/LanguageContext';

export default function PortalsPage() {
  const navigate = useNavigate();
  const { isBn } = useLanguage();
  const { role } = useAuth();
  const { balance, coins } = useWalletStore();
  const [searchQuery, setSearchQuery] = useState("");

  const userBalance = balance !== undefined ? balance : 21450;
  const userCoins = coins !== undefined ? coins : 1450;

  const filteredHubs = useMemo(() => {
    if (!searchQuery.trim()) return HUB_REGISTRY;
    return HUB_REGISTRY.map(hub => {
      const filteredPortals = PORTAL_REGISTRY.filter(p => 
        p.hubId === hub.id && 
        (p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
         p.nameBn.includes(searchQuery))
      );
      if (filteredPortals.length > 0) return { ...hub, filteredPortals };
      return null;
    }).filter(Boolean) as any[];
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#010804] text-white">
      {/* Search Header - Sticky */}
      <div className="sticky top-0 z-50 bg-[#010804]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-[1280px] mx-auto px-4 h-20 flex items-center gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-cyan-500 transition-colors" />
            <input 
              type="text"
              placeholder={isBn ? "সুপার অ্যাপস খুঁজুন..." : "Search Super Apps..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 text-sm font-black uppercase tracking-wider focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-600"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10"
              >
                <X className="w-3 h-3 text-zinc-400" />
              </button>
            )}
          </div>
          <div className="hidden md:flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-500" />
             </div>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-40 bg-[#010804]/80 backdrop-blur-md">
        <section className="px-2 pt-2">
          <StoryBar context="social-feed" />
        </section>
        <section className="px-2 pb-2">
          <CategoryNavBar context="social-feed" />
        </section>
      </div>

      <main className="mx-auto w-full max-w-[1280px] px-4 md:px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          <div className="lg:col-span-8 space-y-12">
            <AnimatePresence mode="popLayout">
              {filteredHubs.length > 0 ? (
                filteredHubs.map((hub) => {
                  const hubPortals = hub.filteredPortals || PORTAL_REGISTRY.filter(p => p.hubId === hub.id);
                  const HubIcon = ICON_COMPONENTS_MAP[hub.iconName] || Star;

                  return (
                    <motion.section 
                      key={hub.id} 
                      className="space-y-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${hub.color} flex items-center justify-center shadow-lg border border-white/10`}>
                            <HubIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-white tracking-tight uppercase italic underline decoration-cyan-500/50 decoration-4 underline-offset-4">
                              {isBn ? hub.nameBn : hub.nameEn}
                            </h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                              {isBn ? hub.descriptionBn : hub.descriptionEn}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-y-8 gap-x-4">
                        {hubPortals.map((tile: any) => {
                          const IconComponent = ICON_COMPONENTS_MAP[tile.iconName] || Star;
                          return (
                            <motion.div
                              key={tile.id}
                              whileHover={{ y: -5 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => navigate(tile.route)}
                              className="flex flex-col items-center gap-2.5 cursor-pointer group"
                            >
                              <div
                                className={`relative w-full aspect-square max-w-[64px] rounded-[24px] flex items-center justify-center bg-zinc-900 border border-white/5 group-hover:border-white/20 group-hover:bg-zinc-800 transition-all duration-300 shadow-2xl overflow-hidden`}
                              >
                                <IconComponent
                                  className={`w-7 h-7 bg-gradient-to-br ${tile.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                                  strokeWidth={2}
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                
                                {tile.status === 'upcoming' && (
                                  <span className="absolute top-1 right-1 bg-amber-500 text-black text-[7px] font-black px-1.5 rounded-full uppercase py-0.5">
                                    New
                                  </span>
                                )}
                              </div>
                              <div className="text-center w-full px-1 overflow-hidden">
                                <span className="block text-[10px] font-black text-zinc-300 group-hover:text-white transition-colors truncate">
                                  {tile.nameBn}
                                </span>
                                <span className="block text-[7px] font-bold text-zinc-600 uppercase tracking-tighter opacity-60 truncate">
                                  {tile.nameEn}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.section>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-zinc-700" />
                  </div>
                  <h3 className="text-lg font-black text-zinc-500 uppercase">No apps found</h3>
                  <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest mt-2 px-10">
                    {isBn ? "আপনার খোঁজা অ্যাপটি পাওয়া যায়নি" : "Try searching for a different keyword"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT COLUMN / SIDEBAR ── */}
          <div className="lg:col-span-4 space-y-6">
            {/* SUPER WALLET */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative p-7 rounded-[32px] bg-white/[0.015] border border-white/10 shadow-2xl overflow-hidden group"
            >
              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <div className="px-2.5 py-1 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-[9px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    PaikarWallet
                  </div>
                  <Wallet className="w-5 h-5 text-cyan-500" />
                </div>

                <div>
                  <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-1">Balance</p>
                  <h4 className="text-3xl font-black tracking-tighter text-white">
                    <span className="text-cyan-500 mr-1">৳</span>
                    {userBalance.toLocaleString()}
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                  <div>
                    <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">PK Coins</p>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-black text-white">{userCoins}</span>
                    </div>
                  </div>
                  <div className="border-l border-white/5 pl-4">
                    <p className="text-[8px] font-black text-zinc-500 uppercase mb-1">Status</p>
                    <span className="text-[8px] font-black text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded-sm uppercase tracking-widest">Active</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/wallet')}
                  className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-cyan-500/20"
                >
                  Withdraw / Topup
                </button>
              </div>
            </motion.div>

            {/* MY ACCOUNT LIST */}
            <div className="space-y-2">
              {[
                { id: 'store', bn: 'সেলার সেন্ট্রাল', en: 'Seller Central', path: role === 'buyer' ? '/become-seller' : '/seller', icon: ShoppingBag, color: 'text-amber-400' },
                { id: 'wallet', bn: 'আমার ওয়ালেট', en: 'My Wallet', path: '/wallet', icon: Wallet, color: 'text-cyan-400' },
                { id: 'order', bn: 'অর্ডার ও ক্রয়', en: 'Orders', path: '/orders', icon: ShoppingBag, color: 'text-sky-400' },
                { id: 'favourite', bn: 'প্রিয় পণ্য তালিকা', en: 'Wishlist', path: '/wishlist', icon: Heart, color: 'text-rose-400' },
              ].map((act) => (
                <motion.div
                  key={act.id}
                  onClick={() => navigate(act.path)}
                  whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.03)' }}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.015] border border-white/5 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-white/5 border border-white/5 ${act.color}`}>
                      <act.icon className="w-5 h-5" strokeWidth={1} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-zinc-100 group-hover:text-cyan-400 transition-colors uppercase tracking-tight">{act.bn}</p>
                      <p className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest mt-1">{act.en}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-cyan-500 transition-all" strokeWidth={3} />
                </motion.div>
              ))}
            </div>

            {/* ECOSYSTEM SYNC */}
            <div className="p-5 rounded-3xl bg-cyan-500/[0.02] border border-cyan-500/10 flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4 text-cyan-500" />
              </div>
              <div>
                <h5 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Trust Ecosystem</h5>
                <p className="text-[9px] text-zinc-600 mt-2 leading-relaxed font-bold uppercase tracking-tighter">
                  Real-time sync enabled with 7-level verification score.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
