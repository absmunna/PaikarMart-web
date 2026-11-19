import React from 'react';
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';

export const InteractionRow: React.FC = () => {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-[var(--pm-border)] mt-auto">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-1.5 text-white/70 hover:text-[var(--pm-accent)] transition-colors">
          <Heart className="w-5 h-5" />
          <span className="text-xs font-bold">১২৪</span>
        </button>
        <button className="flex items-center gap-1.5 text-white/70 hover:text-[var(--pm-accent)] transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs font-bold">৪৮</span>
        </button>
        <button className="text-white/70 hover:text-[var(--pm-accent)] transition-colors">
          <Share2 className="w-5 h-5" />
        </button>
      </div>
      <button className="text-white/70 hover:text-[var(--pm-accent)] transition-colors">
        <Bookmark className="w-5 h-5" />
      </button>
    </div>
  );
};
