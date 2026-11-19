import React from 'react';
import { cn } from '@/lib/utils';

export type SkeletonVariant = 'rectangular' | 'circular' | 'rounded' | 'text' | 'badge';
export type SkeletonAnimation = 'shimmer' | 'pulse' | 'none';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

/**
 * Reusable Skeleton Component for the Paikar Mart Design System.
 * Provides accessible, high-fidelity visual loading state feedback.
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(({
  variant = 'rectangular',
  animation = 'shimmer',
  width,
  height,
  lines = 1,
  className,
  style,
  ...props
}, ref) => {
  // Convert numeric dimension to px string
  const formatDimension = (val?: string | number) => {
    if (val === undefined) return undefined;
    return typeof val === 'number' ? `${val}px` : val;
  };

  const baseStyles = 'relative overflow-hidden bg-white/[0.05] border border-white/[0.03] select-none';

  const animationStyles = {
    shimmer: 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent',
    pulse: 'animate-pulse',
    none: '',
  };

  const variantStyles: Record<SkeletonVariant, string> = {
    rectangular: 'rounded-xl',
    rounded: 'rounded-2xl sm:rounded-3xl',
    circular: 'rounded-full shrink-0',
    text: 'rounded-md h-3.5 my-1',
    badge: 'rounded-lg h-5 px-3',
  };

  const combinedStyles: React.CSSProperties = {
    width: formatDimension(width),
    height: formatDimension(height),
    ...style,
  };

  // If multiple lines are requested for text skeleton
  if (lines > 1) {
    const lineWidths = ['w-full', 'w-[90%]', 'w-[75%]', 'w-[60%]', 'w-[80%]'];
    return (
      <div 
        ref={ref} 
        role="status" 
        aria-label="কনটেন্ট লোড হচ্ছে..." 
        className={cn("flex flex-col gap-2 w-full", className)}
        {...props}
      >
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            style={{
              height: formatDimension(height) || undefined,
            }}
            className={cn(
              baseStyles,
              variantStyles.text,
              animationStyles[animation],
              lineWidths[index % lineWidths.length]
            )}
          />
        ))}
        <span className="sr-only">লোড হচ্ছে...</span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="status"
      aria-label="কনটেন্ট লোড হচ্ছে..."
      style={combinedStyles}
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      {...props}
    >
      <span className="sr-only">লোড হচ্ছে...</span>
    </div>
  );
});

Skeleton.displayName = 'Skeleton';

/* ─────────────────────────────────────────────────────────────
 * Pre-composed Specialized Skeletons for Common Super App Views
 * ───────────────────────────────────────────────────────────── */

export interface SkeletonTextProps extends React.HTMLAttributes<HTMLDivElement> {
  lines?: number;
  className?: string;
  lineHeight?: string;
  spacing?: string;
}

/**
 * Multi-line Text Skeleton with staggered natural widths
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
  lineHeight = 'h-3.5',
  spacing = 'gap-2',
  ...props
}) => {
  const widths = ['w-full', 'w-[92%]', 'w-[68%]', 'w-[85%]', 'w-[74%]'];
  return (
    <div role="status" className={cn("flex flex-col w-full", spacing, className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(lineHeight, widths[i % widths.length])}
        />
      ))}
      <span className="sr-only">টেক্সট লোড হচ্ছে...</span>
    </div>
  );
};

export interface SkeletonAvatarProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  shape?: 'circle' | 'rounded';
  className?: string;
}

/**
 * Avatar or User Profile placeholder skeleton
 */
export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  shape = 'circle',
  className,
}) => {
  const sizeMap: Record<string, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const isNamedSize = typeof size === 'string' && sizeMap[size];
  const dimensionClass = isNamedSize ? sizeMap[size] : '';
  const customStyle = typeof size === 'number' ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <Skeleton
      variant={shape === 'circle' ? 'circular' : 'rounded'}
      style={customStyle}
      className={cn(dimensionClass, className)}
    />
  );
};

