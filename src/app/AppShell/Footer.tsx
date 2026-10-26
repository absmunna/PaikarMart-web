import React from "react";
import { NavLink } from "react-router-dom";
import {
  ShieldCheck,
  Info,
  HelpCircle,
  FileText,
  MapPin
} from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-[#030906] border-t border-cyan-500/10 mt-auto pt-6 pb-28 md:pb-6 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.04] text-left">
          
          {/* Compact Brand and Regulatory Info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm md:text-base font-black text-white tracking-tight">
                Paikar<span className="text-cyan-400">Mart</span>
              </span>
              <span className="text-[8px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-black uppercase">
                সুপার অ্যাপ / Super App
              </span>
            </div>
            
            <p className="hidden md:block text-[10px] text-zinc-400 leading-relaxed font-semibold">
              বাংলাদেশের প্রথম ও বৃহত্তম সোশ্যাল কমার্স সুপার অ্যাপ। হকার্স মার্কেট ও চকবাজারের পাইকারি রেট এখন সরাসরি হোম ডেলিভারি। ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ মেনে নিবন্ধিত।
            </p>

            <div className="flex items-center gap-1.5 text-[8.5px] text-cyan-400 bg-cyan-500/5 border border-cyan-500/10 px-2 py-0.5 rounded w-fit">
              <Info className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="font-bold">বাণিজ্য সংবিধি ২০২১ মেনে নিবন্ধিত</span>
            </div>
          </div>

          {/* Minimal Essential Links (All Redundant items like Settings/Contact are already in Side navigation) */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[10px] md:text-[11px] font-black text-zinc-400">
            <NavLink 
              to="/terms" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-500/65" />
              <span>শর্তাবলী ও নীতি / Terms & Policy</span>
            </NavLink>
            <NavLink 
              to="/qna" 
              className="hover:text-cyan-400 transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-500/65" />
              <span>পাইকারি ফোরাম / Forum</span>
            </NavLink>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <MapPin className="w-3.5 h-3.5 text-zinc-650" />
              <span>Chawkbazar Hub, Dhaka</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright and Sleek Payment badges */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-bold">
            <span>&copy; {new Date().getFullYear()} PaikarMart.</span>
            <span>&bull;</span>
            <div className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="uppercase tracking-wider font-black">Escrow Secured</span>
            </div>
          </div>

          {/* Sleek Payment indicators */}
          <div className="flex flex-wrap items-center justify-center gap-1 text-[8px] font-black opacity-85">
            <span className="px-1.5 py-0.5 rounded bg-pink-500/5 text-[#e2136e] border border-[#e2136e]/10">bKash</span>
            <span className="px-1.5 py-0.5 rounded bg-orange-500/5 text-[#f37021] border border-[#f37021]/10">Nagad</span>
            <span className="px-1.5 py-0.5 rounded bg-[#e2136e]/10 text-[#e2136e] border border-[#e2136e]/30 font-bold">Merchant Pay</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/5 text-cyan-400 border border-cyan-500/10 font-bold">COD / কুরিয়ার</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
