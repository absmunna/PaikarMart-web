import React from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeHandle } from '@paikarmart/shared';
import { MapPin, Star, ShieldCheck, Minus, Plus, MessageSquare, Wrench, ShoppingBag, Check } from 'lucide-react';
import { CommerceItem, PortalTab } from '@/types';

interface CommerceProductCardProps {
  item: any;
  isBn: boolean;
  currentQty: number;
  unitPrice: number;
  totalPrice: number;
  isAddedNotice: boolean;
  onQtyChange: (itemId: string, qty: number, minQty: number) => void;
  onAddToCart: (item: CommerceItem, isWholesale: boolean) => void;
  onBuyNow: (item: CommerceItem, isWholesale: boolean) => void;
  onSelectTab?: (tab: PortalTab) => void;
}

export const CommerceProductCard: React.FC<CommerceProductCardProps> = ({
  item,
  isBn,
  currentQty,
  unitPrice,
  totalPrice,
  isAddedNotice,
  onQtyChange,
  onAddToCart,
  onBuyNow,
  onSelectTab
}) => {
  const navigate = useNavigate();
  const isWholesale = item.tradeMode === 'wholesale';
  const isDemand = item.isDemandRequest || item.badge?.includes('Demand');
  const isUsed = item.isUsedItem || item.badge?.includes('Used');
  const isService = item.type === 'service';

  const handleViewDetails = () => {
    navigate(`/hub/marketplace/product/${item.id}`);
  };

  return (
    <div
      onClick={handleViewDetails}
      className={`p-2.5 rounded-[2rem] bg-[var(--pm-card)] text-[var(--pm-text)] border transition-all hover:shadow-2xl flex flex-col justify-between space-y-2.5 group cursor-pointer premium-shadow active-scale ${
        isDemand
          ? 'border-orange-500/30 hover:border-orange-500/60'
          : isUsed
          ? 'border-teal-500/30 hover:border-teal-500/60'
          : isWholesale
          ? 'border-amber-500/30 hover:border-amber-500/60'
          : 'border-[var(--pm-border)] hover:border-[var(--pm-accent)]'
      }`}
    >
      <div className="space-y-2.5">
        <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-[var(--pm-surface)]">
          <img
            src={item.imageUrl || 'https://images.unsplash.com/photo-1585478259715-876a6a81fc08?auto=format&fit=crop&w=600&h=450&q=80'}
            alt={item.title}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              event.currentTarget.src = '/src/assets/images/paikarmart_fresh_grocery_1794489814176.jpg';
            }}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {(item.galleryImages?.length || item.sellerRealPhotos?.length) && (
            <span className="absolute bottom-2 left-2 rounded-lg bg-black/55 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
              {(item.galleryImages?.length || 0) + (item.sellerRealPhotos?.length || 0) + 1} photos
            </span>
          )}

          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {isDemand ? (
              <span className="pm-glass border border-[var(--pm-border)] px-2 py-0.5 rounded-full text-orange-500 text-[8px] font-black uppercase tracking-wider">
                RFQ
              </span>
            ) : isUsed ? (
              <span className="pm-glass border border-[var(--pm-border)] px-2 py-0.5 rounded-full text-teal-500 text-[8px] font-black uppercase tracking-wider">
                Used
              </span>
            ) : isWholesale ? (
              <span className="pm-glass border border-[var(--pm-border)] px-2 py-0.5 rounded-full text-amber-500 text-[8px] font-black uppercase tracking-wider">
                Wholesale
              </span>
            ) : isService ? (
              <span className="pm-glass border border-[var(--pm-border)] px-2 py-0.5 rounded-full text-purple-500 text-[8px] font-black uppercase tracking-wider">
                Service
              </span>
            ) : (
              <span className="pm-glass border border-[var(--pm-border)] px-2 py-0.5 rounded-full text-[var(--pm-accent)] text-[8px] font-black uppercase tracking-wider">
                Retail
              </span>
            )}
          </div>

          {item.rating && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-full pm-glass border border-[var(--pm-border)] text-amber-500 text-[8px] font-bold flex items-center gap-0.5">
              <Star className="w-2 h-2 fill-amber-500" />
              <span>{item.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="space-y-1 px-0.5">
          <div className="flex items-center justify-between gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/u/${normalizeHandle(item.storeHandle || item.storeName)}`);
              }}
              className="text-[10px] font-bold text-[var(--pm-muted)] hover:text-[var(--pm-accent)] truncate flex items-center gap-1 cursor-pointer"
            >
              <span className="hover:underline truncate">{item.storeName}</span>
              <ShieldCheck className="w-2.5 h-2.5 text-[var(--pm-accent)] shrink-0" />
            </button>
            {item.proximityDistance && !isWholesale && (
              <div className="flex items-center gap-0.5 text-[8px] font-bold text-[var(--pm-muted)]">
                <MapPin className="w-2 h-2" />
                <span>{item.proximityDistance}</span>
              </div>
            )}
          </div>

          <h4 className="text-[13px] font-black text-[var(--pm-text)] line-clamp-1 group-hover:text-[var(--pm-accent)] transition-colors leading-tight">
            {item.title}
          </h4>

          <p className="text-[10px] leading-4 text-[var(--pm-muted)] line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between gap-2 text-[9px] font-semibold text-[var(--pm-muted)]">
            <span className="truncate">{item.brand || item.category}</span>
            <span className={item.inStock ? 'text-[var(--pm-success)]' : 'text-rose-500'}>
              {item.inStock ? (isBn ? 'স্টকে আছে' : 'In stock') : (isBn ? 'স্টক শেষ' : 'Out of stock')}
            </span>
          </div>

          {isWholesale && item.wholesaleTiers && item.wholesaleTiers.length > 0 && (
            <div className="grid grid-cols-3 gap-1 pt-0.5">
              {item.wholesaleTiers.slice(0, 3).map((t: any, idx: number) => (
                <div key={idx} className="bg-[var(--pm-surface)] p-0.5 rounded-lg text-center border border-[var(--pm-border)]">
                  <span className="block text-[7px] font-bold text-[var(--pm-muted)] uppercase tracking-tighter">{t.minQty}+</span>
                  <span className="text-[8px] text-amber-500 font-black">৳{t.pricePerUnit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2.5 pt-2.5 border-t border-[var(--pm-border)] px-0.5">
        <div className="flex items-end justify-between">
          <div className="min-w-0">
            <span className="text-[8px] text-[var(--pm-muted)] font-bold uppercase block leading-none mb-1">
              {isDemand ? (isBn ? 'বাজেট' : 'Budget') : (isBn ? 'মূল্য' : 'Price')}
            </span>
            <p className="text-base font-mono font-black text-[var(--pm-text)] leading-none">
              ৳{unitPrice.toLocaleString()}
            </p>
          </div>

          {isWholesale && (
            <div className="text-right">
              <span className="text-[8px] text-[var(--pm-muted)] font-bold uppercase block leading-none mb-1">
                {isBn ? 'মোট' : 'Total'}
              </span>
              <p className="text-[11px] font-mono font-black text-amber-500 leading-none">
                ৳{totalPrice.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {isWholesale && (
          <div className="flex items-center justify-between bg-[var(--pm-surface)] p-1.5 rounded-xl border border-[var(--pm-border)]">
            <span className="text-[8px] font-black text-[var(--pm-muted)] uppercase tracking-tighter">
              {isBn ? `মিনিমাম: ${item.minWholesaleQty || 25}` : `Min: ${item.minWholesaleQty || 25}`}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(item.id, currentQty - 5, item.minWholesaleQty || 25);
                }}
                className="w-5 h-5 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] flex items-center justify-center cursor-pointer hover:bg-[var(--pm-card-hover)] active-scale"
              >
                <Minus className="w-2.5 h-2.5" />
              </button>
              <span className="text-xs font-mono font-black min-w-[20px] text-center">{currentQty}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQtyChange(item.id, currentQty + 5, item.minWholesaleQty || 25);
                }}
                className="w-5 h-5 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-text)] flex items-center justify-center cursor-pointer hover:bg-[var(--pm-card-hover)] active-scale"
              >
                <Plus className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          {isAddedNotice && (
            <div className="absolute inset-x-0 -top-10 flex justify-center animate-slide-up">
              <div className="bg-[var(--pm-success)] text-white text-[9px] font-black uppercase py-1 px-2.5 rounded-full shadow-xl flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                <span>{isBn ? 'কার্টে যুক্ত হয়েছে' : 'Added to Cart'}</span>
              </div>
            </div>
          )}

          {isDemand ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); }}
              className="w-full py-2 rounded-[2rem] bg-orange-600 hover:bg-orange-700 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all active-scale flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isBn ? 'প্রস্তাব পাঠান' : 'Send Quote'}</span>
            </button>
          ) : isUsed ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); }}
              className="w-full py-2 rounded-[2rem] bg-teal-600 hover:bg-teal-700 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-teal-500/20 transition-all active-scale flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3 h-3" />
              <span>{isBn ? 'মেসেজ দিন' : 'Message'}</span>
            </button>
          ) : isService ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTab) onSelectTab('services');
              }}
              className="w-full py-2 rounded-[2rem] bg-purple-600 hover:bg-purple-700 text-white font-black text-[9px] uppercase tracking-widest shadow-lg shadow-purple-500/20 transition-all active-scale flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-3 h-3" />
              <span>{isBn ? 'বুকিং দিন' : 'Book Now'}</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart(item, isWholesale);
                }}
                aria-label={isBn ? 'কার্টে যোগ করুন' : 'Add product to cart'}
                className="min-h-9 rounded-xl border border-[var(--pm-border-strong)] bg-[var(--pm-surface)] text-[var(--pm-text)] hover:border-[var(--pm-accent)] hover:text-[var(--pm-accent)] font-black text-[9px] uppercase tracking-wide transition-all active-scale flex items-center justify-center gap-1 cursor-pointer"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>{isBn ? 'কার্টে নিন' : 'Add to Cart'}</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onBuyNow(item, isWholesale);
                }}
                aria-label={isBn ? 'এখনই কিনুন' : 'Buy product now'}
                className={`min-h-9 rounded-xl font-black text-[9px] uppercase tracking-wide shadow-lg transition-all active-scale flex items-center justify-center gap-1 cursor-pointer ${
                  isWholesale
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/30'
                    : 'bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)]'
                }`}
              >
                <ShoppingBag className="w-3 h-3" />
                <span>{isBn ? 'এখনই কিনুন' : 'Buy Now'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
