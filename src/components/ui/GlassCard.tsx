import React from 'react';
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverEffect = false,
  ...props 
}) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, backgroundColor: 'rgba(255, 255, 255, 0.05)' } : undefined}
      className={cn(
        "bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-[2rem] overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
