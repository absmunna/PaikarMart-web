import React, { useState } from "react";
import { Store, Star, MapPin, CheckCircle2, ShoppingBag, Package, Phone, Mail, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function StoreProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Store Cover */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-orange-950 via-zinc-900 to-amber-900 mb-6">
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Store Header */}
      <div className="relative px-4 -mt-16 md:-mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-end gap-5">
          <img 
            src="https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=250" 
            alt="Store Logo" 
            className="h-28 w-28 md:h-36 md:w-36 rounded-3xl object-cover border-4 border-[#0f111a] shadow-2xl bg-zinc-900"
            referrerPolicy="no-referrer"
          />
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-black text-white">Bismillah Enterprise & Wholesale</h1>
              <CheckCircle2 className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <p className="text-xs text-zinc-400 flex items-center gap-1.5 mb-2">
              <MapPin className="h-3.5 w-3.5 text-[#FF7A00]" /> Khatunganj, Chattogram, Bangladesh
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-300">
              <span className="flex items-center gap-1 font-bold text-white"><Star className="h-3.5 w-3.5 text-amber-400 fill-current" /> 4.9 Rating (3,420 Reviews)</span>
              <span className="flex items-center gap-1 font-bold text-emerald-400">Verified Wholesaler</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25">
            Follow Store
          </button>
          <button className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10">
            Contact Seller
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <h3 className="text-base font-black text-white mb-4">Store Products & Wholesale Offers</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-[#141624] border border-white/5 rounded-3xl overflow-hidden p-4 flex flex-col justify-between shadow-xl">
            <div>
              <div className="aspect-square w-full rounded-2xl bg-zinc-900 mb-3 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=400" 
                  alt="Product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">
                Wholesale Cotton Panjabi Bulk Lot #{i}
              </h4>
              <p className="text-[10px] text-zinc-400 mb-2">MOQ: 10 Pieces</p>
              <p className="text-sm font-black text-[#FF7A00]">৳1,450 <span className="text-[10px] text-zinc-500 font-normal">/ piece</span></p>
            </div>
            <button className="w-full mt-4 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black transition-all">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
