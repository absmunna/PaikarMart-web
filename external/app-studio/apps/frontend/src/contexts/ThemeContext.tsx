import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system' | 'deepDark' | 'nakshiLight' | 'greenField';

export interface ThemePresetMeta {
  id: ThemeMode;
  nameEn: string;
  nameBn: string;
  descEn: string;
  descBn: string;
  isDark: boolean;
  bgHex: string;
  surfaceHex: string;
  accentHex: string;
  textHex: string;
}

export const THEME_PRESETS: ThemePresetMeta[] = [
  {
    id: 'light',
    nameEn: 'Clean Light',
    nameBn: 'ক্লিন লাইট',
    descEn: 'Crisp slate daylight studio view',
    descBn: 'উজ্জ্বল ও পরিষ্কার দিনকালীন ভিউ',
    isDark: false,
    bgHex: '#f1f5f9',
    surfaceHex: '#ffffff',
    accentHex: '#2563eb',
    textHex: '#0f172a',
  },
  {
    id: 'nakshiLight',
    nameEn: 'Nakshi Light',
    nameBn: 'নকশী লাইট',
    descEn: 'Warm heritage saffron & cream canvas',
    descBn: 'বাংলার ঐতিহ্যবাহী উষ্ণ সোনালি আবহ',
    isDark: false,
    bgHex: '#fffbeb',
    surfaceHex: '#fef3c7',
    accentHex: '#b45309',
    textHex: '#78350f',
  },
  {
    id: 'greenField',
    nameEn: 'Green Field',
    nameBn: 'সবুজ প্রান্তর',
    descEn: 'Deep emerald soil & mint high-contrast',
    descBn: 'সবুজ বাংলার গভীর পান্না থিম',
    isDark: true,
    bgHex: '#021a12',
    surfaceHex: '#052e22',
    accentHex: '#10b981',
    textHex: '#ecfdf5',
  },
  {
    id: 'deepDark',
    nameEn: 'Deep Dark',
    nameBn: 'ডিপ ডার্ক',
    descEn: 'Obsidian OLED canvas with amber accent',
    descBn: 'গভীর ওলেড কালো ও অ্যাম্বার অ্যাকসেন্ট',
    isDark: true,
    bgHex: '#07080b',
    surfaceHex: '#0d0f14',
    accentHex: '#ff7a00',
    textHex: '#f5f6f8',
  },
  {
    id: 'dark',
    nameEn: 'Midnight Slate',
    nameBn: 'মিডনাইট ডার্ক',
    descEn: 'Classic slate dark interface',
    descBn: 'চোখের আরামদায়ক ক্লাসিক নাইট মোড',
    isDark: true,
    bgHex: '#020617',
    surfaceHex: '#0f172a',
    accentHex: '#3b82f6',
    textHex: '#f8fafc',
  },
  {
    id: 'system',
    nameEn: 'System Auto',
    nameBn: 'সিস্টেম অটো',
    descEn: 'Matches device OS light/dark state',
    descBn: 'ডিভাইসের ওএস সেটিং অনুসরণ করবে',
    isDark: false,
    bgHex: '#1e293b',
    surfaceHex: '#334155',
    accentHex: '#0ea5e9',
    textHex: '#f8fafc',
  },
];

const VALID_THEMES: ThemeMode[] = ['light', 'dark', 'system', 'deepDark', 'nakshiLight', 'greenField'];

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  accentColor: string;
  presets: ThemePresetMeta[];
  setAccentColor: (color: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'paikarmart_theme_mode';
const ACCENT_STORAGE_KEY = 'paikarmart_accent_color';
const DEFAULT_ACCENT = '#2563eb';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null;
      if (stored && VALID_THEMES.includes(stored)) {
        return stored;
      }
    } catch {}
    return 'dark';
  });

  const [accentColor, setAccentColorState] = useState<string>(() => {
    try {
      return localStorage.getItem(ACCENT_STORAGE_KEY) || DEFAULT_ACCENT;
    } catch {
      return DEFAULT_ACCENT;
    }
  });

  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  const isDark = useMemo(() => {
    if (themeMode === 'system') return systemIsDark;
    return themeMode === 'dark' || themeMode === 'deepDark' || themeMode === 'greenField';
  }, [themeMode, systemIsDark]);

  const effectiveDataTheme = useMemo(() => {
    if (themeMode === 'system') return systemIsDark ? 'dark' : 'light';
    return themeMode;
  }, [themeMode, systemIsDark]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, themeMode);
      localStorage.setItem(ACCENT_STORAGE_KEY, accentColor);
    } catch {}

    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.setAttribute('data-theme', effectiveDataTheme);

    const activePreset = THEME_PRESETS.find((p) => p.id === effectiveDataTheme);
    const resolvedAccent = accentColor || activePreset?.accentHex || DEFAULT_ACCENT;

    // Compute WCAG-safe foreground for filled accent buttons
    let accentFg = '#ffffff';
    const hex = resolvedAccent.replace('#', '');
    if (hex.length === 6) {
      const toLinear = (c: number) => {
        const s = c / 255;
        return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      };
      const r = toLinear(parseInt(hex.slice(0, 2), 16));
      const g = toLinear(parseInt(hex.slice(2, 4), 16));
      const b = toLinear(parseInt(hex.slice(4, 6), 16));
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      if (lum > 0.28) {
        accentFg = '#07080b';
      }
    }

    root.style.setProperty('--accent-color', resolvedAccent);
    root.style.setProperty('--pm-accent-fg', accentFg);
  }, [themeMode, isDark, effectiveDataTheme, accentColor]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    const resolvedMode = mode === 'system' ? (systemIsDark ? 'dark' : 'light') : mode;
    const preset = THEME_PRESETS.find((p) => p.id === resolvedMode);
    if (preset) {
      setAccentColorState(preset.accentHex);
    }
  };

  const setAccentColor = (color: string) => setAccentColorState(color);

  const toggleTheme = () =>
    setThemeModeState((prev) => (prev === 'dark' || prev === 'deepDark' || prev === 'greenField' ? 'light' : 'dark'));

  const value = useMemo(
    () => ({
      themeMode,
      isDark,
      accentColor,
      presets: THEME_PRESETS,
      setAccentColor,
      setThemeMode,
      toggleTheme,
    }),
    [themeMode, isDark, accentColor]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
