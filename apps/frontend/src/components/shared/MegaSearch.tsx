import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  ShoppingBag,
  Package,
  Wrench,
  Newspaper,
  TrendingUp,
  History,
  ArrowUpRight,
  Compass,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CommerceItem, PortalTab, SocialPost } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPER_PORTALS } from '@/data/portalsData';

export type SearchScope = 'all' | 'b2c' | 'b2b' | 'posts';

interface MegaSearchProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  scope: SearchScope;
  onScopeChange: (scope: SearchScope) => void;
  commerceItems: CommerceItem[];
  posts?: SocialPost[];
  onSelectTab: (tab: PortalTab) => void;
  searchHistory: string[];
  onSaveSearch: (term: string) => void;
}

const TRENDING_TOPICS_BD = [
  { bn: 'কেরানীগঞ্জ থ্রি-পিস', en: 'Keraniganj Three-Piece' },
  { bn: 'ইসলামপুর কাপড়', en: 'Islampur Fabric' },
  { bn: 'Samsung Galaxy', en: 'Samsung Galaxy' },
  { bn: 'AC সার্ভিসিং', en: 'AC Maintenance' },
  { bn: 'অর্গানিক গ্রোসারি', en: 'Organic Vegetables' },
  { bn: 'চকবাজার কসমেটিক্স', en: 'Chawkbazar Cosmetics' },
];

