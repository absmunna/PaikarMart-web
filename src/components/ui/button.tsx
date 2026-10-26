import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'default' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'default';
  asChild?: boolean;
}

export const buttonVariants = ({ variant = 'primary', size = 'md', className = '' }: { variant?: any; size?: any; className?: string } = {}) => {
  const variants: Record<string, string> = {
    primary: 'bg-[#FF7A00] text-white hover:bg-[#e66e00] shadow-lg shadow-[#FF7A00]/20',
    default: 'bg-[#FF7A00] text-white hover:bg-[#e66e00] shadow-lg shadow-[#FF7A00]/20',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/5',
    outline: 'bg-transparent border border-[#FF7A00] text-[#FF7A00] hover:bg-[#FF7A00]/10',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
    destructive: 'bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20',
    link: 'bg-transparent text-blue-400 underline-offset-4 hover:underline p-0 h-auto',
  };

  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    default: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return cn(
    "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-widest transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
    variants[variant] || variants.primary,
    sizes[size] || sizes.md,
    className
  );
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonVariants({ variant, size, className })}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
