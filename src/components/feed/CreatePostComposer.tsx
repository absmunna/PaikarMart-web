import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Package, FileText, PlaySquare, Wrench, Send } from 'lucide-react';

type Kind = 'status' | 'product' | 'video' | 'deal';

const QUICK = [
  { kind: 'product' as Kind, label: 'Product', Icon: Package, href: '/seller/products', color: 'text-emerald-400' },
  { kind: 'deal' as Kind, label: 'Demand', Icon: FileText, href: '/demand', color: 'text-amber-400' },
  { kind: 'status' as Kind, label: 'Service', Icon: Wrench, href: '/services', color: 'text-purple-400' },
  { kind: 'video' as Kind, label: 'Video', Icon: PlaySquare, href: '/reels', color: 'text-rose-400' },
];

export const CreatePostComposer = () => {
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<Kind>('status');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    // UI mock for posting
    console.log('Posting:', { content, kind });
    setContent('');
    setKind('status');
  };

  return (
    <div className="bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4 flex flex-col gap-3">
      <form onSubmit={submit} className="flex items-start gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full border border-[var(--pm-border)] bg-[var(--pm-surface-hover)] flex items-center justify-center text-[var(--pm-text-muted)] font-bold">
          U
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="আপনি কী বিক্রি করতে বা অনুরোধ করতে চান?"
            rows={2}
            className="w-full resize-none bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2 text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
          />
          <div className="flex items-center justify-between gap-2">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              className="bg-[var(--pm-bg)] text-[var(--pm-text)] text-xs rounded-md px-2 py-1.5 border border-[var(--pm-border)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
            >
              <option value="status">স্ট্যাটাস</option>
              <option value="product">প্রোডাক্ট</option>
              <option value="deal">ডিমান্ড</option>
              <option value="video">ভিডিও</option>
            </select>
            <button 
              type="submit" 
              disabled={!content.trim()}
              className="bg-[var(--pm-accent)] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Send className="h-3.5 w-3.5" />
              পোস্ট করুন
            </button>
          </div>
        </div>
      </form>

      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--pm-border)]/50">
        {QUICK.map(({ kind, label, Icon, href, color }) => (
          <Link key={kind} to={href} className="w-full">
            <button
              type="button"
              className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs py-2 rounded-lg bg-[var(--pm-bg)] border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text-secondary)] transition-colors"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="font-semibold">{label}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
};
