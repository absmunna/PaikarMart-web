import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  formatDisplayHandle,
  normalizeHandle,
  type PublicProfileProjection
} from '@paikarmart/shared';
import {
  Store,
  ShieldCheck,
  MapPin,
  Search,
  ShoppingCart,
  MessageCircle,
  ArrowLeft,
  Share2,
  Check,
  Lock,
  Wrench,
  Package,
  MessageSquare,
  SlidersHorizontal
} from 'lucide-react';
import { CommerceItem, ReactionType, ServiceBooking, SocialPost, User } from '@/types';
import { vendorApiClient } from '@/features/vendors';
import { FeedPostCard } from '@/hubs/social/components/FeedPostCard';
import { ServiceCard } from '@/hubs/services/portals/local-services/components/ServiceCard';
import { ServiceBookingModal } from '@/hubs/services/portals/local-services/components/ServiceBookingModal';

interface PublicStorefrontPageProps {
  commerceItems: CommerceItem[];
  posts: SocialPost[];
  currentUser: User;
  onAddToCart: (item: CommerceItem, qty: number, isWholesale: boolean) => void;
  onBookService?: (booking: Omit<ServiceBooking, 'id' | 'status'>) => void;
  onReact: (postId: string, reaction: ReactionType) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onDeductBalance?: (amount: number) => boolean;
}

type ProfileSectionTab = 'all' | 'posts' | 'products' | 'services';

