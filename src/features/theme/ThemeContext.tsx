import * as React from "react";

type Theme = "dark" | "light" | "premium" | "deep-dark" | "colorful" | "nakshi-light" | "green-field";

export interface ThemePreset {
  id: string;
  name: string;
  label: string;
  labelBn: string;
  description: string;
  badge: string;
  bgClass: string;
  textClass: string;
  swatch: string[];
}

interface ThemeContextValue {
  theme: Theme;
  mode: Theme;
  setTheme: (theme: Theme) => void;
  setMode: (mode: Theme) => void;
  presets: ThemePreset[];
}

const THEME_PRESETS: ThemePreset[] = [
  { id: "dark", name: "Deep Dark", label: "Deep Dark", labelBn: "গভীর ডার্ক থিম", description: "Modern eye-friendly twilight dark mode", badge: "Modern Dark", bgClass: "bg-slate-950", textClass: "text-white", swatch: ["#0f172a", "#3b82f6", "#10b981"] },
  { id: "light", name: "Nakshi Light", label: "Nakshi Light", labelBn: "নকশী লাইট থিম", description: "Clean high-contrast Bangladeshi light theme", badge: "Clean White", bgClass: "bg-gray-50", textClass: "text-gray-900", swatch: ["#ffffff", "#2563eb", "#059669"] },
  { id: "green-field", name: "Green Field", label: "Green Field", labelBn: "সবুজ প্রান্তর থিম", description: "Nature inspired emerald gradient theme", badge: "Nature Emerald", bgClass: "bg-emerald-950", textClass: "text-emerald-50", swatch: ["#064e3b", "#10b981", "#f59e0b"] },
  { id: "colorful", name: "Colorful Vibrant", label: "Colorful Vibrant", labelBn: "রঙিন প্রাইব্র্যান্ট থিম", description: "Vibrant expressive commerce layout", badge: "Expressive", bgClass: "bg-indigo-950", textClass: "text-indigo-100", swatch: ["#312e81", "#6366f1", "#ec4899"] }
];

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = React.useState<Theme>("dark");

  const value: ThemeContextValue = React.useMemo(() => ({
    theme,
    mode: theme,
    setTheme,
    setMode: setTheme,
    presets: THEME_PRESETS
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}