export interface SkeletonButtonProps {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

/**
 * Button placeholder skeleton
 */
export const SkeletonButton: React.FC<SkeletonButtonProps> = ({
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const sizeClass = {
    sm: 'h-8 px-4 rounded-lg',
    md: 'h-10 px-5 rounded-xl',
    lg: 'h-12 px-6 rounded-2xl',
  }[size];

  return (
    <Skeleton
      variant="rounded"
      className={cn(sizeClass, fullWidth ? 'w-full' : 'w-28', className)}
    />
  );
};

/**
 * Pixel-matched E-Commerce Product Card Skeleton for Paikar Mart
 */
export const SkeletonProductCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      "bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-0 overflow-hidden flex flex-col justify-between shadow-sm",
      className
    )}>
      <div>
        {/* Media Placeholder: 4/3 Aspect Ratio */}
        <div className="aspect-[4/3] w-full bg-zinc-900 relative">
          <Skeleton variant="rectangular" className="w-full h-full rounded-none" />
        </div>

        {/* Card Content Details */}
        <div className="p-3.5 sm:p-4 space-y-2 text-left">
          {/* Unboxed Kicker/Category */}
          <div className="flex items-center gap-1.5">
            <Skeleton variant="text" className="h-2.5 w-16" />
            <span className="text-zinc-600 text-[10px]">·</span>
            <Skeleton variant="text" className="h-2.5 w-12" />
          </div>

          {/* Product Title: 2 lines */}
          <div className="space-y-1 py-0.5">
            <Skeleton variant="text" className="h-3.5 w-full" />
            <Skeleton variant="text" className="h-3.5 w-3/4" />
          </div>

          {/* Seller / Location Info */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <Skeleton variant="circular" className="w-3.5 h-3.5" />
            <Skeleton variant="text" className="h-2.5 w-20" />
            <span className="text-zinc-600 text-[10px]">·</span>
            <Skeleton variant="text" className="h-2.5 w-12" />
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between pt-1.5 border-t border-white/[0.04]">
            <Skeleton variant="text" className="h-5 w-20" />
            <Skeleton variant="text" className="h-3.5 w-12" />
          </div>

          {/* Rating / Reviews Row */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <Skeleton variant="circular" className="w-3 h-3" />
            <Skeleton variant="text" className="h-2.5 w-16" />
          </div>
        </div>
      </div>

      {/* Action Buttons Footer: Dual 2-Column Buttons */}
      <div className="p-3.5 sm:p-4 pt-0 grid grid-cols-2 gap-2">
        <Skeleton variant="rounded" className="h-8 rounded-xl w-full" />
        <Skeleton variant="rounded" className="h-8 rounded-xl w-full" />
      </div>
    </div>
  );
};

/**
 * Grid of Product Card Skeletons
 */
export const SkeletonProductGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
};

/**
 * Social Feed Post Skeleton
 */
export const SkeletonFeedCard: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      "bg-[var(--pm-surface)] rounded-3xl border border-[var(--pm-border)] p-4 sm:p-5 space-y-4 shadow-sm",
      className
    )}>
      {/* Header: User avatar & name */}
      <div className="flex items-center gap-3">
        <SkeletonAvatar size="md" />
        <div className="flex-1 space-y-1">
          <Skeleton variant="text" className="h-3.5 w-32" />
          <Skeleton variant="text" className="h-2.5 w-20" />
        </div>
        <Skeleton variant="circular" className="w-6 h-6" />
      </div>

      {/* Post Text */}
      <SkeletonText lines={2} />

      {/* Post Media: 16/9 aspect ratio */}
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden">
        <Skeleton variant="rectangular" className="w-full h-full rounded-2xl" />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <div className="flex items-center gap-4">
          <Skeleton variant="rounded" className="h-6 w-14 rounded-lg" />
          <Skeleton variant="rounded" className="h-6 w-14 rounded-lg" />
        </div>
        <Skeleton variant="rounded" className="h-6 w-12 rounded-lg" />
      </div>
    </div>
  );
};

export default Skeleton;
