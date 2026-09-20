import React, { useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useLanguage } from "@/features/language/LanguageContext";
import { VerificationForm, VerificationCategory } from "./VerificationForm";
import { VerificationBadge } from "./VerificationBadge";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  Gift,
  HelpCircle,
  ShieldCheck,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressiveVerificationPromptProps {
  category: VerificationCategory;
  inline?: boolean;
  className?: string;
  id?: string;
}

export function ProgressiveVerificationPrompt({
  category,
  inline = false,
  className,
  id,
}: ProgressiveVerificationPromptProps) {
  const { user } = useAuth();
  const { isBn } = useLanguage();
  const [showForm, setShowForm] = useState(false);

  // If user is already fully verified, we can congratulate them or show their tier
  const isVerified = user?.verification?.status === "verified";
  const isPending = user?.verification?.status === "pending";

  const segmentLabelsBn = {
    seller: "হোলসেল ও মার্চেন্ট",
    rider: "লজিস্টিক ডেলিভারি",
    service_provider: "লোকাল সার্ভিস",
  };

  const segmentLabelsEn = {
    seller: "B2B Wholesale & Merchant",
    rider: "Ride Sharing & Logistics",
    service_provider: "Local Service Platform",
  };

  const badgeMappedType = {
    seller: "trusted_merchant" as const,
    rider: "pro_rider" as const,
    service_provider: "verified" as const,
  };

  if (isVerified) {
    return (
      <div
        id={id}
        className={cn(
          "w-full bg-[#050f0a] border border-[#00a859]/20 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl animate-fade-in shadow-[0_8px_30px_rgba(0,168,89,0.05)]",
          className
        )}
      >
        <div className="absolute top-0 right-0 -m-8 w-48 h-48 bg-[#00a859]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#00a859]/10 border border-[#00a859]/20 text-[#00a859] shrink-0 animate-bounce">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-black text-white flex items-center gap-2">
                {isBn ? "প্রোফাইল ভেরিফাইড!" : "Profile Fully Verified!"}
                <VerificationBadge badgeType={badgeMappedType[category]} size="xs" />
              </h4>
              <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed font-medium">
                {isBn
                  ? `আপনার অ্যাকাউন্ট সফলভাবে ভেরিফিকেশন করা হয়েছে। আপনার নামের পাশে এখন একটি স্বনামধন্য ট্রাস্ট ব্যাজ প্রদর্শিত হচ্ছে!`
                  : `Your account is fully verified. Your profile now proudly showcases the trust badge across our micro-app portals!`}
              </p>
            </div>
          </div>
          <div>
            <VerificationBadge badgeType={badgeMappedType[category]} showText size="sm" className="shadow-lg py-1 px-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id={id + "-unverified"}
      className={cn(
        "w-full bg-[#070b09] border border-white/5 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md relative",
        className
      )}
    >
      <div className="absolute top-0 right-0 -m-10 w-64 h-64 bg-[#00a859]/5 rounded-full blur-[80px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {!showForm ? (
          <motion.div
            key="pitch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start gap-4.5">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold font-mono">
                  {isBn ? "ভেরিফিকেশন রিকমেন্ডেড" : "Verification Recommended"}
                </span>
                <h4 className="text-base md:text-lg font-black text-white leading-tight">
                  {isBn
                    ? `${segmentLabelsBn[category]} ভেরিফাইড ইউজার হিসেবে নিজেকে প্রমাণ করুন`
                    : `Be recognized as a Verified ${segmentLabelsEn[category]} partner`}
                </h4>
                <p className="text-xs text-zinc-400 max-w-[580px] leading-relaxed font-medium">
                  {isBn
                    ? "লাইসেন্স বা এনআইডি যাচাইয়ের মাধ্যমে দ্রুত ভেরিফাইড ক্রেতা-বিক্রেতা ব্যাজ অর্জন করুন এবং গ্রাহকদের আস্থা অর্জনের সাথে লাভ বাড়ান।"
                    : "Earn a high-visibility trust badge displayed on your feed, catalog items, and reviews. Boost conversion rate by unlocking verified-tier benefits."}
                </p>

                {/* Benefits Pill Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-3">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] text-zinc-300 font-bold rounded-full">
                    <Check className="w-3 h-3 text-[#00a859]" /> {isBn ? "ভিজিবিলিটি বৃদ্ধি" : "Higher Search Visibility"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] text-zinc-300 font-bold rounded-full">
                    <Check className="w-3 h-3 text-[#00a859]" /> {isBn ? "৫% ক্যাশব্যাক বোনাস" : "Verification Coin Bonus"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/5 text-[10px] text-zinc-300 font-bold rounded-full">
                    <Check className="w-3 h-3 text-[#00a859]" /> {isBn ? "গ্রাহক বিশ্বাস" : "Customer Escrow Support"}
                  </span>
                </div>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 min-w-[130px]">
              <button
                onClick={() => setShowForm(true)}
                className="w-full h-11 px-5 rounded-xl bg-[#00a859] hover:bg-[#00a859]/90 active:scale-95 text-white text-xs font-black flex items-center justify-center gap-2 transition shadow-md cursor-pointer"
              >
                {isBn ? "ইনস্ট্যান্ট ভেরিফাই হন" : "Verify Instantly"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-zinc-500 font-semibold text-center mt-1 block">
                {isBn ? "সময় লাগবে মাত্র ২ মিনিট" : "Takes just 2 minutes"}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="p-1"
          >
            <VerificationForm
              category={category}
              onSuccess={() => {
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default ProgressiveVerificationPrompt;
