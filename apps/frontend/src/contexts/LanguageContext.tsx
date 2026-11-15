import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { AppLanguage, translations, TranslationKey } from '@/data/locales';

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toggleLanguage: () => void;
  t: TranslationKey;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANG_STORAGE_KEY = 'paikarmart_app_language';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as AppLanguage | null;
      if (stored === 'en' || stored === 'bn') {
        return stored;
      }
      // Check browser navigator language
      if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('bn')) {
        return 'bn';
      }
    } catch {
      // Fallback
    }
    return 'bn'; // Default to Bengali (Bangla) as per user preference, with English switchable
  });

  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, language);
    } catch {
      // ignore
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
  };

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'en' ? 'bn' : 'en'));
  };

  const t = useMemo(() => {
    return translations[language] || translations.en;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
    }),
    [language, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
