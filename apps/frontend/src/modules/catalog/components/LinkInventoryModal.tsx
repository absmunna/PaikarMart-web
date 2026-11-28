import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Loader2 } from 'lucide-react';
import { SellerOffer } from '../types/catalog.types';
import { catalogApi } from '../services/catalogApi';
import { toast } from 'sonner';

interface LinkInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  asin: string;
  productTitle: string;
  onOfferLinked: (offer: Omit<SellerOffer, 'id' | 'updatedAt'>) => void;
}

export const LinkInventoryModal: React.FC<LinkInventoryModalProps> = ({
  isOpen,
  onClose,
  asin,
  productTitle,
  onOfferLinked,
}) => {
  const [sellerName, setSellerName] = useState('মুন্না টেক্সটাইল ও ডিস্ট্রিবিউশন');
  const [sellerSku, setSellerSku] = useState(`SKU-${Date.now().toString().slice(-6)}`);
  const [price, setPrice] = useState('325');
  const [stock, setStock] = useState('100');
  const [moq, setMoq] = useState('15');
  const [shippingFee, setShippingFee] = useState('0');
  const [estimatedDelivery, setEstimatedDelivery] = useState('আগামীকাল (১-২ দিন)');
  const [fulfillmentType, setFulfillmentType] = useState<'FBP' | 'FBM'>('FBP');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      toast.error('সঠিক মূল্য প্রদান করুন।');
      return;
    }
    if (!stock || Number(stock) <= 0) {
      toast.error('স্টকের পরিমাণ প্রদান করুন।');
      return;
    }

    const localOffer: Omit<SellerOffer, 'id' | 'updatedAt'> = {
      asin,
      sellerId: `seller-${Date.now()}`,
      sellerName,
      sellerRating: 4.9,
      positiveFeedbackPct: 99,
      location: 'ঢাকা সেন্ট্রাল হাব',
      isVerified: true,
      sellerSku,
      price: Number(price),
      originalPrice: Math.round(Number(price) * 1.3),
      condition: 'new',
      stock: Number(stock),
      moq: Number(moq) || 1,
      fulfillmentType,
      shippingFee: Number(shippingFee) || 0,
      estimatedDelivery,
    };

    setSubmitting(true);
    try {
      await catalogApi.upsertOffer({
        pmin: asin,
        price: Number(price),
        originalPrice: Math.round(Number(price) * 1.3),
        stock: Number(stock),
        moq: Number(moq) || 1,
        shippingFee: Number(shippingFee) || 0,
        deliveryEta: estimatedDelivery,
        condition: 'New',
        fulfillmentType: fulfillmentType === 'FBP' ? 'paikar_express' : 'seller_fulfilled',
        isActive: true,
      });
      toast.success('অফার লাইভ ক্যাটালগে সেভ হয়েছে!');
    } catch (err: any) {
      console.warn('catalogApi.upsertOffer failed, local only:', err);
      const msg = err?.response?.data?.error || err?.message || 'API offline';
      toast.message('লোকাল লিঙ্ক OK', { description: String(msg) });
    } finally {
      setSubmitting(false);
    }

    onOfferLinked(localOffer);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl z-10 text-white space-y-4"
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-accent)]">
                  মাস্টার ক্যাটালগে সেলার অফার লিঙ্ক
                </span>
                <h3 className="text-base font-bold text-white mt-1">Sell on ASIN: {asin}</h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{productTitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">শপ/ভেন্ডর নাম</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">Seller SKU</label>
                  <input
                    type="text"
                    value={sellerSku}
                    onChange={(e) => setSellerSku(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">মূল্য (৳)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">স্টক</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">MOQ</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">শিপিং (৳)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">ফুলফিলমেন্ট</label>
                  <select
                    value={fulfillmentType}
                    onChange={(e) => setFulfillmentType(e.target.value as 'FBP' | 'FBM')}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                  >
                    <option value="FBP" className="bg-[#12141f]">
                      PaikarAssured (FBP)
                    </option>
                    <option value="FBM" className="bg-[#12141f]">
                      Merchant (FBM)
                    </option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-2 text-[11px] text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  ভালো দর ও শিপিং স্পিড থাকলে আপনি <strong>Buy Box</strong> জিততে পারেন। সেভ হয় backend{' '}
                  <code className="text-amber-400">/catalog/offers</code> এ।
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[#FF8A00] text-black font-black shadow-lg active:scale-95 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  ইনভেন্টরি লিঙ্ক করুন
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
