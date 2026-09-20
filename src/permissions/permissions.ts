import type { AppRole } from "./roles";

export type Permission =
  // Product
  | "product.create" | "product.edit" | "product.delete" | "product.view"
  | "product.bulk_upload" | "product.wholesale_price"
  // Order
  | "order.place" | "order.manage_own" | "order.manage_all" | "order.cancel"
  | "order.bulk_process"
  // Wallet
  | "wallet.view" | "wallet.topup" | "wallet.withdraw" | "wallet.transfer"
  // Seller
  | "seller.dashboard" | "seller.analytics" | "seller.campaigns"
  | "seller.livestream" | "seller.verification"
  // B2B / Wholesale
  | "b2b.view" | "b2b.create_rfq" | "b2b.manage_buyers"
  | "wholesale.set_tiers" | "wholesale.bulk_orders"
  // Logistics
  | "logistics.view" | "logistics.accept_pickup" | "logistics.track"
  | "logistics.manage_all"
  // Admin
  | "admin.dashboard" | "admin.users" | "admin.settings"
  | "admin.financials" | "admin.disputes" | "admin.portals"
  | "admin.cms" | "admin.ads" | "admin.permissions"
  // Content
  | "content.post" | "content.reel" | "content.video_paid"
  | "content.moderate"
  // Export
  | "export.view" | "export.register" | "export.manage"
  // Portal access
  | "portal.b2b" | "portal.wholesale" | "portal.factory"
  | "portal.ride" | "portal.services" | "portal.digital";

export const ROLE_PERMISSIONS: Record<AppRole, Permission[]> = {
  guest: ["product.view", "b2b.view", "logistics.view", "export.view"],

  // "user" is an alias for "buyer" — kept for backward-compat
  user: [
    "product.view", "order.place", "order.cancel",
    "wallet.view", "wallet.topup",
    "content.post", "b2b.view",
    "logistics.view", "export.view",
  ],

  buyer: [
    "product.view", "order.place", "order.cancel",
    "wallet.view", "wallet.topup",
    "content.post", "b2b.view",
    "logistics.view", "export.view",
  ],

  rural: [
    "product.view", "product.create", "product.edit",
    "order.place", "order.manage_own",
    "wallet.view", "wallet.topup", "wallet.withdraw",
    "seller.dashboard", "content.post",
    "b2b.view", "logistics.view",
  ],

  nearby_shop: [
    "product.view", "product.create", "product.edit",
    "order.place", "order.manage_own",
    "wallet.view", "wallet.topup", "wallet.withdraw",
    "seller.dashboard", "content.post",
  ],

  rider: [
    "logistics.view", "logistics.accept_pickup", "logistics.track",
    "wallet.view", "wallet.withdraw",
  ],

  service_provider: [
    "product.view", "product.create", "product.edit",
    "order.manage_own", "wallet.view", "wallet.withdraw",
    "seller.dashboard", "content.post",
  ],

  digital_seller: [
    "product.view", "product.create", "product.edit", "product.delete",
    "order.manage_own", "wallet.view", "wallet.withdraw",
    "seller.dashboard", "seller.analytics",
    "content.post", "content.reel", "content.video_paid",
    "portal.digital",
  ],

  wholesale: [
    "product.view", "product.create", "product.edit", "product.delete",
    "product.bulk_upload", "product.wholesale_price",
    "order.manage_own", "order.bulk_process",
    "wallet.view", "wallet.topup", "wallet.withdraw", "wallet.transfer",
    "seller.dashboard", "seller.analytics", "seller.campaigns",
    "b2b.view", "b2b.create_rfq", "b2b.manage_buyers",
    "wholesale.set_tiers", "wholesale.bulk_orders",
    "logistics.view", "content.post",
    "portal.b2b", "portal.wholesale",
  ],

  seller: [
    "product.view", "product.create", "product.edit", "product.delete",
    "product.bulk_upload",
    "order.manage_own", "order.cancel",
    "wallet.view", "wallet.topup", "wallet.withdraw",
    "seller.dashboard", "seller.analytics", "seller.campaigns",
    "seller.livestream", "seller.verification",
    "content.post", "content.reel",
    "b2b.view", "logistics.view",
  ],

  factory: [
    "product.view", "product.create", "product.edit", "product.delete",
    "product.bulk_upload", "product.wholesale_price",
    "order.manage_own", "order.bulk_process",
    "wallet.view", "wallet.withdraw",
    "seller.dashboard", "seller.analytics",
    "b2b.view", "b2b.create_rfq",
    "export.view", "export.register", "export.manage",
    "logistics.view",
    "portal.b2b", "portal.factory",
  ],

  moderator: [
    "product.view", "order.manage_all",
    "content.moderate", "admin.users",
    "b2b.view", "logistics.view",
  ],

  admin: [
    "product.view", "product.create", "product.edit", "product.delete",
    "product.bulk_upload", "product.wholesale_price",
    "order.place", "order.manage_own", "order.manage_all", "order.cancel", "order.bulk_process",
    "wallet.view", "wallet.topup", "wallet.withdraw", "wallet.transfer",
    "seller.dashboard", "seller.analytics", "seller.campaigns",
    "seller.livestream", "seller.verification",
    "b2b.view", "b2b.create_rfq", "b2b.manage_buyers",
    "wholesale.set_tiers", "wholesale.bulk_orders",
    "logistics.view", "logistics.accept_pickup", "logistics.track", "logistics.manage_all",
    "admin.dashboard", "admin.users", "admin.settings",
    "admin.financials", "admin.disputes", "admin.portals", "admin.cms", "admin.ads",
    "content.post", "content.reel", "content.video_paid", "content.moderate",
    "export.view", "export.register", "export.manage",
    "portal.b2b", "portal.wholesale", "portal.factory",
    "portal.ride", "portal.services", "portal.digital",
  ],

  super_admin: [
    "product.view", "product.create", "product.edit", "product.delete",
    "product.bulk_upload", "product.wholesale_price",
    "order.place", "order.manage_own", "order.manage_all", "order.cancel", "order.bulk_process",
    "wallet.view", "wallet.topup", "wallet.withdraw", "wallet.transfer",
    "seller.dashboard", "seller.analytics", "seller.campaigns",
    "seller.livestream", "seller.verification",
    "b2b.view", "b2b.create_rfq", "b2b.manage_buyers",
    "wholesale.set_tiers", "wholesale.bulk_orders",
    "logistics.view", "logistics.accept_pickup", "logistics.track", "logistics.manage_all",
    "admin.dashboard", "admin.users", "admin.settings",
    "admin.financials", "admin.disputes", "admin.portals", "admin.cms", "admin.ads",
    "admin.permissions",
    "content.post", "content.reel", "content.video_paid", "content.moderate",
    "export.view", "export.register", "export.manage",
    "portal.b2b", "portal.wholesale", "portal.factory",
    "portal.ride", "portal.services", "portal.digital",
  ],
};

/** Check if a role has a permission */
export function hasPermission(role: AppRole, permission: Permission): boolean {
  return (ROLE_PERMISSIONS[role] ?? []).includes(permission);
}

/** Check if role has ANY of the listed permissions */
export function hasAnyPermission(role: AppRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}

/** Check if role has ALL of the listed permissions */
export function hasAllPermissions(role: AppRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p));
}
