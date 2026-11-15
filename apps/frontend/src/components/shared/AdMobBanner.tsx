import React from 'react';
import { Info, X } from 'lucide-react';

interface AdMobBannerProps {
  format?: 'banner' | 'leaderboard' | 'native';
  variant?: 'vercel' | 'supabase' | 'render';
  className?: string;
}

const AD_VARIANTS = {
  vercel: {
    tag: 'Vercel',
    title: 'Deploy Next-Gen React Frontends on Vercel',
    desc: 'Zero configuration edge deployments, instant previews, and global CDN caching.',
    url: 'https://vercel.com'
  },
  supabase: {
    tag: 'Supabase',
    title: 'PostgreSQL Database & Real-Time Auth',
    desc: 'Scalable PostgreSQL, Row-Level Security, vector search, and instant APIs.',
    url: 'https://supabase.com'
  },
  render: {
    tag: 'Render',
    title: 'Host Cloud Web Services & APIs on Render',
    desc: 'Deploy fast, reliable Node.js backends and microservices with automatic SSL.',
    url: 'https://render.com'
  }
};

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ format = 'banner', variant = 'vercel', className = '' }) => {
  const [dismissed, setDismissed] = React.useState(false);
  const ad = AD_VARIANTS[variant] || AD_VARIANTS.vercel;

  if (dismissed) return null;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[var(--pm-border)] bg-[var(--pm-card)] p-3 ${className}`}>
      <div className="flex items-center justify-between text-[11px] text-[var(--pm-muted)] mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wider text-[10px] px-1.5 py-0.5 rounded bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)]">
            Ad · Google AdMob
          </span>
          <span>Sponsored Recommendation</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            type="button" 
            aria-label="Ad info" 
            className="p-1 text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            onClick={() => setDismissed(true)} 
            aria-label="Close ad"
            className="p-1 text-[var(--pm-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center justify-center shrink-0">
            <span className="font-bold text-[var(--pm-accent)] text-xs text-center px-1">{ad.tag}</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--pm-text)]">
              {ad.title}
            </h4>
            <p className="text-xs text-[var(--pm-muted)] mt-0.5">
              {ad.desc}
            </p>
          </div>
        </div>
        <a
          href={ad.url}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] transition-colors"
        >
          Learn More
        </a>
      </div>
    </div>
  );
};
