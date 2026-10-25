import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/navigation/Navbar';
import { BottomNav } from '@/components/navigation/BottomNav';
import { UnifiedSidebar } from '@/design-system/components/navigation/UnifiedSidebar';
import { ThemeBlobs } from '@/components/layout/ThemeBlobs';
import { NakshiOverlay } from '@/components/layout/NakshiOverlay';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { useCartDrawerStore } from '@/modules/cart';
import { NotificationDrawer } from '@/components/notifications/NotificationDrawer';
import { LiveChatDrawer, useLiveChatStore } from '@/components/chat/LiveChatDrawer';
import { useAuth } from '@/modules/auth';
import { useWalletStore } from '@/modules/wallet';
import { 
  Wallet, ShieldCheck, 
  PhoneCall, 
  Truck, Flame
} from 'lucide-react';
import { CategoryBar } from '@/design-system/components/navigation/CategoryBar';
import { GlobalLocationModal } from '@/modules/location';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();
  const { user, isSeller } = useAuth();
  const { balance, coins } = useWalletStore();
  const openChat = useLiveChatStore((state) => state.openChat);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  // Automatically scroll page and main container to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="h-[100dvh] w-full bg-[var(--pm-bg)] transition-colors duration-500 overflow-hidden">
      <ThemeBlobs />
      <NakshiOverlay />

      {/* Responsive Desktop Max Width Container */}
      <div className="mx-auto h-full w-full max-w-[1740px] 2xl:max-w-[1920px] bg-[var(--pm-surface)] lg:bg-transparent relative transition-colors duration-500 flex justify-center">

        {/* ━━━ Left Sidebar - Desktop Only (Unified Master Cockpit) ━━━ */}
        <UnifiedSidebar />

        {/* ━━━ Main Content Area (Mobile-friendly on small screens, Spacious on Desktop) ━━━ */}
        <div className="w-full max-w-[480px] sm:max-w-[560px] md:max-w-[640px] lg:max-w-none lg:flex-1 lg:shrink min-w-0 bg-[var(--pm-surface)] lg:bg-transparent sm:shadow-2xl lg:shadow-none relative border-x border-[var(--pm-border)] h-full flex flex-col overflow-hidden">
          <Navbar onMenuClick={() => setMenuOpen(true)} />
          
          <UnifiedSidebar isMobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
          <CartDrawer isOpen={isOpen} onClose={close} />
          <NotificationDrawer />
          <LiveChatDrawer />
          <GlobalLocationModal />

          <main ref={mainRef} className="flex-1 pt-[60px] md:pt-[64px] pb-[80px] lg:pb-8 overflow-y-auto hide-scrollbar">
            <CategoryBar className="sticky top-0 z-30" />
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

