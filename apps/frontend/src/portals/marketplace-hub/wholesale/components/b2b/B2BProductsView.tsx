import React, { useMemo } from 'react';
import { 
  Sliders, Search, ShieldCheck, Heart, MessageCircle, FileText, 
  Trash2, Star, Globe, ArrowLeft, Filter, RefreshCw
} from 'lucide-react';
import { useB2BProducts } from '@/modules/b2b';
import { useB2BProductUIStore } from '@/modules/b2b';
import { GlobalSkeletonSystem, SafeFallbackCard } from '@/app/AppShell/GlobalSkeletonSystem';
import { ProductCardSkeleton } from '@/components/ui/ProductCard/ProductCardSkeleton';
import { ProductCard } from '@/design-system/components/ui/ProductCard/ProductCard';

interface B2BProductsViewProps {
  initialCategory?: string;
  initialMoq?: number;
  initialSearch?: string;
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
}

export const B2BProductsView: React.FC<B2BProductsViewProps> = ({ 
  initialCategory = '', 
  initialMoq = 0, 
  initialSearch = '', 
  onNavigate,
  onBack 
}) => {
  const { data: allProducts = [], isLoading, error } = useB2BProducts();
  const { 
    search, category, moq, price, verifiedOnly, exportOnly, savedProducts,
    setSearch, setCategory, setMoq, setPrice, setVerifiedOnly, setExportOnly, toggleSaveProduct, resetUIState
  } = useB2BProductUIStore();

  // Initialize from props if needed, but store is already active. 
  // Maybe just ensure they are set if initial values are provided.
  React.useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    if (initialCategory) setCategory(initialCategory);
    if (initialMoq) setMoq(initialMoq);
  }, [initialSearch, initialCategory, initialMoq, setSearch, setCategory, setMoq]);

  // Reset Filters helper
  const handleReset = () => {
    resetUIState();
  };

  // Toggle Save product
  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveProduct(id);
  };

  // Dynamic filtering
  const filteredProducts = useMemo(() => {
    return allProducts.filter(prod => {
      // search
      if (search && !prod.name.toLowerCase().includes(search.toLowerCase()) && !prod.vendorName.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      // category
      if (category && prod.category !== category) {
        return false;
      }
      // moq (filtered below or equal slider value)
      if (prod.moq > moq) {
        return false;
      }
      // lowest/highest price check against slider base
      const minPrice = Math.min(...prod.tierPrices.map(t => t.price));
      if (minPrice > price) {
        return false;
      }
      // verified only
      if (verifiedOnly && !prod.isVerified) {
        return false;
      }
      // export only
      if (exportOnly && !prod.isExport) {
        return false;
      }
      return true;
    });
  }, [allProducts, search, category, moq, price, verifiedOnly, exportOnly]);

  return (
    <div className="space-y-5">
      {/* Header back & navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">Portal Main</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Bulk showroom ({filteredProducts.length} items)</span>
      </div>

      {/* 2. Search Box */}
      <div className="flex gap-2 rounded-2xl p-2 border"
        style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex-1 flex items-center gap-2 pl-2">
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input
            type="text"
            placeholder="Search within wholesale showrooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]"
          />
        </div>
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-[var(--pm-text-secondary)] pr-2 hover:text-white font-black">
            Clear
          </button>
        )}
      </div>

      {/* 3. Advanced Filter Panel Stack */}
      <div className="p-4 rounded-2xl border space-y-4" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5 col">
            <Filter className="w-3.5 h-3.5 text-[var(--pm-accent)]" /> Trade Sourcing Filters
          </span>
          <button 
            type="button" 
            onClick={handleReset} 
            className="text-[10px] text-rose-400 hover:text-rose-300 font-extrabold flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category SELECT */}
          <div className="space-y-1.5">
            <label className="text-[11px] text-[var(--pm-text-secondary)] font-extrabold">Filter Industry</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-white/5 rounded-xl p-2.5 text-xs text-white border border-white/10 outline-none cursor-pointer"
            >
              <option value="">All Industries</option>
              <option value="garments">Garments & Textiles</option>
              <option value="agro">Agro Foods & Crops</option>
              <option value="electronics">Electronics assembly</option>
              <option value="machinery">Heavy Machinery & Exporters</option>
              <option value="construction">Construction Materials</option>
              <option value="furniture">Furniture mill</option>
              <option value="auto-parts">Auto accessories</option>
            </select>
          </div>

          {/* MOQ maximum limit slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-[var(--pm-text-secondary)]">
              <span>Maximum MOQ</span>
              <span className="text-[var(--pm-accent)] font-black">{moq} Pcs</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={moq}
              onChange={(e) => setMoq(parseInt(e.target.value))}
              className="w-full bg-black/40 accent-[var(--pm-accent)] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Price slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px] font-extrabold text-[var(--pm-text-secondary)]">
              <span>Maximum Pricing Limit</span>
              <span className="text-[var(--pm-accent)] font-black">৳ {price}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="10"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
              className="w-full bg-black/40 accent-[var(--pm-accent)] h-1.5 rounded-lg cursor-pointer"
            />
          </div>

          {/* Verification Toggles */}
          <div className="flex items-center gap-5 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--pm-text)]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-[var(--pm-accent)] accent-[var(--pm-accent)] w-4 h-4"
              />
              <span>Verified Direct Factory</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--pm-text)]">
              <input
                type="checkbox"
                checked={exportOnly}
                onChange={(e) => setExportOnly(e.target.checked)}
                className="rounded text-[var(--pm-accent)] accent-[var(--pm-accent)] w-4 h-4"
              />
              <span className="flex items-center gap-0.5"><Globe className="w-3 h-3 text-cyan-400" /> Export Ready</span>
            </label>
          </div>
        </div>
      </div>

      {/* 4. Product Grid Layout */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <SafeFallbackCard message="Error Loading Products" />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
          <p className="text-sm font-black text-white/50">ভোক্তা বা সেলারের এই ফিল্টারে কোনো হোলসেল স্পেসিফিকেশন পাওয়া যায়নি।</p>
          <button onClick={handleReset} className="px-4 py-2 bg-[var(--pm-accent)] text-white text-xs font-extrabold rounded-xl transition-all">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
          {filteredProducts.map(prod => {
            const minPrice = Math.min(...prod.tierPrices.map(t => t.price));
            return (
              <ProductCard 
                key={prod.id} 
                product={{
                  id: prod.id,
                  name: prod.name,
                  type: 'product',
                  portal: 'wholesale',
                  vendor: prod.vendorName,
                  price: minPrice,
                  image: prod.image,
                  moq: prod.moq,
                  isVerified: prod.isVerified,
                  isExport: prod.isExport
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
