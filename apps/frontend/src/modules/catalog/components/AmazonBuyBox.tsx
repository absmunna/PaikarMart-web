import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Truck,
  Store,
  ShoppingCart,
  Copy,
  Check,
  Plus,
  AlertCircle,
  ArrowRight,
  Zap,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { SellerOffer } from '../types/catalog.types';
import { OtherSellersModal } from './OtherSellersModal';
import { LinkInventoryModal } from './LinkInventoryModal';
import { useCatalogStore } from '../store/catalogStore';

interface AmazonBuyBoxProps {
  asin: string;
  productTitle: string;
  onAddToCart: (offer: SellerOffer, quantity: number) => void;
  onBuyNow: (offer: SellerOffer, quantity: number) => void;
}

export const AmazonBuyBox: React.FC<AmazonBuyBoxProps> = ({
  asin,
  productTitle,
  onAddToCart,
  onBuyNow,
}) => {
  const { getBuyBox, getOffers, linkSellerOffer, hydrateFromApi } = useCatalogStore();
  const [hydrating, setHydrating] = useState(true);
  const [source, setSource] = useState<'api' | 'local'>('local');

  useEffect(() => {
    let cancelled = false;
    setHydrating(true);
    hydrateFromApi(asin).then((ok) => {
      if (cancelled) return;
      setSource(ok ? 'api' : 'local');
      setHydrating(false);
    });
    return () => {
      cancelled = true;
    };
  }, [asin, hydrateFromApi]);

  const buyBoxData = getBuyBox(asin);
  const allOffers = getOffers(asin);

  const [quantity, setQuantity] = useState(1);
  const [isCopiedAsin, setIsCopiedAsin] = useState(false);
  const [isOtherSellersOpen, setIsOtherSellersOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  useEffect(() => {
    if (buyBoxData?.winner?.moq) setQuantity(buyBoxData.winner.moq);
  }, [buyBoxData?.winner?.id, buyBoxData?.winner?.moq]);

  if (hydrating) {
    return (
      <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-8 flex items-center justify-center gap-2 text-zinc-400 text-xs font-bold">
        <Loader2 className="w-4 h-4 animate-spin text-[var(--pm-accent)]" />
        Buy Box লোড হচ্ছে...
      </div>
    );
  }

  if (!buyBoxData || !buyBoxData.winner) {
    return (
      <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-5 text-xs text-zinc-500 space-y-2">
        <p className="font-bold text-zinc-300">এই PMIN-এ এখনো কোনো অ্যাকটিভ অফার নেই।</p>
        <button
          type="button"
          onClick={() => setIsLinkModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-amber-400/50 text-[11px] font-bold text-zinc-400 hover:text-amber-300 flex items-center justify-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> প্রথম অফার লিঙ্ক করুন
        </button>
        <LinkInventoryModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
          asin={asin}
          productTitle={productTitle}
          onOfferLinked={(newOffer) => linkSellerOffer(newOffer)}
        />
      </div>
    );
  }

  const winner = buyBoxData.winner;
  const isLowStock = winner.stock > 0 && winner.stock <= 20;

  const handleCopyAsin = () => {
    navigator.clipboard.writeText(asin);
    setIsCopiedAsin(true);
    toast.success(`ASIN ${asin} ক্লিপবোর্ডে কপি করা হয়েছে!`);
    setTimeout(() => setIsCopiedAsin(false), 2000);
  };

  return (
    <>
      <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">Unique Code:</span>
            <button
              type="button"
              onClick={handleCopyAsin}
              className="px-2 py-0.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
              title="Click to copy ASIN"
            >
              <span>{asin}</span>
              {isCopiedAsin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
            </button>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase">
            {source === 'api' ? '✓ Live Catalog' : '✓ Demo Catalog'}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2.5xl sm:text-3xl font-black text-[var(--pm-accent)] tabular-nums">
              ৳{winner.price.toLocaleString('bn-BD')}
            </span>
            {winner.originalPrice && winner.originalPrice > winner.price && (
              <span className="text-xs text-zinc-500 line-through tabular-nums">
                ৳{winner.originalPrice.toLocaleString('bn-BD')}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {winner.shippingFee === 0 ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> ফ্রি ডেলিভারি
              </span>
            ) : (
              <span className="text-zinc-400">+ ৳{winner.shippingFee} ডেলিভারি</span>
            )}
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">{winner.estimatedDelivery}</span>
          </div>
        </div>

        <div>
          {winner.stock > 0 ? (
            isLowStock ? (
              <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> শুধুমাত্র {winner.stock} টি স্টকে
              </p>
            ) : (
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ইন স্টক
              </p>
            )
          ) : (
            <p className="text-xs font-bold text-zinc-500">স্টক আউট</p>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">শিপিং:</span>
            <span className="font-bold text-white flex items-center gap-1">
              {winner.fulfillmentType === 'FBP' ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> PaikarMart Fulfilled
                </>
              ) : (
                'সেলার ডেলিভারি (FBM)'
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">বিক্রেতা:</span>
            <span className="font-bold text-white flex items-center gap-1 truncate max-w-[170px]" title={winner.sellerName}>
              <Store className="w-3 h-3 text-[var(--pm-accent)]" /> {winner.sellerName}
            </span>
          </div>
          {winner.moq > 1 && (
            <div className="flex justify-between items-center pt-1 border-t border-white/[0.04]">
              <span className="text-zinc-500">MOQ:</span>
              <span className="font-black text-amber-400">{winner.moq} পিস</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-zinc-400">পরিমাণ:</span>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(winner.moq || 1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-black text-white tabular-nums">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(Math.max(winner.stock, 1), quantity + 1))}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold"
            >
              +
            </button>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={() => onAddToCart(winner, quantity)}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-black flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4 text-[var(--pm-accent)]" /> কার্টে যুক্ত করুন
          </button>
          <button
            type="button"
            onClick={() => onBuyNow(winner, quantity)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF7A00] text-black text-xs font-black flex items-center justify-center gap-2"
          >
            এখনই অর্ডার করুন
          </button>
        </div>

        {allOffers.length > 1 && (
          <div className="pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setIsOtherSellersOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-bold text-zinc-300 flex items-center justify-between group"
            >
              <div className="text-left">
                <span className="text-[11px] block font-black text-amber-400">
                  New ({allOffers.length}) from ৳{buyBoxData.lowestPrice.toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-zinc-500 block">অন্যান্য সেলার তুলনা</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400" />
            </button>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIsLinkModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-amber-400/50 text-[11px] font-bold text-zinc-400 hover:text-amber-300 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> আপনিও এই পণ্য বিক্রি করুন
          </button>
        </div>
      </div>

      <OtherSellersModal
        isOpen={isOtherSellersOpen}
        onClose={() => setIsOtherSellersOpen(false)}
        offers={allOffers}
        onSelectOffer={(offer) => onAddToCart(offer, offer.moq || 1)}
        onAddToCart={(offer) => onAddToCart(offer, offer.moq || 1)}
        productTitle={productTitle}
      />

      <LinkInventoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        asin={asin}
        productTitle={productTitle}
        onOfferLinked={(newOffer) => linkSellerOffer(newOffer)}
      />
    </>
  );
};
