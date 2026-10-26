import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Factory, Sprout, Cpu, Settings, 
  HardHat, Armchair, Wrench, Star, ArrowRight, Zap, PlusCircle, 
  MapPin, CheckCircle2, MessageCircle, FileText
} from 'lucide-react';
import { B2B_CATEGORIES } from '@/modules/b2b/constants/b2bConstants';
import { MOCK_B2B_PRODUCTS } from '@/modules/b2b/store/useB2BProductDataStore';
import { MOCK_B2B_VENDORS } from '@/modules/b2b/store/useB2BVendorStore';
import { MOCK_B2B_RFQS } from '@/modules/b2b/store/useB2BRFQStore';
import { MOCK_B2B_POSTS } from '@/modules/b2b/store/useB2BFeedStore';
import { B2BProduct, B2BVendor } from '@/modules/b2b/types/b2bTypes';

interface B2BHomeViewProps {
  onNavigate: (view: string, id?: string) => void;
  onSearch: (query: string, category: string, moq: number) => void;
}

export const B2BHomeView: React.FC<B2BHomeViewProps> = ({ onNavigate, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [moqShortcut, setMoqShortcut] = useState<number | null>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedCategory === 'all' ? '' : selectedCategory, moqShortcut || 0);
  };

  const mapIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shirt': return <Cpu className="w-5 h-5 text-sky-400" />; // Fallback wrapper
      case 'Sprout': return <Sprout className="w-5 h-5 text-cyan-400" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-400" />;
      case 'Settings': return <Settings className="w-5 h-5 text-[#f59e0b]" />;
      case 'HardHat': return <HardHat className="w-5 h-5 text-amber-500" />;
      case 'Armchair': return <Armchair className="w-5 h-5 text-orange-400" />;
      case 'Wrench': return <Wrench className="w-5 h-5 text-rose-400" />;
      default: return <Factory className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Global B2B Search bar */}
      <form onSubmit={handleSearchSubmit} className="space-y-2.5">
        <div className="flex gap-2 rounded-2xl p-2 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <div className="flex items-center gap-1.5 px-2 bg-white/5 rounded-xl border border-white/5 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-[var(--pm-text-secondary)] font-extrabold outline-none py-1.5 cursor-pointer"
            >
              <option value="all" className="bg-[#111] text-xs">All Categories</option>
              {B2B_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id} className="bg-[#111] text-xs">{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 flex items-center gap-2 pl-1">
            <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
            <input
              type="text"
              placeholder="Search wholesale products, factories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]"
            />
          </div>
          <button type="submit" className="px-4.5 py-2 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold rounded-xl text-xs transition-colors shrink-0">
            Search
          </button>
        </div>

        {/* MOQ shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar text-[11px] pb-1">
          <span className="text-[var(--pm-text-secondary)] font-semibold whitespace-nowrap">MOQ Selectors:</span>
          {[
            { label: 'Any MOQ', value: null },
            { label: 'MOQ ≤ 50', value: 50 },
            { label: 'MOQ ≤ 100', value: 100 },
            { label: 'MOQ ≤ 500', value: 500 }
          ].map((sh, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setMoqShortcut(sh.value);
                onSearch(searchQuery, selectedCategory === 'all' ? '' : selectedCategory, sh.value || 0);
              }}
              className={`px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                moqShortcut === sh.value
                  ? 'bg-[var(--pm-accent)]/20 border-[var(--pm-accent)] text-[var(--pm-accent)] font-extrabold'
                  : 'bg-[var(--pm-glass)] border-white/5 text-[var(--pm-text-secondary)]'
              }`}
            >
              {sh.label}
            </button>
          ))}
        </div>
      </form>

      {/* 2. Hero Section / Wholesale Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] p-5.5 bg-gradient-to-br from-[var(--pm-bg)] via-[var(--pm-surface)] to-[var(--pm-bg)] shadow-lg">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--pm-accent)]/8 blur-3xl rounded-full" />
        <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] text-[9px] font-extrabold tracking-widest uppercase border border-[var(--pm-accent)]/20 mb-2">
              <Zap className="w-3 h-3 animate-pulse" /> Bangladesh Industrial Hub
            </span>
            <h2 className="text-xl font-black text-white leading-tight">
              Global Wholesale & <br />
              <span className="text-[var(--pm-accent)]">Factory Direct Sourcing</span>
            </h2>
            <p className="text-[11px] text-[var(--pm-text-secondary)] mt-1.5 leading-relaxed">
              Connect directly with verified industrial manufacturers and importers. Best MOQ rates and custom B2B trade assurance guaranteed.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('rfq')}
              className="flex-1 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:from-teal-400 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" /> Post Quick RFQ
            </button>
            <button
              onClick={() => onNavigate('directory')}
              className="flex-1 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 text-white font-bold text-xs rounded-xl transition-all"
            >
              Wholesale Directories
            </button>
          </div>
        </div>
      </div>

      {/* 2. Factory Spotlight Carousel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase">Factory Spotlight</h3>
          <button onClick={() => onNavigate('factories')} className="text-[11px] text-[var(--pm-accent)] font-extrabold flex items-center gap-1 hover:underline">
            All Factories <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1.5 -mx-1 px-1">
          {MOCK_B2B_VENDORS.filter(v => v.type === 'factory').map(fac => (
            <div
              key={fac.id}
              onClick={() => onNavigate('factory-profile', fac.id)}
              className="w-56 shrink-0 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--pm-accent)]/30 transition-all shadow-sm"
            >
              <div className="h-20 w-full relative">
                <img src={fac.banner} alt={fac.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-orange-600/90 text-white text-[8px] font-black tracking-wider uppercase flex items-center gap-0.5 shadow-sm">
                  <ShieldCheck className="w-2.5 h-2.5" /> VERIFIED
                </div>
              </div>
              <div className="p-3 space-y-1.5">
                <h4 className="text-xs font-black text-[var(--pm-text)] line-clamp-1 leading-snug">{fac.name}</h4>
                <div className="flex items-center justify-between text-[10px] text-[var(--pm-text-secondary)] font-semibold">
                  <span>{fac.location.split(',')[1] || fac.location}</span>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    <Star className="w-3 h-3 fill-amber-400 shrink-0" />
                    <span>{fac.rating}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 pt-1 border-t border-white/5">
                  <span className="text-[7.5px] px-1.5 py-0.5 bg-blue-500/10 text-cyan-400 border border-cyan-500/15 font-black uppercase rounded">
                    Direct Mill
                  </span>
                  {fac.exportMarkets?.slice(0, 2).map(m => (
                    <span key={m} className="text-[7.5px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 font-black uppercase rounded">
                      Exp: {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Bulk Deals Feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase">Bulk Sourcing & Deals</h3>
        <div className="grid grid-cols-2 gap-3">
          {MOCK_B2B_PRODUCTS.slice(0, 4).map(prod => (
            <div
              key={prod.id}
              onClick={() => onNavigate('product-detail', prod.id)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl overflow-hidden cursor-pointer hover:border-[var(--pm-accent)]/30 hover:scale-[1.01] transition-all p-2.5 flex flex-col justify-between space-y-2.5"
            >
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-black/10">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[8px] font-black tracking-wider uppercase border border-white/10 [referrerPolicy='no-referrer']">
                  MOQ: {prod.moq}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[8px] px-1 py-0.2 bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] font-extrabold rounded">
                    {prod.category.toUpperCase()}
                  </span>
                  {prod.isExport && (
                    <span className="text-[8px] px-1 py-0.2 bg-cyan-500/10 text-cyan-400 font-extrabold rounded">
                      EXPORT
                    </span>
                  )}
                </div>
                <h4 className="text-xs font-black text-[var(--pm-text)] line-clamp-2 leading-snug">{prod.name}</h4>
                <div className="pt-1.5 flex items-end justify-between border-t border-white/5">
                  <div className="flex flex-col">
                    <span className="text-[8px] text-[var(--pm-text-secondary)] leading-none uppercase">Lowest Tier</span>
                    <span className="text-xs font-black text-[var(--pm-accent)] mt-0.5">৳ {prod.tierPrices[prod.tierPrices.length - 1].price}</span>
                  </div>
                  <span className="text-[9px] text-[var(--pm-text-secondary)] underline font-bold leading-normal">Details</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Active RFQs & Trade Announcements snippet */}
      <div className="p-4 rounded-2xl border" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
          <h4 className="text-xs font-black tracking-wider text-[var(--pm-text)] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Active Buyers RFQ
          </h4>
          <span onClick={() => onNavigate('rfq')} className="text-[9px] text-[var(--pm-accent)] font-extrabold hover:underline cursor-pointer">
            Browse All {MOCK_B2B_RFQS.length} RFQs
          </span>
        </div>
        <div className="space-y-2.5">
          {MOCK_B2B_RFQS.slice(0, 2).map(rfq => (
            <div
              key={rfq.id}
              onClick={() => onNavigate('rfq-detail', rfq.id)}
              className="p-3 bg-white/5 hover:bg-white/8 rounded-xl border border-white/5 cursor-pointer transition-all flex justify-between gap-3"
            >
              <div className="min-w-0">
                <h5 className="text-xs font-black text-white line-clamp-1 leading-snug">{rfq.title}</h5>
                <span className="text-[9px] text-[var(--pm-text-muted)] mt-0.5 block">{rfq.buyerRegion} · Qty: {rfq.quantity} {rfq.unit}</span>
              </div>
              <div className="text-right shrink-0 self-center">
                <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 px-1.5 py-0.5 rounded font-black uppercase">
                  ACTIVE
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. CTA / Post RFQ Section */}
      <div className="p-5.5 rounded-3xl text-center border bg-linear-to-br from-[var(--pm-surface)] to-[var(--pm-surface)]/20 text-[var(--pm-text)]" style={{ borderColor: "var(--pm-border)" }}>
        <h3 className="text-base font-black text-white leading-tight">Can't Find Your Wholesale Product?</h3>
        <p className="text-xs text-[var(--pm-text-secondary)] mt-1 mb-4 leading-relaxed">
          Submit a Request for Quotation (RFQ) and let hundreds of verified factories bid directly with custom quotes.
        </p>
        <button
          onClick={() => onNavigate('rfq')}
          className="px-6 py-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/95 text-white font-extrabold text-xs tracking-wider rounded-full transition-all active:scale-95 shadow-lg shadow-[var(--pm-accent)]/20"
        >
          POST RFQ PROPOSAL NOW
        </button>
      </div>
    </div>
  );
};
