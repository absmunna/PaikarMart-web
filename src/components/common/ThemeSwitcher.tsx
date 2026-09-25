import React from 'react';
import { useTheme } from '@/features/theme/ThemeContext';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, presets } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-200 transition-all active:scale-95"
        title="Switch Theme"
      >
        <Palette className="w-4 h-4 text-[var(--pm-accent)]" />
        <span className="hidden sm:inline">Theme</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-50" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-zinc-900/95 border border-white/10 shadow-2xl backdrop-blur-xl z-50"
            >
              <div className="px-3 py-2 text-[11px] font-bold text-zinc-400 uppercase tracking-wider border-b border-white/5 mb-1">
                Select Theme / থিম নির্বাচন
              </div>
              <div className="space-y-1">
                {presets.map((preset) => {
                  const isActive = theme === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setTheme(preset.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                        isActive 
                          ? 'bg-[var(--pm-accent)]/20 text-white font-bold border border-[var(--pm-accent)]/30' 
                          : 'text-zinc-300 hover:bg-white/5 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-1">
                          {preset.swatch.map((color, i) => (
                            <span 
                              key={i} 
                              className="w-2.5 h-2.5 rounded-full" 
                              style={{ backgroundColor: color }} 
                            />
                          ))}
                        </div>
                        <div>
                          <div className="text-xs">{preset.label}</div>
                          <div className="text-[10px] text-zinc-400">{preset.labelBn}</div>
                        </div>
                      </div>
                      {isActive && <Check className="w-4 h-4 text-[var(--pm-accent)]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
