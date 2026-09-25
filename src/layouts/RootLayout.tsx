import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { BottomNav } from '../components/navigation/BottomNav';
import { MobileMenu } from '../components/navigation/MobileMenu';
import { FloatingNavButton } from '../components/navigation/FloatingNavButton';
import { ThemeBlobs } from '../components/layout/ThemeBlobs';
import { NakshiOverlay } from '../components/layout/NakshiOverlay';
import { CartDrawer } from '../components/cart/CartDrawer';
import { useCartDrawerStore } from '../modules/cart/cartDrawerStore';
import { NotificationDrawer } from '../components/notifications/NotificationDrawer';
import { LiveChatDrawer, useLiveChatStore } from '../components/chat/LiveChatDrawer';
import { useAuth } from '@/features/auth/AuthContext';
import { useWalletStore } from '../modules/wallet/useWalletStore';
import { 
  Wallet, ArrowUpRight, TrendingUp, ShieldCheck, CheckCircle2, 
  Store, Sparkles, PhoneCall, Clock, PackageCheck, Flame, 
  ShoppingBag, Truck, BadgePercent, ChevronRight, PlusCircle, HelpCircle,
  Home, ShoppingBasket, Pill, Zap, MapPin, Package, Heart, LayoutGrid, Settings, Video,
  Building2, LayoutDashboard
} from 'lucide-react';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();
  const { user, isSeller } = useAuth();
  const { balance, coins } = useWalletStore();
  const openChat = useLiveChatStore((state) => state.openChat);
  const navigate = useNavigate();

  return (
    <div className="h-[100dvh] w-full bg-[var(--pm-bg)] transition-colors duration-500 overflow-hidden">
      <ThemeBlobs />
      <NakshiOverlay />

      {/* Responsive Desktop Max Width Container */}
      <div className="mx-auto h-full w-full max-w-[1740px] 2xl:max-w-[1920px] bg-[var(--pm-surface)] lg:bg-transparent relative transition-colors duration-500 flex justify-center">

        {/* ━━━ Left Sidebar - Desktop Only (Enhanced PC Cockpit) ━━━ */}
        <aside className="hidden lg:flex w-64 xl:w-72 2xl:w-80 h-[100dvh] sticky top-0 flex-col p-5 xl:p-6 border-r border-[var(--pm-border)] bg-[var(--pm-surface)]/95 backdrop-blur-xl shrink-0 overflow-y-auto no-scrollbar select-none z-30">
          
          {/* Logo & Super App Tagline */}
          <div className="mb-6 px-1.5 flex items-center justify-between">
            <Link to="/" className="group block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--pm-accent)] to-emerald-400 flex items-center justify-center text-white font-black text-base shadow-lg shadow-[var(--pm-accent)]/20 group-hover:scale-105 transition-transform">
                  P
                </div>
                <div>
                  <h1 className="text-xl xl:text-2xl font-black text-[var(--pm-text)] tracking-tight leading-none">
                    Paikar<span className="text-[var(--pm-accent)]">Mart</span>
                  </h1>
                  <span className="text-[9px] text-[var(--pm-accent)] font-extrabold uppercase tracking-widest block mt-0.5">
                    🇧🇩 সুপার কমার্স আড়ত
                  </span>
                </div>
              </div>
            </Link>
            <span className="hidden xl:inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          </div>

          {/* Grouped Desktop Navigation */}
          <div className="flex-1 space-y-6">
            
            {/* 1. মার্কেটপ্লেস ও আড়ত (Portals) */}
            <div>
              <p className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider px-3 mb-2">
                মার্কেটপ্লেস ও আড়ত (Hubs)
              </p>
              <nav className="flex flex-col gap-1">
                {[
                  { label: 'হোম ফিড (Home Feed)', icon: Home, color: 'text-orange-400 bg-orange-500/10', path: '/' },
                  { label: 'রিটেইল মার্কেট (Retail Shop)', icon: ShoppingBag, color: 'text-pink-400 bg-pink-500/10', path: '/b2c', badge: 'হট' },
                  { label: 'পাইকারি আড়ত (Wholesale B2B)', icon: Building2, color: 'text-blue-400 bg-blue-500/10', path: '/wholesale', badge: 'MOQ' },
                  { label: 'মুদি আড়ত (Grocery Mart)', icon: ShoppingBasket, color: 'text-emerald-400 bg-emerald-500/10', path: '/portal/grocery' },
                  { label: 'ফার্মেসি (Pharmacy)', icon: Pill, color: 'text-rose-400 bg-rose-500/10', path: '/portal/pharmacy' },
                  { label: 'ইলেকট্রনিক্স (Tech Store)', icon: Zap, color: 'text-amber-400 bg-amber-500/10', path: '/portal/electronics' },
                  { label: 'পিকে শপ (PK Exclusive)', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10', path: '/pk-shop', badge: 'কয়েন' },
                  { label: 'লোকাল শপ (Nearby)', icon: MapPin, color: 'text-cyan-400 bg-cyan-500/10', path: '/portal/nearby' },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center justify-between group ${isActive
                          ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] shadow-xs font-bold border border-[var(--pm-accent)]/30'
                          : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-[var(--pm-accent)]/15 text-[var(--pm-accent)] uppercase">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* 2. ব্যক্তিগত কমার্স ও লেনদেন */}
            <div>
              <p className="text-[10px] font-black text-[var(--pm-text-muted)] uppercase tracking-wider px-3 mb-2">
                লেনদেন ও ট্র্যাকিং (Commerce)
              </p>
              <nav className="flex flex-col gap-1">
                {isSeller && (
                  <NavLink
                    to="/seller"
                    className={({ isActive }) =>
                      `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 group ${isActive
                        ? 'bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'hover:bg-[var(--pm-surface-hover)] text-emerald-500/70 hover:text-emerald-400'
                      }`
                    }
                  >
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <LayoutDashboard className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">মার্চেন্ট হাব (Merchant Central)</span>
                  </NavLink>
                )}
                {[
                  { label: 'আমার অর্ডার (My Orders)', icon: Package, color: 'text-sky-400 bg-sky-500/10', path: '/orders' },
                  { label: 'পছন্দের তালিকা (Wishlist)', icon: Heart, color: 'text-rose-400 bg-rose-500/10', path: '/wishlist' },
                  { label: 'সুপার ওয়ালেট (Wallet)', icon: Wallet, color: 'text-emerald-400 bg-emerald-500/10', path: '/wallet' },
                  { label: 'সব পোর্টাল হাব (All Hubs)', icon: LayoutGrid, color: 'text-indigo-400 bg-indigo-500/10', path: '/portals' },
                  { label: 'সেটিংস (Settings)', icon: Settings, color: 'text-zinc-400 bg-zinc-500/10', path: '/settings' },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <NavLink
                      key={item.label}
                      to={item.path}
                      className={({ isActive }) =>
                        `w-full text-left px-3 py-2 rounded-xl transition-all font-semibold text-xs flex items-center gap-2.5 group ${isActive
                          ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] font-bold border border-[var(--pm-accent)]/30'
                          : 'hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'
                        }`
                      }
                    >
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${item.color} group-hover:scale-105 transition-transform`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* 3. সেলার অনবোর্ডিং প্রমো ব্যানার - Hide if already a seller */}
            {!isSeller && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/15 via-[var(--pm-accent)]/5 to-transparent border border-[var(--pm-accent)]/25 relative overflow-hidden">
                <div className="flex items-center gap-2 text-[var(--pm-accent)] font-black text-xs uppercase tracking-wider mb-1">
                  <Store className="w-4 h-4" /> অনলাইন আড়ত খুলুন
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] leading-relaxed font-medium mb-3">
                  ০% প্ল্যাটফর্ম ফি-তে দেশজুড়ে পাইকারি ও খুচরা বিক্রয় শুরু করুন।
                </p>
                <Link 
                  to="/become-seller"
                  className="w-full py-2 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-[11px] font-bold text-center block transition-all shadow-md shadow-[var(--pm-accent)]/20 active:scale-95"
                >
                  সেলার আবেদন করুন →
                </Link>
              </div>
            )}

          </div>

          {/* User Profile Card Footing on Desktop */}
          <div className="mt-auto p-2 border-t border-[var(--pm-border)] pt-4">
            <Link 
              to="/profile"
              className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-[var(--pm-surface-hover)] border border-transparent hover:border-[var(--pm-border)] transition-all cursor-pointer group"
            >
              <div className="relative">
                <div className="w-10 h-10 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden shrink-0 group-hover:scale-105 transition-transform bg-[var(--pm-bg)]">
                  <img 
                    src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Munna"} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[var(--pm-surface)] rounded-full" />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)] transition-colors">
                  {user ? user.name : 'গেস্ট ইউজার'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] text-[var(--pm-accent)] font-bold uppercase truncate">
                    {user ? user.role : 'লগইন করুন'}
                  </span>
                  <span className="text-[8px] text-zinc-500 font-bold">• Lvl 3</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-[var(--pm-text)] transition-colors" />
            </Link>
          </div>
        </aside>

        {/* ━━━ Main Content Area (Mobile-friendly on small screens, Spacious on Desktop) ━━━ */}
        <div className="w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px] lg:max-w-none lg:flex-1 lg:shrink min-w-0 bg-[var(--pm-surface)] lg:bg-transparent sm:shadow-2xl lg:shadow-none relative border-x border-[var(--pm-border)] h-full flex flex-col overflow-hidden">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          
          <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <CartDrawer isOpen={isOpen} onClose={close} />
          <NotificationDrawer />
          <LiveChatDrawer />

          <main className="flex-1 pt-[60px] md:pt-[64px] pb-[80px] lg:pb-8 overflow-y-auto hide-scrollbar">
            <FloatingNavButton />
            <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 py-2 max-w-[1400px] mx-auto">
              {children}
            </div>
          </main>

          <div className="lg:hidden">
            <BottomNav />
          </div>
        </div>

        {/* ━━━ Right Sidebar - Desktop Only (Interactive Commerce Cockpit) ━━━ */}
        <aside className="hidden xl:flex w-80 2xl:w-88 h-[100dvh] sticky top-0 flex-col p-5 xl:p-6 border-l border-[var(--pm-border)] bg-[var(--pm-surface)]/95 backdrop-blur-xl shrink-0 overflow-y-auto no-scrollbar z-30 select-none">
          <div className="flex flex-col gap-5">
            
            {/* 1. লাইভ ওয়ালেট কার্ড (Connected to useWalletStore) */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-[var(--pm-accent-soft)] via-[var(--pm-surface)] to-[var(--pm-accent-soft)]/50 border border-[var(--pm-accent)]/25 shadow-lg relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-wider flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" /> ওয়ালেট ব্যালেন্স
                </span>
                <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  সক্রিয়
                </span>
              </div>
              
              <div className="my-1">
                <p className="text-2xl 2xl:text-3xl font-black text-[var(--pm-accent)] tracking-tight">
                  ৳ {balance ? balance.toLocaleString('en-IN') : '৪৫,২৮০'}.০০
                </p>
                <p className="text-[10px] font-bold text-[var(--pm-text-muted)] mt-0.5 flex items-center gap-1">
                  <span>🪙 {coins ? coins.toLocaleString('en-IN') : '১,২৫০'} পিকে কয়েন</span>
                  <span className="text-zinc-500">• ক্যাশব্যাক রেডি</span>
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <NavLink 
                  to="/wallet?tab=topup" 
                  className="flex-1 py-2 px-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black rounded-xl text-center shadow-md shadow-[var(--pm-accent)]/20 transition-all active:scale-95"
                >
                  রিচার্জ
                </NavLink>
                <NavLink 
                  to="/wallet?tab=transactions" 
                  className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-[var(--pm-text)] text-xs font-bold rounded-xl border border-[var(--pm-border)] text-center transition-all"
                >
                  হিস্ট্রি
                </NavLink>
              </div>
            </div>

            {/* 2. সক্রিয় অর্ডার লাইভ ট্র্যাকার */}
            <div className="p-4 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)]">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="font-bold text-xs text-[var(--pm-text)] flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> 
                  লাইভ অর্ডার ট্র্যাকিং
                </h3>
                <Link to="/orders" className="text-[10px] text-[var(--pm-accent)] font-bold hover:underline">
                  সব দেখুন
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-[var(--pm-bg)]/60 border border-[var(--pm-border)]/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-white">অর্ডার #PM-94821</span>
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                    ট্রানজিটে
                  </span>
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] line-clamp-1">
                  সুন্দরবনের খাঁটি মধু ও প্রিমিয়াম জামদানি
                </p>
                {/* 4-Stage Mini Stepper */}
                <div className="pt-1 flex items-center justify-between text-[8px] font-bold text-zinc-500">
                  <span className="text-emerald-400">কনফার্মড</span>
                  <span className="text-emerald-400">প্যাকিং</span>
                  <span className="text-amber-400 font-black">ট্রানজিটে</span>
                  <span>ডেলিভারি</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full w-[70%]" />
                </div>
              </div>
            </div>

            {/* 3. জরুরি বায়ার ডিমান্ড বোর্ড (Live Demands) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-bold text-xs text-[var(--pm-text)] flex items-center gap-1.5 uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  জরুরি পাইকারি ডিমান্ড
                </h3>
                <Link to="/demand" className="text-[10px] text-[var(--pm-accent)] font-bold hover:underline">
                  + ডিমান্ড দিন
                </Link>
              </div>

              <div className="space-y-2">
                {[
                  { title: 'মিরপুরে ২০ কার্টন খাঁটি সরিষার তেল', time: '২৫ মিনিট আগে', budget: '৳ ১৮,০০০' },
                  { title: 'চকবাজারে ৫০ ডজন মেনস জেনুইন বেল্ট', time: '১ ঘন্টা আগে', budget: '৳ ৪৫,০০০' },
                  { title: 'যাত্রাবাড়িতে ১০০ বস্তা চিনিগুঁড়া আতপ চাল', time: '৩ ঘন্টা আগে', budget: '৳ ১,২০,০০০' }
                ].map((demand, i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate('/demand')}
                    className="p-3 rounded-2xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] transition-all hover:border-[var(--pm-accent)]/30 group cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-bold text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors line-clamp-1">
                        {demand.title}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[var(--pm-border)]/40 text-[10px]">
                      <span className="text-[var(--pm-text-muted)]">{demand.time}</span>
                      <span className="font-black text-[var(--pm-accent)]">{demand.budget}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. ২৪/৭ হেল্পলাইন ও কাস্টমার ট্রাস্ট গ্যারান্টি */}
            <div className="mt-auto p-4 rounded-2xl bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] space-y-2">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>১০০% সুরক্ষিত এসক্রো ট্রাস্ট</span>
              </div>
              <p className="text-[10px] text-[var(--pm-text-muted)] leading-relaxed">
                পণ্য হাতে পেয়ে নিশ্চিত না করা পর্যন্ত বিক্রেতা কোনো অর্থ উত্তোলন করতে পারেন না।
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <a 
                  href="tel:09638022222"
                  className="text-[10px] font-black text-[var(--pm-accent)] flex items-center gap-1 hover:underline"
                >
                  <PhoneCall className="w-3 h-3" /> ০৯৬-৩৮০২২২২ (হটলাইন)
                </a>
                <button
                  onClick={() => openChat()}
                  className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors"
                >
                  লাইভ চ্যাট
                </button>
              </div>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
};

