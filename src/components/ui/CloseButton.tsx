import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "motion/react";

interface CloseButtonProps extends HTMLMotionProps<"button"> {
  onClose: () => void;
  className?: string;
  variant?: "glass" | "outline" | "ghost" | "solid";
  size?: "sm" | "md" | "lg";
}

/**
 * Premium CloseButton for PaikarMart.
 * Animated, responsive, and glassmorphic.
 */
export const CloseButton: React.FC<CloseButtonProps> = ({ 
  onClose, 
  className, 
  variant = "glass", 
  size = "md", 
  ...props 
}) => {
  const sizeCls = {
    sm: "h-8 w-8 rounded-lg",
    md: "h-10 w-10 rounded-xl",
    lg: "h-12 w-12 rounded-2xl",
  }[size];

  const iconSize = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }[size];

  const variantCls = {
    glass: "bg-black/40 backdrop-blur-md border border-white/10 text-white hover:text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 shadow-xl",
    outline: "bg-transparent border border-white/10 text-zinc-500 hover:text-rose-500 hover:border-rose-500/30 hover:bg-rose-500/5",
    solid: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/20",
    ghost: "bg-transparent text-zinc-600 hover:text-rose-500 hover:bg-rose-500/8 border border-transparent hover:border-rose-500/10",
  }[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.05, rotate: 90 }}
      whileTap={{ scale: 0.95 }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className={cn(
        "group flex items-center justify-center transition-all duration-300 ease-out select-none cursor-pointer relative overflow-hidden",
        sizeCls,
        variantCls,
        className
      )}
      aria-label="Close"
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <X 
        className={cn(
          "stroke-[2.5] relative z-10",
          iconSize
        )} 
      />
    </motion.button>
  );
}
