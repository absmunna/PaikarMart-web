import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const GlassPillBadge: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold bg-white/5 backdrop-blur-md border border-white/10 text-white/80 ${className}`}>
      {children}
    </span>
  );
};
