import React from "react";
import { AppRole, RoleGroup, getRoleGroup, ROLE_GROUP_META, ROLE_HIERARCHY } from "@/config/roles.config";
import { cn } from "@/lib/utils";
import { Shield, Store, ShoppingBag, CheckCircle2, UserCheck } from "lucide-react";

interface RoleBadgeProps {
  role: AppRole;
  showGroup?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function RoleBadge({ role, showGroup = true, size = "md", className }: RoleBadgeProps) {
  const roleGroup: RoleGroup = getRoleGroup(role);
  const meta = ROLE_GROUP_META[roleGroup];
  const roleConfig = ROLE_HIERARCHY[role];

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2"
  };

  const groupIcons = {
    customer: <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-emerald-400" />,
    vendor: <Store className="w-3.5 h-3.5 shrink-0 text-amber-400" />,
    admin: <Shield className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
  };

  const groupColors = {
    customer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    vendor: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/25"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border shadow-sm transition-all",
        sizeClasses[size],
        groupColors[roleGroup],
        className
      )}
      title={`${meta.labelEn} (${meta.labelBn}) — Role: ${role}`}
    >
      {groupIcons[roleGroup]}
      <span>{roleConfig?.labelBn || meta.labelBn}</span>
      {showGroup && (
        <span className="opacity-75 text-[10px] uppercase font-mono tracking-wider ml-0.5">
          • {meta.labelEn}
        </span>
      )}
    </span>
  );
}
