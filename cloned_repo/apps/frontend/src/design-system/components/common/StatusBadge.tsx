import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

interface StatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({
  status,
  showIcon = true,
  size = "md",
}: StatusBadgeProps) {
  const config: Record<
    OrderStatus,
    { label: string; icon: React.ReactNode; className: string }
  > = {
    pending: {
      label: "Pending",
      icon: <Clock className="w-3 h-3" />,
      className: "bg-warning/10 text-warning border-warning/20",
    },
    processing: {
      label: "Processing",
      icon: <Package className="w-3 h-3" />,
      className: "bg-info/10 text-info border-info/20",
    },
    shipped: {
      label: "Shipped",
      icon: <Truck className="w-3 h-3" />,
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    delivered: {
      label: "Delivered",
      icon: <CheckCircle className="w-3 h-3" />,
      className: "bg-success/10 text-success border-success/20",
    },
    cancelled: {
      label: "Cancelled",
      icon: <XCircle className="w-3 h-3" />,
      className: "bg-destructive/10 text-destructive border-destructive/20",
    },
    refunded: {
      label: "Refunded",
      icon: <RotateCcw className="w-3 h-3" />,
      className: "bg-muted text-muted-foreground border-border",
    },
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  const { label, icon, className } = config[status];

  return (
    <Badge
      variant="outline"
      className={`${className} ${sizeClasses[size]} inline-flex items-center gap-1.5`}
    >
      {showIcon && icon}
      <span>{label}</span>
    </Badge>
  );
}
