import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Factory, Store, MapPin, Users, ArrowDown, ArrowRight,
  Globe, Truck, Wallet, BarChart3, ShieldCheck, Package,
  CheckCircle2, Zap, ChevronRight, BadgePercent, Info, BellRing, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";

// Import modular B2B sub-components (new add)
import { B2BHomeView } from "@/portals/business-hub/b2b/components/B2BHomeView";
import { B2BProductsView } from "@/portals/business-hub/b2b/components/B2BProductsView";
import { B2BProductDetailView } from "@/portals/business-hub/b2b/components/B2BProductDetailView";
import { FactoryDirectoryView } from "@/portals/business-hub/b2b/components/FactoryDirectoryView";
import { FactoryProfileView } from "@/portals/business-hub/b2b/components/FactoryProfileView";
import { SupplierDirectoryView } from "@/portals/business-hub/b2b/components/SupplierDirectoryView";
import { RFQMarketplaceView } from "@/portals/business-hub/b2b/components/RFQMarketplaceView";
import { RFQDetailView } from "@/portals/business-hub/b2b/components/RFQDetailView";
import { B2BTradeFeedView } from "@/portals/business-hub/b2b/components/B2BTradeFeedView";

const CHAIN_STEPS = [
  {
    id: 1, label: "কারখানা", sublabel: "Factory / Manufacturer",
    icon: Factory, color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30", textColor: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(34,211,238,0.15)]",
    desc: "পণ্য উৎপাদন করে পাইকারদের কাছে পাঠায়",
    features: ["Export license verified", "Bulk supply", "B2B invoice"],
    href: "/auth/factory-register", cta: "Factory Register",
  },
  {
    id: 2, label: "পাইকারি বিক্রেতা", sublabel: "Wholesale · Islampur / Khatunganj",
    icon: Store, color: "from-cyan-500/20 to-teal-600/20",
    border: "border-cyan-500/30", textColor: "text-cyan-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    desc: "কারখানা থেকে বাল্কে কিনে খুচরা ও গ্রামীণ বিক্রেতাদের কাছে সরবরাহ করে",
    features: ["Price tiers (MOQ)", "Factory sourcing", "Order tracking"],
    href: "/auth/wholesale-register", cta: "Wholesale Register",
  },
  {
    id: 3, label: "গ্রামীণ দোকানদার", sublabel: "Rural Shopkeeper · হাটবাজার",
    icon: MapPin, color: "from-amber-500/20 to-orange-600/20",
    border: "border-amber-500/30", textColor: "text-amber-400",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
    desc: "স্থানীয় হাটবাজারে বিক্রি করে, অনলাইনে গ্রাহকদের কাছ থেকে অর্ডার নেয়",
    features: ["Hat-day schedule", "Local area orders", "Cash on delivery"],
    href: "/auth/rural-register", cta: "Rural Register",
  },
  {
    id: 4, label: "গ্রাহক", sublabel: "Customer · Local Buyer",
    icon: Users, color: "from-purple-500/20 to-pink-600/20",
    border: "border-purple-500/30", textColor: "text-purple-400",
    glow: "shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    desc: "লোকেশন অনুযায়ী কাছের দোকান, দাম, ও পণ্য খুঁজে অর্ডার দেয়",
    features: ["Location-based search", "Price comparison", "Order tracking"],
    href: "/local", cta: "কাছের দোকান খুঁজুন",
  },
];

const FOUR_MODELS = [
  {
    Icon: Package, title: "সেলার রেজিস্ট্রেশন ও পণ্য লিস্টিং",
    color: "text-cyan-400", bg: "bg-cyan-500/8", border: "border-cyan-500/20",
    points: [
      "কারখানা / পাইকারি / গ্রামীণ — তিনটি আলাদা রেজিস্ট্রেশন ফর্ম",
      "পণ্য আপলোড, দাম ও স্টক আপডেট",
      "Price tier সিস্টেম (MOQ ভিত্তিক ছাড়)",
      "ফ্যাক্টরি সোর্স লিংকিং",
    ],
  },
  {
    Icon: Truck, title: "ডাইনামিক লজিস্টিক ক্যালকুলেশন",
    color: "text-cyan-400", bg: "bg-cyan-500/8", border: "border-cyan-500/20",
    points: [
      "দূরত্ব ও ওজন ভিত্তিক ডেলিভারি চার্জ",
      "Google Maps Distance Matrix API",
      "রোড ফ্রেইট রেট: ৳৬-১২/টন-কিমি",
      "পিকআপ পয়েন্ট → গন্তব্য অটো ক্যালকুলেট",
    ],
  },
  {
    Icon: Zap, title: "ফিল্টারিং ও রাইডার ম্যাচিং",
    color: "text-amber-400", bg: "bg-amber-500/8", border: "border-amber-500/20",
    points: [
      "রাইড নিজের গন্তব্য অনুযায়ী পিকআপ খুঁজে",
      "লোকেশন রেডিয়াস ফিল্টার",
      "ডেলিভারি রিকোয়েস্ট ম্যাচিং বোর্ড",
      "রিয়েল-টাইম স্ট্যাটাস আপডেট",
    ],
  },
  {
    Icon: BadgePercent, title: "কমিশন ও পেমেন্ট মডেল",
    color: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/20",
    points: [
      "Factory→Wholesale: ৩% প্ল্যাটফর্ম ফি",
      "Wholesale→Rural: ৫% কমিশন",
      "Rural→Customer: ৮% কমিশন",
      "bKash / Nagad / Bank — সব পদ্ধতি",
    ],
  },
];