export const MegaSearch: React.FC<MegaSearchProps> = ({
  isOpen,
  onClose,
  query,
  onQueryChange,
  scope,
  onScopeChange,
  commerceItems,
  posts = [],
  onSelectTab,
  searchHistory,
  onSaveSearch,
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 40);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const trimmed = query.trim().toLowerCase();

  const matchingPortals = useMemo(() => {
    if (!trimmed) return SUPER_PORTALS.filter((p) => p.isFeatured).slice(0, 6);
    return SUPER_PORTALS.filter(
      (p) =>
        p.nameEn.toLowerCase().includes(trimmed) ||
        p.nameBn.toLowerCase().includes(trimmed) ||
        p.realWorldModel.toLowerCase().includes(trimmed)
    ).slice(0, 4);
  }, [trimmed]);

  const matchingItems = useMemo(() => {
    if (!trimmed) return [];
    return commerceItems
      .filter((item) => {
        if (scope === 'b2c' && item.tradeMode !== 'retail' && item.type !== 'retail') return false;
        if (scope === 'b2b' && item.tradeMode !== 'wholesale' && item.type !== 'wholesale') return false;
        if (scope === 'posts') return false;
        return (
          item.title.toLowerCase().includes(trimmed) ||
          item.category.toLowerCase().includes(trimmed) ||
          item.storeName.toLowerCase().includes(trimmed) ||
          (item.description || '').toLowerCase().includes(trimmed)
        );
      })
      .slice(0, 8);
  }, [trimmed, commerceItems, scope]);

  const matchingPosts = useMemo(() => {
    if (!trimmed || (scope !== 'all' && scope !== 'posts')) return [];
    return posts
      .filter(
        (p) =>
          p.content.toLowerCase().includes(trimmed) ||
          p.authorName.toLowerCase().includes(trimmed) ||
          p.taggedProduct?.title.toLowerCase().includes(trimmed)
      )
      .slice(0, 4);
  }, [trimmed, posts, scope]);

  if (!isOpen) return null;

  const handleOpenProduct = (item: CommerceItem) => {
    onSaveSearch(item.title);
    onQueryChange(item.title);
    onClose();
    if (item.type === 'service') {
      onSelectTab('services');
    } else if (item.type === 'rides') {
      onSelectTab('rides');
    } else {
      navigate(`/hub/marketplace/product/${item.id}`);
    }
  };

  const handlePickTerm = (term: string) => {
    onSaveSearch(term);
    onQueryChange(term);
    if (scope === 'b2b') onSelectTab('wholesale');
    else if (scope === 'posts') onSelectTab('feed');
    else onSelectTab('commerce');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center p-3 sm:p-6 pt-12 sm:pt-16 animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Spotlight Search"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] shadow-2xl overflow-hidden flex flex-col max-h-[82vh]"
      >
        {/* Top Input Row */}
        <div className="p-3.5 sm:p-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] space-y-3">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-[var(--pm-accent)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  handlePickTerm(query.trim());
                }
              }}
              placeholder={
                isBn
                  ? 'পণ্য, পাইকারি ফ্যাক্টরি, সার্ভিস বা পোর্টাল খুঁজুন...'
                  : 'Search B2C retail, B2B factories, services, posts, or portals...'
              }
              className="flex-1 bg-transparent text-sm sm:text-base font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => onQueryChange('')}
                className="p-1 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-2.5 py-1 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[11px] font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* Scope Tabs: All / B2C / B2B / Feed */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all' as SearchScope, labelEn: 'All Scope', labelBn: 'সবকিছু' },
              { id: 'b2c' as SearchScope, labelEn: 'B2C Retail', labelBn: 'খুচরা (B2C)' },
              { id: 'b2b' as SearchScope, labelEn: 'B2B Wholesale', labelBn: 'পাইকারি (B2B)' },
              { id: 'posts' as SearchScope, labelEn: 'Social Posts', labelBn: 'পোস্ট ও ফিড' },
            ].map((tab) => {
              const isActive = scope === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onScopeChange(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent shadow-xs'
                      : 'bg-[var(--pm-card)] text-[var(--pm-muted)] border-[var(--pm-border)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {isBn ? tab.labelBn : tab.labelEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 no-scrollbar">
          {/* Quick Portals Match */}
          {matchingPortals.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-1">
                <Compass className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                <span>{trimmed ? (isBn ? 'মিল থাকা পোর্টাল' : 'Matching Portals') : isBn ? 'দ্রুত পোর্টাল' : 'Quick Launch Portals'}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {matchingPortals.map((portal) => {
                  const Icon = portal.icon;
                  return (
                    <button
                      key={portal.id}
                      type="button"
                      onClick={() => {
                        if (portal.searchHint) onQueryChange(portal.searchHint);
                        onSelectTab(portal.targetTab);
                        onClose();
                      }}
                      className="p-2.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-left flex items-center gap-2.5 transition-all cursor-pointer group"
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${portal.color} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate group-hover:text-[var(--pm-accent)]">
                          {isBn ? portal.nameBn : portal.nameEn}
                        </p>
                        <p className="text-[10px] text-[var(--pm-muted)] truncate">{portal.realWorldModel}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Typed Query: Live Matching Commerce Items */}
          {trimmed && matchingItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-1">
                <span className="flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                  {isBn ? 'পণ্য ও সেবা' : 'Commerce & Services'}
                </span>
                <span className="font-mono">{matchingItems.length}</span>
              </div>
              <div className="divide-y divide-[var(--pm-border)] rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] overflow-hidden">
                {matchingItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleOpenProduct(item)}
                    className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-[var(--pm-card-hover)] text-left transition-colors cursor-pointer"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 border border-[var(--pm-border)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                            item.tradeMode === 'wholesale'
                              ? 'bg-amber-500/15 text-amber-500'
                              : item.type === 'service'
                                ? 'bg-purple-500/15 text-purple-500'
                                : 'bg-blue-500/15 text-blue-500'
                          }`}
                        >
                          {item.tradeMode === 'wholesale' ? 'B2B' : item.type === 'service' ? 'Service' : 'B2C'}
                        </span>
                        <span className="text-[10px] text-[var(--pm-muted)] truncate">{item.storeName}</span>
                      </div>
                      <p className="text-xs font-bold truncate text-[var(--pm-text)]">{item.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-[var(--pm-accent)]">
                        ৳{item.price.toLocaleString()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Typed Query: Matching Social Feed Posts */}
          {trimmed && matchingPosts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-1">
                <Newspaper className="w-3.5 h-3.5 text-purple-500" />
                <span>{isBn ? 'কমিউনিটি পোস্ট' : 'Community Feed Posts'}</span>
              </div>
              <div className="space-y-2">
                {matchingPosts.map((post) => (
                  <button
                    key={post.id}
                    type="button"
                    onClick={() => handlePickTerm(query.trim())}
                    className="w-full p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-left flex items-start gap-3 cursor-pointer"
                  >
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-8 h-8 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[var(--pm-text)]">{post.authorName}</p>
                      <p className="text-xs text-[var(--pm-muted)] line-clamp-2 mt-0.5">{post.content}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State if Query Has No Direct Hit */}
          {trimmed && matchingItems.length === 0 && matchingPosts.length === 0 && matchingPortals.length === 0 && (
            <div className="py-10 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[var(--pm-muted)] mx-auto opacity-60" />
              <p className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? `"${query}" এর জন্য সরাসরি কিছু পাওয়া যায়নি` : `No direct hits for "${query}"`}
              </p>
              <button
                type="button"
                onClick={() => handlePickTerm(query.trim())}
                className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold cursor-pointer"
              >
                {isBn ? 'পুরো মার্কেটপ্লেসে খুঁজুন' : 'Apply Filter to Feed'}
              </button>
            </div>
          )}

          {/* Empty Query: Trending & Search History */}
          {!trimmed && (
            <>
              {searchHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-1">
                    <History className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                    <span>{isBn ? 'সাম্প্রতিক অনুসন্ধান' : 'Recent Searches'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {searchHistory.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePickTerm(item)}
                        className="px-3 py-1.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-xs font-semibold text-[var(--pm-text)] transition-all cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--pm-muted)] px-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isBn ? 'বাংলাদেশে জনপ্রিয়' : 'Trending Across Bangladesh'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_TOPICS_BD.map((topic) => (
                    <button
                      key={topic.en}
                      type="button"
                      onClick={() => handlePickTerm(isBn ? topic.bn : topic.en)}
                      className="px-3 py-1.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] text-xs font-bold text-[var(--pm-text)] flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>{isBn ? topic.bn : topic.en}</span>
                      <ArrowUpRight className="w-3 h-3 text-[var(--pm-accent)]" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
