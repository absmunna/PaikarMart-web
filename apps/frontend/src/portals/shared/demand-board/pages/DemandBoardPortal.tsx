import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Plus,
  ShoppingBag,
  Wrench,
  Truck,
  Layers,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { User, PortalTab } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DemandCard,
  CreateDemandModal,
  INITIAL_DEMANDS,
  DemandRequest,
  DemandDomain
} from '@/features/demand';
import { ROUTE_PATHS } from '@/app/router/routeIds';

interface DemandBoardPortalProps {
  currentUser: User;
  onSelectTab?: (tab: PortalTab) => void;
  onOpenVendorModal?: () => void;
}

export const DemandBoardPortal: React.FC<DemandBoardPortalProps> = ({
  currentUser,
  onSelectTab,
  onOpenVendorModal
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL Hub parameter support (?hub=services or ?hub=marketplace or ?hub=logistics)
  const hubParam = searchParams.get('hub');
  const initialDomain: DemandDomain =
    hubParam === 'services'
      ? 'services'
      : hubParam === 'logistics'
      ? 'logistics'
      : hubParam === 'marketplace'
      ? 'products'
      : 'all';

  const [activeDomain, setActiveDomain] = useState<DemandDomain>(initialDomain);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [urgentOnly, setUrgentOnly] = useState(false);
  const [demands, setDemands] = useState<DemandRequest[]>(INITIAL_DEMANDS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDemandForQuote, setSelectedDemandForQuote] = useState<DemandRequest | null>(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNote, setQuoteNote] = useState('');
  const [quoteSuccessMsg, setQuoteSuccessMsg] = useState('');

  // Sync if hubParam changes in URL
  useEffect(() => {
    if (hubParam === 'services') setActiveDomain('services');
    else if (hubParam === 'logistics') setActiveDomain('logistics');
    else if (hubParam === 'marketplace') setActiveDomain('products');
  }, [hubParam]);

  const filteredDemands = useMemo(() => {
    return demands.filter((item) => {
      // Domain filter
      if (activeDomain !== 'all' && item.domain !== activeDomain) return false;

      // City filter
      if (selectedCity !== 'All' && item.locationCity !== selectedCity) return false;

      // Urgent filter
      if (urgentOnly && item.urgency !== 'urgent') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesArea = item.locationArea.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesArea) return false;
      }

      return true;
    });
  }, [demands, activeDomain, selectedCity, urgentOnly, searchQuery]);

  const handleDomainSwitch = (domain: DemandDomain) => {
    setActiveDomain(domain);
    const newParams = new URLSearchParams(searchParams);
    if (domain === 'products') newParams.set('hub', 'marketplace');
    else if (domain === 'services') newParams.set('hub', 'services');
    else if (domain === 'logistics') newParams.set('hub', 'logistics');
    else newParams.delete('hub');
    setSearchParams(newParams);
  };

  const handleAddDemand = (newDemand: DemandRequest) => {
    setDemands((prev) => [newDemand, ...prev]);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDemandForQuote || !quoteAmount) return;

    setDemands((prev) =>
      prev.map((d) =>
        d.id === selectedDemandForQuote.id
          ? { ...d, quotesCount: d.quotesCount + 1 }
          : d
      )
    );

    setQuoteSuccessMsg(isBn ? 'কোটেশন সফলভাবে পাঠানো হয়েছে!' : 'Quote submitted successfully!');
    setTimeout(() => {
      setQuoteSuccessMsg('');
      setSelectedDemandForQuote(null);
      setQuoteAmount('');
      setQuoteNote('');
    }, 1500);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 animate-fadeIn">
      {/* 1. Header Banner */}
      <section className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-7 text-[var(--pm-text)] shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] text-[10px] font-black uppercase tracking-wider">
              <ClipboardList className="w-3.5 h-3.5" />
              <span>{isBn ? 'লাইভ ডিমান্ড ও রিকোয়েস্ট বোর্ড' : 'Dynamic Demand Board & RFQ'}</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {isBn ? 'ক্রেতা ও গ্রাহকদের লাইভ চাহিদা' : 'Live Consumer & Business Demands'}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] leading-relaxed">
              {isBn
                ? 'পণ্য, সার্ভিস এবং লজিস্টিকস চাহিদায় সরাসরি কোটেশন পাঠান অথবা আপনার নিজের চাহিদা পোস্ট করুন।'
                : 'Browse live buyer requests across retail, B2B wholesale, home services, and logistics to submit your quote.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-2 cursor-pointer active-scale shadow-md shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন চাহিদা পোস্ট করুন' : 'Post Demand Request'}</span>
          </button>
        </div>

        {/* 2. Dynamic Domain Filter Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => handleDomainSwitch('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeDomain === 'all'
                ? 'bg-[var(--pm-text)] text-[var(--pm-bg)] shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isBn ? 'সকল চাহিদা' : 'All Demands'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {demands.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDomainSwitch('products')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeDomain === 'products'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isBn ? '🛒 পণ্যের চাহিদা (মার্কেটপ্লেস)' : '🛒 Product Demands'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {demands.filter((d) => d.domain === 'products').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDomainSwitch('services')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeDomain === 'services'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{isBn ? '🔧 সার্ভিস ও মেরামত চাহিদা' : '🔧 Service Demands'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {demands.filter((d) => d.domain === 'services').length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDomainSwitch('logistics')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
              activeDomain === 'logistics'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] border border-[var(--pm-border)]'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>{isBn ? '🚚 লজিস্টিকস ও ফ্রেইট' : '🚚 Logistics Demands'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/10 dark:bg-white/10">
              {demands.filter((d) => d.domain === 'logistics').length}
            </span>
          </button>
        </div>
      </section>

      {/* 3. Search and Quick Filters Strip */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder={
              isBn
                ? 'চাহিদা, প্রোডাক্ট, সার্ভিস বা এলাকা দিয়ে খুঁজুন...'
                : 'Search demands by item, category or location...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] transition-all shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* City Filter */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs">
            <MapPin className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent font-bold text-[var(--pm-text)] outline-none cursor-pointer"
            >
              <option value="All">{isBn ? 'সব বিভাগ/শহর' : 'All Cities'}</option>
              <option value="Dhaka">ঢাকা (Dhaka)</option>
              <option value="Chittagong">চট্টগ্রাম (Chittagong)</option>
              <option value="Sylhet">সিলেট (Sylhet)</option>
              <option value="Rajshahi">রাজশাহী (Rajshahi)</option>
              <option value="Khulna">খুলনা (Khulna)</option>
            </select>
          </div>

          {/* Urgent Toggle */}
          <button
            type="button"
            onClick={() => setUrgentOnly(!urgentOnly)}
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
              urgentOnly
                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:bg-[var(--pm-surface)]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isBn ? 'শুধুমাত্র জরুরি' : 'Urgent Only'}</span>
          </button>
        </div>
      </section>

      {/* 4. Demands Grid */}
      <section aria-label="Demands listing" className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs font-bold text-[var(--pm-muted)]">
            {filteredDemands.length} {isBn ? 'টি সক্রিয় চাহিদা পাওয়া গেছে' : 'active demands found'}
          </p>
        </div>

        {filteredDemands.length === 0 ? (
          <div className="py-16 text-center rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--pm-surface)] text-[var(--pm-muted)] flex items-center justify-center mx-auto">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[var(--pm-text)]">
              {isBn ? 'কোনো চাহিদা খুঁজে পাওয়া যায়নি' : 'No demand requests found'}
            </h4>
            <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
              {isBn
                ? 'আপনার ফিল্টারের সাথে মিলছে এমন কোনো চাহিদা নেই। আপনি চাইলে নতুন চাহিদা পোস্ট করতে পারেন।'
                : 'Try adjusting your search query or post your own demand request.'}
            </p>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isBn ? 'চাহিদা পোস্ট করুন' : 'Post Demand'}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDemands.map((demand) => (
              <DemandCard
                key={demand.id}
                demand={demand}
                isBn={isBn}
                onRespond={(d) => setSelectedDemandForQuote(d)}
                onMessageBuyer={() => navigate(ROUTE_PATHS.MESSAGES)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal: Create Demand */}
      <CreateDemandModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        initialDomain={activeDomain === 'all' ? 'products' : activeDomain}
        onAddDemand={handleAddDemand}
      />

      {/* Modal: Submit Quote Modal */}
      {selectedDemandForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-2xl p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-[var(--pm-accent)]">
                  {selectedDemandForQuote.domain} Quote
                </span>
                <h3 className="text-base font-bold text-[var(--pm-text)]">
                  {selectedDemandForQuote.title}
                </h3>
                <p className="text-xs text-[var(--pm-muted)]">
                  {isBn ? 'ক্রেতার বাজেট:' : 'Buyer Budget:'} ৳{selectedDemandForQuote.targetBudgetBdt.toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDemandForQuote(null)}
                className="p-1 rounded-lg hover:bg-[var(--pm-surface)] text-[var(--pm-muted)]"
              >
                ✕
              </button>
            </div>

            {quoteSuccessMsg ? (
              <div className="py-6 text-center text-emerald-500 font-bold text-sm">
                {quoteSuccessMsg}
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                    {isBn ? 'আপনার প্রস্তাবিত দর বা কোটেশন (৳) *' : 'Your Proposed Offer Amount (৳) *'}
                  </label>
                  <input
                    type="number"
                    required
                    placeholder={`৳ ${selectedDemandForQuote.targetBudgetBdt}`}
                    value={quoteAmount}
                    onChange={(e) => setQuoteAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs font-mono font-bold text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--pm-text)] mb-1 block">
                    {isBn ? 'নোট বা ডেলিভারি শর্ত' : 'Notes / Delivery Term'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={
                      isBn
                        ? 'কখন ডেলিভারি দিতে পারবেন বা কোনো শর্ত থাকলে লিখুন...'
                        : 'Delivery timeline, product warranty, or notes...'
                    }
                    value={quoteNote}
                    onChange={(e) => setQuoteNote(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer active-scale"
                >
                  {isBn ? 'কোটেশন সাবমিট করুন' : 'Confirm & Submit Quote'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
