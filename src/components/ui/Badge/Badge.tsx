import React from 'react';

export const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-[var(--pm-accent-soft)] ${className}`}>
      {children}
    </span>
  );
};
