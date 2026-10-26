import React, { useState } from "react";
import {
  X, CheckCircle2, AlertCircle, Sparkles, TrendingDown,
  Truck, ShieldCheck, Box, Package, Tag, ArrowRight, Zap, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import type { SellerProductOffer } from "../types/product.types";

interface LinkInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  asin: string;
  productTitle: string;
  brand: string;
  currentBuyBoxWinner: SellerProductOffer | null;
  onOfferLinked: (newOffer: SellerProductOffer) => void;
}

export const LinkInventoryModal: React.FC<LinkInventoryModalProps> = ({
  isOpen,
  onClose,
  asin,
  productTitle,
  brand,
  currentBuyBoxWinner,
  onOfferLinked,
}) => {
  const currentBuyBoxLandedPrice = currentBuyBoxWinner
    ? currentBuyBoxWinner.price + currentBuyBoxWinner.shippingFee
    : 450;

  const [sellerSku, setSellerSku] = useState(`SKU-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
  const [condition, setCondition] = useState<"New" | "Refurbished" | "Open Box" | "Wholesale Lot">("New");
  const [price, setPrice] = useState<number>(currentBuyBoxWinner ? currentBuyBoxWinner.price - 10 : 420);
  const [originalPrice, setOriginalPrice] = useState<number>(currentBuyBoxWinner ? Math.round(currentBuyBoxWinner.price * 1.3) : 600);
  const [stock, setStock] = useState<number>(50);
  const [minOrderQty, setMinOrderQty] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<"paikar_express" | "seller_fulfilled">("paikar_express");
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [dispatchDays, setDispatchDays] = useState<number>(1);
  const [warranty, setWarranty] = useState<string>("7 Days Replacement Warranty");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const userLandedPrice = Number(price) + Number(shippingFee);
  const willWinBuyBox =
    userLandedPrice < currentBuyBoxLandedPrice ||
    (userLandedPrice === currentBuyBoxLandedPrice && fulfillmentType === "paikar_express");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sellerSku.trim()) {
      toast.error("অনুগ্রহ করে আপনার শপের SKU লিখুন");
      return;
    }
    if (price <= 0 || stock <= 0) {
      toast.error("মূল্য এবং স্টক সংখ্যা সঠিক হতে হবে");
      return;
    }

    setIsSubmitting(true);

    const newOffer: SellerProductOffer = {
      id: `off-${Date.now()}`,
      masterProductId: "mp-1",
      asin: asin,
      sellerId: "v-my-store",
      sellerName: "My Merchant Store (You)",
      sellerRating: 4.9,
      sellerReviewCount: 88,
      sellerLocation: "ঢাকা, বাংলাদেশ",
      sellerVerified: true,
      sellerSku: sellerSku.trim(),
      condition: condition,
      price: Number(price),
      originalPrice: Number(originalPrice),
      stock: Number(stock),
      minOrderQty: Number(minOrderQty),
      fulfillmentType: fulfillmentType,
      shippingFee: Number(shippingFee),
      freeShippingAbove: shippingFee === 0 ? 0 : 1500,
      dispatchTimeDays: Number(dispatchDays),
      warranty: warranty,
      isBuyBoxWinner: willWinBuyBox,
      isActive: true,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Attempt backend sync if available
    try {
      await fetch(`/api/v1/catalog/master/${asin}/offers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newOffer,
          sellerId: "v1", // current seller id
        }),
      }).catch(() => null);
    } catch {
      // Dev mode fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      onOfferLinked(newOffer);
      toast.success(`ইনভেন্টরি সফলভাবে যুক্ত হয়েছে! ASIN: ${asin}`);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#141624] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-left text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF7A00]/20 border border-[#FF7A00]/30 flex items-center justify-center text-[#FF7A00]">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-[#FF7A00] px-2 py-0.5 rounded-full border border-orange-500/20">
                  ASIN Master Catalog Link
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {asin}
                </span>
              </div>
              <h2 className="text-base font-black text-white mt-0.5 line-clamp-1">
                {productTitle}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Buy Box Live Competitive Analysis Banner */}
          <div className={`p-4 rounded-2xl border transition-all ${
            willWinBuyBox
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-amber-500/10 border-amber-500/30 text-amber-300"
          }`}>
            <div className="flex items-start gap-3">
              {willWinBuyBox ? (
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <TrendingDown className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-1">
                <p className="font-black text-sm">
                  {willWinBuyBox
                    ? "🏆 অভিনন্দন! আপনার এই অফারটি 'Buy Box' জয় করবে!"
                    : "⚠️ সতর্কবার্তা: আপনার অফারটি বর্তমান 'Buy Box' এর চেয়ে বেশি।"}
                </p>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  বর্তমান সেরা ল্যান্ডেড মূল্য: <strong className="underline">৳{currentBuyBoxLandedPrice}</strong> (পণ্য + শিপিং)।
                  আপনার ল্যান্ডেড মূল্য: <strong className="underline">৳{userLandedPrice}</strong> (৳{price} + ৳{shippingFee} শিপিং)।
                  {willWinBuyBox
                    ? " গ্রাহকরা সরাসরি আপনার স্টক থেকে মূল 'অর্ডার করুন' বাটনে কিনবেন।"
                    : " ফিচার্ড স্পট পেতে আপনার মূল্য ৳" + (currentBuyBoxLandedPrice - 5) + " বা তার নিচে রাখুন।"}
                </p>
              </div>
            </div>
          </div>

          <form id="inventory-offer-form" onSubmit={handleSubmit} className="space-y-4">

            {/* Row 1: SKU & Condition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  আপনার অভ্যন্তরীণ SKU (Seller SKU)
                </label>
                <div className="relative">
                  <Tag className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={sellerSku}
                    onChange={(e) => setSellerSku(e.target.value)}
                    placeholder="e.g. WH-TSHIRT-001"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF7A00] outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  পণ্যের কন্ডিশন (Condition)
                </label>
                <select
                  value={condition}
                  onChange={(e: any) => setCondition(e.target.value)}
                  className="w-full bg-[#1c1f33] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FF7A00] outline-none cursor-pointer"
                >
                  <option value="New">ব্র্যান্ড নিউ (Brand New)</option>
                  <option value="Wholesale Lot">পাইকারি বাল্ক লট (Wholesale Lot)</option>
                  <option value="Open Box">ওপেন বক্স (Open Box Inspection)</option>
                  <option value="Refurbished">রিফার্বিশড (Refurbished Grade A)</option>
                </select>
              </div>
            </div>

            {/* Row 2: Price & Original Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  আপনার বিক্রয় মূল্য (BDT) <span className="text-[#FF7A00]">*</span>
                </label>
                <div className="relative">
                  <span className="text-zinc-500 absolute left-3 top-2.5 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={1}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-sm font-black text-white focus:border-[#FF7A00] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  পূর্বের/রেগুলার মূল্য (স্ট্রাইকথ্রু এর জন্য)
                </label>
                <div className="relative">
                  <span className="text-zinc-500 absolute left-3 top-2.5 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    min={price}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-xs text-zinc-300 focus:border-[#FF7A00] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Stock Quantity & Min Order Qty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  উপলব্ধ স্টক ইউনিট (Stock Available) <span className="text-[#FF7A00]">*</span>
                </label>
                <div className="relative">
                  <Box className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    min={1}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-white focus:border-[#FF7A00] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  সর্বনিম্ন অর্ডার পরিমাণ (MOQ)
                </label>
                <input
                  type="number"
                  value={minOrderQty}
                  onChange={(e) => setMinOrderQty(Number(e.target.value))}
                  min={1}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FF7A00] outline-none"
                />
              </div>
            </div>

            {/* Row 4: Fulfillment Method & Shipping Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  ফুলফিলমেন্ট পদ্ধতি (Fulfillment)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType("paikar_express");
                      setShippingFee(0);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfillmentType === "paikar_express"
                        ? "bg-[#FF7A00]/15 border-[#FF7A00] text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#FF7A00]" />
                      <span className="text-xs font-black">Paikar Express</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">FBA সমতুল্য ফাস্ট হাব</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType("seller_fulfilled")}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      fulfillmentType === "seller_fulfilled"
                        ? "bg-indigo-600/20 border-indigo-500 text-white"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-black">Merchant Ship</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block mt-0.5">মার্চেন্ট নিজস্ব কুরিয়ার</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  ডেলিভারি চার্জ (Shipping Fee in BDT)
                </label>
                <div className="relative">
                  <span className="text-zinc-500 absolute left-3 top-2.5 font-bold text-xs">৳</span>
                  <input
                    type="number"
                    value={shippingFee}
                    onChange={(e) => setShippingFee(Number(e.target.value))}
                    min={0}
                    placeholder="0 for Free Shipping"
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-8 pr-3 py-2.5 text-xs font-bold text-white focus:border-[#FF7A00] outline-none"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">
                  ০ লিখলে 'ফ্রি ডেলিভারি' হিসেবে গ্রাহকের নিকট প্রদর্শিত হবে।
                </span>
              </div>
            </div>

            {/* Row 5: Dispatch latency & Warranty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  শিপিং ডিসপ্যাচ টাইম (Dispatch Speed)
                </label>
                <select
                  value={dispatchDays}
                  onChange={(e) => setDispatchDays(Number(e.target.value))}
                  className="w-full bg-[#1c1f33] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FF7A00] outline-none cursor-pointer"
                >
                  <option value={1}>১ দিন (একই দিন বা পরের দিন শিপিং - সর্বোচ্চ স্কোর)</option>
                  <option value={2}>২ দিন (স্ট্যান্ডার্ড ডিসপ্যাচ)</option>
                  <option value={3}>৩-৫ দিন (মফস্বল মার্চেন্ট)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  ওয়ারেন্টি ও রিপ্লেসমেন্ট পলিসি
                </label>
                <input
                  type="text"
                  value={warranty}
                  onChange={(e) => setWarranty(e.target.value)}
                  placeholder="e.g. 7 Days Replacement Warranty"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:border-[#FF7A00] outline-none"
                />
              </div>
            </div>

          </form>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/5 bg-white/[0.02] flex items-center justify-between gap-4">
          <div className="text-xs">
            <span className="text-zinc-400">আপনার চূড়ান্ত ল্যান্ডেড প্রাইস: </span>
            <span className="text-base font-black text-[#FF7A00]">৳{userLandedPrice}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              form="inventory-offer-form"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>লাইভ যুক্ত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>ইনভেন্টরি অফার লাইভ করুন</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
