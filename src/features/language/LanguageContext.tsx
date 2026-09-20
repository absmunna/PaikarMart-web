import * as React from "react";

type Language = "en" | "bn";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  isBn: boolean;
  t: (key: string) => string;
}

const TRANSLATIONS: Record<string, Record<Language, string>> = {
  "app.title": { en: "PaikarMart Bangladesh", bn: "পাইকারমার্ট বাংলাদেশ" },
  "app.tagline": { en: "Social Commerce Platform", bn: "সোশ্যাল কমার্স প্ল্যাটফর্ম" },
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.marketplace": { en: "Marketplace", bn: "মার্কেটপ্লেস" },
  "nav.services": { en: "Services", bn: "সার্ভিস" },
  "nav.feed": { en: "Feed", bn: "ফিড" },
  "nav.profile": { en: "Profile", bn: "প্রোফাইল" }
};

const LanguageContext = React.createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>("en");

  const t = React.useCallback((key: string): string => {
    if (TRANSLATIONS[key]) {
      return TRANSLATIONS[key][language] || key;
    }
    return key;
  }, [language]);

  const value: LanguageContextValue = React.useMemo(() => ({
    language,
    setLanguage,
    isBn: language === "bn",
    t
  }), [language, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
