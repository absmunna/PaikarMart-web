import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, ShieldCheck, Tag, Box, Truck, CheckCircle2 } from 'lucide-react';
import { SellerOffer } from '../types/catalog.types';
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
  onOfferLinked
}) => {
  const [sellerName, setSellerName] = useState('মুন্না টেক্সটাইল ও ডিস্ট্রিবিউশন');
  const [sellerSku, setSellerSku] = useState(`SKU-${Date.now().toString().slice(-6)}`);
  const [price, setPrice] = useState('325');
  const [stock, setStock] = useState('100');
  const [moq, setMoq] = useState('15');
  const [shippingFee, setShippingFee] = useState('0');
  const [estimatedDelivery, setEstimatedDelivery] = useState('আগামীকাল (১-২ দিন)');
  const [fulfillmentType, setFulfillmentType] = useState<'FBP' | 'FBM'>('FBP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || Number(price) <= 0) {
      toast.error('সঠিক মূল্য প্রদান করুন।');
      return;
    }
    if (!stock || Number(stock) <= 0) {
      toast.error('স্টকের পরিমাণ প্রদান করুন।');
      return;
    }

    onOfferLinked({
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
      estimatedDelivery
    });

    toast.success('আপনার ইনভেন্টরি সফলভাবে এই মাস্টার প্রোডাক্টের সাথে লিঙ্ক করা হয়েছে!');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-xs"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-lg bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-6 shadow-2xl z-10 text-white space-y-4"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--pm-accent)]">
                  মাস্টার ক্যাটালগে সেলার অফার লিঙ্ক
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Sell Your Offer on this Listing (ASIN: {asin})
                </h3>
                <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">
                  {productTitle}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">আপনার শপ/ভেন্ডর নাম</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">আপনার প্রাইভেট SKU (Seller SKU)</label>
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
                  <label className="font-bold text-zinc-300">অফার মূল্য (BDT ৳)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-[var(--pm-accent)]"
                    placeholder="320"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">স্টক সংখ্যা (Qty)</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    placeholder="50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">MOQ (নূন্যতম অর্ডার)</label>
                  <input
                    type="number"
                    value={moq}
                    onChange={(e) => setMoq(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">শিপিং চার্জ (৳ / ফ্রি হলে ০)</label>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-zinc-300">ফুলফিলমেন্ট মেথড</label>
                  <select
                    value={fulfillmentType}
                    onChange={(e) => setFulfillmentType(e.target.value as 'FBP' | 'FBM')}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[var(--pm-accent)]"
                  >
                    <option value="FBP" className="bg-[#12141f]">PaikarAssured (FBP - ওয়্যারহাউস)</option>
                    <option value="FBM" className="bg-[#12141f]">Merchant (FBM - নিজস্ব ডেলিভারি)</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-2 text-[11px] text-zinc-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  আপনার দেওয়া দর এবং শিপিং স্পিড যদি বর্তমান বিজয়ী সেলারের চেয়ে উন্নত হয়, তবে আপনি সরাসরি <strong>Buy Box (Featured Offer)</strong> অর্জন করবেন!
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[#FF8A00] text-black font-black transition-all cursor-pointer shadow-lg active:scale-95"
                >
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
