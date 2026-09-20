/**
 * Portal registry — all available portals in PaikarMart
 * Each portal has its own isolated pages/, components/, routes/, services/
 */
export { LOCAL_HUB_PORTAL }  from "./local-hub";

export const ALL_PORTALS = [
  { id: "b2b",       label: "B2B",         labelBn: "বি-টু-বি",           path: "/b2b",        icon: "building2",    roles: ["wholesale","factory","admin"] },
  { id: "factory",   label: "Export",      labelBn: "এক্সপোর্ট",          path: "/export",     icon: "globe",        roles: ["factory","admin"] },
  { id: "nearby",    label: "Nearby",      labelBn: "কাছের দোকান",         path: "/local",      icon: "map-pin",      roles: ["rural","nearby_shop","buyer"] },
  { id: "ride",      label: "Logistics",   labelBn: "লজিস্টিক",           path: "/logistics",  icon: "truck",        roles: ["rider","admin"] },
  { id: "digital",   label: "Digital",     labelBn: "ডিজিটাল",            path: "/video",      icon: "play-square",  roles: ["digital_seller","seller","buyer"] },
  { id: "services",  label: "Services",    labelBn: "সার্ভিস",            path: "/services",   icon: "briefcase",    roles: ["service_provider","buyer"] },
  { id: "pharmacy",  label: "Pharmacy",    labelBn: "ফার্মেসি",           path: "/pharmacy",   icon: "pill",         roles: ["seller","buyer"] },
  { id: "grocery",   label: "Grocery",     labelBn: "মুদিখানা",           path: "/marketplace?cat=grocery", icon: "shopping-basket", roles: [] },
  { id: "b2c",       label: "Marketplace", labelBn: "মার্কেটপ্লেস",      path: "/marketplace",icon: "shopping-bag", roles: [] },
] as const;
