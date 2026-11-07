import React from 'react';
import { X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DrawerItem {
  label: string;
  icon: React.ElementType;
  badge?: string;
  href?: string;
  onClick?: () => void;
}

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: DrawerItem[];
}

export const SettingsDrawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, items }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-sm bg-[var(--pm-surface)] h-full shadow-2xl border-l border-[var(--pm-border)] p-6 flex flex-col text-[var(--pm-text)]">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--pm-border)]">
          <div>
            <h2 className="text-lg font-black text-[var(--pm-text)] tracking-tight">{title}</h2>
            <p className="text-[11px] text-[var(--pm-text-muted)]">অ্যাকাউন্ট ও অ্যাপ্লিকেশন কনফিগারেশন</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-2xl hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.onClick?.();
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-[var(--pm-surface-hover)] border border-transparent hover:border-[var(--pm-border)] text-[var(--pm-text)] hover:text-white transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[var(--pm-bg)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-accent)] group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-xs block text-[var(--pm-text)]">{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] text-[var(--pm-accent)] font-semibold">{item.badge}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--pm-text-muted)] group-hover:translate-x-0.5 transition-transform" />
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-[var(--pm-border)] text-center">
          <p className="text-[10px] text-[var(--pm-text-muted)]">Paikar Mart Super App • v2.4</p>
        </div>
      </div>
    </div>
  );
};
