import React, { useEffect, useState } from 'react';
import {
  X,
  Store,
  Star,
  MapPin,
  Truck,
  Camera,
  ChevronRight,
  CheckCircle2,
  Award
} from 'lucide-react';
import { SellerListing } from '@/types';
import { retailApiClient } from '@/features/marketplace/services/retailApiClient';

type RankedSellerListing = SellerListing & {
  landedPrice?: number;
  buyBoxScore?: number;
  isBuyBoxWinner?: boolean;
};

interface OtherSellersModalProps {
  productTitle: string;
  sellerListings: SellerListing[];
  currentSellerId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectSellerListing: (listing: SellerListing) => void;
}

export const OtherSellersModal: React.FC<OtherSellersModalProps> = ({
  productTitle,
  sellerListings,
  currentSellerId,
  isOpen,
  onClose,
  onSelectSellerListing,
}) => {
  const [activePhotoGallery, setActivePhotoGallery] = useState<{ sellerName: string; photos: string[] } | null>(null);
  const [rankedListings, setRankedListings] = useState<RankedSellerListing[]>(sellerListings);

  useEffect(() => {
    if (!isOpen || sellerListings.length === 0) {
      setRankedListings(sellerListings);
      return;
    }

    let active = true;
    retailApiClient.rankBuyBoxOffers(sellerListings).then((res) => {
      if (active && Array.isArray(res.rankedOffers) && res.rankedOffers.length > 0) {
        setRankedListings(res.rankedOffers);
      }
    });

    return () => {
      active = false;
    };
  }, [isOpen, sellerListings]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-[var(--pm-card)] text-[var(--pm-text)] rounded-3xl shadow-2xl border border-[var(--pm-border)] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-[var(--pm-text)] truncate">
                Compare Sellers · Buy Box Ranking
              </h3>
              <p className="text-xs text-[var(--pm-muted)] truncate max-w-sm font-medium">
                {productTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Overlay View */}
        {activePhotoGallery ? (
          <div className="p-6 space-y-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[var(--pm-success)]" />
                Actual In-Store Photos from {activePhotoGallery.sellerName}
              </h4>
              <button
                type="button"
                onClick={() => setActivePhotoGallery(null)}
                className="text-xs text-[var(--pm-accent)] font-bold hover:underline cursor-pointer"
              >
                ← Back to Sellers List
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {activePhotoGallery.photos.map((url, idx) => (
                <div key={idx} className="aspect-4/3 rounded-2xl overflow-hidden border border-[var(--pm-border)] bg-[var(--pm-surface)]">
                  <img
                    src={url}
                    alt={`Shelf view ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sellers List */
          <div className="p-5 space-y-3 flex-1 overflow-y-auto">
            <p className="text-xs font-medium text-[var(--pm-muted)] px-1">
              Offers ranked by landed price (item + delivery), seller rating, and express dispatch availability.
            </p>

            <div className="space-y-3">
              {rankedListings.map((listing) => {
                const isCurrent = listing.id === currentSellerId || listing.sellerId === currentSellerId;
                const hasRealPhotos = listing.sellerRealPhotos && listing.sellerRealPhotos.length > 0;
                const landed = listing.landedPrice ?? listing.price;

                return (
                  <div
                    key={listing.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent)]'
                        : listing.isBuyBoxWinner
                          ? 'bg-[var(--pm-success-soft)] border-[var(--pm-success)]/50'
                          : 'bg-[var(--pm-surface)] border-[var(--pm-border)] hover:border-[var(--pm-border-strong)]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      {/* Seller Info */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2">
                          <h4 className="text-xs sm:text-sm font-bold text-[var(--pm-text)] truncate">
                            {listing.sellerName}
                          </h4>
                          {listing.isBuyBoxWinner && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[var(--pm-success)]">
                              <Award className="w-3.5 h-3.5" />
                              Best Landed Value
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[11px] font-bold text-[var(--pm-accent)]">
                              · Current Offer
                            </span>
                          )}
                        </div>

                        <div className="flex items-center flex-wrap gap-2 text-[11px] text-[var(--pm-muted)]">
                          <span className="flex items-center gap-1 font-bold text-amber-500 tabular-nums">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {listing.sellerRating} ({listing.sellerReviewsCount})
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[var(--pm-muted)]" />
                            {listing.location} ({listing.proximityDistance || 'Near you'})
                          </span>
                        </div>

                        <div className="flex items-center flex-wrap gap-2 pt-1 text-[11px] text-[var(--pm-muted)]">
                          <span className="flex items-center gap-1 text-[var(--pm-text)]">
                            <Truck className="w-3 h-3 text-[var(--pm-success)]" />
                            {listing.deliveryEta}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            Stock: {listing.stockQuantity} units
                          </span>
                          {landed !== listing.price && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono tabular-nums text-[var(--pm-text)]">
                                Landed: ৳{landed.toLocaleString()}
                              </span>
                            </>
                          )}
                        </div>

                        {hasRealPhotos && (
                          <button
                            type="button"
                            onClick={() => setActivePhotoGallery({ sellerName: listing.sellerName, photos: listing.sellerRealPhotos! })}
                            className="mt-2 text-[11px] font-semibold text-[var(--pm-success)] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            View In-Store Shelf Photos ({listing.sellerRealPhotos!.length})
                          </button>
                        )}
                      </div>

                      {/* Pricing & Selection Action */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[var(--pm-border)] shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-[var(--pm-muted)] block font-medium">Seller Price</span>
                          <div className="font-mono tabular-nums text-base sm:text-lg font-black text-[var(--pm-text)]">
                            ৳{listing.price.toLocaleString()}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectSellerListing(listing);
                            onClose();
                          }}
                          className={`mt-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ${
                            isCurrent
                              ? 'bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)]'
                              : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)]'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
                              Selected
                            </>
                          ) : (
                            <>
                              Select Offer
                              <ChevronRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
