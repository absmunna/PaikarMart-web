import React, { useState } from "react";
import { CheckCircle2, Film, ShoppingBag, Wrench, Radio, Users, Star, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CreatorChannel() {
  const [activeTab, setActiveTab] = useState<"videos" | "shorts" | "products" | "services">("videos");
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Channel Header Banner */}
      <div className="relative w-full h-48 md:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-[#FF7A00]/40 mb-6">
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Creator Profile Info */}
      <div className="relative px-4 -mt-16 md:-mt-20 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-end gap-5">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250" 
            alt="Creator Avatar" 
            className="h-28 w-28 md:h-36 md:w-36 rounded-3xl object-cover border-4 border-[#0f111a] shadow-2xl"
            referrerPolicy="no-referrer"
          />
          <div className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-black text-white">Dhaka Fashion Hub</h1>
              <CheckCircle2 className="h-5 w-5 text-[#FF7A00]" />
            </div>
            <p className="text-xs text-zinc-400 mb-2">Verified Wholesale Manufacturer & Exporter in Bangladesh</p>
            <div className="flex items-center gap-4 text-xs text-zinc-300">
              <span className="flex items-center gap-1 font-bold text-white"><Users className="h-3.5 w-3.5 text-[#FF7A00]" /> 45.2K Followers</span>
              <span className="flex items-center gap-1 font-bold text-white"><Star className="h-3.5 w-3.5 text-amber-400 fill-current" /> 4.9 Rating</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25">
            Follow Channel
          </button>
          <button className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/10">
            Message
          </button>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-white/10">
        {[
          { id: "videos", label: "Videos (14)", icon: Film },
          { id: "shorts", label: "Shorts (28)", icon: Radio },
          { id: "products", label: "Store Products (42)", icon: ShoppingBag },
          { id: "services", label: "Services (3)", icon: Wrench },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive 
                  ? "bg-white text-zinc-900 shadow-md shadow-white/10" 
                  : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-[#141624] border border-white/5 rounded-3xl overflow-hidden p-4">
            <div className="aspect-video w-full rounded-2xl bg-zinc-900 mb-3 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=600" 
                alt="Item" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="text-xs font-bold text-white line-clamp-2 mb-2">
              Executive Premium Panjabi Collection 2026 - Direct Factory Price #{i}
            </h4>
            <div className="flex items-center justify-between text-[11px] text-zinc-400">
              <span>12.4K views</span>
              <span className="text-[#FF7A00] font-black">৳1,850</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
