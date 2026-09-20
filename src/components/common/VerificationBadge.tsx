import React from "react";
import { useLanguage } from "@/features/language/LanguageContext";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Star,
  Activity,
  Award,
  ShieldAlert,
  ShieldCheck,
  Bike,
  Sparkles,
} from "lucide-react";

export type BadgeType = "verified" | "trusted_merchant" | "pro_rider" | "top_creator";

interface VerificationBadgeProps {
  badgeType: BadgeType;
  showText?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

export function VerificationBadge({
  badgeType,
  showText = false,
  size = "sm",
  className,
  id,
}: VerificationBadgeProps) {
  const { isBn } = useLanguage();

  const configs: Record<
    BadgeType,
    {
      icon: React.ReactNode;
      labelBn: string;
      labelEn: string;
      colorClass: string;
      bgClass: string;
    }
  > = {
    verified: {
      icon: <ShieldCheck className="w-full h-full" />,
      labelBn: "ভেরিফাইড ক্রেতা",
      labelEn: "Verified Buyer",
      colorClass: "text-[#00a859]",
      bgClass: "bg-[#00a859]/10 border-[#00a859]/20",
    },
    trusted_merchant: {
      icon: <Star className="w-full h-full fill-current" />,
      labelBn: "ট্রাস্টেড মার্চেন্ট",
      labelEn: "Trusted Merchant",
      colorClass: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/20",
    },
    pro_rider: {
      icon: <Bike className="w-full h-full" />,
      labelBn: "ভেরিফাইড রাইডার",
      labelEn: "Verified Rider",
      colorClass: "text-sky-500",
      bgClass: "bg-sky-500/10 border-sky-500/20",
    },
    top_creator: {
      icon: <Sparkles className="w-full h-full" />,
      labelBn: "টপ ক্রিয়েটর",
      labelEn: "Top Creator",
      colorClass: "text-purple-500",
      bgClass: "bg-purple-500/10 border-purple-500/20",
    },
  };

  const current = configs[badgeType];
  const label = isBn ? current.labelBn : current.labelEn;

  const sizeMap = {
    xs: {
      container: "h-4 w-4",
      px: "text-[10px] px-1 py-0",
    },
    sm: {
      container: "h-5 w-5",
      px: "text-xs px-1.5 py-0.5",
    },
    md: {
      container: "h-6 w-6",
      px: "text-sm px-2 py-1",
    },
    lg: {
      container: "h-7 w-7",
      px: "text-base px-2.5 py-1.5",
    },
  };

  if (showText) {
    return (
      <span
        id={id}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-bold leading-none shadow-sm transition-all duration-250 animate-fade-in",
          current.bgClass,
          current.colorClass,
          sizeMap[size].px,
          className
        )}
      >
        <span className={cn(sizeMap[size].container, "shrink-0")}>
          {current.icon}
        </span>
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      id={id}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 shrink-0",
        current.colorClass,
        sizeMap[size].container,
        className
      )}
    >
      {current.icon}
    </span>
  );
}
