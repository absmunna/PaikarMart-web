import React from "react";
import { Loader2 } from "lucide-react";

export interface LoaderProps {
  full?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Loader({ full = false, size = "md" }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinner = <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />;

  if (full) {
    return (
      <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center p-4">{spinner}</div>;
}

export function FeedSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="glass-card p-4 rounded-xl space-y-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-white/10" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-white/10 rounded w-1/4" />
              <div className="h-3 bg-white/10 rounded w-1/6" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded w-full" />
            <div className="h-4 bg-white/10 rounded w-5/6" />
          </div>
          <div className="h-48 bg-white/10 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
export { Loader };
