import * as React from "react";
import { bn as bnLocale } from "@/i18n/locales/bn";
import { en as enLocale } from "@/i18n/locales/en";

export type Language = "en" | "bn";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  isBn: boolean;
  t: (key: string, fallback?: string) => string;
}

export const TRANSLATIONS: Record<string, Record<Language, string>> = {
  // Navigation & Core Hubs
  "app.title": { en: "PaikarMart Bangladesh", bn: "পাইকারমার্ট বাংলাদেশ" },
  "app.tagline": { en: "Social Commerce & Wholesale Super App", bn: "সোশ্যাল কমার্স ও পাইকারি সুপার অ্যাপ" },
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.marketplace": { en: "Marketplace", bn: "মার্কেটপ্লেস" },
  "nav.wholesale": { en: "Wholesale B2B", bn: "পাইকারি হাব" },
  "nav.local": { en: "Nearby Shops", bn: "কাছের দোকান" },
  "nav.services": { en: "Services", bn: "সার্ভিস" },
  "nav.feed": { en: "Community Feed", bn: "কমিউনিটি ফিড" },
  "nav.reels": { en: "Video Reels", bn: "রিলস ও ভিডিও" },
  "nav.messages": { en: "Message Terminal", bn: "মেসেজ সেন্টার" },
  "nav.cart": { en: "Cart", bn: "কার্ট" },
  "nav.orders": { en: "My Orders", bn: "আমার অর্ডার" },
  "nav.wallet": { en: "Wallet & Escrow", bn: "ওয়ালেট ও এসক্রো" },
  "nav.profile": { en: "Profile", bn: "প্রোফাইল" },
  "nav.admin": { en: "Admin Dashboard", bn: "অ্যাডমিন প্যানেল" },
  "nav.seller": { en: "Seller Central", bn: "সেলার সেন্টার" },

  // Checkout & Payments
  "checkout.title": { en: "Universal Settlement Engine", bn: "ইউনিভার্সাল চেকআউট টার্মিনাল" },
  "checkout.address": { en: "Delivery Address", bn: "ডেলিভারি ঠিকানা" },
  "checkout.delivery_method": { en: "Delivery Method", bn: "ডেলিভারি পদ্ধতি" },
  "checkout.payment_method": { en: "Payment Gateway", bn: "পেমেন্ট গেটওয়ে" },
  "checkout.review": { en: "Review & Lock Escrow", bn: "অর্ডার ও এসক্রো রিভিউ" },
  "checkout.subtotal": { en: "Subtotal", bn: "মোট মূল্য" },
  "checkout.delivery_fee": { en: "Delivery Fee", bn: "ডেলিভারি চার্জ" },
  "checkout.vat": { en: "Govt VAT (5%)", bn: "ভ্যাট (৫%)" },
  "checkout.total_payable": { en: "Total Payable", bn: "সর্বমোট প্রদেয়" },
  "checkout.bkash": { en: "bKash Online Payment", bn: "বিকাশ অনলাইন পেমেন্ট" },
  "checkout.nagad": { en: "Nagad Instant Checkout", bn: "নগদ অনলাইন পেমেন্ট" },
  "checkout.cod": { en: "Cash on Delivery", bn: "ক্যাশ অন ডেলিভারি (COD)" },
  "checkout.wallet": { en: "Use Wallet Balance", bn: "ওয়ালেট ব্যালেন্স ব্যবহার" },
  "checkout.escrow_notice": { en: "Payment locked in safe escrow until delivery inspection.", bn: "পণ্য ডেলিভারি ও যাচাই না হওয়া পর্যন্ত অর্থ নিরাপদ এসক্রো ভল্টে সংরক্ষিত থাকবে।" },
  "checkout.confirm_order": { en: "Confirm & Secure Escrow", bn: "অর্ডার নিশ্চিত ও এসক্রো লক করুন" },

  // B2B Wholesale & RFQ
  "b2b.title": { en: "B2B Wholesale Terminal", bn: "বিটুবি পাইকারি মার্কেট" },
  "b2b.moq": { en: "Minimum Order Qty (MOQ)", bn: "সর্বনিম্ন লট পরিমাণ (MOQ)" },
  "b2b.tier_pricing": { en: "Tiered Volume Pricing", bn: "ভলিউম ভিত্তিক পাইকারি রেট" },
  "b2b.factory_direct": { en: "Factory Direct Verified", bn: "সরাসরি কারখানা থেকে সরবরাহ" },
  "b2b.rfq_marketplace": { en: "RFQ Live Marketplace", bn: "লাইভ আরএফকিউ (RFQ) মার্কেট" },
  "b2b.post_rfq": { en: "Post Custom RFQ", bn: "নতুন আরএফকিউ পোস্ট করুন" },
  "b2b.submit_quote": { en: "Submit Manufacturer Quote", bn: "ফ্যাক্টরি কোটেশন প্রদান করুন" },
  "b2b.chat_vendor": { en: "Chat with Manufacturer", bn: "কারখানার সাথে সরাসরি চ্যাট" },

  // Escrow & Inspection
  "escrow.safe_vault": { en: "Escrow Safe Vault", bn: "নিরাপদ এসক্রো ভল্ট" },
  "escrow.funds_held": { en: "Funds Held in Escrow", bn: "এসক্রো ব্যালেন্স সুরক্ষিত" },
  "escrow.funds_released": { en: "Funds Released to Seller", bn: "বিক্রেতার ওয়ালেটে স্থানান্তরিত" },
  "escrow.inspection_window": { en: "7-Day Inspection Protection", bn: "৭-দিনের ইন্সপেকশন সুরক্ষা" },
  "escrow.confirm_delivery": { en: "Confirm Received & Release Escrow", bn: "পণ্য পেয়েছি — এসক্রো রিলিজ করুন" },
  "escrow.raise_dispute": { en: "Raise Inspection Dispute", bn: "৭-দিনের ইন্সপেকশন ডিসপুট" },
  "escrow.disputed_status": { en: "Dispute Under Compliance Review", bn: "ডিসপুট পর্যালোচনাধীন" },

  // Hyperlocal & Nearby Shops
  "nearby.hub_title": { en: "Local Hub · Nearby Ecosystem", bn: "লোকাল হাব · কাছের দোকান ও সেবা" },
  "nearby.within_radius": { en: "Within Radius", bn: "দূরত্ব পরিধি" },
  "nearby.instant_delivery": { en: "Instant Delivery Eligible", bn: "দ্রুততম ডেলিভারি উপযোগী" },
  "nearby.open_now": { en: "Open Now", bn: "এখন খোলা আছে" },
  "nearby.closed": { en: "Closed", bn: "সাময়িকভাবে বন্ধ" },
  "nearby.grocery": { en: "Grocery Store", bn: "মুদিখানা" },
  "nearby.pharmacy": { en: "Pharmacy", bn: "ফার্মেসি" },
  "nearby.restaurant": { en: "Restaurant / Food", bn: "খাবার ও রেস্টুরেন্ট" },
  "nearby.services": { en: "Local Technicians & Services", bn: "লোকাল মিস্ত্রি ও সেবা" },
  "nearby.search_placeholder": { en: "Search local shops, groceries, medicines...", bn: "কাছের দোকান, মুদিখানা, ঔষধ খুঁজুন..." },

  // Common UI Actions
  "btn.buy_now": { en: "Buy Now", bn: "এখনই কিনুন" },
  "btn.add_cart": { en: "Add to Cart", bn: "কার্টে রাখুন" },
  "btn.chat_seller": { en: "Chat with Seller", bn: "বিক্রেতার সাথে চ্যাট" },
  "btn.view_details": { en: "View Details", bn: "বিস্তারিত দেখুন" },
  "btn.save": { en: "Save", bn: "সংরক্ষণ করুন" },
  "btn.cancel": { en: "Cancel", bn: "বাতিল" },
  "btn.submit": { en: "Submit", bn: "জমা দিন" },
  "btn.back": { en: "Back", bn: "পেছনে যান" },
  "btn.track_order": { en: "Track Order", bn: "অর্ডার ট্র্যাক করুন" }
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "pm_user_lang_preference";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to bn (Bangla) as requested for Paikar Mart Bangladesh, or load saved preference
  const [language, setLanguageState] = React.useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved === "en" || saved === "bn") return saved;
    }
    return "bn";
  });

  const setLanguage = React.useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const toggleLanguage = React.useCallback(() => {
    setLanguageState((prev) => {
      const next: Language = prev === "bn" ? "en" : "bn";
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, next);
      }
      return next;
    });
  }, []);

  const t = React.useCallback(
    (key: string, fallback?: string): string => {
      if (TRANSLATIONS[key]) {
        return TRANSLATIONS[key][language] || fallback || key;
      }
      if (language === 'bn' && (bnLocale as any)[key]) {
        return (bnLocale as any)[key];
      }
      if (language === 'en' && (enLocale as any)[key]) {
        return (enLocale as any)[key];
      }
      return fallback || key;
    },
    [language]
  );

  const value: LanguageContextValue = React.useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      isBn: language === "bn",
      t,
    }),
    [language, setLanguage, toggleLanguage, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
