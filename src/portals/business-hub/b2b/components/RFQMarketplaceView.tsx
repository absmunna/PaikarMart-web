import React, { useState } from 'react';
import { 
  FileText, Search, Plus, ThumbsUp, MapPin, Calendar, 
  Trash2, User, HelpCircle, CheckCircle, ArrowLeft, Filter, Sparkles
} from 'lucide-react';
import { useB2BRFQStore } from '@/modules/b2b/store/useB2BRFQStore';
import { RFQ } from '@/modules/b2b/types/b2bTypes';

interface RFQMarketplaceViewProps {
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export const RFQMarketplaceView: React.FC<RFQMarketplaceViewProps> = ({ 
  onNavigate, 
  onBack,
  onNotify
}) => {
  const { rfqs, addRFQ } = useB2BRFQStore();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Open Post RFQ Modal state
  const [showPostModal, setShowPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('garments');
  const [newQty, setNewQty] = useState<number>(100);
  const [newUnit, setNewUnit] = useState('Pcs');
  const [newBudget, setNewBudget] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDeadline, setNewDeadline] = useState('');

  const handlePostRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBudget.trim() || !newDesc.trim()) {
      onNotify('সবগুলো প্রয়োজনীয় ফিল্ড পূরণ করুন!', 'warning');
      return;
    }

