import { en, TranslationKey } from '@/data/locales/en';
import { bn } from '@/data/locales/bn';

export type AppLanguage = 'en' | 'bn';

export const translations: Record<AppLanguage, TranslationKey> = {
  en,
  bn,
};

export { en, bn };
export type { TranslationKey };
