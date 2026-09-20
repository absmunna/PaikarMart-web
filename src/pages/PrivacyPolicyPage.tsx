import React from "react";
import { ShieldCheck, Lock, FileText, CheckCircle2, ArrowLeft, Building2, Download, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicyPage() {
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
        <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#FF7A00]/10 border border-white/10 space-y-4 shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold font-mono">
            <ShieldCheck className="w-4 h-4" />
            BD Digital Commerce Policy 2021 & GDPR Compliant
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            পাইকারমার্ট গোপনীয়তা নীতি ও তথ্য সুরক্ষা নীতিমালা (Privacy Policy)
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-3xl">
            PaikarMart ব্যবহারকারীদের তথ্যের গোপনীয়তা রক্ষা করা আমাদের প্রথম অগ্রাধিকার। বাংলাদেশ সরকার কর্তৃক জারিকৃত ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১, ডিজিটাল নিরাপত্তা আইন ও আন্তর্জাতিক উপাত্ত অধিকার (GDPR Standard) মেনে আমাদের ফায়ারবেস ডাটাবেস ও সিকিউরিটি পলিসি তৈরি করা হয়েছে।
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {/* Section 1 */}
          <section className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#FF7A00]" />
              ১. আমরা কী কী তথ্য সংগ্রহ করি?
            </h2>
            <ul className="text-xs text-zinc-300 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong>ব্যক্তিগত পরিচয় তথ্য:</strong> অ্যাকাউন্ট তৈরির সময় নাম, ফোন নম্বর, ইমেইল ও পাসওয়ার্ড।</li>
              <li><strong>বাণিজ্যিক ও ব্যবসায়িক নথি (KYC):</strong> সেলারদের জাতীয় পরিচয়পত্র (NID), ডিজিটাল বিজনেস আইডেন্টিফিকেশন নম্বর (DBID), ট্রেড লাইসেন্স ও টিআইএন সার্টিফিকেট।</li>
              <li><strong>মিডিয়া ও ফাইল ডাটা:</strong> ব্যবহারকারীর আপলোড করা পণ্যের ছবি, বাণিজ্যিক শর্ট ভিডিও রিলস, সার্ভিসের নথিপত্র এবং ক্লায়েন্ট ভল্টের ফাইলসমূহ।</li>
              <li><strong>অর্ডার ও লেনদেন তথ্য:</strong> পণ্য কেনাবেচা, অর্ডার ডেলিভারি এড্রেস এবং পেমেন্ট সংক্রান্ত মেটাডাটা।</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              ২. ফায়ারবেস এনক্রিপ্টেড ডাটাবেস ও সিকিউরিটি রুলস
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              আমাদের সকল তথ্যাদি গুগলের ফায়ারবেস (Google Firebase Cloud Storage & Firestore) ক্লাউড ডাটাবেসে অত্যন্ত নিরাপদ ও এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকে।
            </p>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" /> সিকিউর এক্সেস পলিসি (RBAC & Document Isolation)
              </div>
              <p>
                আপনার একান্ত গোপনীয় ট্রেড লাইসেন্স, ব্যাংক তথ্য বা ভল্ট ফাইল অন্য কোনো সাধারণ ব্যবহারকারী বা তৃতীয় পক্ষ দেখতে পারবে না। শুধুমাত্র এনক্রিপ্টেড অথেনটিকেশনের মাধ্যমে নিজস্ব মালিকানাধীন অ্যাকাউন্টে ডাটা দৃশ্যমান হয়।
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              ৩. ব্যবহারকারীর তথ্য নিয়ন্ত্রণ অধিকার (Access, Edit, Export & Delete)
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              পাইকারমার্ট প্ল্যাটফর্মে প্রতিটি ব্যবহারকারী নিম্নলিখিত মৌলিক অধিকারসমূহ ভোগ করেন:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#FF7A00]" /> তথ্য সম্পাদনা ও সংশোধন
                </h3>
                <p className="text-[11px] text-zinc-400">যে কোনো সময় আপলোডকৃত পণ্য, ভিডিও বা তথ্য সংশোধন করতে পারবেন।</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Download className="w-4 h-4 text-emerald-400" /> ডাটা এক্সপোর্ট
                </h3>
                <p className="text-[11px] text-zinc-400">আপনার সমস্ত ডাটা এক ক্লিকে JSON ফাইলের মাধ্যমে পিসিতে ডাউনলোড করুন।</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Trash2 className="w-4 h-4 text-rose-400" /> একাউন্ট ও ডাটা ডিলিট
                </h3>
                <p className="text-[11px] text-zinc-400">Right to be Forgotten আইনের অধীনে একাউন্ট ও ডাটা সম্পূর্ণ মুছে ফেলতে পারবেন।</p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950 border border-white/10 space-y-1">
                <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" /> প্রাইভেসি টগল
                </h3>
                <p className="text-[11px] text-zinc-400">মোবাইল নম্বর ও ইমেইল প্রকাশ না রাখার স্বায়ত্তশাসন।</p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              ৪. তৃতীয় পক্ষের সাথে তথ্য শেয়ারিং নিষিদ্ধ নীতি
            </h2>
            <p className="text-xs text-zinc-300 leading-relaxed">
              পাইকারমার্ট কখনো কোনো বাণিজ্যিক উদ্দেশ্যে ব্যবহারকারীর ব্যক্তিগত তথ্য তৃতীয় কোনো পক্ষের নিকট বিক্রয় বা হস্তান্তর করে না। শুধুমাত্র আইনি বাধ্যবাধকতা বা ডিজিটাল কমার্স পরিচালনা নীতিমালা অনুযায়ী প্রয়োজনীয় কর্তৃপক্ষ ব্যতীত সকল ডাটা গোপন রাখা হয়।
            </p>
          </section>
        </div>

        {/* Footer info */}
        <div className="p-4 rounded-xl bg-zinc-900 border border-white/10 text-center text-xs text-zinc-500">
          সর্বশেষ সংস্করণ আপডেট: সেপ্টেম্বর ২০২৬ • পাইকারমার্ট লিগ্যাল অ্যান্ড ডিজিটাল কমপ্লায়েন্স টিম
        </div>
      </div>
    </div>
  );
}
