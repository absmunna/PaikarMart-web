import React from 'react';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ChatFloatingButtonProps {
  onClick: () => void;
  unreadCount?: number;
  className?: string;
}

export const ChatFloatingButton: React.FC<ChatFloatingButtonProps> = ({
  onClick,
  unreadCount = 0,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/30 dark:border-emerald-500/40 ${className}`}
      aria-label="Open Messages & B2B Quotes"
    >
      <div className="relative flex items-center justify-center">
        <MessageSquare className="w-5 h-5 text-white transition-transform group-hover:rotate-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 bg-amber-500 text-gray-950 font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-emerald-600 shadow-sm animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline text-xs font-semibold tracking-wide">
        Messages & Quotes
      </span>
      <Sparkles className="w-3.5 h-3.5 text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
