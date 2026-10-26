export type ThemeMode = "dark" | "midnight" | "forest" | "sunset" | "light" | "deepDark" | "colourful" | "nakshiLight" | "greenField";

export interface ThemePreset {
  id: ThemeMode;
  label: string;
  labelBn: string;
  description: string;
  htmlClass: string;
  /** Swatch colors for the picker */
  swatch: [string, string, string];
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "dark",
    label: "Cyber Blue",
    labelBn: "সাইবার ব্লু",
    description: "Slate navy with neon cyan accents",
    htmlClass: "dark",
    swatch: ["#0f172a", "#06b6d4", "#db2777"],
  },
  {
    id: "midnight",
    label: "Midnight",
    labelBn: "মিডনাইট",
    description: "Deep obsidian with indigo glow",
    htmlClass: "midnight",
    swatch: ["#020617", "#6366f1", "#a855f7"],
  },
  {
    id: "forest",
    label: "Moss Forest",
    labelBn: "মস ফরেস্ট",
    description: "Dark evergreen with cyber spirit",
    htmlClass: "forest",
    swatch: ["#022c22", "#10b981", "#34d399"],
  },
  {
    id: "sunset",
    label: "Evening Glow",
    labelBn: "ইভিনিং গ্লো",
    description: "Warm umber with amber horizons",
    htmlClass: "sunset",
    swatch: ["#1c1917", "#f59e0b", "#f97316"],
  },
  {
    id: "light",
    label: "Pristine",
    labelBn: "প্রিস্টিন",
    description: "Clean minimalistic light theme",
    htmlClass: "light",
    swatch: ["#ffffff", "#0ea5e9", "#6366f1"],
  },
  {
    id: "deepDark",
    label: "Obsidian",
    labelBn: "অবসিডিয়ান",
    description: "Pure dark with volcanic accents",
    htmlClass: "deepDark",
    swatch: ["#000000", "#f97316", "#d946ef"],
  },
  {
    id: "colourful",
    label: "Vibrant",
    labelBn: "ভাইব্রেন্ট",
    description: "Playful and energetic colors",
    htmlClass: "colourful",
    swatch: ["#fff1f2", "#f43f5e", "#fb7185"],
  },
  {
    id: "nakshiLight",
    label: "Heritage",
    labelBn: "হেরিটেজ",
    description: "Traditional nakshi kantha aesthetics",
    htmlClass: "nakshiLight",
    swatch: ["#fffbeb", "#92400e", "#b45309"],
  },
  {
    id: "greenField",
    label: "Evergreen",
    labelBn: "এভারগ্রিন",
    description: "Natural Bangladeshi landscapes",
    htmlClass: "greenField",
    swatch: ["#064e3b", "#34d399", "#10b981"],
  },
];

export const THEME_STORAGE_KEY = "pm.theme.v1";
