import React, { useState, useMemo } from 'react';
import {
  Store,
  Cloud,
  ArrowRight,
  Compass,
  Search,
  Layers,
  ArrowUpRight,
  Sparkles,
  Grid,
} from 'lucide-react';
import { PortalTab, User } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { HUB_PILLARS, SUPER_PORTALS, HubPillarId, SuperPortalEntry } from '@/data/portalsData';

interface ExplorePortalProps {
  onSelectTab: (tab: PortalTab) => void;
  onOpenVendorModal: () => void;
  onOpenCloudGuide: () => void;
  onQuickSearch?: (keyword: string) => void;
  isVendor: boolean;
  currentUser?: User;
}

export const ExplorePortal: React.FC<ExplorePortalProps> = ({
  onSelectTab,
  onOpenVendorModal,
  onOpenCloudGuide,
  onQuickSearch,
  isVendor,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<'all' | HubPillarId>('all');

  const featuredPortals = useMemo(
    () => SUPER_PORTALS.filter((p) => p.isFeatured),
    []
  );

  const filteredPortals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return SUPER_PORTALS.filter((portal) => {
      const matchesPillar = selectedPillar === 'all' || portal.hubId === selectedPillar;
      if (!matchesPillar) return false;
      if (!q) return true;
      return (
        portal.nameEn.toLowerCase().includes(q) ||
        portal.nameBn.toLowerCase().includes(q) ||
        portal.realWorldModel.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedPillar]);

  const handleLaunchPortal = (portal: SuperPortalEntry) => {
    if (portal.searchHint && onQuickSearch) {
      onQuickSearch(portal.searchHint);
    }
    onSelectTab(portal.targetTab);
  };

  const pillarsToRender = useMemo(() => {
    if (selectedPillar === 'all') return HUB_PILLARS;
    return HUB_PILLARS.filter((h) => h.id === selectedPillar);
  }, [selectedPillar]);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-24 pt-1 px-1 sm:px-2">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 animate-fadeIn">
        {/* Command Center Header Banner */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-8 text-[var(--pm-text)] shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
                <Compass className="w-3.5 h-3.5" />
                <span>
                  {isBn
                    ? `৪-পিলার সুপার অ্যাপ হাব (${SUPER_PORTALS.length}+ পোর্টাল)`
                    : `4-Pillar Super App Hub (${SUPER_PORTALS.length}+ Portals)`}
                </span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight">
                {isBn ? 'সুপার অ্যাপ হাব ও পোর্টাল ডিরেক্টরি' : 'Super App Hub & Portal Directory'}
              </h1>
              <p className="text-xs sm:text-sm text-[var(--pm-muted)] font-medium max-w-xl line-clamp-2">
                {isBn
                  ? 'কমার্স, পাইকারি মোকাম, লোকাল সার্ভিস, রাইড শেয়ার, কমিউনিটি এবং ওয়ালেট — এক গ্রিড থেকে সব নিয়ন্ত্রণ করুন।'
                  : 'Navigate retail, factory wholesale, hyperlocal services, logistics, community feeds, and utility tools in one place.'}
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-xl px-3 py-2 shrink-0">
              <div className="flex flex-col border-r border-[var(--pm-border)] pr-3">
                <span className="text-[10px] text-[var(--pm-muted)] uppercase font-black">
                  {isBn ? 'মোট পোর্টাল' : 'Portals'}
                </span>
                <span className="text-lg font-mono font-bold">{SUPER_PORTALS.length}+</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-blue-200 uppercase font-black">
                  {isBn ? 'পিলার' : 'Pillars'}
                </span>
                <span className="text-lg font-mono font-bold">{HUB_PILLARS.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Super Portals Strip */}
        {!searchQuery && selectedPillar === 'all' && (
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5 px-1 text-xs font-black uppercase tracking-wider text-[var(--pm-muted)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'দ্রুত অ্যাক্সেস পোর্টাল' : 'Featured Super Portals'}</span>
            </div>
            <div className="flex items-stretch gap-2.5 overflow-x-auto no-scrollbar pb-1">
              {featuredPortals.map((portal) => {
                const Icon = portal.icon;
                return (
                  <button
                    key={`feat-${portal.id}`}
                    type="button"
                    onClick={() => handleLaunchPortal(portal)}
                    className="shrink-0 min-w-[124px] p-2.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] flex items-center gap-2 text-left transition-all cursor-pointer group active:scale-95 shadow-2xs"
                  >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${portal.color} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--pm-text)] truncate group-hover:text-[var(--pm-accent)]">
                        {isBn ? portal.nameBn : portal.nameEn}
                      </p>
                      <p className="text-[10px] text-[var(--pm-muted)] truncate">{portal.realWorldModel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Toolbar: Portal Search & 4-Pillar Tabs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--pm-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isBn
                  ? `${SUPER_PORTALS.length}+ পোর্টাল খুঁজুন (যেমন: ফার্মেসি, হোলসেল, ট্রানজিট, ফুড)...`
                  : `Search ${SUPER_PORTALS.length}+ portals (e.g. Pharmacy, Wholesale, Transit, Food)...`
              }
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-xl text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--pm-accent)]/50 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setSelectedPillar('all')}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                selectedPillar === 'all'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-sm'
                  : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>{isBn ? 'সব পিলার (৪)' : 'All Pillars (4)'}</span>
            </button>
            {HUB_PILLARS.map((hub) => {
              const Icon = hub.icon;
              const isSelected = selectedPillar === hub.id;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => setSelectedPillar(hub.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-sm'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isBn ? hub.nameBn : hub.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4-Pillar Grouped Hub Grid (28+ Portals) */}
        {filteredPortals.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {pillarsToRender.map((pillar) => {
              const PillarIcon = pillar.icon;
              const groupPortals = filteredPortals.filter((p) => p.hubId === pillar.id);
              if (groupPortals.length === 0) return null;
              const pillarHubTab: PortalTab =
                pillar.id === 'commerce-hub'
                  ? 'commerce'
                  : pillar.id === 'services-logistics-hub'
                  ? 'services'
                  : pillar.id === 'community-content-hub'
                  ? 'community-hub'
                  : 'utility-hub';

              return (
                <section
                  key={pillar.id}
                  className="rounded-2xl sm:rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] p-3 sm:p-5 shadow-xs space-y-3 sm:space-y-4"
                >
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[var(--pm-border)]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${pillar.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                        <PillarIcon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-black text-[var(--pm-text)] truncate">
                          {isBn ? pillar.nameBn : pillar.nameEn}
                        </h2>
                        <p className="text-[11px] text-[var(--pm-muted)] truncate">
                          {isBn ? pillar.descriptionBn : pillar.descriptionEn}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)]">
                        {groupPortals.length} {isBn ? 'টি পোর্টাল' : 'portals'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectTab(pillarHubTab)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-accent)] text-[var(--pm-accent)] hover:text-[var(--pm-accent-fg)] text-[11px] font-bold transition-colors cursor-pointer"
                      >
                        <span>{isBn ? 'হাব খুলুন' : 'Open Hub'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
                    {groupPortals.map((portal) => {
                      const Icon = portal.icon;
                      return (
                        <button
                          key={portal.id}
                          type="button"
                          onClick={() => handleLaunchPortal(portal)}
                          className="group relative p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] hover:border-[var(--pm-accent)]/60 transition-all flex flex-col items-start text-left active:scale-95 cursor-pointer"
                        >
                          <div className="w-full flex items-start justify-between mb-2.5">
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br ${portal.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--pm-accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <h3 className="text-xs font-black text-[var(--pm-text)] group-hover:text-[var(--pm-accent)] transition-colors line-clamp-1">
                            {isBn ? portal.nameBn : portal.nameEn}
                          </h3>
                          <p className="text-[10px] text-[var(--pm-muted)] mt-0.5 line-clamp-1">
                            {portal.realWorldModel}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--pm-card)] rounded-3xl border border-dashed border-[var(--pm-border)]">
            <Layers className="w-10 h-10 text-[var(--pm-muted)] mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-[var(--pm-text)]">
              {isBn ? 'কোনো পোর্টাল খুঁজে পাওয়া যায়নি' : 'No portals matching your filter'}
            </h3>
          </div>
        )}

        {/* Bottom Merchant & Cloud Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              if (isVendor) onSelectTab('vendor-dash');
              else onOpenVendorModal();
            }}
            className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 hover:opacity-95 transition-all text-left group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[var(--pm-success)] text-white shadow-lg">
              <Store className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[var(--pm-success)]">
                {isVendor
                  ? isBn
                    ? 'সেলার সেন্ট্রাল'
                    : 'Seller Central'
                  : isBn
                    ? 'সেলার অ্যাকাউন্ট খুলুন'
                    : 'Open Seller Account'}
              </h4>
              <p className="text-[11px] text-[var(--pm-muted)] font-medium truncate">
                {isVendor
                  ? isBn
                    ? 'ইনভেন্টরি ও অর্ডার ম্যানেজ করুন'
                    : 'Manage inventory & sales'
                  : isBn
                    ? '৪-ধাপের ভেরিফিকেশন শুরু করুন'
                    : 'Start 4-step store registration'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--pm-success)] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onOpenCloudGuide}
            className="flex items-center gap-3 p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] hover:opacity-95 transition-all text-left group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-lg">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-black text-[var(--pm-accent)]">
                {isBn ? 'ক্লাউড কনফিগারেশন' : 'Cloud Architecture'}
              </h4>
              <p className="text-[11px] text-[var(--pm-muted)] font-medium truncate">
                {isBn ? 'সার্ভার ও ডেটাবেস গাইড দেখুন' : 'View server & database setup'}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--pm-accent)] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
