import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Star, HelpCircle, Users } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { ReviewTab, Review } from './ReviewTab';
import { QATab, QAThread } from './QATab';
import { DiscussionTab, DiscussionPost } from './DiscussionTab';

export interface CommentSectionProps {
  productId: string;
  initialReviews?: Review[];
  initialQA?: QAThread[];
  initialDiscussion?: DiscussionPost[];
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  productId,
  initialReviews,
  initialQA,
  initialDiscussion
}) => {
  const { isBn } = useLanguage();
  const [activeTab, setActiveTab] = useState<'reviews' | 'qa' | 'discussion'>('reviews');

  const tabs = [
    { id: 'reviews' as const, label: isBn ? "রিভিউ" : "Reviews", icon: Star },
    { id: 'qa' as const, label: isBn ? "প্রশ্নোত্তর" : "Q&A", icon: HelpCircle },
    { id: 'discussion' as const, label: isBn ? "আলোচনা" : "Discussion", icon: Users }
  ];

  return (
    <div className="bg-[#030604] rounded-[2.5rem] border border-white/[0.04] p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          {isBn ? "ক্রেতা প্রতিক্রিয়া" : "Consignee Hub Chat & Reviews"}
        </h3>
      </div>

      {/* Tabs list with 44px minimum touch targets */}
      <div className="grid grid-cols-3 bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer min-h-[44px] ${
                isActive 
                  ? "bg-white/5 border border-white/10 text-cyan-400 shadow-lg" 
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <Icon size={12} className={isActive ? "text-cyan-400" : "text-zinc-500"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render content */}
      <div className="mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'reviews' && (
              <ReviewTab productId={productId} initialReviews={initialReviews} />
            )}
            {activeTab === 'qa' && (
              <QATab productId={productId} initialQA={initialQA} />
            )}
            {activeTab === 'discussion' && (
              <DiscussionTab productId={productId} initialDiscussion={initialDiscussion} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
