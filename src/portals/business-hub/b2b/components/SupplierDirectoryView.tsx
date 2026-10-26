import React, { useState, useMemo } from 'react';
import { 
  Building2, Ship, Truck, Globe, Search, ShieldCheck, Star, 
  MapPin, ArrowLeft, CheckCircle2, Award
} from 'lucide-react';
import { MOCK_B2B_VENDORS } from '@/modules/b2b/store/useB2BVendorStore';

interface SupplierDirectoryViewProps {
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
}

export const SupplierDirectoryView: React.FC<SupplierDirectoryViewProps> = ({ onNavigate, onBack }) => {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'supplier' | 'exporter' | 'importer'>('all');

  const filteredSuppliers = useMemo(() => {
    return MOCK_B2B_VENDORS.filter(v => {
      // Filter out 'factory' so this directories covers non-factory or combined trade stakeholders
      if (v.type === 'factory' && activeType !== 'all') {
        return false;
      }
      
      const typeMatch = activeType === 'all' || v.type === activeType;
      const searchMatch = v.name.toLowerCase().includes(search.toLowerCase()) || 
                          v.industry.toLowerCase().includes(search.toLowerCase()) ||
                          v.location.toLowerCase().includes(search.toLowerCase());
      
      return typeMatch && searchMatch;
    });
  }, [search, activeType]);

  const mapTypeLabel = (type: string) => {
    switch (type) {
      case 'factory': return 'Factory Direct';
      case 'exporter': return 'Verified Exporter';
      case 'importer': return 'Bulk Importer';
      default: return 'Wholesale Supplier';
    }
  };

  const mapTypeIcon = (type: string) => {
    switch (type) {
      case 'exporter': return <Globe className="w-3.5 h-3.5 text-cyan-400" />;
      case 'importer': return <Ship className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Truck className="w-3.5 h-3.5 text-orange-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header back & navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">Portal Main</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Trading Registry</span>
      </div>

      {/* 1. Global Directory search bar */}
      <div className="flex gap-2 rounded-2xl p-2 border"
        style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex-1 flex items-center gap-2 pl-2">
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input
            type="text"
            placeholder="Search verified trading entities, exporters..."
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

      {/* 2. Directory Selector Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar p-1 bg-white/5 rounded-2xl gap-1">
        {[
          { id: 'all', name: 'All Traders' },
          { id: 'supplier', name: 'Suppliers' },
          { id: 'exporter', name: 'Exporters' },
          { id: 'importer', name: 'Importers' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveType(cat.id as any)}
            className={`flex-1 text-center py-2 px-3 rounded-xl text-xs font-black whitespace-nowrap ${
              activeType === cat.id 
                ? 'bg-[#1f2833] text-white shadow-sm' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 3. Output List */}
      <div className="space-y-4">
        {filteredSuppliers.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <p className="text-xs font-black text-white/50">এই ট্রেডিং ক্যাটাগরিতে কোনো নিবন্ধিত ব্রোকার পাওয়া যায়নি।</p>
          </div>
        ) : (
          filteredSuppliers.map(sup => (
            <div
              key={sup.id}
              onClick={() => onNavigate(sup.type === 'factory' ? 'factory-profile' : 'factory-profile', sup.id)} // Shared detailed view profile
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-2xl hover:border-[var(--pm-accent)]/30 cursor-pointer transition flex items-start gap-3 relative overflow-hidden group"
            >
              {/* Image logo */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-white/5 bg-black/30">
                <img src={sup.logo} alt={sup.name} className="w-full h-full object-cover group-hover:scale-105 transition-all" referrerPolicy="no-referrer" />
              </div>

              {/* info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1">
                      <span className="inline-flex items-center gap-1 text-[8.5px] font-black text-cyan-400 bg-cyan-500/10 border border-cyan-500/15 px-1.5 py-0.2 rounded uppercase">
                        {mapTypeIcon(sup.type)} {mapTypeLabel(sup.type)}
                      </span>
                      {sup.isVerified && (
                        <span className="text-[7.5px] px-1 py-0.2 bg-orange-500/10 border border-orange-500/15 text-orange-400 rounded font-black flex items-center uppercase">
                          <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {sup.rating}
                    </span>
                  </div>

                  <h3 className="text-xs font-black text-white group-hover:text-[var(--pm-accent)] transition mt-1.5 truncate leading-tight">
                    {sup.name}
                  </h3>
                  
                  <p className="text-[10px] text-[var(--pm-text-secondary)] font-medium flex items-center gap-1 mt-0.5 truncate leading-normal">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" /> {sup.location}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[10px] text-[var(--pm-text-secondary)]">
                  <span>Specialty: <span className="text-white font-extrabold">{sup.industry}</span></span>
                  <span>Est: <span className="text-white font-bold">{sup.establishedYear}</span></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
