import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default';
  className?: string;
}

export const Button = ({ variant = 'primary', className = '', ...props }: ButtonProps) => {
  const baseClass = "px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95";
  const variants = {
    primary: "bg-[var(--pm-accent)] text-white hover:bg-opacity-90",
    default: "bg-[var(--pm-accent)] text-white hover:bg-opacity-90",
    secondary: "bg-[var(--pm-surface)] text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]",
    outline: "border border-[var(--pm-border)] text-[var(--pm-text)] hover:bg-[var(--pm-surface)]",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };
  
  return <button className={`${baseClass} ${variants[variant] || variants.primary} ${className}`} {...props} />;
};
