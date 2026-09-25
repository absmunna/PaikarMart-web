/**
 * PaikarMart Central Portal & Hub Registry
 * 
 * Defines the 4 Primary Business Hubs (Marketplace, Services, Logistics, Local)
 * and their specialized sub-portals as specified in Master Plan & Section 4/28.
 */

export { usePortalStore, type PortalType } from "./store/usePortalStore";
export { HUB_REGISTRY, PORTAL_REGISTRY, type PortalHub, type PortalItem } from "@/config/portals.config";

export interface HubDefinition {
  id: string;
  name: string;
  nameBn: string;
  description: string;
  descriptionBn: string;
  path: string;
  icon: string;
  portals: string[];
}

export const CORE_HUBS: HubDefinition[] = [
  {
    id: "marketplace-hub",
    name: "Marketplace Hub",
    nameBn: "মার্কেটপ্লেস হাব",
    description: "Wholesale bulk, retail consumer products & brand stores",
    descriptionBn: "পাইকারি আড়ত, খুচরা মার্কেটপ্লেস ও ডিজিটাল পণ্য",
    path: "/marketplace",
    icon: "shopping-bag",
    portals: ["wholesale", "b2c", "pk-shop", "digital", "brands"],
  },
  {
    id: "services-hub",
    name: "Services Hub",
    nameBn: "সার্ভিস হাব",
    description: "Home repair, professional technicians & business consulting",
    descriptionBn: "বাসার সার্ভিস, মেকানিক, ফ্রিল্যান্সিং ও টেকনিশিয়ান",
    path: "/services",
    icon: "briefcase",
    portals: ["services", "travel"],
  },
  {
    id: "logistics-hub",
    name: "Logistics Hub",
    nameBn: "লজিস্টিক হাব",
    description: "Courier, parcel shipping, truck rental & ride sharing",
    descriptionBn: "কুরিয়ার, পার্সেল ডেলিভারি, ট্রাক ভাড়া ও রাইড শেয়ারিং",
    path: "/logistics",
    icon: "truck",
    portals: ["ride", "transport", "emergency", "rental"],
  },
  {
    id: "local-hub",
    name: "Local Hub",
    nameBn: "লোকাল হাব",
    description: "Nearby physical shops, grocery, pharmacy & local services",
    descriptionBn: "কাছের দোকান, তাজা মুদি বাজার, ফার্মেসি ও স্থানীয় পণ্য",
    path: "/local",
    icon: "map-pin",
    portals: ["nearby", "grocery", "pharmacy", "electronics"],
  },
  {
    id: "community-hub",
    name: "Community Hub",
    nameBn: "কমিউনিটি হাব",
    description: "Buyer demands, seller offers & live commerce streaming",
    descriptionBn: "ক্রেতার চাহিদা পত্র, সেলার অফার ও লাইভ বাণিজ্য",
    path: "/demand",
    icon: "users",
    portals: ["demand", "offer", "live", "video"],
  },
];

export const ALL_PORTALS = [
  { id: "wholesale",   hubId: "marketplace-hub", label: "Wholesale B2B", labelBn: "পাইকারি বাজার",  path: "/wholesale",       icon: "building2",    roles: ["wholesale", "factory", "admin"] },
  { id: "b2c",         hubId: "marketplace-hub", label: "Retail Shop",   labelBn: "খুচরা বাজার",    path: "/b2c",             icon: "shopping-bag", roles: [] },
  { id: "pk-shop",     hubId: "marketplace-hub", label: "PK Store",      labelBn: "পিকে স্টোর",     path: "/pk-shop",         icon: "sparkles",     roles: [] },
  { id: "digital",     hubId: "marketplace-hub", label: "Digital Store", labelBn: "ডিজিটাল শপ",     path: "/portal/digital",  icon: "play-square",  roles: ["digital_seller", "seller", "buyer"] },
  { id: "services",    hubId: "services-hub",    label: "Services",      labelBn: "সেবা সমূহ",      path: "/portal/services", icon: "briefcase",    roles: ["service_provider", "buyer"] },
  { id: "ride",        hubId: "logistics-hub",   label: "Ride & Cargo",  labelBn: "রাইড ও কার্গো",   path: "/portal/ride",     icon: "truck",        roles: ["rider", "admin"] },
  { id: "nearby",      hubId: "local-hub",       label: "Nearby Shops",  labelBn: "কাছের দোকান",     path: "/portal/nearby",   icon: "map-pin",      roles: ["rural", "nearby_shop", "buyer"] },
  { id: "grocery",     hubId: "local-hub",       label: "Grocery",       labelBn: "মুদিখানা",       path: "/portal/grocery",  icon: "shopping-basket", roles: [] },
  { id: "pharmacy",    hubId: "local-hub",       label: "Pharmacy",      labelBn: "ফার্মেসি",       path: "/portal/pharmacy", icon: "pill",         roles: ["seller", "buyer"] },
  { id: "electronics", hubId: "local-hub",       label: "Electronics",   labelBn: "ইলেকট্রনিক্স",   path: "/portal/electronics", icon: "laptop",   roles: [] },
  { id: "demand",      hubId: "community-hub",   label: "Demand Post",   labelBn: "চাহিদা পত্র",    path: "/demand",          icon: "file-text",    roles: [] },
  { id: "wallet",      hubId: "marketplace-hub", label: "Wallet",        labelBn: "ওয়ালেট",         path: "/wallet",          icon: "wallet",       roles: [] },
] as const;

export type PortalId = typeof ALL_PORTALS[number]["id"];
export { LOCAL_HUB_PORTAL } from "./local-hub";
