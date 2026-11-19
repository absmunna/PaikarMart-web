import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, Truck, ShoppingCart, Check, Store } from 'lucide-react';
import { SellerOffer } from '../types/catalog.types';

interface OtherSellersModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: SellerOffer[];
  onSelectOffer: (offer: SellerOffer) => void;
  onAddToCart: (offer: SellerOffer) => void;
  productTitle: string;
}

export const OtherSellersModal: React.FC<OtherSellersModalProps> = ({
  isOpen,
  onClose,
  offers,
  onAddToCart,
  productTitle
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />

          {/* Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md h-full bg-[var(--pm-surface)] border-l border-[var(--pm-border)] p-6 overflow-y-auto shadow-2xl flex flex-col justify-between z-10 text-white"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-accent)]">
                    অন্যান্য বিক্রেতাদের অফার
                  </span>
                  <h3 className="text-sm font-bold text-white mt-0.5 line-clamp-1">
                    Other Sellers on PaikarMart ({offers.length})
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Product preview */}
              <div className="py-3 text-xs text-zinc-400 line-clamp-1 border-b border-white/[0.04]">
                আইটেম: <strong className="text-zinc-200">{productTitle}</strong>
              </div>

              {/* Offers list */}
              <div className="divide-y divide-white/[0.06] mt-2">
                {offers.map((offer, idx) => {
                  const isWinning = offer.isBuyBoxWinner;
                  const totalLanded = offer.price + (offer.shippingFee || 0);

                  return (
                    <div key={offer.id || idx} className="py-4 space-y-3">
                      {/* Top seller info & price */}
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-white tabular-nums">
                              ৳{offer.price.toLocaleString('bn-BD')}
                            </span>
                            {offer.shippingFee === 0 ? (
                              <span className="text-[10px] text-emerald-400 font-bold">
                                + ফ্রি ডেলিভারি
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-400">
                                + ৳{offer.shippingFee} শিপিং
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] text-zinc-500 font-medium mt-0.5">
                            সর্বমোট: ৳{totalLanded.toLocaleString('bn-BD')} · MOQ: {offer.moq || 1} পিস
                          </p>
                        </div>

                        {isWinning && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase tracking-wider">
                            ★ Featured Offer
                          </span>
                        )}
                      </div>

                      {/* Delivery & Fulfillment Details */}
                      <div className="flex items-center gap-2 text-[11px] text-zinc-300">
                        <Truck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>ডেলিভারি: <strong className="text-white">{offer.estimatedDelivery}</strong></span>
                        {offer.fulfillmentType === 'FBP' && (
                          <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[8px] font-black uppercase">
                            PaikarAssured
                          </span>
                        )}
                      </div>

                      {/* Seller Identity & Credibility */}
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-white flex items-center gap-1 truncate max-w-[190px]">
                            <Store className="w-3 h-3 text-[var(--pm-accent)]" /> {offer.sellerName}
                          </span>
                          <span className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400" /> {offer.sellerRating} ({offer.positiveFeedbackPct}% পজিটিভ)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500">
                          <span>📍 {offer.location}</span>
                          <span className="tabular-nums">স্টক: {offer.stock} টি</span>
                        </div>
                      </div>

                      {/* Add to cart action for this specific seller */}
                      <button
                        onClick={() => {
                          onAddToCart(offer);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[var(--pm-accent)] hover:text-black text-white text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" /> এই সেলার থেকে কার্টে যোগ করুন
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom info */}
            <div className="pt-4 border-t border-white/[0.08] text-center">
              <p className="text-[10px] text-zinc-500">
                সবগুলো অফার পাইকারমার্ট এস্ক্রো ট্রেড গ্যারান্টি দ্বারা সম্পূর্ণ সুরক্ষিত।
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