export const PublicStorefrontPage: React.FC<PublicStorefrontPageProps> = ({
  commerceItems,
  posts,
  currentUser,
  onAddToCart,
  onBookService,
  onReact,
  onAddComment,
  onDeductBalance
}) => {
  const { handle, storeId } = useParams<{ handle?: string; storeId?: string }>();
  const navigate = useNavigate();

  const rawParam = handle || storeId || currentUser.handle || currentUser.name;
  const targetSlug = normalizeHandle(rawParam);

  const [publicProfile, setPublicProfile] = useState<PublicProfileProjection | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileSectionTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<'all' | 'retail' | 'wholesale'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedService, setSelectedService] = useState<CommerceItem | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void vendorApiClient
      .fetchPublicProfileByHandle(rawParam)
      .then((res) => {
        if (active) setPublicProfile(res);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [rawParam]);

  // Match all public Social Posts belonging to this single @handle / author / store
  const matchingPosts = useMemo(() => {
    return posts.filter((p) => {
      const authorSlug = normalizeHandle(p.authorHandle || p.authorName);
      const taggedSlug = p.taggedProduct
        ? normalizeHandle(p.taggedProduct.storeHandle || p.taggedProduct.storeName)
        : '';
      return (
        authorSlug === targetSlug ||
        p.authorId === rawParam ||
        (publicProfile?.storeId && p.authorId === publicProfile.storeId) ||
        taggedSlug === targetSlug
      );
    });
  }, [posts, targetSlug, rawParam, publicProfile]);

  // Match all public Commerce Products (Retail & Wholesale) belonging to this handle / store
  const matchingProducts = useMemo(() => {
    return commerceItems.filter((item) => {
      if (item.type === 'service' || item.type === 'rides') return false;
      const storeSlug = normalizeHandle(item.storeHandle || item.storeName);
      const belongsToHandle =
        item.storeId === rawParam ||
        storeSlug === targetSlug ||
        (publicProfile?.storeId && item.storeId === publicProfile.storeId) ||
        (publicProfile && normalizeHandle(publicProfile.displayName) === storeSlug);

      if (!belongsToHandle) return false;
      if (modeFilter !== 'all' && (item.tradeMode || item.type) !== modeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [commerceItems, rawParam, targetSlug, publicProfile, modeFilter, searchQuery]);

  // Match all public Services belonging to this handle / store
  const matchingServices = useMemo(() => {
    return commerceItems.filter((item) => {
      if (item.type !== 'service') return false;
      const storeSlug = normalizeHandle(item.storeHandle || item.storeName);
      const belongsToHandle =
        item.storeId === rawParam ||
        storeSlug === targetSlug ||
        (publicProfile?.storeId && item.storeId === publicProfile.storeId);
      if (!belongsToHandle) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [commerceItems, rawParam, targetSlug, publicProfile, searchQuery]);

  const isOwner = useMemo(() => {
    const userSlug = normalizeHandle(currentUser.handle || currentUser.name);
    const vendorSlug = currentUser.vendorProfile
      ? normalizeHandle(currentUser.vendorProfile.handle || currentUser.vendorProfile.storeName)
      : '';
    return (
      userSlug === targetSlug ||
      (vendorSlug && vendorSlug === targetSlug) ||
      currentUser.id === rawParam ||
      Boolean(currentUser.vendorProfile?.id && currentUser.vendorProfile.id === rawParam) ||
      Boolean(currentUser.vendorProfile?.id && publicProfile?.storeId === currentUser.vendorProfile.id)
    );
  }, [currentUser, targetSlug, rawParam, publicProfile]);

  const resolvedDisplayName =
    publicProfile?.displayName ||
    (isOwner ? currentUser.vendorProfile?.storeName || currentUser.name : undefined) ||
    matchingProducts[0]?.storeName ||
    matchingServices[0]?.storeName ||
    matchingPosts[0]?.authorName ||
    rawParam.replace(/^@/, '').replace(/_/g, ' ');

  const resolvedHandle = formatDisplayHandle(
    publicProfile?.handle || targetSlug
  );

  const resolvedAvatar =
    publicProfile?.avatar ||
    matchingPosts[0]?.authorAvatar ||
    (isOwner ? currentUser.avatar : undefined);

  const resolvedLocation =
    publicProfile?.location ||
    (isOwner ? currentUser.vendorProfile?.location || currentUser.location : 'Dhaka Verified Network');

  const isMerchantProfile =
    Boolean(publicProfile) ||
    matchingProducts.length > 0 ||
    matchingServices.length > 0 ||
    (isOwner && currentUser.isVendor);

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/u/${encodeURIComponent(normalizeHandle(resolvedHandle))}`;
    if (navigator.clipboard?.writeText) {
      void navigator.clipboard.writeText(shareUrl);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-20">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-xs font-bold text-[var(--pm-accent)] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <span className="text-[11px] font-medium text-[var(--pm-muted)] flex items-center gap-1">
          <Lock className="w-3 h-3 text-[var(--pm-success)]" />
          <span>Zero-PII Public Profile · Private Docs & Balance Hidden</span>
        </span>
      </div>

      {/* Unified Public Profile Header Banner */}
      <div className="p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            {resolvedAvatar ? (
              <img
                src={resolvedAvatar}
                alt={resolvedDisplayName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-[var(--pm-border)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0 font-bold text-xl">
                {isMerchantProfile ? <Store className="w-8 h-8" /> : resolvedDisplayName.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--pm-text)] truncate">
                  {resolvedDisplayName}
                </h1>
                {(publicProfile?.verified || matchingPosts[0]?.authorVerified || isMerchantProfile) && (
                  <span className="text-xs font-bold text-[var(--pm-success)] flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Trust Level {publicProfile?.trustLevel ?? (isMerchantProfile ? 5 : 2)}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--pm-muted)]">
                <span className="font-mono font-bold text-[var(--pm-accent)]">
                  {resolvedHandle}
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{resolvedLocation}</span>
                </span>
                {isMerchantProfile && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className={publicProfile?.isOpen === false ? 'text-[var(--pm-danger)] font-bold' : 'text-[var(--pm-success)] font-bold'}>
                      {publicProfile?.isOpen === false ? 'Closed' : 'Open Now'}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono font-bold text-[var(--pm-text)]">
                      ★ {(publicProfile?.rating ?? 4.9).toFixed(1)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={handleCopyShareLink}
              className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[var(--pm-success)]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Link Copied' : 'Share @handle'}</span>
            </button>

            <Link
              to="/portal/messages"
              className="px-4 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message</span>
            </Link>

            {isOwner && currentUser.isVendor && (
              <Link
                to="/portal/seller"
                className="px-3.5 py-2.5 rounded-xl bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Seller Central</span>
              </Link>
            )}
          </div>
        </div>

        {/* Single-ID Navigation Tabs (Posts + Shop + Services inside ONE @handle) */}
        <div className="pt-4 border-t border-[var(--pm-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] overflow-x-auto no-scrollbar">
            {([
              { id: 'all', label: `All (${matchingPosts.length + matchingProducts.length + matchingServices.length})` },
              { id: 'posts', label: `Posts (${matchingPosts.length})` },
              { id: 'products', label: `Shop (${matchingProducts.length})` },
              { id: 'services', label: `Services (${matchingServices.length})` }
            ] as const).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-[var(--pm-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search inside ${resolvedHandle}...`}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs text-[var(--pm-muted)]">Loading unified @handle profile...</div>
      ) : (
        <div className="space-y-6">
          {/* Shop Products Section */}
          {(activeTab === 'all' || activeTab === 'products') && (
            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--pm-accent)]" />
                  <span>Shop & Wholesale Catalog</span>
                </h2>
                <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  {(['all', 'retail', 'wholesale'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModeFilter(m)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold capitalize cursor-pointer ${
                        modeFilter === m
                          ? 'bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] shadow-xs'
                          : 'text-[var(--pm-muted)]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {matchingProducts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)] text-center">
                  No active shop products listed under {resolvedHandle} yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchingProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-3">
                        <div className="aspect-4/3 rounded-xl overflow-hidden bg-[var(--pm-surface)]">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-[var(--pm-muted)]">
                            {item.category} · {(item.tradeMode || item.type).toUpperCase()}
                          </p>
                          <Link
                            to={`/hub/marketplace/product/${encodeURIComponent(item.id)}`}
                            className="text-sm font-bold text-[var(--pm-text)] hover:text-[var(--pm-accent)] line-clamp-1 block"
                          >
                            {item.title}
                          </Link>
                          <p className="text-xs text-[var(--pm-muted)] line-clamp-2">{item.description}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[var(--pm-border)] flex items-center justify-between">
                        <span className="text-base font-mono tabular-nums font-bold text-[var(--pm-text)]">
                          ৳{item.price.toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => onAddToCart(item, item.minWholesaleQty || 1, item.type === 'wholesale')}
                          className="px-3.5 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer active-scale"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Bookable Services Section */}
          {(activeTab === 'all' || activeTab === 'services') && (matchingServices.length > 0 || activeTab === 'services') && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2 px-1">
                <Wrench className="w-4 h-4 text-[var(--pm-success)]" />
                <span>Bookable Services</span>
              </h2>
              {matchingServices.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)] text-center">
                  No bookable services listed under {resolvedHandle}.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {matchingServices.map((srv) => (
                    <ServiceCard
                      key={srv.id}
                      service={srv}
                      onClick={(s) => setSelectedService(s)}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Social Posts Section */}
          {(activeTab === 'all' || activeTab === 'posts') && (
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2 px-1">
                <MessageSquare className="w-4 h-4 text-[var(--pm-accent)]" />
                <span>Community & Merchant Updates</span>
              </h2>
              {matchingPosts.length === 0 ? (
                <div className="p-6 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs text-[var(--pm-muted)] text-center">
                  No public social posts shared under {resolvedHandle} yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {matchingPosts.map((post) => (
                    <FeedPostCard
                      key={post.id}
                      post={post}
                      currentUser={currentUser}
                      onReact={onReact}
                      onAddComment={onAddComment}
                      onAddToCart={(item) => onAddToCart(item, 1, item.type === 'wholesale')}
                      commerceItems={commerceItems}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      )}

      {onBookService && (
        <ServiceBookingModal
          selectedService={selectedService}
          onClose={() => setSelectedService(null)}
          onBookService={onBookService}
          currentUser={currentUser}
          onDeductBalance={onDeductBalance}
        />
      )}
    </div>
  );
};
