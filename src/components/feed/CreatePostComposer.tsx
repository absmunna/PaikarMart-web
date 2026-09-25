import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, FileText, PlaySquare, Wrench, Send, Sparkles, PlusCircle } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { toast } from 'sonner';

type Kind = 'status' | 'product' | 'video' | 'deal';

interface CreatePostComposerProps {
  onPostCreated?: (post: { content: string; kind: Kind }) => void;
  onOpenModal?: () => void;
  className?: string;
}

export const CreatePostComposer: React.FC<CreatePostComposerProps> = ({ 
  onPostCreated, 
  onOpenModal,
  className = "" 
}) => {
  const { user, isSeller } = useAuth();
  const [content, setContent] = useState('');
  const [kind, setKind] = useState<Kind>(isSeller ? 'product' : 'status');

  const QUICK = [
    { 
      kind: 'product' as Kind, 
      label: isSeller ? 'পণ্য আপলোড' : 'Product', 
      Icon: Package, 
      href: isSeller ? '/seller/products' : '/shop', 
      color: 'text-emerald-400',
      action: onOpenModal
    },
    { 
      kind: 'deal' as Kind, 
      label: 'ডিমান্ড পোস্ট', 
      Icon: FileText, 
      href: '/demand', 
      color: 'text-amber-400',
      action: onOpenModal
    },
    { 
      kind: 'status' as Kind, 
      label: 'সার্ভিস', 
      Icon: Wrench, 
      href: '/services', 
      color: 'text-purple-400' 
    },
    { 
      kind: 'video' as Kind, 
      label: 'রিলস ভিডিও', 
      Icon: PlaySquare, 
      href: '/reels', 
      color: 'text-rose-400' 
    },
  ];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    if (onPostCreated) {
      onPostCreated({ content, kind });
    }
    
    toast.success("পোস্ট সফলভাবে পাবলিশ হয়েছে!");
    setContent('');
    setKind(isSeller ? 'product' : 'status');
  };

  return (
    <div className={`bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] shadow-sm p-4 sm:p-5 flex flex-col gap-3.5 ${className}`}>
      {/* Header / Avatar + Input */}
      <form onSubmit={submit} className="flex items-start gap-3">
        <div className="h-10 w-10 sm:h-11 sm:w-11 shrink-0 rounded-full border border-[var(--pm-border)] bg-[var(--pm-surface-hover)] overflow-hidden shadow-xs">
          <img 
            src={user?.avatar || user?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`} 
            alt="Avatar" 
            className="w-full h-full object-cover" 
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              isSeller 
                ? "নতুন পাইকারি পণ্য বা স্টোরের অফার লিখুন..." 
                : "আপনার কী পণ্য বা সার্ভিস প্রয়োজন? বিস্তারিত লিখুন..."
            }
            rows={2}
            className="w-full resize-none bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] transition-all font-medium"
          />

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
                className="bg-[var(--pm-bg)] text-[var(--pm-text)] text-[11px] sm:text-xs font-bold rounded-xl px-2.5 py-1.5 border border-[var(--pm-border)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)]"
              >
                <option value="status">📝 সাধারণ আপডেট</option>
                <option value="product">📦 পাইকারি পণ্য</option>
                <option value="deal">📢 বায়ার ডিমান্ড</option>
                <option value="video">🎬 ভিডিও রিলস</option>
              </select>

              {onOpenModal && (
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-[var(--pm-accent)] hover:underline"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {isSeller ? 'ক্যাটালগ পণ্য যুক্ত' : 'ডিমান্ড ফর্ম'}
                </button>
              )}
            </div>

            <button 
              type="submit" 
              disabled={!content.trim()}
              className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-white px-4 py-1.5 rounded-xl text-xs font-black shadow-md shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Send className="h-3.5 w-3.5" />
              পোস্ট করুন
            </button>
          </div>
        </div>
      </form>

      {/* Quick Action Badges */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--pm-border)]/50">
        {QUICK.map(({ kind, label, Icon, href, color, action }) => (
          action ? (
            <button
              key={kind}
              type="button"
              onClick={action}
              className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs py-2 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] transition-colors active:scale-98"
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <span className="font-bold truncate">{label}</span>
            </button>
          ) : (
            <Link key={kind} to={href} className="w-full">
              <button
                type="button"
                className="w-full flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-[10px] sm:text-xs py-2 rounded-xl bg-[var(--pm-bg)]/70 border border-[var(--pm-border)] hover:bg-[var(--pm-surface-hover)] text-[var(--pm-text)] transition-colors active:scale-98"
              >
                <Icon className={`h-4 w-4 ${color}`} />
                <span className="font-bold truncate">{label}</span>
              </button>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};
