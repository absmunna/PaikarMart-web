interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "full";
}

export function ResponsiveContainer({
  children,
  className = "",
  size = "md",
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    full: "w-full",
  };

  return (
    <div className={`mx-auto w-full ${sizeClasses[size]} px-4 lg:px-6 ${className}`}>
      {children}
    </div>
  );
}
