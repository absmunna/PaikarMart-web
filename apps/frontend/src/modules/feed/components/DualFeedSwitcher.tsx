import React from 'react';
import { Sparkles, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

export type FeedTab = 'social' | 'commerce';

interface DualFeedSwitcherProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  socialCount?: number;
  commerceCount?: number;
}

export const DualFeedSwitcher: React.FC<DualFeedSwitcherProps> = ({
  activeTab,
  onTabChange,
  socialCount,
  commerceCount
}) => {
  return (
    <div className="flex items-center justify-center w-full">
      <div className="relative flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md shadow-inner">
        {/* Social Feed Tab Button */}
        <button
          onClick={() => onTabChange('social')}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all z-10 cursor-pointer ${
            activeTab === 'social' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'social' && (
            <motion.div
              layoutId="feed-active-pill"
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-rose-500 rounded-xl shadow-md shadow-orange-500/25"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>সোশ্যাল ফিড (Social)</span>
          </span>
        </button>

        {/* Commerce Feed Tab Button */}
        <button
          onClick={() => onTabChange('commerce')}
          className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition-all z-10 cursor-pointer ${
            activeTab === 'commerce' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          {activeTab === 'commerce' && (
            <motion.div
              layoutId="feed-active-pill"
              className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md shadow-orange-500/25"
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4" />
            <span>কমার্স ফিড (Commerce)</span>
          </span>
        </button>
      </div>
    </div>
  );
};
