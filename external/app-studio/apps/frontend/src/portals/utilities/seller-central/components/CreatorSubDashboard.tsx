import React from 'react';
import { Video, Sparkles, DollarSign, Heart, Eye, Lock, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const CreatorSubDashboard: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-5 rounded-3xl border border-[var(--pm-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black shadow-md shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'কন্টেন্ট ক্রিয়েটর ও ওটিটি স্টুডিও' : 'Content Creator & OTT Studio'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'এক্সক্লুসিভ টেক আর্টিকেলে, ভিডিও স্ট্রিম, প্রিমিয়াম আনলক ও টিপস আয় পরিচালনা করুন' : 'Publish premium articles, videos, set unlock fees & track creator tips earnings'}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isBn ? 'নতুন কন্টেন্ট প্রকাশ করুন' : 'Publish Content'}</span>
        </button>
      </div>

      {/* Creator Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Total Views</span>
          <p className="text-xl font-black text-[var(--pm-text)] font-mono">24.5k</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Tips Received</span>
          <p className="text-xl font-black text-[var(--pm-accent)] font-mono">$185.00</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Premium Unlocks</span>
          <p className="text-xl font-black text-[var(--pm-text)] font-mono">142 Unlocks</p>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-[var(--pm-muted)] uppercase tracking-wider">Subscribers</span>
          <p className="text-xl font-black text-[var(--pm-success)] font-mono">1,280 Users</p>
        </div>

      </div>

    </div>
  );
};
