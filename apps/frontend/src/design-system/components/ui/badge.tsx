import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white shadow-lg shadow-primary/20",
        secondary: "border-white/10 bg-white/5 text-white backdrop-blur-md",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20",
        outline: "text-foreground border-white/20 bg-transparent hover:bg-white/5",
        premium: "border-amber-400/50 bg-amber-400/10 text-amber-500 shadow-[0_0_15px_rgba(251,191,36,0.2)]",
        glass: "glass-card border-none text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
