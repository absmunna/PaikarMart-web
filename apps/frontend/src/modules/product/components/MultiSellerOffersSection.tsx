import React, { useState } from "react";
import {
  Store, Star, Truck, ShieldCheck, Zap, CheckCircle2,
  ArrowUpDown, Plus, ShoppingCart, Lock, Edit3, Check, X,
  ExternalLink, ChevronDown, ChevronUp, AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import type { SellerProductOffer } from "../types/product.types";
import { useCartStore } from "@/modules/cart";

interface MultiSellerOffersSectionProps {
  asin: string;
  productTitle: string;
  offers: SellerProductOffer[];
  buyBoxWinner: SellerProductOffer | null;
  onOpenLinkModal: () => void;
  onUpdateOffer: (offerId: string, updates: Partial<SellerProductOffer>) => void;
  onSelectBuyBoxOffer: (offer: SellerProductOffer) => void;
  activeSelectedOfferId: string | null;
}

export const MultiSellerOffersSection: React.FC<MultiSellerOffersSectionProps> = ({
  asin,
  productTitle,
  offers,
  buyBoxWinner,
  onOpenLinkModal,
  onUpdateOffer,
  onSelectBuyBoxOffer,
  activeSelectedOfferId,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);
  const [editShipping, setEditShipping] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const startEdit = (offer: SellerProductOffer) => {
    setEditingOfferId(offer.id);
    setEditPrice(offer.price);
    setEditStock(offer.stock);
    setEditShipping(offer.shippingFee);
  };

  const saveEdit = (offerId: string) => {
    if (editPrice <= 0 || editStock < 0) {
      toast.error("সঠিক মূল্য ও স্টক দিন");
      return;
    }
    onUpdateOffer(offerId, {
      price: editPrice,
      stock: editStock,
      shippingFee: editShipping,
      updatedAt: new Date().toISOString(),
    });
    setEditingOfferId(null);
    toast.success("অফার রিয়েল-টাইমে আপডেট করা হয়েছে!");
  };

  const handleAddOfferToCart = (offer: SellerProductOffer) => {
    addItem({
      id: `${offer.asin}-${offer.id}`,
      name: productTitle,
      title: `${productTitle} (বিক্রেতা: ${offer.sellerName})`,
      price: offer.price,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
      store: offer.sellerName,
      vendorName: offer.sellerName,
      sellerId: offer.sellerId,
      quantity: Math.max(1, offer.minOrderQty),
      portal: offer.condition === "Wholesale Lot" ? "wholesale" : "retail",
    });
    toast.success(`${offer.sellerName} এর অফার কার্টে যুক্ত হয়েছে (৳${offer.price})`);
  };

  const lowestPrice = Math.min(...offers.map((o) => o.price));

  return (
    <div className="mt-8 bg-[#141624] p-6 md:p-8 rounded-[2rem] border border-white/5 shadow-2xl text-left text-white select-none">

      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-[#FF7A00]">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>অন্যান্য বিক্রেতাদের অফার (Multi-Seller Offers)</span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-[#FF7A00] px-2.5 py-0.5 rounded-full border border-orange-500/30">
                  {offers.length} জন বিক্রেতা তালিকাভুক্ত
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                একই ASIN (<span className="font-mono text-zinc-300 font-bold">{asin}</span>) এ সরাসরি মূল্য, স্টক ও শিপিং স্পিড তুলনা করুন।
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: List on this ASIN */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenLinkModal}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-[#FF7A00] hover:from-orange-600 hover:to-[#e06b00] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>এই পণ্যটি আপনিও বিক্রি করুন</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="টগল করুন"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Overview Stat Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">সর্বনিম্ন মূল্য</span>
          <span className="text-sm font-black text-emerald-400 mt-0.5 block">৳{lowestPrice} BDT</span>
        </div>
        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">ফিচার্ড Buy Box বিজয়ী</span>
          <span className="text-xs font-black text-[#FF7A00] mt-0.5 block line-clamp-1">
            {buyBoxWinner?.sellerName || "N/A"}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">ফুলফিলমেন্ট সাপোর্ট</span>
          <span className="text-xs font-bold text-zinc-300 mt-0.5 flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FF7A00]" /> Paikar Express + মার্চেন্ট
          </span>
        </div>
        <div className="p-3 rounded-xl bg-black/20 border border-white/5">
          <span className="text-[10px] font-bold text-zinc-400 block uppercase">গ্যারান্টিড এসক্রো</span>
          <span className="text-xs font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> ১০০% সুরক্ষিত কেনাকাটা
          </span>
        </div>
      </div>

      {/* Expanded Offers List */}
      {isExpanded && (
        <div className="space-y-3 mt-4">
          {offers.map((offer) => {
            const isWinner = offer.isBuyBoxWinner;
            const isSelected = activeSelectedOfferId === offer.id;
            const isEditing = editingOfferId === offer.id;
            const landedTotal = offer.price + offer.shippingFee;

            return (
              <div
                key={offer.id}
                className={`p-4 md:p-5 rounded-2xl border transition-all ${
                  isWinner
                    ? "bg-[#FF7A00]/5 border-[#FF7A00]/40 shadow-lg shadow-orange-500/5 ring-1 ring-[#FF7A00]/20"
                    : isSelected
                    ? "bg-white/10 border-white/20"
                    : "bg-black/30 border-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

                  {/* Left Column: Seller info & badges */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-white hover:text-[#FF7A00] transition-colors cursor-pointer">
                        {offer.sellerName}
                      </h3>

                      {offer.sellerVerified && (
                        <span className="inline-flex items-center gap-1 text-[8.5px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-2.5 h-2.5" /> ভেরিফাইড
                        </span>
                      )}

                      {isWinner && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-black bg-[#FF7A00] text-white px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                          🏆 Buy Box Winner
                        </span>
                      )}

                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10">
                        {offer.condition}
                      </span>
                    </div>

                    {/* Ratings & Location & SKU */}
                    <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="font-bold text-white text-xs">{offer.sellerRating}</span>
                        <span className="text-zinc-500">({offer.sellerReviewCount} রিভিউ)</span>
                      </div>
                      <span>·</span>
                      <span>{offer.sellerLocation}</span>
                      <span>·</span>
                      <span className="font-mono text-[10px] text-zinc-500">SKU: {offer.sellerSku}</span>
                    </div>

                    {/* Fulfillment and delivery promises */}
                    <div className="flex items-center gap-3 text-xs flex-wrap pt-1">
                      {offer.fulfillmentType === "paikar_express" ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#FF7A00] bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
                          <Zap className="w-3 h-3" /> PaikarMart Express (পরের দিন ডেলিভারি)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-zinc-300 bg-white/5 px-2 py-0.5 rounded-md">
                          <Truck className="w-3 h-3 text-zinc-400" /> মার্চেন্ট ডিসপ্যাচ ({offer.dispatchTimeDays} দিন)
                        </span>
                      )}

                      <span className="text-[10px] text-zinc-400">
                        {offer.shippingFee === 0 ? (
                          <strong className="text-emerald-400 font-bold">ফ্রি শিপিং</strong>
                        ) : (
                          `শিপিং চার্জ: ৳${offer.shippingFee}`
                        )}
                      </span>

                      {offer.warranty && (
                        <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                          🛡️ {offer.warranty}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: Price & Stock (View or Edit mode) */}
                  <div className="flex items-center gap-6 lg:border-l lg:border-r border-white/5 lg:px-6 py-2">
                    {isEditing ? (
                      <div className="space-y-2 w-full max-w-xs">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <span className="text-[9px] text-zinc-400 block font-bold">মূল্য (৳)</span>
                            <input
                              type="number"
                              value={editPrice}
                              onChange={(e) => setEditPrice(Number(e.target.value))}
                              className="w-full bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none focus:border-[#FF7A00]"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 block font-bold">স্টক</span>
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-full bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none focus:border-[#FF7A00]"
                            />
                          </div>
                          <div>
                            <span className="text-[9px] text-zinc-400 block font-bold">শিপিং (৳)</span>
                            <input
                              type="number"
                              value={editShipping}
                              onChange={(e) => setEditShipping(Number(e.target.value))}
                              className="w-full bg-black/60 border border-white/20 rounded-lg px-2 py-1 text-xs font-bold text-white outline-none focus:border-[#FF7A00]"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(offer.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3 h-3" /> সেভ
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingOfferId(null)}
                            className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold cursor-pointer"
                          >
                            <X className="w-3 h-3" /> বাতিল
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-left space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-white">
                            ৳{offer.price}
                          </span>
                          {offer.originalPrice && offer.originalPrice > offer.price && (
                            <span className="text-xs text-zinc-500 line-through">
                              ৳{offer.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          ল্যান্ডেড সর্বমোট: <strong className="text-[#FF7A00] font-bold">৳{landedTotal}</strong>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-bold">
                          স্টকে আছে: {offer.stock} ইউনিট {offer.minOrderQty > 1 && `(MOQ: ${offer.minOrderQty})`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Actions (Select Buy Box, Add to Cart, Edit) */}
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(offer)}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="বিক্রেতা রিয়েল-টাইম এডিট (মূল্য ও স্টক পরিবর্তন)"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectBuyBoxOffer(offer)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        isSelected
                          ? "bg-white text-zinc-950 font-black shadow-md"
                          : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {isSelected ? "বর্তমান নির্বাচিত" : "অফার নির্বাচন"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddOfferToCart(offer)}
                      className="px-4 py-2.5 bg-[#FF7A00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-[#FF7A00]/20 flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>এই বিক্রেতা থেকে কিনুন</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Seller Integration Tips Box */}
      <div className="mt-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-zinc-400">
        <AlertCircle className="w-4 h-4 text-[#FF7A00] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-zinc-200">
            মার্চেন্টদের জন্য স্বয়ংক্রিয় ASIN ইনভেন্টরি লিংকিং নীতি:
          </p>
          <p className="text-[11px] leading-relaxed">
            একই পণ্যের জন্য ডুপ্লিকেট ক্যাটালগ পেজ তৈরি না করে সরাসরি বিদ্যমান ASIN এ আপনার স্টক ও প্রাইস লিঙ্ক করুন।
            সবচেয়ে সাশ্রয়ী মূল্য, দ্রুত ডেলিভারি এবং উচ্চ রেটিং সম্পন্ন বিক্রেতা স্বয়ংক্রিয়ভাবে মূল 'Buy Box' এ অগ্রাধিকার পাবেন।
          </p>
        </div>
      </div>

    </div>
  );
};
