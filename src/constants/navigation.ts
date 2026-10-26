import { 
  Home, ShoppingBag, Wallet, MessageSquare, Heart, Bell, 
  Truck, Wrench, MapPin, Radio, Sparkles, Store, LayoutDashboard, Package, Film, Tag, Monitor
} from "lucide-react";

export const MAIN_NAV = [
  { id: "feed", icon: Home, label: "Feed", href: "/", color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/10", desc: "Community & Updates" },
  { id: "video", icon: Film, label: "Video Hub", href: "/video", color: "text-rose-500", bg: "bg-rose-500/10", desc: "Shorts & Streams" },
  { id: "offers", icon: Sparkles, label: "Special Offers", href: "/offers", color: "text-amber-500", bg: "bg-amber-500/10", desc: "Best Deals" },
];

export const COMMERCE_HUBS = [
  { id: "marketplace", icon: ShoppingBag, label: "Marketplace", href: "/marketplace", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", desc: "Wholesale & Retail" },
  { id: "video", icon: Film, label: "Video & OTT Hub", href: "/video", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20", desc: "Commerce Videos & Live" },
  { id: "wholesale", icon: Store, label: "Wholesale Hub", href: "/wholesale", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20", desc: "Bulk Trade" },
  { id: "logistic", icon: Truck, label: "Logistics Hub", href: "/logistic", color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-500/20", desc: "Delivery & Rides" },
  { id: "services", icon: Wrench, label: "Services Hub", href: "/services", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", desc: "Professional Experts" },
  { id: "demand", icon: Tag, label: "Buyer Demand", href: "/demand", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", desc: "Sourcing & Requests" },
  { id: "local", icon: MapPin, label: "Local Nearby", href: "/local", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", desc: "Nearby Shops" },
  { id: "digital", icon: Monitor, label: "Digital Market", href: "/digital", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", desc: "Software, Keys & Assets" },
];

export const PERSONAL_NAV = [
  { id: "orders", icon: Package, label: "My Orders", href: "/orders", color: "text-[#FF7A00]", bg: "bg-[#FF7A00]/10" },
  { id: "wallet", icon: Wallet, label: "My Wallet", href: "/wallet", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "wishlist", icon: Heart, label: "Wishlist", href: "/wishlist", color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "messages", icon: MessageSquare, label: "Messages", href: "/messages", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "notifications", icon: Bell, label: "Notifications", href: "/notifications", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export const UTILITY_NAV = [
  { id: "seller", label: "Seller Central", icon: LayoutDashboard, href: "/seller-central", color: "text-[#FF7A00]" },
];