    const added: RFQ = {
      id: `custom-rfq-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      quantity: newQty,
      unit: newUnit,
      budget: newBudget,
      deadline: newDeadline || '২০২৬-০৮-৩০',
      description: newDesc,
      buyerName: 'মেসার্স নিজ ট্রেডার্স (Self)',
      buyerRegion: 'Dhaka, Bangladesh',
      status: 'Open',
      date: 'আজকে',
      quotes: []
    };

    addRFQ(added);
    onNotify('আপনার নতুন RFQ সাকসেসফুলি পোস্ট করা হয়েছে!', 'success');
    setShowPostModal(false);

    // reset
    setNewTitle('');
    setNewBudget('');
    setNewDesc('');
    setNewDeadline('');
  };

  const filteredRfqs = rfqs.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                          r.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || r.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* Header back & navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">Portal Main</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Demand Engine</span>
      </div>

      {/* 1. Header Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-950/40 via-blue-950/20 to-transparent border border-white/5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" /> Live RFQ Marketplace
          </h2>
          <p className="text-[10px] text-white/50 leading-relaxed mt-0.5">
            এখানে খুচরা ক্রেতারা তাদের নিজস্ব ডিক্লারেশন এবং বাজেট এ পণ্যের রিকোয়ারমেন্ট আপলোড করেন। সরাসরি বিড বা কোট করে ফ্যাক্টরি অর্ডার বুক করুন।
          </p>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2.5 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold text-[10.5px] rounded-xl flex items-center gap-1 shrink-0 shadow-lg tracking-wider"
        >
          <Plus className="w-4 h-4" /> POST RFQ
        </button>
      </div>

      {/* 2. Direct Post RFQ inline form/Modal */}
      {showPostModal && (
        <div className="p-5.5 rounded-3xl border space-y-4" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Write RFQ Specification</h3>
            <button onClick={() => setShowPostModal(false)} className="text-xs text-rose-400 font-extrabold hover:underline">
              Cancel
            </button>
          </div>

          <form onSubmit={handlePostRFQSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[10px] text-white/60 font-black uppercase">Product Needed / Title *</label>
              <input
                type="text"
                placeholder="যেমন: ১০,০০০ গজ কম্বড কটন ফেব্রিক্স সোর্সিং"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-white/60 font-black uppercase">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="garments">Garments & Textiles</option>
                  <option value="agro">Agro & Foods</option>
                  <option value="electronics">Electronics assembly</option>
                  <option value="machinery">Heavy Machinery/Exporters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/60 font-black uppercase">Target Budget Range *</label>
                <input
                  type="text"
                  placeholder="যেমন: ৳ ১৫০ - ১৭০ /পিস"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 col-span-2">
                <label className="text-[10px] text-white/60 font-black uppercase">Total Qty Required *</label>
                <input
                  type="number"
                  value={newQty}
                  onChange={(e) => setNewQty(parseInt(e.target.value) || 0)}
                  className="w-full text-xs p-3 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/60 font-black uppercase">Unit *</label>
                <input
                  type="text"
                  placeholder="যেমন: Pcs, Roll, Kg"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-white/60 font-black uppercase">Specifications Description / Requirements *</label>
              <textarea
                placeholder="কালার, সাইজ চার্ট, থিকনেস, সুতার কাউন্ট কাউন্টিং এবং শিপিং টাইমলাইন বিস্তারিত লিখুন..."
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/40 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold text-xs rounded-xl tracking-wider transition active:scale-95 shadow-md"
            >
              POST RFQ TO SYSTEM
            </button>
          </form>
        </div>
      )}

      {/* 3. Filter controls inputs */}
      <div className="flex gap-2 rounded-2xl p-2 border"
        style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <div className="flex-1 flex items-center gap-2 pl-2">
          <Search className="w-4 h-4 text-[var(--pm-text-secondary)]" />
          <input
            type="text"
            placeholder="Search active buyer quotation demand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-xs bg-transparent outline-none text-[var(--pm-text)]"
          />
        </div>
        
        <div className="flex items-center shrink-0 pr-1 border-l border-white/10 pl-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-xs text-[var(--pm-text-secondary)] font-bold outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#111]">All Industries</option>
            <option value="garments" className="bg-[#111]">Garments</option>
            <option value="agro" className="bg-[#111]">Agro Procs</option>
            <option value="electronics" className="bg-[#111]">Electronics</option>
          </select>
        </div>
      </div>

      {/* 4. Display list of active RFQs */}
      {filteredRfqs.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <p className="text-xs font-black text-white/50">আপনার সার্চকৃত প্যারামিটারে কোনো বায়ার ডিমান্ড বা RFQ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRfqs.map(rfq => (
            <div
              key={rfq.id}
              onClick={() => onNavigate('rfq-detail', rfq.id)}
              className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-2xl hover:border-[var(--pm-accent)]/30 cursor-pointer transition flex flex-col justify-between space-y-4 relative group"
            >
              {/* Core header of Card */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex justify-between items-center gap-2">
                  <span className="text-[8px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 px-2 py-0.2 rounded font-black uppercase text-[7.5px]">
                    {rfq.category.toUpperCase()}
                  </span>
                  <span className="text-[10px] text-[var(--pm-text-secondary)] flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {rfq.buyerRegion}
                  </span>
                </div>

                <h3 className="text-xs font-black text-white group-hover:text-[var(--pm-accent)] transition mt-1 line-clamp-2 leading-snug">
                  {rfq.title}
                </h3>
              </div>

              {/* description snippet */}
              <p className="text-[11px] text-[var(--pm-text-secondary)] line-clamp-2 leading-relaxed">
                {rfq.description}
              </p>

              {/* Pricing metrics */}
              <div className="p-3 bg-white/5 rounded-xl border border-white/5 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase block">Budget limit</span>
                  <span className="font-mono text-white font-extrabold">{rfq.budget}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase block">Target Volume</span>
                  <span className="text-white font-bold">{rfq.quantity} {rfq.unit}</span>
                </div>
              </div>

              {/* bottom date or quote counters */}
              <div className="flex justify-between items-center pt-2.5 border-t border-white/5 text-[10px] text-[var(--pm-text-secondary)] font-semibold">
                <span>Posted Date: {rfq.date}</span>
                <span className="text-[var(--pm-accent)] font-extrabold flex items-center gap-1">
                  Active Quotes: {rfq.quotes ? rfq.quotes.length : 0} bids →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
