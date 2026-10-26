import { useAppStore } from '@/store/appStore';

type Translations = {
  [key: string]: {
    BN: string;
    EN: string;
  };
};

export const translations: Translations = {
  // Navigation
  home: { BN: 'হোম', EN: 'Home' },
  shop: { BN: 'শপ', EN: 'Shop' },
  feed: { BN: 'ফিড', EN: 'Feed' },
  wallet: { BN: 'ওয়ালেট', EN: 'Wallet' },
  hubs: { BN: 'হাবস', EN: 'Hubs' },
  profile: { BN: 'প্রোফাইল', EN: 'Profile' },
  more: { BN: 'আরও', EN: 'More' },
  portals: { BN: 'পোর্টালস', EN: 'Portals' },
  dashboard: { BN: 'ড্যাশবোর্ড', EN: 'Dashboard' },
  settings: { BN: 'সেটিংস', EN: 'Settings' },
  vendor_dir: { BN: 'মার্চেন্ট ডিরেক্টরি', EN: 'Vendors' },
  messages: { BN: 'মেসেজ', EN: 'Messages' },
  apps: { BN: 'অ্যাপস', EN: 'Apps' },

  // Auth / Profile
  login: { BN: 'লগইন করুন', EN: 'Login' },
  guest: { BN: 'অতিথি ইউজার', EN: 'Guest User' },

  // Misc
  themes: { BN: 'থিম', EN: 'Themes' },
  language: { BN: 'ভাষা', EN: 'Language' },
};

export function useTranslation() {
  const { lang } = useAppStore();

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[lang] || key;
  };

  return { t, lang };
}
