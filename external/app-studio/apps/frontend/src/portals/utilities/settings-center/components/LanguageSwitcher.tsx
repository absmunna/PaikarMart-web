import React from 'react';
import { Languages, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AppLanguage } from '@/data/locales';

interface LanguageSwitcherProps {
  variant?: 'compact' | 'segmented' | 'badge';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ variant = 'segmented', className = '' }) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleLanguage}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] text-xs font-bold transition-colors cursor-pointer border border-[var(--pm-border)] ${className}`}
        title="Toggle English / বাংলা"
      >
        <Languages className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
        <span>{language === 'en' ? 'EN' : 'বাং'}</span>
      </button>
    );
  }

  const langs: { id: AppLanguage; label: string; subtext: string; flag: string }[] = [
    { id: 'en', label: 'English', subtext: 'US', flag: '🇺🇸' },
    { id: 'bn', label: 'বাংলা', subtext: 'BD', flag: '🇧🇩' },
  ];

  return (
    <div className={`inline-flex items-center p-1 bg-[var(--pm-surface)] rounded-xl border border-[var(--pm-border)] ${className}`}>
      {langs.map(({ id, label, flag }) => {
        const isActive = language === id;
        return (
          <button
            key={id}
            onClick={() => setLanguage(id)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-[var(--pm-card)] text-[var(--pm-accent)] shadow-xs border border-[var(--pm-border)]'
                : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
            }`}
          >
            <span>{flag}</span>
            <span>{label}</span>
            {isActive && <Check className="w-3 h-3 text-[var(--pm-accent)] ml-0.5" />}
          </button>
        );
      })}
    </div>
  );
};
