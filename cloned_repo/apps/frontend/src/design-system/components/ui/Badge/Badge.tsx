import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  className?: string;
  variant?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, className = '', variant, ...props }) => {
  const variantStyles = variant === 'destructive' 
    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
    : variant === 'secondary'
    ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
    : variant === 'outline'
    ? 'border border-[var(--pm-border)] text-zinc-300'
    : 'bg-[var(--pm-accent-soft)] text-white';

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1 ${variantStyles} ${className}`} {...props}>
      {children}
    </span>
  );
};
