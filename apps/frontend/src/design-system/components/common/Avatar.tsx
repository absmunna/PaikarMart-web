import React from "react";

interface AvatarProps {
  src?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, fallback, size = "md", className }: AvatarProps) {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }[size] || "w-10 h-10 text-sm";

  // Check if src is an emoji
  const isEmoji = src && src.length < 3 && /\p{Emoji}/u.test(src);

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] shrink-0 ${sizeClasses} ${className || ""}`}
    >
      {src && !src.includes("undefined") && !isEmoji ? (
        <img
          src={src}
          alt={fallback || "Avatar"}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <span className="font-bold text-[var(--pm-text-muted)]">
          {isEmoji ? src : (fallback || "U").slice(0, 1).toUpperCase()}
        </span>
      )}
    </div>
  );
}
