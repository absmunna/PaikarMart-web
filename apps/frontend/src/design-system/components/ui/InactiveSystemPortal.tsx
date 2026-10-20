import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
  portalName: string;
}

export const InactiveSystemPortal = ({ portalName }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <div className="w-16 h-16 bg-[var(--pm-surface)] rounded-3xl flex items-center justify-center mb-6 border border-[var(--pm-border)]">
        <Construction className="w-8 h-8 text-[var(--pm-accent)]" />
      </div>
      <h1 className="text-xl font-black mb-2 text-[var(--pm-text)] tracking-tight">
        {portalName} System Inactive
      </h1>
      <p className="text-sm text-[var(--pm-text-secondary)] max-w-sm">
        This system layer is currently undergoing final calibration. 
        Please check back after the next maintenance cycle.
      </p>
    </div>
  );
};