const COMMISSION_FLOW = [
  { from: "কারখানা",    to: "পাইকারি",   rate: "৩%",  color: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/25" },
  { from: "পাইকারি",    to: "গ্রামীণ",   rate: "৫%",  color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/25" },
  { from: "গ্রামীণ",    to: "গ্রাহক",    rate: "৮%",  color: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/25" },
  { from: "সব লেনদেন", to: "প্ল্যাটফর্ম", rate: "২%", color: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/25" },
];

export default function B2BHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Custom router state inside B2B Portal
  const [view, setViewState] = useState<{ type: string; id?: string }>({
    type: searchParams.get('v') || 'home',
    id: searchParams.get('id') || undefined
  });

  // State to pass advanced search entries from home form directly into filters
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchMoq, setSearchMoq] = useState<number>(0);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);

  // Sync state with SearchParams
  useEffect(() => {
    const v = searchParams.get('v') || 'home';
    const id = searchParams.get('id') || undefined;
    setViewState({ type: v, id });
  }, [searchParams]);

  const handleNavigate = (newType: string, id?: string) => {
    setViewState({ type: newType, id });
    const params: any = { v: newType };
    if (id) params.id = id;
    setSearchParams(params);
    // Scroll to top of the screen comfortably
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTransfer = (query: string, cat: string, moq: number) => {
    setSearchQuery(query);
    setSearchCategory(cat);
    setSearchMoq(moq);
    handleNavigate('products');
  };

  const triggerNotify = (msg: string, type: 'success' | 'warning' | 'error') => {
    setToast({ message: msg, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Nav Bar categories list
  const navTabs = [
    { id: 'home', label: 'B2B Home', bn: 'পাইকারি হোম' },
    { id: 'products', label: 'Showrooms', bn: 'শো-রুম' },
    { id: 'factories', label: 'Factories', bn: 'ফ্যাক্টরি' },
    { id: 'directory', label: 'Traders', bn: 'আমদানিকারক' },
    { id: 'rfq', label: 'RFQ Engine', bn: 'অনুরোধ' },
    { id: 'feed', label: 'Trade Feed', bn: 'ইন্ডাস্ট্রি ফিড' },
    { id: 'rules', label: 'Info Desk', bn: 'নিয়মাবলী' },
  ];

  return (
    <div className="w-full max-w-[480px] md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-28 text-[var(--pm-text)] flex flex-col gap-0 pt-16 min-h-screen bg-[var(--pm-bg)] transition-all duration-300">
      
      {/* ━━━ HERO ZONE: Stories ━━━ */}
      <section className="pt-3">
        <StoryBar context="wholesale" />
      </section>

      {/* ━━━ STICKY NAV HUB (SUB ROUTER TABS + PORTAL BAR) ━━━ */}
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/95 backdrop-blur-md border-b border-white/[0.08] mt-2 -mx-4 px-4 pb-2 pt-1.5 flex flex-col gap-2">
        {/* Sub Router Selection Tabs (Top) */}
        <div className="flex overflow-x-auto hide-scrollbar gap-2 border-b border-white/[0.06] pb-2">
          {navTabs.map(tab => {
            const isActive = view.type === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavigate(tab.id)}
                className={cn(
                  "px-3.5 py-1 rounded-full text-[10px] font-black tracking-wide whitespace-nowrap transition-all uppercase",
                  isActive 
                    ? "bg-[var(--pm-accent)] text-white shadow-md scale-[1.02]" 
                    : "bg-white/5 text-[var(--pm-text-secondary)] border border-white/5 hover:text-white hover:bg-white/10"
                )}
              >
                {tab.bn}
              </button>
            );
          })}
        </div>

        {/* Top Category Portals (Bottom) */}
        <CategoryNavBar context="wholesale" />
      </div>

      {/* ━━━ PORTAL BROADCAST FLOATING NOTICE BOARD ━━━ */}
      <div className="my-3 p-3 bg-linear-to-r from-teal-950/20 to-blue-950/10 border border-teal-500/10 rounded-2xl flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2 min-w-0">
          <BellRing className="w-4 h-4 text-teal-400 shrink-0 animate-pulse" />
          <p className="text-[10px] text-white/70 truncate">
            <span className="font-extrabold text-[var(--pm-accent)]">[লাইভ]</span> নারায়ণগঞ্জ নিটওয়্যারে জ্যাকার্ড উইভিং রোল স্টক Clearance!
          </p>
        </div>
        <span 
          onClick={() => handleNavigate('products')} 
          className="text-[9px] text-teal-400 underline font-extrabold cursor-pointer shrink-0 uppercase"
        >
          Check
        </span>
      </div>

      {/* ━━━ VIEW ENGINE CONDITIONAL PORTS ━━━ */}
      <div className="flex flex-col gap-6 pt-2">
        {/* VIEW 1: B2B Home */}
        {view.type === 'home' && (
          <B2BHomeView 
            onNavigate={handleNavigate} 
            onSearch={handleSearchTransfer} 
          />
        )}

        {/* VIEW 2: B2B Showroom Listing */}
        {view.type === 'products' && (
          <B2BProductsView 
            initialCategory={searchCategory}
            initialMoq={searchMoq}
            initialSearch={searchQuery}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 3: Granular bulk detail view */}
        {view.type === 'product-detail' && view.id && (
          <B2BProductDetailView 
            productId={view.id}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('products')}
            onNotify={triggerNotify}
          />
        )}

        {/* VIEW 4: Millers Directory */}
        {view.type === 'factories' && (
          <FactoryDirectoryView 
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 5: Deep industrial corporate profiling */}
        {view.type === 'factory-profile' && view.id && (
          <FactoryProfileView 
            factoryId={view.id}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('factories')}
            onNotify={triggerNotify}
          />
        )}

        {/* VIEW 6: Combined importer supplier boards */}
        {view.type === 'directory' && (
          <SupplierDirectoryView 
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 7: RFQ Marketplace boards */}
        {view.type === 'rfq' && (
          <RFQMarketplaceView 
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
            onNotify={triggerNotify}
          />
        )}

        {/* VIEW 8: Detail of RFQ bids */}
        {view.type === 'rfq-detail' && view.id && (
          <RFQDetailView 
            rfqId={view.id}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('rfq')}
            onNotify={triggerNotify}
          />
        )}

        {/* VIEW 9: Social trading announcements */}
        {view.type === 'feed' && (
          <B2BTradeFeedView 
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('home')}
            onNotify={triggerNotify}
          />
        )}

        {/* VIEW 10: Original Guide Page / Info Desk */}
        {view.type === 'rules' && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-br from-[var(--pm-bg)] via-[var(--pm-surface)] to-[var(--pm-bg)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.06)_0%,transparent_65%)]" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-5 w-5 text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">PaikarMart B2B Guide</span>
                </div>
                <h1 className="text-xl font-extrabold text-white leading-tight mb-2">
                  বাংলাদেশের সম্পূর্ণ ডিজিটাল সাপ্লাই চেইন
                </h1>
                <p className="text-xs text-white/55 leading-relaxed">
                  কারখানা থেকে গ্রামীণ দোকান পর্যন্ত — প্রতিটি স্তর ডিজিটালি সংযুক্ত। স্বচ্ছ মূল্য, অটো লজিস্টিক, এবং রিয়েল-টাইম ট্র্যাকিং।
                </p>
              </div>
            </div>

            {/* Supply chain flow */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-1.5">
                <ArrowDown className="h-4 w-4 text-cyan-400" /> সাপ্লাই চেইন ফ্লো
              </h2>
              <div className="flex flex-col gap-2.5">
                {CHAIN_STEPS.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.id} className="space-y-1">
                      <GlassCard className={cn("p-4 border transition-all hover:scale-[1.01] bg-white/5", s.border, s.glow)} hoverEffect>
                        <div className="flex items-start gap-4">
                          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", s.color)}>
                            <Icon className={cn("h-5 w-5", s.textColor)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={cn("text-xs font-bold uppercase tracking-wider", s.textColor)}>স্তর {s.id}</span>
                                  <h3 className="font-bold text-white text-xs">{s.label}</h3>
                                </div>
                                <p className="text-[10px] text-white/40 mt-0.5">{s.sublabel}</p>
                              </div>
                            </div>
                            <p className="text-[11px] text-white/55 mt-2 leading-relaxed">{s.desc}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {s.features.map(f => (
                                <span key={f} className="flex items-center gap-1 text-[9px] text-white/40">
                                  <CheckCircle2 className="h-2.5 w-2.5 text-cyan-400 shrink-0" />{f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                      {i < CHAIN_STEPS.length - 1 && (
                        <div className="flex items-center justify-center py-1">
                          <div className="flex flex-col items-center gap-0.5">
                            <div className="h-3 w-px bg-white/15" />
                            <ArrowDown className="h-3.5 w-3.5 text-white/20" />
                            <div className="h-1 w-px bg-white/10" />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4 Core Models */}
            <div className="space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#c5c6c7] flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-cyan-400" /> চারটি মূল মডেল
              </h2>
              <div className="grid grid-cols-1 gap-3.5">
                {FOUR_MODELS.map(({ Icon, title, color, bg, border, points }) => (
                  <div key={title} className={cn("rounded-2xl border p-4.5", bg, border)}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={cn("h-4 w-4", color)} />
                      <h3 className={cn("font-semibold text-xs", color)}>{title}</h3>
                    </div>
                    <ul className="space-y-1.5">
                      {points.map(p => (
                        <li key={p} className="flex items-start gap-2 text-[11px] text-white/60">
                          <span className="text-white/25 mt-0.5 shrink-0">•</span>{p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Commission model */}
            <GlassCard className="p-4 border border-white/[0.07] bg-white/5 space-y-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#c5c6c7] flex items-center gap-1.5">
                <BadgePercent className="h-4 w-4 text-purple-400" /> কমিশন ও ফি কাঠামো
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {COMMISSION_FLOW.map(({ from, to, rate, color, bg, border }) => (
                  <div key={from + to} className={cn("rounded-xl border p-3 text-center bg-black/20", bg, border)}>
                    <div className={cn("text-xl font-black mb-1", color)}>{rate}</div>
                    <div className="text-[9px] text-white/35 uppercase tracking-wider">ট্যারিফ রেট</div>
                    <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-white/55">
                      <span>{from}</span>
                      <ArrowRight className="h-3 w-3 text-white/25" />
                      <span>{to}</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/35 leading-relaxed pt-1">
                প্রতিটি লেনদেনে প্ল্যাটফর্ম কমিশন স্বয়ংক্রিয়ভাবে কেটে নেওয়া হয়। বিক্রেতারা তাদের নেট পেমেন্ট ড্যাশবোর্ডে দেখতে পাবেন।
              </p>
            </GlassCard>

            {/* Verification */}
            <div className="p-4.5 rounded-2xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-600/5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-5 w-5 text-cyan-400" />
                <h3 className="font-semibold text-white text-xs">যাচাইকরণ প্রক্রিয়া</h3>
              </div>
              <div className="space-y-3">
                {[
                  { step: "১", title: "আবেদন করুন", desc: "রেজিস্ট্রেশন ফর্ম পূরণ করুন — ট্রেড লাইসেন্স ও NID দিয়ে" },
                  { step: "২", title: "যাচাই ২৪ঘণ্টা", desc: "এডমিন টিম তথ্য যাচাই করবে। প্রয়োজনে ডকুমেন্ট চাওয়া হবে" },
                  { step: "৩", title: "সক্রিয় অ্যাকাউন্ট", desc: "অনুমোদনের পর ড্যাশবোর্ড সক্রিয় হবে, পণ্য আপলোড করতে পারবেন" },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-3">
                    <div className="h-6 w-6 rounded-full bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center text-[10px] font-bold text-cyan-400 shrink-0">{step}</div>
                    <div>
                      <div className="text-xs font-semibold text-white">{title}</div>
                      <div className="text-[10px] text-white/45 leading-relaxed mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ━━━ GLOBAL TOAST RENDER DESK ━━━ */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
          <div className={cn(
            "p-3.5 rounded-2xl border shadow-lg backdrop-blur-md flex items-center gap-2.5 transition-all animate-in fade-in-50 slide-in-from-bottom-5",
            toast.type === 'success' ? "bg-cyan-950/90 text-cyan-300 border-cyan-500/30" : 
            toast.type === 'warning' ? "bg-amber-950/90 text-amber-300 border-amber-500/30" : 
                                      "bg-rose-950/90 text-rose-300 border-rose-500/30"
          )}>
            <Info className="w-4 h-4 shrink-0" />
            <p className="text-xs font-extrabold leading-normal">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
