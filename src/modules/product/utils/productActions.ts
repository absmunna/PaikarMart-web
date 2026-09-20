import type { ReactElement } from "react";
import { SellerType } from "@/modules/auth/types/user.types";

export interface ProductAction {
  label: string;
  variant: "primary" | "outline" | "soft";
  icon?: ReactElement;
}

export function getProductActionBySellerType(sellerType?: SellerType): ProductAction {
  const actions: Record<SellerType, ProductAction> = {
    wholesale: {
      label: "Request Quote",
      variant: "primary",
    },
    retail: {
      label: "Buy Now",
      variant: "primary",
    },
    service: {
      label: "Book Service",
      variant: "primary",
    },
    content_creator: {
      label: "Subscribe",
      variant: "primary",
    },
  };

  return actions[sellerType || "retail"];
}
