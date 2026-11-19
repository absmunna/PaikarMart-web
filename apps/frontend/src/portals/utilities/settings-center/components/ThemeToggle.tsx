import React from 'react';
import { Sun, Moon, Laptop, Sparkles, Leaf, Flame } from 'lucide-react';
import { useTheme, ThemeMode, THEME_PRESETS } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThemeToggleProps {
  variant?: 'compact' | 'segmented' | 'icon' | 'swatches';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'segmented', className = '' }) => {
  const { themeMode, isDark, setThemeMode, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  if (variant === 'icon') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`p-2 rounded-xl bg-[var(--pm-surface)] text-[var(--pm-text)] border border-[var(--pm-border)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer ${className}`}
        title={`Toggle theme (currently ${themeMode})`}
        aria-label="Toggle display theme"
      >
        {isDark ? <Moon className="w-4 h-4 text-[var(--pm-warning)]" /> : <Sun className="w-4 h-4 text-[var(--pm-warning)]" />}
      </button>
    );
  }

  if (variant === 'swatches') {
    const swatchModes: ThemeMode[] = ['light', 'nakshiLight', 'greenField', 'deepDark'];
    return (
      <div className={`flex items-center gap-1.5 ${className}`} role="group" aria-label="Theme color swatches">
        {swatchModes.map((modeId) => {
          const preset = THEME_PRESETS.find((p) => p.id === modeId);
          if (!preset) return null;
          const isActive = themeMode === modeId;
          return (
            <button
              key={modeId}
              type="button"
              onClick={() => setThemeMode(modeId)}
              title={isBn ? preset.nameBn : preset.nameEn}
              aria-label={isBn ? preset.nameBn : preset.nameEn}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer border-2 ${
                isActive
                  ? 'scale-110 ring-2 ring-[var(--pm-accent)] ring-offset-1 border-[var(--pm-card)]'
                  : 'border-[var(--pm-border)] opacity-85 hover:opacity-100 hover:scale-105'
              }`}
              style={{ backgroundColor: preset.bgHex }}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shadow-2xs"
                style={{ backgroundColor: preset.accentHex }}
              />
            </button>
          );
        })}
      </div>
    );
  }

  const modes: { id: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'light', label: isBn ? 'লাইট' : 'Light', icon: Sun },
    { id: 'nakshiLight', label: isBn ? 'নকশী' : 'Nakshi', icon: Sparkles },
    { id: 'greenField', label: isBn ? 'সবুজ' : 'Green', icon: Leaf },
    { id: 'deepDark', label: isBn ? 'ডিপ' : 'Deep', icon: Flame },
    { id: 'dark', label: isBn ? 'ডার্ক' : 'Dark', icon: Moon },
    { id: 'system', label: isBn ? 'অটো' : 'Auto', icon: Laptop },
  ];

  return (
    <div className={`flex flex-wrap items-center gap-1 p-1 bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)] ${className}`}>
      {modes.map(({ id, label, icon: Icon }) => {
        const isActive = themeMode === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => setThemeMode(id)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[var(--pm-card)] text-[var(--pm-accent)] border border-[var(--pm-border)] shadow-xs'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <Icon className="w-3 h-3" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
