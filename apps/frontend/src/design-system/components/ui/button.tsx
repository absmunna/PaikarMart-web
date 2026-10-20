import * as React from "react";
import { cn } from "@/lib/utils";

export function buttonVariants({ variant = 'primary', size = 'md' }: { variant?: string; size?: string } = {}) {
  const base = "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer";
  
  const variants = {
    primary: 'bg-[var(--pm-accent)] text-white hover:opacity-90 shadow-lg shadow-[var(--pm-accent)]/20',
    default: 'bg-[var(--pm-accent)] text-white hover:opacity-90 shadow-lg shadow-[var(--pm-accent)]/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/5',
    outline: 'bg-transparent border border-[var(--pm-accent)] text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
    link: 'underline underline-offset-4 hover:text-[var(--pm-accent)] text-zinc-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  const v = (variants[variant as keyof typeof variants] || variants.primary);
  const s = (sizes[size as keyof typeof sizes] || sizes.md);

  return `${base} ${v} ${s}`;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
