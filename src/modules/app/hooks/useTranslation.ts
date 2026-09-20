import { useAppStore, Language } from '@/modules/app/appStore';
import { en } from '@/i18n/locales/en';
import { bn } from '@/i18n/locales/bn';

const locales: Record<Language, any> = {
  EN: en,
  BN: bn,
  // Future proofing for AR, HI etc
  AR: bn, // Fallback to BN for now
  HI: bn, // Fallback to BN for now
};

export const useTranslation = () => {
  const { lang, setLang } = useAppStore();
  
  const t = (key: keyof typeof en) => {
    const translations = locales[lang] || locales.EN;
    return translations[key] || en[key] || key;
  };

  return { t, lang, setLang, availableLanguages: Object.keys(locales) as Language[] };
};
