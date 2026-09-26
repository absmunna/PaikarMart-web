import React from "react";
import { ShieldCheck, Truck, RefreshCw, FileText, CheckCircle2, ArrowLeft, Clock, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function ECommercePolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0b10] text-zinc-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-[#FF7A00] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          হোম পেজে ফিরে যান
        </Link>

        {/* Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-emerald-500/10 border border-white/10 space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4" />
            ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ ও ভোক্তা অধিকার আইন অনুবর্তী
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ই-কমার্স ও সামাজিক বাণিজ্য পরিচালনা নীতিমালা (Digital Commerce Terms)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            বাংলাদেশ বাণিজ্য মন্ত্রণালয় কর্তৃক নির্দেশিত "ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১" এবং "ভোক্তা অধিকার সংরক্ষণ আইন ২০০৯" কঠোরভাবে অনুসরণ করে পাইকারমার্ট পরিচালিত হয়।
          </p>
        </div>

        {/* Policy Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00] w-fit">
              <Truck className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-white">১. পণ্য সরবরাহ ও ডেলিভারি সময়সীমা (SLA)</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              একই শহরের (যেমন ঢাকা মেট্রো) মধ্যে সর্বোচ্চ <strong>৪৮ ঘণ্টার</strong> মধ্যে এবং আন্তঃজেলা বা দেশের অন্যত্র সর্বোচ্চ <strong>৫ দিনের</strong> মধ্যে অর্ডারকৃত পণ্য ক্রেতার নিকট পৌঁছে দেওয়া বাধ্যতামূলক।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-white">২. রিফান্ড ও মূল্য ফেরত নীতি (Refund Terms)</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              পণ্য গ্রহণে ব্যর্থতা, ত্রুটিযুক্ত পণ্য সরবরাহ বা স্টক না থাকলে গ্রাহকের প্রদত্ত অর্থ সর্বোচ্চ <strong>৭ থেকে ১০ কর্মদিবসের</strong> মধ্যে বিকাশ, নগদ বা ব্যাংকের মাধ্যমে ফেরত দেওয়া হয়।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-white">৩. সেলার DBID ও ট্রেড লাইসেন্স বাধ্যতামূলককরণ</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              পাইকারমার্টে নিবন্ধিত পাইকারি বা হোলসেল সেলারদের ডিজিটাল বিজনেস আইডেন্টিফিকেশন (DBID) অথবা হালনাগাদ ট্রেড লাইসেন্স যাচাইকরণ সাপেক্ষে সেলার সেন্ট্রাল এক্সেস প্রদান করা হয়।
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h2 className="text-sm font-bold text-white">৪. ক্যাশ অন ডেলিভারি (COD) ও নিরাপত্তা</h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              ক্রেতার নিরাপত্তা নিশ্চিতে দেশের অধিকাংশ রুটে ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে মূল্য পরিশোধ) সুবিধা রয়েছে। কোনো অবস্থাতেই অগ্রিম অতিরিক্ত বুকিং মানি দাবি গ্রহণযোগ্য নয়।
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-center text-xs text-zinc-500">
          পাইকারমার্ট ডিজিটাল কমার্স কমপ্লায়েন্স উইং • বাণিজ্য মন্ত্রণালয় নিবন্ধিত স্ট্যান্ডার্ড
        </div>
      </div>
    </div>
  );
}
