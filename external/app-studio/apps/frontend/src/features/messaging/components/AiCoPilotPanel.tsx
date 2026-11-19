import React from 'react';
import {
  Bot,
  Sparkles,
  Languages,
  TrendingDown,
  FileText,
  Send,
  ArrowUpRight,
  X,
  Loader2,
  DollarSign
} from 'lucide-react';
import { CoPilotAction, CoPilotAdvice } from '@/features/messaging/types/messaging';

interface AiCoPilotPanelProps {
  advice: CoPilotAdvice | null;
  isLoading: boolean;
  error: string | null;
  onRunAction: (action: CoPilotAction) => void;
  onInsertReply: (text: string) => void;
  onSendReply: (text: string) => void;
  onApplyRecommendedQuote?: (quote: { price: number; quantity: number; notes: string }) => void;
  onClose: () => void;
}

export const AiCoPilotPanel: React.FC<AiCoPilotPanelProps> = ({
  advice,
  isLoading,
  error,
  onRunAction,
  onInsertReply,
  onSendReply,
  onApplyRecommendedQuote,
  onClose
}) => {
  const actionChips: { id: CoPilotAction; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'reply_draft', label: 'Smart Replies', icon: Sparkles },
    { id: 'negotiate', label: 'B2B Price Coach', icon: TrendingDown },
    { id: 'summarize', label: 'Summarize', icon: FileText },
    { id: 'translate', label: 'EN ↔ BN', icon: Languages }
  ];

  return (
    <div className="mx-3 mt-2 mb-1 p-3.5 rounded-[2rem] bg-[var(--pm-surface)] border border-[var(--pm-accent-border)] text-[var(--pm-text)] shadow-xl space-y-3 animate-fadeIn">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0 shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-[var(--pm-accent)] truncate">
              Gemini AI Live Co-Pilot
            </h4>
            <p className="text-[10px] text-[var(--pm-muted)] truncate">
              Real-time negotiation, bilingual replies & thread summary
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] flex items-center justify-center transition-all active-scale cursor-pointer shrink-0"
          aria-label="Close AI Co-Pilot"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {actionChips.map((chip) => {
          const isActive = advice?.action === chip.id;
          return (
            <button
              key={chip.id}
              type="button"
              disabled={isLoading}
              onClick={() => onRunAction(chip.id)}
              className={`px-3 py-1.5 rounded-[2rem] text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap transition-all active-scale cursor-pointer ${
                isActive
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md'
                  : 'bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] border border-[var(--pm-border)]'
              }`}
            >
              <chip.icon className="w-3 h-3" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="py-4 flex items-center justify-center gap-2 text-xs font-bold text-[var(--pm-accent)]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Gemini AI is analyzing live conversation...</span>
        </div>
      ) : error ? (
        <div className="p-2.5 rounded-[1.5rem] bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[11px] text-[var(--pm-danger)] font-semibold">
          {error}
        </div>
      ) : advice ? (
        <div className="space-y-2.5">
          {/* Insight Box */}
          <div className="p-3 rounded-[1.5rem] bg-[var(--pm-card)] border border-[var(--pm-border)] text-[11px] leading-relaxed text-[var(--pm-text)]">
            {advice.insight}
            {advice.translatedText && (
              <div className="mt-2 pt-2 border-t border-[var(--pm-border)] text-[var(--pm-success)] font-medium">
                {advice.translatedText}
              </div>
            )}
          </div>

          {/* Recommended B2B Counter-Offer */}
          {advice.recommendedQuote && onApplyRecommendedQuote && (
            <div className="p-2.5 rounded-[1.5rem] bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-widest text-[var(--pm-success)] block">
                  AI Recommended Counter-Offer
                </span>
                <p className="text-xs font-mono font-black text-[var(--pm-text)] truncate">
                  {advice.recommendedQuote.quantity} pcs @ ৳{advice.recommendedQuote.price}/unit
                </p>
              </div>
              <button
                type="button"
                onClick={() => onApplyRecommendedQuote(advice.recommendedQuote!)}
                className="px-3 py-1.5 rounded-[2rem] bg-[var(--pm-success)] hover:opacity-90 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0 active-scale cursor-pointer shadow-md"
              >
                <DollarSign className="w-3 h-3" />
                <span>Apply Quote</span>
              </button>
            </div>
          )}

          {/* Ready-to-Send Reply Drafts */}
          {advice.suggestedReplies && advice.suggestedReplies.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase tracking-widest text-[var(--pm-muted)] px-1 block">
                1-Tap Reply Drafts
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-0.5">
                {advice.suggestedReplies.map((reply, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-2 rounded-[1.25rem] bg-[var(--pm-card)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] transition-colors"
                  >
                    <p className="text-[11px] text-[var(--pm-text)] flex-1 leading-snug">{reply}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onInsertReply(reply)}
                        title="Insert into message box"
                        className="p-1.5 rounded-full bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] active-scale cursor-pointer"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSendReply(reply)}
                        title="Send immediately"
                        className="p-1.5 rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] active-scale cursor-pointer shadow-sm"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
