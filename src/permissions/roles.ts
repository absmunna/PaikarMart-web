export type AppRole =
  | "guest"
  | "buyer"
  | "user"           // legacy alias → treated as buyer
  | "seller"
  | "wholesale"
  | "factory"
  | "rural"
  | "rider"
  | "service_provider"
  | "nearby_shop"
  | "digital_seller"
  | "moderator"
  | "admin"
  | "super_admin";

export const ROLE_HIERARCHY: Record<AppRole, number> = {
  guest:            0,
  buyer:            1,
  user:             1,  // legacy alias for buyer
  rural:            2,
  nearby_shop:      2,
  rider:            2,
  service_provider: 3,
  digital_seller:   3,
  wholesale:        4,
  seller:           4,
  factory:          5,
  moderator:        6,
  admin:            7,
  super_admin:      8,
};

/** Human-readable labels */
export const ROLE_LABELS: Record<AppRole, string> = {
  guest:            "Guest",
  buyer:            "Buyer",
  user:             "Buyer",  // legacy alias
  rural:            "Rural Shopkeeper",
  nearby_shop:      "Nearby Shop",
  rider:            "Delivery Rider",
  service_provider: "Service Provider",
  digital_seller:   "Digital Seller",
  wholesale:        "Wholesale Seller",
  seller:           "Seller",
  factory:          "Factory / Exporter",
  moderator:        "Moderator",
  admin:            "Admin",
  super_admin:      "Super Admin",
};

export const ROLE_COLORS: Record<AppRole, string> = {
  guest:            "bg-white/8 text-white/50 border-white/10",
  buyer:            "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",
  user:             "bg-cyan-500/15 text-cyan-300 border-cyan-500/20",  // legacy alias
  rural:            "bg-amber-500/15 text-amber-300 border-amber-500/25",
  nearby_shop:      "bg-orange-500/15 text-orange-300 border-orange-500/25",
  rider:            "bg-sky-500/15 text-sky-300 border-sky-500/25",
  service_provider: "bg-teal-500/15 text-teal-300 border-teal-500/25",
  digital_seller:   "bg-violet-500/15 text-violet-300 border-violet-500/25",
  wholesale:        "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  seller:           "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
  factory:          "bg-blue-500/15 text-blue-300 border-blue-500/25",
  moderator:        "bg-amber-500/15 text-amber-300 border-amber-500/25",
  admin:            "bg-purple-500/15 text-purple-300 border-purple-500/25",
  super_admin:      "bg-rose-500/15 text-rose-300 border-rose-500/25",
};
