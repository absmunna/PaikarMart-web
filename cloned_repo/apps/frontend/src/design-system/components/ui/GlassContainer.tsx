import React from 'react';
import { cn } from '@/lib/utils'; // Assuming you have a cn utility, if not use string interpolation

interface GlassContainerProps {
  children?: React.ReactNode;
  className?: string;
  surfaceClassName?: string;
  rounded?: 'xl' | '2xl' | '3xl' | 'full' | string;
}

export const GlassContainer = ({ 
  children, 
  className,
  surfaceClassName,
  rounded = '3xl' 
}: GlassContainerProps) => {
  const isCustomRounded = !['xl', '2xl', '3xl', 'full'].includes(rounded);
  
  const roundedClass = {
    'xl': 'rounded-2xl',
    '2xl': 'rounded-[24px]',
    '3xl': 'rounded-[30px]',
    'full': 'rounded-full'
  } as Record<string, string>;

  const finalRounded = isCustomRounded ? `rounded-${rounded}` : roundedClass[rounded];

  return (
    <div className={cn(
      "p-[1px] relative overflow-hidden backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]",
      finalRounded,
      className
    )}>
      {/* 3D Border Glow (Outline) */}
      <div className={cn("absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none z-0", finalRounded)} />
      
      {/* Secondary Inner Border for depth */}
      <div className={cn("absolute inset-[1px] bg-gradient-to-tr from-white/10 via-transparent to-black/20 pointer-events-none z-20", finalRounded)} />

      {/* Surface Background */}
      <div className={cn(
        "absolute inset-[1px] backdrop-blur-2xl -z-10", 
        surfaceClassName || "bg-[#030d06]/85",
        finalRounded
      )} />

      {/* Inner reflection shine */}
      <div className={cn("absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none z-30", finalRounded)} />

      <div className="relative z-40 w-full h-full"> 
        {children}
      </div>
    </div>
  );
};
