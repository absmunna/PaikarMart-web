import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div className={`animate-pulse bg-[var(--pm-surface-hover)] rounded ${className}`} />
  );
};
