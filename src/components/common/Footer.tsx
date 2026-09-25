import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Building2, Download, FileText, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0a0b10] border-t border-white/10 text-zinc-400 py-10 px-4 sm:px-6 lg:px-8 mt-12 mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="space-y-3">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold tracking-tight text-[#FF7A00]">Paikar</span>
            <span className="text-xl font-extrabold tracking-tight text-white">Mart</span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed">
            বাংলাদেশের পাইকারি, খুচরা, সার্ভিস, লজিস্টিক ও সোশ্যাল বাণিজ্যের নিরাপদ ডিজিটাল ই-কমার্স প্ল্যাটফর্ম।
          </p>
          <div className="flex items-center gap-2 pt-1 text-[11px] text-emerald-400 font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>BD E-Commerce Law 2021 Standard</span>
          </div>
        </div>

        {/* Portals */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">হালকা লিঙ্কসমূহ</h4>
          <ul className="space-y-1.5 text-xs">
            <li><Link to="/" className="hover:text-[#FF7A00] transition-colors">হোম ফিড</Link></li>
            <li><Link to="/apps" className="hover:text-[#FF7A00] transition-colors">পোর্টাল হাব (Marketplace & Services)</Link></li>
            <li><Link to="/client-vault" className="hover:text-[#FF7A00] transition-colors">ক্লায়েন্ট ভল্ট (Client Vault)</Link></li>
            <li><Link to="/seller-central" className="hover:text-[#FF7A00] transition-colors">সেলার সেন্ট্রাল</Link></li>
          </ul>
        </div>

        {/* Legal & Compliance */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">আইনি ও কমপ্লায়েন্স নীতি</h4>
          <ul className="space-y-1.5 text-xs">
            <li>
              <Link to="/privacy" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> গোপনীয়তা নীতি (Privacy Policy)
              </Link>
            </li>
            <li>
              <Link to="/ecommerce-policy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" /> ডিজিটাল কমার্স পরিচালনা নীতি ২০২১
              </Link>
            </li>
            <li>
              <Link to="/refund-policy" className="hover:text-[#FF7A00] transition-colors flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF7A00]" /> রিফান্ড ও রিটার্ন পলিসি
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-zinc-200 transition-colors">ব্যবহারের শর্তাবলী (Terms)</Link></li>
          </ul>
        </div>

        {/* Data Protection */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">ফায়ারবেস তথ্য সুরক্ষা</h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            গুগল ফায়ারবেস সিকিউর্ড সার্ভারে সংরক্ষিত আপনার পণ্য, মিডিয়া ও কেওয়াইসি ডকুমেন্টের ওপর সম্পূর্ণ ইউজার কন্ট্রোল বজায় রাখা হয়েছে।
          </p>
          <div className="p-3 rounded-xl bg-zinc-900 border border-white/10 text-[11px] text-zinc-300">
            🔒 256-bit AES Firebase Encryption & SSL Protected
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
        <p>© 2026 PaikarMart Bangladesh. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Bangladesh Social Commerce
        </p>
      </div>
    </footer>
  );
};
