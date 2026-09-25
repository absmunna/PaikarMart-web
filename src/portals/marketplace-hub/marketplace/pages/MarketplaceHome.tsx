import * as React from "react";
import { useState, useMemo } from "react";
import { 
  Search, ShoppingBag, Flame, Zap, ChevronRight, Filter, 
  Layers, Package, MapPin, Building2, TrendingDown, Clock, 
  Sparkles, ShieldCheck, ArrowRight, FileText, Plus, Check, X,
  BadgeAlert, Globe, Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language/LanguageContext";
import { StoryBar } from "@shared/StoryBar";
import { PortalIconBar } from "@shared/PortalIconBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { HeroSpotlight } from "@shared/HeroSpotlight";
import { ProductCard } from "@/components/ui/ProductCard";
import { motion, AnimatePresence } from "motion/react";
import { useProductDataStore } from '@/modules/product/store/useProductDataStore';
import { useB2BRFQStore } from '@/modules/b2b/store/useB2BRFQStore';
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types for Wholesale Layer
interface PriceTier {
  moq: number;
  price: number;
  unit: string;
  label: string;
}

interface WholesaleProduct {
  id: string;
  name: string;
  category: string;
  priceTiers: PriceTier[];
  minOrderQty: number;
  inStock: boolean;
  rating: number;
  reviews?: number;
  supplier: string;
  location: string;
  leadTime: string;
  verified: boolean;
  image: string;
  description: string;
  certification?: string;
}

// B2B Mock Wholesale Products
const B2B_PRODUCTS: WholesaleProduct[] = [
  {
    id: "w1", 
    name: "Ready-Made Garments (Export T-Shirts)", 
    category: "apparel",
    priceTiers: [
      { moq: 100, price: 180, unit: "pcs", label: "Starter" },
      { moq: 500, price: 150, unit: "pcs", label: "Business" },
      { moq: 2000, price: 110, unit: "pcs", label: "Enterprise" },
    ],
    minOrderQty: 100, 
    inStock: true, 
    rating: 4.8, 
    reviews: 312,
    supplier: "Dhaka Garments Ltd.", 
    location: "Gazipur, Dhaka",
    leadTime: "14 days", 
    verified: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&q=80",
    description: "100% combed cotton ready-made T-shirts, premium export quality. Custom brand print & labels accepted.", 
    certification: "BSCI, Oeko-Tex Standard 100",
  },
  {
    id: "w2", 
    name: "Industrial Ceramic Tiles (60x60cm Premium)", 
    category: "raw_materials",
    priceTiers: [
      { moq: 100, price: 85, unit: "sqft", label: "Standard" },
      { moq: 500, price: 70, unit: "sqft", label: "Bulk" },
      { moq: 2000, price: 58, unit: "sqft", label: "Factory direct" },
    ],
    minOrderQty: 100, 
    inStock: true, 
    rating: 4.7, 
    reviews: 189,
    supplier: "Akij Ceramic Industries", 
    location: "Mymensingh, Dhaka",
    leadTime: "7 days", 
    verified: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80",
    description: "High-density ceramic floor tiles with matte anti-slip finish. BSTI & ISO certified for commercial malls.",
  },
  {
    id: "w3", 
    name: "Aromatic Chinigura Rice (50kg Bulk Bags)", 
    category: "raw_materials",
    priceTiers: [
      { moq: 20, price: 3400, unit: "bags", label: "Wholesaler" },
      { moq: 100, price: 3100, unit: "bags", label: "Distributor" },
      { moq: 500, price: 2850, unit: "bags", label: "Mill direct" },
    ],
    minOrderQty: 20, 
    inStock: true, 
    rating: 4.9, 
    reviews: 567,
    supplier: "Nawabganj Automated Rice Mill", 
    location: "Nawabganj, Rajshahi",
    leadTime: "4 days", 
    verified: true,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80",
    description: "Authentic Chinigura aromatic rice, machine-sorted & triple-polished. Excellent smell and grain length.",
  },
  {
    id: "w4", 
    name: "Heavy-Duty PVC Conduit Pipes", 
    category: "packaging",
    priceTiers: [
      { moq: 200, price: 140, unit: "pcs", label: "Standard" },
      { moq: 1000, price: 110, unit: "pcs", label: "Bulk Lot" },
      { moq: 5000, price: 85, unit: "pcs", label: "Industrial" },
    ],
    minOrderQty: 200, 
    inStock: true, 
    rating: 4.6, 
    reviews: 134,
    supplier: "National Plastics BD Ltd.", 
    location: "Narayanganj, Dhaka",
    leadTime: "5 days", 
    verified: false,
    image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=300&q=80",
    description: "Premium durable fire-retardant PVC conduit pipes for electrical wiring and high pressure setups.",
  }
];

// Retail Mock Flash Sales
const FLASH_SALES = [
  { id: "p1", name: "Modern Suede Jacket", price: 1250, originalPrice: 1800, imageUrl: "https://images.unsplash.com/photo-1551028712-03101bb02dd7?w=300&q=80", category: "Fashion", rating: 4.8, sold: 124, portal: 'b2c' },
  { id: "p2", name: "Wireless Bluetooth Buds", price: 890, originalPrice: 1200, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80", category: "Electronics", rating: 4.5, sold: 450, portal: 'b2c' },
];

const JUST_FOR_YOU = [
  { id: "jf1", name: "Leather Formal Shoes", price: 2100, originalPrice: 2800, imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80", category: "Fashion", rating: 4.7, sold: 56, portal: 'b2c' },
  { id: "jf2", name: "Smart Watch Series 7 Mock", price: 3500, originalPrice: 4500, imageUrl: "https://images.unsplash.com/photo-1544117518-30dd07b3c282?w=300&q=80", category: "Electronics", rating: 4.9, sold: 231, portal: 'b2c' },
  { id: "jf3", name: "Premium Coffee Beans", price: 650, originalPrice: 800, imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&q=80", category: "Grocery", rating: 4.6, sold: 12, portal: 'b2c' },
  { id: "jf4", name: "Wall Art Painting", price: 1200, originalPrice: 1500, imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=300&q=80", category: "Home", rating: 4.3, sold: 8, portal: 'b2c' },
];

// Top Bangladesh Verified Manufacturers & Factories
const VERIFIED_FACTORIES = [
  { id: "f1", name: "Apex Garments factory", category: "Apparel & Fashion", location: "Kaliakair, Gazipur", employees: "1,500+", verified: true, rating: 4.9, image: "https://images.unsplash.com/photo-1558441719-ff34b0524a24?w=400&q=80", leadTime: "15-20 days" },
  { id: "f2", name: "M/S Kabir Chemical & Plastic Hub", category: "Plastics & Materials", location: "Chawkbazar, Dhaka", employees: "200+", verified: true, rating: 4.6, image: "https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?w=400&q=80", leadTime: "5-10 days" },
  { id: "f3", name: "Shanta Packaging & Corrugations", category: "Carton & Packaging", location: "Tejgaon, Dhaka", employees: "450+", verified: true, rating: 4.8, image: "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400&q=80", leadTime: "3-5 days" },
];

export function MarketplaceHome() {
  const { isBn } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { products: storeProducts } = useProductDataStore();
  const { rfqs } = useB2BRFQStore();

  // Active layer state: 'retail' | 'wholesale'
  const [layer, setLayer] = useState<'retail' | 'wholesale'>('retail');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Interactive Quote Form Modal state
  const [rfqModal, setRfqModal] = useState<{ product: WholesaleProduct; tier: PriceTier } | null>(null);
  const [quoteQty, setQuoteQty] = useState("");
  const [quoteNote, setQuoteNote] = useState("");
  const [quoteSent, setQuoteSent] = useState(false);

  // Filter products for the retail layer
  const retailProducts = useMemo(() => {
    const retailItems = storeProducts.filter(p => p.portal !== 'b2b' && !p.isNearMe);
    const combined = [...retailItems, ...JUST_FOR_YOU];
    
    // De-duplicate based on ID
    const seen = new Set();
    const unique = combined.filter(item => {
      const id = (item as any).id || (item as any).productId;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return unique.filter((p: any) => 
        (p.name || p.title || "").toLowerCase().includes(q) || 
        (p.category || "").toLowerCase().includes(q)
      );
    }
    return unique;
  }, [storeProducts, searchQuery]);

  // Filter products for the B2B wholesale layer
  const wholesaleProducts = useMemo(() => {
    let filtered = B2B_PRODUCTS;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.supplier.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [categoryFilter, searchQuery]);

  // Handle quote submitting
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteQty || Number(quoteQty) < (rfqModal?.tier.moq || 1)) {
      toast.error(isBn ? `কমপক্ষে ${rfqModal?.tier.moq} পিস অর্ডার কোট করতে হবে!` : `Minimum order qty is ${rfqModal?.tier.moq}!`);
      return;
    }
    setQuoteSent(true);
    toast.success(isBn ? "আপনার রিকোয়েস্ট সফলভাবে সাবমিট করা হয়েছে!" : "Your wholesale RFQ has been successfully sent to supplier!");
  };

  return (
    <div className="min-h-screen bg-[#020604] pb-24 text-white">
      {/* ━━━ PORTAL HOMEPAGE HEADER (Top Priority) ━━━ */}
      <section className="pt-4 space-y-1">
        <StoryBar context="marketplace" />
        <PortalIconBar context="marketplace" />
      </section>

      {/* Search & Segment Header */}
      <div className="sticky top-0 z-50 bg-[#020604]/90 backdrop-blur-md px-4 py-3 border-b border-white/[0.04] mt-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder={
                layer === 'retail'
                  ? (isBn ? "পণ্য বা ব্র্যান্ড খুঁজুন..." : "Search brands or products...")
                  : (isBn ? "পাইকারি সাপ্লাইয়ার বা ফ্যাক্টরি খুঁজুন..." : "Search B2B suppliers, products, factories...")
              }
              className="w-full bg-zinc-900 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-[10px] font-black uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none focus:border-[var(--pm-accent)]/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Layer Segment Control - Highly Crafted */}
        <div className="mt-3 bg-zinc-950 p-1.5 rounded-2xl border border-white/5 flex gap-2">
          <button 
            onClick={() => { setLayer('retail'); setCategoryFilter('all'); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
              layer === 'retail' 
                ? "bg-[var(--pm-accent)]/10 border-[var(--pm-accent)]/30 text-[var(--pm-accent)] shadow-md"
                : "bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300"
            )}
            style={{ minHeight: '44px' }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{isBn ? "খুচরা বাজার (B2C)" : "Retail Commerce"}</span>
          </button>
          
          <button 
            onClick={() => { setLayer('wholesale'); setCategoryFilter('all'); }}
            className={cn(
              "flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2",
              layer === 'wholesale' 
                ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 text-blue-400 shadow-md"
                : "bg-transparent border border-transparent text-zinc-500 hover:text-zinc-300"
            )}
            style={{ minHeight: '44px' }}
          >
            <Layers className="w-4 h-4" />
            <span>{isBn ? "পাইকারি (Wholesale / B2B)" : "Wholesale B2B"}</span>
          </button>
        </div>
      </div>

      {/* Layer Sub-Header */}
      <section className={cn(
        "mt-2 text-center py-4 border-b border-white/[0.03] transition-all",
        layer === 'retail' 
          ? "bg-gradient-to-b from-[var(--pm-accent)]/10 to-transparent" 
          : "bg-gradient-to-b from-blue-950/20 to-transparent"
      )}>
        <div className="flex items-center justify-center gap-2 mb-1">
          {layer === 'retail' ? (
            <>
              <ShoppingBag className="w-5 h-5 text-[var(--pm-accent)]" />
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Retail Universe</h1>
            </>
          ) : (
            <>
              <Layers className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Wholesale Hub</h1>
            </>
          )}
        </div>
        <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
          {layer === 'retail' 
            ? (isBn ? "খুচরা কেনাকাটার ডিজিটাল স্বর্গ" : "Hub for Global & Digital Brands")
            : (isBn ? "বাংলাদেশী সাপ্লায়ার ও ফ্যাক্টরির ডিজিটাল সংযোগ" : "Connecting Bangladesh Factories & Suppliers")}
        </p>
      </section>

      {/* CategoryNavBar - Context-Aware */}
      <CategoryNavBar 
        context={layer} 
        activeFilter={categoryFilter} 
        onFilterChange={(id) => setCategoryFilter(id)} 
        topOffset="136px"
      />

      <div className="px-3 space-y-8 mt-6">
        
        {/* RETAIL COMMERCE LAYER VIEWS */}
        {layer === 'retail' && (
          <>
            {/* Flash Sale */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 text-red-500">
                    <Flame className="w-4 h-4 fill-red-500" />
                    Flash Sale
                  </h2>
                  <div className="flex items-center gap-1">
                    <div className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black">04</div>
                    <span className="text-red-500 font-extrabold">:</span>
                    <div className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black">22</div>
                    <span className="text-red-500 font-extrabold">:</span>
                    <div className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-black">15</div>
                  </div>
                </div>
                <button className="text-[10px] font-black text-[var(--pm-accent)] uppercase flex items-center gap-1 group">
                  {isBn ? "আরও দেখুন" : "See All"} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {FLASH_SALES.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* ━━━ INJECTED HERO SPOTLIGHT (Marketplace context) ━━━ */}
            <div className="my-2 animate-in fade-in zoom-in-95 duration-1000">
              <HeroSpotlight context={layer} />
            </div>

            {/* Just For You Feed */}
            <section>
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="w-1 h-4 bg-[var(--pm-accent)] rounded-full" />
                <h2 className="text-xs font-black text-white uppercase tracking-wider">
                  {isBn ? "শুধু আপনার জন্য" : "Just For You"}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {retailProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* WHOLESALE B2B COMMERCE LAYER VIEWS */}
        {layer === 'wholesale' && (
          <>
            {/* Live Buyer Demands / RFQ Request Feed */}
            <section className="bg-zinc-950 p-4 rounded-3xl border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    {isBn ? "লাইভ বায়ার রিকোয়েস্ট বোর্ড" : "Live Buyer Demands Board"}
                  </h3>
                  <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">
                    {isBn ? "সরাসরি ফ্যাক্টরি কোটেশন জমা দিন" : "Submit factory quotation to live leads"}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/b2b')}
                  className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-1"
                >
                  {isBn ? "পোর্টাল প্রবেশ" : "Open Board"} →
                </button>
              </div>

              <div className="space-y-3.5">
                {rfqs.slice(0, 3).map((rfq) => (
                  <div key={rfq.id} className="p-4 rounded-2xl bg-[#020604] border border-white/[0.04] hover:border-blue-500/20 transition-all flex flex-col gap-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black uppercase tracking-widest">
                          {rfq.category}
                        </span>
                        <span className="flex items-center gap-1 text-[8px] text-zinc-500 font-bold">
                          <MapPin className="w-3 h-3 text-zinc-500" /> {rfq.buyerRegion}
                        </span>
                      </div>
                      <span className="text-[8px] text-zinc-500 font-black uppercase tracking-wider">
                        Deadline: {rfq.deadline}
                      </span>
                    </div>

                    <h4 className="text-[11px] font-black text-zinc-100">{rfq.title}</h4>
                    <p className="text-[10px] text-zinc-400 leading-normal line-clamp-2">{rfq.description}</p>

                    <div className="pt-2 border-t border-white/[0.03] flex items-center justify-between">
                      <div className="flex gap-4">
                        <div className="text-[9px] text-zinc-500 font-bold">
                          {isBn ? "বাজেট:" : "Budget:"} <span className="text-cyan-400 font-black">{rfq.budget}</span>
                        </div>
                        <div className="text-[9px] text-zinc-500 font-bold">
                          {isBn ? "পরিমাণ:" : "Qty:"} <span className="text-zinc-100 font-black">{rfq.quantity} Pcs</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          toast.success(isBn ? "কোটেশন প্যানেল খুলছে..." : "Connecting with B2B Demand workspace...");
                          navigate('/b2b');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white border border-blue-500/20 text-[9px] font-black uppercase tracking-wider transition-all"
                      >
                        {isBn ? "কোট করুন" : "Quote Now"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Verified Manufacturers & Factories */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[var(--pm-accent)]" />
                    {isBn ? "যাচাইকৃত ফ্যাক্টরি ও নির্মাতা" : "Verified Manufacturers"}
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {isBn ? "বাংলাদেশী ১০০% কমপ্লায়েন্ট ফ্যাক্টরি সমূহ" : "Top compliant factories with fast turnaround"}
                  </p>
                </div>
                <button 
                  onClick={() => navigate('/vendors')}
                  className="text-[10px] font-black text-[var(--pm-accent)] uppercase flex items-center gap-1 group"
                >
                  {isBn ? "সব দেখুন" : "View All"} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {VERIFIED_FACTORIES.map((factory) => (
                  <div key={factory.id} className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden hover:border-[var(--pm-accent)]/20 transition-all cursor-pointer" onClick={() => navigate(`/vendors/${factory.id}`)}>
                    <div className="h-32 relative">
                      <img src={factory.image} alt={factory.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                      <div className="absolute top-3 left-3 bg-[var(--pm-accent)]/90 text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-black fill-black" /> Verified Manufacturer
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{factory.category}</span>
                        <span className="flex items-center gap-1 text-[9px] text-amber-400 font-black">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {factory.rating}
                        </span>
                      </div>
                      <h4 className="text-[11.5px] font-black text-zinc-100 uppercase tracking-tight">{factory.name}</h4>
                      <div className="pt-2 border-t border-white/[0.04] flex justify-between text-[9px] text-zinc-500">
                        <span>Loc: <span className="text-zinc-300 font-bold">{factory.location}</span></span>
                        <span>Lead: <span className="text-[var(--pm-accent)] font-extrabold">{factory.leadTime}</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ━━━ INJECTED HERO SPOTLIGHT (Wholesale context) ━━━ */}
            <div className="my-2 animate-in fade-in zoom-in-95 duration-1000">
              <HeroSpotlight context={layer} />
            </div>

            {/* B2B Wholesale Bulk Products Grid */}
            <section>
              <div className="flex items-center gap-3 mb-4 px-1">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <div>
                  <h2 className="text-xs font-black text-white uppercase tracking-wider">
                    {isBn ? "পাইকারি প্রোডাক্ট ডিরেক্টরি" : "Bulk B2B Directory"}
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                    {isBn ? "সর্বনিম্ন অর্ডারের সাথে ফ্যাক্টরি রেট" : "Direct-to-business wholesaling rates"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {wholesaleProducts.map((product) => (
                  <div key={product.id} className="bg-zinc-950 rounded-3xl border border-white/5 overflow-hidden flex flex-col md:flex-row gap-4 p-4 hover:border-blue-500/20 transition-all">
                    {/* Image Area */}
                    <div className="w-full md:w-40 h-40 rounded-2xl overflow-hidden shrink-0 relative bg-zinc-900 border border-white/5">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      {product.verified && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5" /> B2B Verified
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex justify-between items-center text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
                          <span>{product.category}</span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <MapPin className="w-3 h-3 text-blue-400" /> {product.location}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white mt-1 leading-snug">{product.name}</h4>
                        <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1 leading-normal">{product.description}</p>
                      </div>

                      {/* Bulk Tier Prices Container */}
                      <div className="bg-[#020604] border border-white/[0.04] p-3 rounded-2xl space-y-1.5">
                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Wholesale Bulk Pricing</span>
                        <div className="grid grid-cols-3 gap-2">
                          {product.priceTiers.map((tier, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => setRfqModal({ product, tier })}
                              className="p-2 rounded-xl bg-white/[0.02] hover:bg-blue-500/10 border border-white/[0.04] hover:border-blue-500/20 text-center transition-all group"
                            >
                              <p className="text-[8px] text-zinc-500 font-black uppercase tracking-wider group-hover:text-blue-400 transition-colors">{tier.label}</p>
                              <p className="text-[10px] text-white font-extrabold mt-0.5">৳{tier.price}</p>
                              <p className="text-[7px] text-zinc-600 font-medium tracking-tight mt-0.5">MOQ: {tier.moq} {tier.unit}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/[0.03]">
                        <div className="text-[9px] text-zinc-500 font-bold">
                          Supplier: <span className="text-zinc-300 font-black">{product.supplier}</span>
                        </div>
                        <button 
                          onClick={() => setRfqModal({ product, tier: product.priceTiers[0] })}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white font-black text-[10px] rounded-xl uppercase tracking-wider transition-all flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> {isBn ? "কোটেশন পাঠান" : "Inquire Lot"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {wholesaleProducts.length === 0 && (
                  <div className="col-span-2 text-center py-10 text-zinc-500 font-bold text-xs uppercase tracking-widest">
                    {isBn ? "কোনো পণ্য খুঁজে পাওয়া যায়নি!" : "No wholesale products found matching category filter!"}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>

      {/* B2B RFQ POPUP MODAL */}
      <AnimatePresence>
        {rfqModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: 50, scale: 0.95 }} 
              animate={{ y: 0, scale: 1 }} 
              exit={{ y: 50, scale: 0.95 }}
              className="w-full max-w-[500px] bg-zinc-950 border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 flex flex-col max-h-[90vh] text-white"
            >
              {!quoteSent ? (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-1.5 uppercase tracking-wide">
                        <FileText className="w-4 h-4 text-blue-400" />
                        Request For Quotation
                      </h3>
                      <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-0.5">{rfqModal.product.name}</p>
                    </div>
                    <button type="button" onClick={() => setRfqModal(null)}>
                      <X className="w-5 h-5 text-zinc-400 hover:text-white transition-colors" />
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Selected Price tier: {rfqModal.tier.label}</p>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-400">Min Order Qty: {rfqModal.tier.moq} {rfqModal.tier.unit}</span>
                      <span className="text-blue-400 font-black">৳{rfqModal.tier.price}/{rfqModal.tier.unit}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Required Quantity ({rfqModal.tier.unit})</label>
                      <input 
                        type="number" 
                        min={rfqModal.tier.moq} 
                        placeholder={`Min order is ${rfqModal.tier.moq}`}
                        value={quoteQty} 
                        onChange={e => setQuoteQty(e.target.value)}
                        required
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white outline-none focus:border-blue-500/40"
                      />
                      {Number(quoteQty) >= rfqModal.tier.moq && (
                        <p className="text-[9px] text-blue-400 mt-1 font-bold">
                          Estimated Order Value: ৳{(Number(quoteQty) * rfqModal.tier.price).toLocaleString()} BDT
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1.5">Additional customization requirements</label>
                      <textarea 
                        value={quoteNote} 
                        onChange={e => setQuoteNote(e.target.value)} 
                        placeholder="Detail design patterns, certifications required, packaging styles, etc."
                        rows={3} 
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-xs text-white outline-none resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-black text-[11px] uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2"
                  >
                    <FileText className="w-4 h-4" /> Send RFQ to factory
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center"
                  >
                    <Check className="w-8 h-8 text-blue-400" />
                  </motion.div>
                  <div>
                    <h4 className="text-base font-black text-white uppercase tracking-wider">RFQ Sent to Factory!</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 max-w-[240px] mx-auto">
                      {rfqModal.product.supplier} representative will respond on your messages within 4 hours.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setRfqModal(null);
                      setQuoteQty("");
                      setQuoteNote("");
                      setQuoteSent(false);
                    }} 
                    className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-[10px] font-black text-white uppercase tracking-widest"
                  >
                    Close Modal
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MarketplaceHome;
