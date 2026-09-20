import React from 'react';
import { HelpCircle } from 'lucide-react';

interface QuestionAnswer {
  id: string;
  userName: string;
  question: string;
  answer: string;
  createdAt: string;
}

interface ProductQASectionProps {
  productId: string;
  questionsAnswers: QuestionAnswer[];
}

export const ProductQASection = ({ productId, questionsAnswers }: ProductQASectionProps) => {
  return (
    <div className="space-y-4">
      {questionsAnswers.map((qa) => (
        <div key={qa.id} className="bg-[#0c1a12] border border-[#1e3425] rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">{qa.userName} <span className="text-zinc-500 font-normal ml-1">asks:</span></p>
              <p className="text-sm text-zinc-300 mt-1">{qa.question}</p>
            </div>
          </div>
          <div className="mt-3 pl-8 text-sm text-cyan-400 font-medium border-l-2 border-cyan-400/30 ml-2">
            {qa.answer}
          </div>
        </div>
      ))}
    </div>
  );
};
