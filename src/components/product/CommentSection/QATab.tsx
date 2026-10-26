import React, { useState } from 'react';
import { MessageSquare, ArrowRight, User, HelpCircle, ShieldAlert, Award } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { toast } from 'sonner';

export interface QAThread {
  id: string;
  question: string;
  askedBy: string;
  askedDate: string;
  answer?: string;
  answeredBy?: string;
  answeredDate?: string;
}

export interface QATabProps {
  productId: string;
  initialQA?: QAThread[];
}

export const QATab: React.FC<QATabProps> = ({ productId, initialQA = [] }) => {
  const { isBn } = useLanguage();
  const [qaList, setQaList] = useState<QAThread[]>(initialQA.length > 0 ? initialQA : [
    {
      id: 'qa-1',
      question: 'পণ্যটির ওয়ারেন্টি পিরিয়ড কত মাস এবং সার্ভিসিং কন্ডিশন কি কি?',
      askedBy: 'Fahim Hasan',
      askedDate: 'June 19, 2026',
      answer: 'ধন্যবাদ আপনার প্রশ্নের জন্য। এই পণ্যটির সাথে পাচ্ছেন ১ বছরের ব্র্যান্ড ওয়ারেন্টি। যেকোনো ত্রুটিতে ফ্রি হোম সার্ভিস পাবেন।',
      answeredBy: 'Verified Supplier',
      answeredDate: 'June 20, 2026'
    },
    {
      id: 'qa-2',
      question: 'Is bulk discount applicable for orders above 500 pieces?',
      askedBy: 'Karim Sourcing',
      askedDate: 'June 18, 2026',
      answer: 'Yes! Please submit an inquiry in our B2B section for custom lot pricing over 500 units.',
      answeredBy: 'Verified Supplier',
      answeredDate: 'June 18, 2026'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState('');

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const newQA: QAThread = {
      id: `qa-${Date.now()}`,
      question: newQuestion,
      askedBy: 'You (Buyer)',
      askedDate: isBn ? 'আজ' : 'Today'
    };

    setQaList([newQA, ...qaList]);
    setNewQuestion('');
    toast.success(isBn ? 'আপনার প্রশ্নটি সফলভাবে পাঠানো হয়েছে!' : 'Question submitted successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Ask form */}
      <form onSubmit={handleAskQuestion} className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
        <div>
          <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mb-2 block">
            {isBn ? "বিক্রেতাকে প্রশ্ন করুন" : "Ask Seller a Question"}
          </label>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder={isBn ? "পণ্যটির স্টক, সাইজ বা কোনো বিষয় সম্পর্কে জানতে প্রশ্ন করুন..." : "Ask about specs, availability, shipping bulk, etc..."}
            className="w-full h-12 bg-zinc-900 border border-white/5 rounded-xl px-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex justify-between items-center">
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-500" />
            {isBn ? "সেলার সাধারণত ১ ঘণ্টায় উত্তর দেন" : "Seller usually replies in 1hr"}
          </p>
          <button
            type="submit"
            className="h-9 px-4 bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-cyan-300 transition-colors min-h-[44px]"
          >
            {isBn ? "প্রশ্ন পাঠান" : "Ask Question"}
          </button>
        </div>
      </form>

      {/* Threads */}
      <div className="space-y-4">
        {qaList.map((qa) => (
          <div key={qa.id} className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 space-y-4">
            {/* Question line */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/20 text-indigo-400">
                <span className="text-xs font-black">Q</span>
              </div>
              <div>
                <p className="text-white text-xs font-black leading-relaxed">{qa.question}</p>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5">
                  {isBn ? "জিজ্ঞাসা করেছেন" : "Asked by"} {qa.askedBy} · {qa.askedDate}
                </p>
              </div>
            </div>

            {/* Answer line */}
            {qa.answer ? (
              <div className="flex gap-3 pl-6 border-l border-white/5 pt-1">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20 text-emerald-400">
                  <span className="text-xs font-black">A</span>
                </div>
                <div>
                  <p className="text-zinc-300 text-xs font-medium leading-relaxed">{qa.answer}</p>
                  <p className="text-[9px] text-emerald-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1">
                    <Award className="w-3 h-3" /> {qa.answeredBy} · {qa.answeredDate}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 pl-6 border-l border-white/5 pt-1 text-zinc-600">
                <p className="text-[10px] font-bold uppercase tracking-widest">
                  {isBn ? "উত্তরের অপেক্ষায়..." : "Pending seller response..."}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
