import React from 'react';

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={`bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl p-4 ${className}`}>
      {children}
    </div>
  );
};
