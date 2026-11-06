import React from 'react';

interface Props {
  current: number;
  moq: number;
  label?: string;
}

export const MoqIndicator: React.FC<Props> = ({ current, moq, label }) => {
  const percentage = Math.min((current / moq) * 100, 100);
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-white/50 uppercase tracking-wider">
        <span>{label || "MOQ Progress"}</span>
        <span>{current} / {moq}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[var(--pm-accent)] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
