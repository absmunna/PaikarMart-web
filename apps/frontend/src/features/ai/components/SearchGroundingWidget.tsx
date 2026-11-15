import React, { useState } from 'react';
import { Search, Globe, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { fetchSearchGrounding } from '@/features/ai/services/aiApiClient';
import { GroundingSource } from '@/features/ai/types/ai';

interface SearchGroundingWidgetProps {
  initialPrompt?: string;
  placeholder?: string;
}

export const SearchGroundingWidget: React.FC<SearchGroundingWidgetProps> = ({
  initialPrompt = 'What are current wholesale cotton t-shirt prices in Bangladesh?',
  placeholder = 'Research live commodity prices, news, market trends...'
}) => {
  const [query, setQuery] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [resultText, setResultText] = useState<string | null>(null);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchSearchGrounding(query.trim());
      setResultText(res.text);
      setSources(res.sources || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Search grounding failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-accent-border)] shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center justify-center text-[var(--pm-accent)] shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase text-[var(--pm-accent)] tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[var(--pm-accent)]" />
              Google Search Grounding
            </span>
            <h3 className="text-sm font-black text-[var(--pm-text)] leading-snug">
              Live Market & Wholesale Intelligence
            </h3>
          </div>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-[var(--pm-muted)]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-black text-xs uppercase tracking-wider transition-all shadow-md shrink-0 flex items-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching...
            </>
          ) : (
            'Research'
          )}
        </button>
      </form>

      {error && (
        <div className="p-3 rounded-2xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/40 text-[var(--pm-danger)] text-xs font-bold">
          {error}
        </div>
      )}

      {resultText && (
        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3 animate-fadeIn">
          <p className="text-xs text-[var(--pm-text)] leading-relaxed whitespace-pre-wrap font-sans">
            {resultText}
          </p>

          {sources.length > 0 && (
            <div className="pt-2 border-t border-[var(--pm-border)] space-y-2">
              <span className="text-[10px] font-black uppercase text-[var(--pm-accent)] tracking-wider block">
                Verified Web Source Citations ({sources.length})
              </span>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <a
                    key={idx}
                    href={source.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--pm-accent-soft)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-accent-border)] text-[var(--pm-accent)] text-[10px] font-bold transition-colors"
                  >
                    <span className="truncate max-w-[180px]">{source.title}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
