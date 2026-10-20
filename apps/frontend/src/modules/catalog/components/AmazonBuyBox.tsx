import React, { useState } from 'react';
import { 
  ShieldCheck, Truck, Store, ShoppingCart, 
  Copy, Check, Plus, AlertCircle, ArrowRight, Zap 
} from 'lucide-react';
import { toast } from 'sonner';
import { SellerOffer, BuyBoxResult } from '../types/catalog.types';
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
  onBuyNow
}) => {
  const { getBuyBox, getOffers, linkSellerOffer } = useCatalogStore();
  const buyBoxData = getBuyBox(asin);
  const allOffers = getOffers(asin);

  const [quantity, setQuantity] = useState(buyBoxData?.winner.moq || 1);
  const [isCopiedAsin, setIsCopiedAsin] = useState(false);
  const [isOtherSellersOpen, setIsOtherSellersOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  if (!buyBoxData || !buyBoxData.winner) {
    return null;
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
        {/* ASIN / PMIN Header Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
              Unique Code:
            </span>
            <button
              onClick={handleCopyAsin}
              className="px-2 py-0.5 rounded-lg bg-black/40 hover:bg-black/60 border border-white/10 text-[10px] font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-all cursor-pointer"
              title="Click to copy ASIN"
            >
              <span>{asin}</span>
              {isCopiedAsin ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 opacity-60" />}
            </button>
          </div>

          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase">
            ✓ Verified Catalog
          </span>
        </div>

        {/* Pricing & Featured Offer Notice */}
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
                <Truck className="w-3.5 h-3.5" /> ফ্রি ডেলিভারি (Free Delivery)
              </span>
            ) : (
              <span className="text-zinc-400">
                + ৳{winner.shippingFee} ডেলিভারি চার্জ
              </span>
            )}
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300 font-medium">{winner.estimatedDelivery}</span>
          </div>
        </div>

        {/* Stock Status */}
        <div>
          {winner.stock > 0 ? (
            isLowStock ? (
              <p className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> শুধুমাত্র {winner.stock} টি স্টকে অবশিষ্ট আছে - দ্রুত অর্ডার করুন!
              </p>
            ) : (
              <p className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ইন স্টক (In Stock)
              </p>
            )
          ) : (
            <p className="text-xs font-bold text-zinc-500">
              বর্তমানে স্টক আউট (Temporarily Out of Stock)
            </p>
          )}
        </div>

        {/* Fulfillment & Seller Ownership Details */}
        <div className="p-3 rounded-2xl bg-black/30 border border-white/5 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">শিপিং মাধ্যম:</span>
            <span className="font-bold text-white flex items-center gap-1">
              {winner.fulfillmentType === 'FBP' ? (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> PaikarMart Fulfilled
                </>
              ) : (
                'সেলার নিজস্ব ডেলিভারি (FBM)'
              )}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">বিক্রেতা (Sold By):</span>
            <span className="font-bold text-white flex items-center gap-1 truncate max-w-[170px]" title={winner.sellerName}>
              <Store className="w-3 h-3 text-[var(--pm-accent)]" /> {winner.sellerName}
            </span>
          </div>
          {winner.moq > 1 && (
            <div className="flex justify-between items-center pt-1 border-t border-white/[0.04]">
              <span className="text-zinc-500">নূন্যতম অর্ডার (MOQ):</span>
              <span className="font-black text-amber-400">{winner.moq} পিস</span>
            </div>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-bold text-zinc-400">অর্ডারের পরিমাণ:</span>
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
            <button
              onClick={() => setQuantity(Math.max(winner.moq || 1, quantity - 1))}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-black text-white tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(winner.stock, quantity + 1))}
              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => onAddToCart(winner, quantity)}
            className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 active:scale-98 text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShoppingCart className="w-4 h-4 text-[var(--pm-accent)]" /> কার্টে যুক্ত করুন (Add to Cart)
          </button>

          <button
            onClick={() => onBuyNow(winner, quantity)}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] active:scale-98 text-black text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#FF7A00]/25"
          >
            এখনই অর্ডার করুন (Buy Now)
          </button>
        </div>

        {/* "Other Sellers on PaikarMart" Link Box */}
        {allOffers.length > 1 && (
          <div className="pt-2 border-t border-white/[0.06]">
            <button
              onClick={() => setIsOtherSellersOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs font-bold text-zinc-300 hover:text-white transition-all flex items-center justify-between cursor-pointer group"
            >
              <div className="text-left">
                <span className="text-[11px] block font-black text-amber-400">
                  New ({allOffers.length}) from ৳{buyBoxData.lowestPrice.toLocaleString('bn-BD')}
                </span>
                <span className="text-[9px] text-zinc-500 block">অন্যান্য {allOffers.length - 1} জন সেলারের দর তুলনা করুন</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        )}

        {/* "Have one to sell? Sell on PaikarMart" Box */}
        <div className="pt-2">
          <button
            onClick={() => setIsLinkModalOpen(true)}
            className="w-full py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-amber-400/50 hover:bg-amber-400/5 text-[11px] font-bold text-zinc-400 hover:text-amber-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> আপনিও কি এই পণ্যটি বিক্রি করতে চান? অফার লিঙ্ক করুন
          </button>
        </div>
      </div>

      {/* Modals */}
      <OtherSellersModal
        isOpen={isOtherSellersOpen}
        onClose={() => setIsOtherSellersOpen(false)}
        offers={allOffers}
        onSelectOffer={(offer) => {
          onAddToCart(offer, offer.moq || 1);
        }}
        onAddToCart={(offer) => {
          onAddToCart(offer, offer.moq || 1);
        }}
        productTitle={productTitle}
      />

      <LinkInventoryModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        asin={asin}
        productTitle={productTitle}
        onOfferLinked={(newOffer) => {
          linkSellerOffer(newOffer);
        }}
      />
    </>
  );
};
