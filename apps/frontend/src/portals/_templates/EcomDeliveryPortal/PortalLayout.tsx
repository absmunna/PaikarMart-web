import React from 'react';
import { motion } from 'motion/react';
import { Search, ShoppingBag, ArrowLeft, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StoryBar } from '@shared/StoryBar';
import { PortalIconBar } from '@shared/PortalIconBar';
import { HeroSpotlight } from '@shared/HeroSpotlight';
import { CategoryNavBar, CategoryFilterItem } from '@shared/CategoryNavBar';
import { cn } from '@/lib/utils';
import { formatBDT } from '@/lib/format';

interface StatLabel {
  label: string;
  val: string;
  icon: React.ComponentType<any>;
}

interface PortalLayoutProps {
  titleEn: string;
  titleBn: string;
  context: 'food' | 'grocery' | 'pharmacy';
  categories: CategoryFilterItem[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  children: React.ReactNode;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  accentColorClass?: string; // e.g. "from-rose-500 to-red-600"
  accentBorderClass?: string; // e.g. "border-rose-500/20"
  accentTextClass?: string; // e.g. "text-rose-400"
  stats?: StatLabel[];
  searchPlaceholderEn?: string;
  searchPlaceholderBn?: string;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({
  titleEn,
  titleBn,
  context,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  children,
  cartCount,
  cartTotal,
  onOpenCart,
  accentColorClass = 'from-rose-500 to-red-600',
  accentBorderClass = 'border-rose-500/20',
  accentTextClass = 'text-rose-400',
  stats = [],
  searchPlaceholderEn = 'Search items...',
  searchPlaceholderBn = 'প্রোডাক্ট খুঁজুন...'
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-32">
      {/* ━━━ HEADER SECTION (Top Priority) ━━━ */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context={context} />
        <PortalIconBar context={context} />
      </section>

      {/* 2nd Element: Category sticky bar */}
      <CategoryNavBar context={context} topOffset="72px" />

      <main className="max-w-6xl mx-auto px-4 md:px-6 pt-6 space-y-6">
        {/* Active Breadcrumb / Title Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white flex items-center gap-2">
                <span className={cn("text-transparent bg-clip-text bg-gradient-to-tr", accentColorClass)}>
                  {titleBn}
                </span>
                <span className="text-zinc-600 font-normal">| {titleEn}</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mt-0.5">
                Powered by Trust Escrow settlement
              </p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          {stats.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {stats.map((st, idx) => {
                const Icon = st.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-bold text-zinc-300"
                  >
                    <Icon className={cn("w-3.5 h-3.5", accentTextClass)} />
                    <span className="text-zinc-500">{st.label}:</span>
                    <span className="text-white font-extrabold">{st.val}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Unified Search & Configurations Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder={`${searchPlaceholderBn} (${searchPlaceholderEn})`}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-white/10 placeholder-zinc-600 transition-all text-ellipsis"
            />
          </div>
          <div className="md:col-span-4 flex gap-3">
            <button className="flex-1 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:text-white transition-all cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
              <span>ফিল্টার (Filters)</span>
            </button>
            <div className="relative shrink-0">
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <button
                onClick={() => navigate('/messages')}
                className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="Aloop Chat Support"
              >
                <Sparkles className="w-4 h-4 text-[var(--pm-accent)]" />
              </button>
            </div>
          </div>
        </div>

        {/* ━━━ HERO SPOTLIGHT (Mid-page) ━━━ */}
        <HeroSpotlight context={context} />

        {/* Dynamic Category Filtering scrolled bar */}
        <div className="border-b border-white/[0.02] pb-2">
          <CategoryNavBar
            items={categories}
            activeFilter={activeCategory}
            onFilterChange={onSelectCategory}
          />
        </div>

        {/* Page children contents */}
        <div className="min-h-[400px]">
          {children}
        </div>
      </main>

      {/* Persistent Floating Sourcing Cart action indicator */}
      {cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
        >
          <div className={cn(
            "p-4 rounded-3xl bg-neutral-950/95 backdrop-blur-xl border flex items-center justify-between shadow-2xl shadow-black/80",
            accentBorderClass
          )}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-gradient-to-tr from-orange-500 to-amber-500 text-black text-[9px] font-black rounded-lg flex items-center justify-center border border-neutral-950 z-20 shadow">
                  {cartCount}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                  <ShoppingBag className="w-5 h-5 text-[var(--pm-accent)] animate-bounce" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Selected Sourcing Items</p>
                <p className="text-sm font-black text-white">{formatBDT(cartTotal)}</p>
              </div>
            </div>

            <button
              id="sticky-cart-btn"
              onClick={onOpenCart}
              className={cn(
                "h-11 px-5 rounded-2xl bg-gradient-to-tr text-black font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md",
                accentColorClass
              )}
            >
              <span>বিস্তারিত দেখুন (View Cart)</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
