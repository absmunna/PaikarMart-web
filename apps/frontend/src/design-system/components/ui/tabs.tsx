import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

export const Tabs = ({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className 
}: { 
  defaultValue?: string; 
  value?: string; 
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  const [currentValue, setCurrentValue] = React.useState(value || defaultValue || "");
  
  const handleValueChange = React.useCallback((val: string) => {
    setCurrentValue(val);
    onValueChange?.(val);
  }, [onValueChange]);

  return (
    <TabsContext.Provider value={{ value: value || currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-xl bg-zinc-900 p-1 text-zinc-500", className)}>
      {children}
    </div>
  );
};

export const TabsTrigger = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  
  const isActive = context.value === value;

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isActive ? "bg-[#FF7A00] text-white shadow-sm" : "hover:text-zinc-300",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className }: { value: string; children: React.ReactNode; className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) return null;

  if (context.value !== value) return null;

  return <div className={cn("mt-2 outline-none", className)}>{children}</div>;
};
