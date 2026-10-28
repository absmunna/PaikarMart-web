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
  Truck, Flame,
  Monitor, Smartphone, Sparkles, CheckCircle2, QrCode, Building2, Layers
} from 'lucide-react';
import { CategoryBar } from '@/design-system/components/navigation/CategoryBar';
import { GlobalLocationModal } from '@/modules/location';
import { useDomainViewMode } from '@/core/hooks/useDomainViewMode';
import { useNavSettingsStore } from '@/app/AppShell/useNavSettingsStore';

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isOpen, close } = useCartDrawerStore();
  const { user, isSeller } = useAuth();
  const { balance, coins } = useWalletStore();
  const openChat = useLiveChatStore((state) => state.openChat);
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const { isDesktopView, toggleViewMode, isWwwDomain } = useDomainViewMode();
  const { navBehavior, isNavVisible, setNavVisible } = useNavSettingsStore();
  
  const prevScrollY = useRef(0);
  const accumulatedDiff = useRef(0);

  // Automatically scroll page and main container to top whenever route changes, and ensure navs are visible
  useEffect(() => {
    window.scrollTo(0, 0);
    if (mainRef.current) {
      mainRef.current.scrollTo(0, 0);
    }
    setNavVisible(true);
    prevScrollY.current = 0;
    accumulatedDiff.current = 0;
  }, [location.pathname, location.search, setNavVisible]);

  // Robust Accumulated Scroll Responsive Navbar & BottomNav auto-hide
  useEffect(() => {
    const handleScroll = (e?: Event) => {
      if (navBehavior === 'fixed') {
        setNavVisible(true);
        return;
      }

      // Read current scroll position from main element or window/body
      const target = (e?.target as HTMLElement) || mainRef.current;
      const currentScrollY = target && typeof target.scrollTop === 'number' 
        ? target.scrollTop 
        : (window.scrollY || document.documentElement.scrollTop || 0);

      const delta = currentScrollY - prevScrollY.current;
      prevScrollY.current = currentScrollY;

      // Always show near top of page (first 35px)
      if (currentScrollY <= 35) {
        setNavVisible(true);
        accumulatedDiff.current = 0;
        return;
      }

      // If scroll direction changed, reset accumulated difference
      if ((delta > 0 && accumulatedDiff.current < 0) || (delta < 0 && accumulatedDiff.current > 0)) {
        accumulatedDiff.current = 0;
      }
      accumulatedDiff.current += delta;

      // Downward scroll accumulated >= 10px -> smoothly hide header & bottom nav
      if (accumulatedDiff.current >= 10 && currentScrollY > 50) {
        setNavVisible(false);
      } 
      // Upward scroll accumulated <= -8px -> smoothly reveal header & bottom nav
      else if (accumulatedDiff.current <= -8) {
        setNavVisible(true);
      }
    };

    const mainEl = mainRef.current;
    if (mainEl) {
      mainEl.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (mainEl) {
        mainEl.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navBehavior, setNavVisible, isDesktopView, location.pathname]);

  return (
    <div className={`h-[100dvh] w-full transition-colors duration-500 overflow-hidden relative ${
      !isDesktopView ? 'bg-[#030712] flex items-center justify-center' : 'bg-[var(--pm-bg)]'
    }`}>
      <ThemeBlobs />
      <NakshiOverlay />

      {/* ━━━━━━━━━━ DESKTOP WEB MODE (www.paikarmart.com) ━━━━━━━━━━ */}
      {isDesktopView ? (
        <div className="mx-auto h-full w-full max-w-[1740px] 2xl:max-w-[1920px] bg-[var(--pm-surface)] lg:bg-transparent relative transition-colors duration-500 flex justify-center">
          {/* Left Sidebar - Desktop Only */}
          <UnifiedSidebar />

          {/* Main Full-Width Content Area */}
          <div className="w-full flex-1 min-w-0 bg-[var(--pm-surface)] lg:bg-transparent relative border-x border-[var(--pm-border)] h-full flex flex-col overflow-hidden">
            <Navbar onMenuClick={() => setMenuOpen(true)} isVisible={isNavVisible} />
            
            <UnifiedSidebar isMobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            <CartDrawer isOpen={isOpen} onClose={close} />
            <NotificationDrawer />
            <LiveChatDrawer />
            <GlobalLocationModal />

            <main ref={mainRef} className="flex-1 pt-[60px] md:pt-[64px] pb-10 overflow-y-auto hide-scrollbar">
              {location.pathname !== '/' && <CategoryBar className={`sticky z-40 transition-all duration-300 bg-[var(--pm-bg)]/95 backdrop-blur-xl ${(navBehavior === 'fixed' || isNavVisible) ? 'top-[60px] md:top-[64px]' : 'top-0'}`} />}
              <div className="w-full px-3 sm:px-6 lg:px-8 py-3 max-w-[1400px] mx-auto">
                {children}
              </div>
            </main>
          </div>

          {/* Right Sidebar - Desktop Only */}
          <aside className="hidden xl:flex w-80 2xl:w-88 h-[100dvh] sticky top-0 flex-col p-5 xl:p-6 border-l border-[var(--pm-border)] bg-[var(--pm-surface)]/95 backdrop-blur-xl shrink-0 overflow-y-auto no-scrollbar z-30 select-none">
            <div className="flex flex-col gap-5">
              {/* Wallet Card */}
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

              {/* Order Tracker */}
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

              {/* Demand Board */}
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

              {/* Trust & Support */}
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
                    className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    লাইভ চ্যাট
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        /* ━━━━━━━━━━ MOBILE APP SCREEN MODE (paikarmart.com) ━━━━━━━━━━ */
        <div className="w-full h-full flex flex-col items-center justify-center p-0 md:py-3 md:px-4 relative z-10 select-none">
          {/* Top Control Pill for Desktop Screens */}
          <div className="hidden md:flex items-center justify-between w-full max-w-[430px] xl:max-w-6xl mb-2 px-4 py-2 rounded-2xl bg-[var(--pm-surface)]/90 backdrop-blur-xl border border-[var(--pm-border)] shadow-lg shadow-black/40">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[var(--pm-text)]">মোবাইল অ্যাপ সিমুলেটর ফ্রেম</span>
              <span className="text-[10px] text-[var(--pm-text-muted)] hidden sm:inline">• 430px View</span>
            </div>
            <button
              onClick={toggleViewMode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-md shadow-[var(--pm-accent)]/25 transition-all active:scale-95 cursor-pointer"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>ফুল স্ক্রিন ডেস্কটপ মোড</span>
            </button>
          </div>

          <div className="w-full h-full md:h-[92vh] flex items-center justify-center gap-6 max-w-7xl">
            {/* Left Desktop Companion Sidebar (XL Screens only) */}
            <aside className="hidden xl:flex w-72 h-[86vh] flex-col justify-between p-5 rounded-3xl bg-[var(--pm-surface)]/80 backdrop-blur-xl border border-[var(--pm-border)]/80 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[var(--pm-accent)]/15 flex items-center justify-center text-[var(--pm-accent)]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[var(--pm-text)]">Paikar Mart</h2>
                    <p className="text-[10px] text-[var(--pm-text-muted)]">সুপার কমার্স প্ল্যাটফর্ম</p>
                  </div>
                </div>

                <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
                  পাইকারি বাজার, খুচরা মার্কেট এবং সার্ভিস হাবের সমন্বয়ে বাংলাদেশের একমাত্র সোশ্যাল কমার্স সুপার অ্যাপ।
                </p>

                <div className="space-y-2 pt-2 border-t border-[var(--pm-border)]/40">
                  <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-wider">
                    মূল সেবাসমূহ
                  </span>
                  {[
                    '🏢 সরাসরি পাইকারি মিল ও আড়ত রেট',
                    '🔥 জরুরি রিয়েল-টাইম ডিমান্ড বোর্ড',
                    '🛍️ প্রিমিয়াম কিউরেটেড পিকে স্টোর',
                    '🔒 ১০০% সুরক্ষিত এসক্রো পেমেন্ট',
                    '🚚 দেশজুড়ে দ্রুত লজিস্টিক ডেলিভারি',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs font-medium text-[var(--pm-text)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--pm-bg)]/60 border border-[var(--pm-border)]/60 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>এসক্রো গ্যারান্টি</span>
                </div>
                <p className="text-[10px] text-[var(--pm-text-muted)] leading-snug">
                  ক্রেতা পণ্য বুঝে পাওয়ার পরই বিক্রেতা মূল্য পান। শতভাগ নিরাপদ কেনাকাটা।
                </p>
              </div>
            </aside>

            {/* Centered Realistic Smartphone Frame (Only on desktop/tablet screens, 100% full screen on phones) */}
            <div className="w-full max-w-full md:max-w-[430px] h-full md:h-[88vh] md:max-h-[890px] bg-[var(--pm-surface)] md:rounded-[42px] md:border-[9px] md:border-zinc-800 md:shadow-[0_25px_80px_rgba(0,0,0,0.9)] relative flex flex-col overflow-hidden shrink-0">
              {/* Top Device Notch on Desktop */}
              <div className="hidden md:block w-24 h-4 bg-zinc-800 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50 pointer-events-none" />

              <Navbar onMenuClick={() => setMenuOpen(true)} isVisible={isNavVisible} />
              
              <UnifiedSidebar isMobileDrawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
              <CartDrawer isOpen={isOpen} onClose={close} />
              <NotificationDrawer />
              <LiveChatDrawer />
              <GlobalLocationModal />

              <main ref={mainRef} className="flex-1 pt-[60px] pb-[72px] overflow-y-auto hide-scrollbar">
                {location.pathname !== '/' && <CategoryBar className={`sticky z-40 transition-all duration-300 bg-[var(--pm-bg)]/95 backdrop-blur-xl ${(navBehavior === 'fixed' || isNavVisible) ? 'top-[60px] md:top-[64px]' : 'top-0'}`} />}
                <div className="w-full px-2.5 py-2 max-w-[440px] mx-auto">
                  {children}
                </div>
              </main>

              {/* Mobile Bottom Navigation - Visible on ALL screens in Mobile App Mode */}
              <BottomNav isVisible={isNavVisible} />

              {/* Bottom Home Indicator Bar on Desktop */}
              <div className="hidden md:block w-28 h-1 bg-zinc-600/50 rounded-full mx-auto absolute bottom-1.5 left-1/2 -translate-x-1/2 z-50 pointer-events-none" />
            </div>

            {/* Right Desktop Companion Sidebar (XL Screens only) */}
            <aside className="hidden xl:flex w-72 h-[86vh] flex-col justify-between p-5 rounded-3xl bg-[var(--pm-surface)]/80 backdrop-blur-xl border border-[var(--pm-border)]/80 shadow-2xl">
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--pm-accent)]/15 via-[var(--pm-surface)] to-[var(--pm-accent)]/5 border border-[var(--pm-accent)]/25 space-y-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-[var(--pm-accent)]" />
                    <span className="text-xs font-black text-[var(--pm-text)]">ডেস্কটপ ওয়েব এক্সপেরিয়েন্স</span>
                  </div>
                  <p className="text-[11px] text-[var(--pm-text-muted)] leading-relaxed">
                    ল্যাপটপ বা কম্পিউটারে বড় স্ক্রিনের পুরো সুবিধা নিতে ফুল স্ক্রিন ডেস্কটপ ভিউতে দেখুন।
                  </p>
                  <button
                    onClick={toggleViewMode}
                    className="w-full mt-2 py-2 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white text-xs font-black shadow-sm transition-all active:scale-95 cursor-pointer text-center"
                  >
                    ফুল স্ক্রিন ভিউ চালু করুন →
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--pm-bg)]/80 border border-[var(--pm-border)] space-y-2.5 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-[var(--pm-accent)]">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[var(--pm-text)]">স্মার্টফোনে ব্যবহার করুন</h3>
                    <p className="text-[10px] text-[var(--pm-text-muted)] mt-0.5">
                      মোবাইল ব্রাউজারে paikarmart.com ওপেন করলেই স্বয়ংক্রিয়ভাবে নেটিভ ফুল মোবাইল ভিউ পাবেন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--pm-border)]/40 flex items-center justify-between text-[11px]">
                <a href="tel:09638022222" className="font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> ০9638022222
                </a>
                <button onClick={() => openChat()} className="text-[var(--pm-text-muted)] hover:text-white cursor-pointer font-medium">
                  লাইভ চ্যাট
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}
    </div>
  );
};

export default RootLayout;
