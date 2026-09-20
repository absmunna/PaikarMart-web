import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Car, Search, Filter, Star, MapPin, BadgeCheck,
  Fuel, Settings, Calendar, Heart, Share2, X, Phone,
  Gauge, Users, Truck, Bike, ShieldCheck, Check, Zap
} from "lucide-react";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type VehicleType = "all" | "car" | "bike" | "truck" | "electric" | "cng";
type ListingType = "buy" | "rent";

type Vehicle = {
  id: string; title: string; brand: string; model: string; year: number;
  type: VehicleType; price: number; listingType: ListingType;
  mileage: string; fuel: string; transmission: string; seats: number;
  color: string; seller: string; location: string;
  rating: number; verified: boolean; image: string;
  features: string[]; description: string; featured?: boolean;
};

const VEHICLES: Vehicle[] = [
  {
    id: "v1", title: "Toyota Corolla X 2022", brand: "Toyota", model: "Corolla X", year: 2022,
    type: "car", price: 3200000, listingType: "buy",
    mileage: "24,000 km", fuel: "Petrol", transmission: "Automatic", seats: 5, color: "Pearl White",
    seller: "Auto Kingdom BD", location: "Dhanmondi, Dhaka",
    rating: 4.9, verified: true,
    image: "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=600&q=70",
    features: ["Leather Seats", "Sunroof", "Reverse Camera", "Keyless Entry", "Cruise Control"],
    description: "Well-maintained Corolla X in excellent condition. Single-owner, never garage-kept. Full service history available.",
    featured: true,
  },
  {
    id: "v2", title: "Honda CB Hornet 160R 2023", brand: "Honda", model: "CB Hornet 160R", year: 2023,
    type: "bike", price: 290000, listingType: "buy",
    mileage: "8,500 km", fuel: "Petrol", transmission: "Manual", seats: 2, color: "Matte Black",
    seller: "Dhaka Moto House", location: "Mirpur, Dhaka",
    rating: 4.7, verified: true,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=70",
    features: ["LED Lighting", "Digital Speedometer", "USB Charging", "ABS"],
    description: "Brand new condition Hornet 160R. Perfectly maintained with all original parts.",
  },
  {
    id: "v3", title: "BYD Atto 3 Electric 2024", brand: "BYD", model: "Atto 3", year: 2024,
    type: "electric", price: 4500000, listingType: "buy",
    mileage: "5,200 km", fuel: "Electric", transmission: "Automatic", seats: 5, color: "Sky Blue",
    seller: "EV Bangladesh", location: "Gulshan, Dhaka",
    rating: 4.8, verified: true,
    image: "https://images.unsplash.com/photo-1617469955246-29c2bf3d5e21?w=600&q=70",
    features: ["480km Range", "Fast Charging", "Panoramic Sunroof", "ADAS", "OTA Updates"],
    description: "Latest BYD Atto 3 with full charging equipment. Perfect for Dhaka city driving. Low running costs.",
    featured: true,
  },
  {
    id: "v4", title: "Suzuki Alto 2021", brand: "Suzuki", model: "Alto", year: 2021,
    type: "car", price: 1150000, listingType: "buy",
    mileage: "38,000 km", fuel: "Petrol/CNG", transmission: "Manual", seats: 4, color: "Silver",
    seller: "Family Auto BD", location: "Uttara, Dhaka",
    rating: 4.5, verified: false,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=70",
    features: ["A/C", "Power Windows", "Central Lock", "CNG Fitted"],
    description: "Budget-friendly Alto in good running condition. Ideal for city use.",
  },
  {
    id: "v5", title: "Hiace Minibus 2019", brand: "Toyota", model: "Hiace", year: 2019,
    type: "truck", price: 85000, listingType: "rent",
    mileage: "N/A", fuel: "Diesel", transmission: "Manual", seats: 14, color: "White",
    seller: "BD Transport Services", location: "Mohakhali, Dhaka",
    rating: 4.6, verified: true,
    image: "https://images.unsplash.com/photo-1601766167630-a55e4d609f9c?w=600&q=70",
    features: ["A/C", "14 Seater", "Corporate Trips", "Driver Included"],
    description: "Available for daily or monthly rental. Driver included. Corporate and event transport.",
  },
  {
    id: "v6", title: "Bajaj RE CNG Auto-Rickshaw", brand: "Bajaj", model: "RE CNG", year: 2022,
    type: "cng", price: 280000, listingType: "buy",
    mileage: "45,000 km", fuel: "CNG", transmission: "Manual", seats: 3, color: "Yellow-Black",
    seller: "Rickshaw Bazaar BD", location: "Old Dhaka",
    rating: 4.4, verified: true,
    image: "https://images.unsplash.com/photo-1586878341523-3b9b9da0f0f2?w=600&q=70",
    features: ["Commercial Use", "Registered", "Insurance Valid"],
    description: "Registered CNG auto-rickshaw in running condition. Route permit included.",
  },
];

const TYPE_FILTERS: { id: VehicleType; label: string; icon: React.ElementType }[] = [
  { id: "all",      label: "All",      icon: Car },
  { id: "car",      label: "Cars",     icon: Car },
  { id: "bike",     label: "Bikes",    icon: Bike },
  { id: "electric", label: "EV",       icon: Zap },
  { id: "truck",    label: "Buses",    icon: Truck },
  { id: "cng",      label: "CNG",      icon: Gauge },
];

export default function AutoPortal() {
  const [vehicleType, setVehicleType] = useState<VehicleType>("all");
  const [listingType, setListingType] = useState<ListingType>("buy");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());

  const filtered = VEHICLES.filter(v => {
    const matchType = vehicleType === "all" || v.type === vehicleType;
    const matchListing = v.listingType === listingType;
    const q = search.toLowerCase();
    const matchSearch = !q || v.title.toLowerCase().includes(q) || v.brand.toLowerCase().includes(q) || v.location.toLowerCase().includes(q);
    return matchType && matchListing && matchSearch;
  });

  const formatPrice = (v: Vehicle) => v.listingType === "rent" ? `৳${v.price.toLocaleString()}/mo` : v.price >= 1000000 ? `৳${(v.price / 100000).toFixed(1)}L` : `৳${v.price.toLocaleString()}`;

  return (
    <div className="flex flex-col gap-6 pb-28 pt-0 px-0">
      <section className="mt-2"><StoryBar context="auto" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <CategoryNavBar context="auto" />
      </div>
      <div className="px-4 mt-4">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-gray-500/20 p-5 bg-gradient-to-br from-slate-800/40 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(100,116,139,0.12)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-500/20 border border-slate-500/30 flex items-center justify-center text-2xl">🚗</div>
            <div><h1 className="text-base font-black text-white">PaikarAuto</h1><p className="text-[11px] text-zinc-400">Cars, bikes, EVs &amp; commercial</p></div>
          </div>
          <div className="relative z-10 flex gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] mb-3">
            {(["buy", "rent"] as ListingType[]).map(t => (
              <button key={t} onClick={() => setListingType(t)} className={cn("flex-1 py-2 rounded-xl text-[12px] font-black capitalize transition-all", t === listingType ? "bg-slate-500 text-white" : "text-zinc-500")}>
                {t === "buy" ? "For Sale" : "For Rent"}
              </button>
            ))}
          </div>
          <div className="relative z-10 grid grid-cols-3 gap-2">
            {[{ label: "Vehicles", value: "50,000+", emoji: "🏎️" }, { label: "Dealers", value: "1,200+", emoji: "🤝" }, { label: "Cities", value: "64", emoji: "🗺️" }].map(({ label, value, emoji }) => (
              <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.05] text-center">
                <span className="text-lg">{emoji}</span>
                <p className="text-[11px] font-black text-slate-400">{value}</p>
                <p className="text-[8px] text-zinc-600">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <div className="flex gap-2 mb-4">
          <div className="flex-1 flex items-center gap-2 p-3 rounded-2xl bg-[var(--pm-surface)]/50 border border-white/[0.06] focus-within:border-slate-500/40 transition-all">
            <Search className="w-4 h-4 text-zinc-600 shrink-0" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Brand, model, location..." className="bg-transparent flex-1 text-[12px] text-white placeholder-zinc-600 outline-none" />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
          {TYPE_FILTERS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setVehicleType(id)} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap border transition-all", vehicleType === id ? "bg-slate-500/15 border-slate-500/30 text-slate-300" : "bg-white/[0.02] border-white/[0.05] text-zinc-500")}>
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-3">{filtered.length} Vehicles</p>
        <div className="space-y-3">
          {filtered.map((vehicle, i) => (
            <motion.div key={vehicle.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} onClick={() => setSelected(vehicle)} className="overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:border-white/[0.10] transition-all cursor-pointer">
              <div className="relative h-40 overflow-hidden">
                <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  {vehicle.type === "electric" && <span className="px-2 py-0.5 rounded-lg bg-cyan-500/90 text-[9px] font-black text-white">⚡ EV</span>}
                  {vehicle.featured && <span className="px-2 py-0.5 rounded-lg bg-amber-500/90 text-[9px] font-black text-black">Featured</span>}
                </div>
                <button onClick={ev => { ev.stopPropagation(); setSaved(p => { const n = new Set(p); n.has(vehicle.id) ? n.delete(vehicle.id) : n.add(vehicle.id); return n; }); }} className={cn("absolute top-3 right-3 w-8 h-8 rounded-full border flex items-center justify-center", saved.has(vehicle.id) ? "bg-red-500/10 border-red-500/30" : "bg-black/40 border-white/20")}>
                  <Heart className={cn("w-4 h-4", saved.has(vehicle.id) ? "text-red-500 fill-red-500" : "text-white")} />
                </button>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                  <p className="text-base font-black text-white">{formatPrice(vehicle)}</p>
                  <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /><span className="text-[10px] font-black text-white">{vehicle.rating}</span></div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[12px] font-black text-white">{vehicle.title}</p>
                  {vehicle.verified && <BadgeCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-3 text-[9px] text-zinc-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{vehicle.location}</span>
                  <span>{vehicle.mileage}</span>
                  <span>{vehicle.fuel}</span>
                  <span>{vehicle.year}</span>
                </div>
              </div>
            </motion.div>
          ))}
          {!filtered.length && <div className="py-16 text-center"><Car className="w-10 h-10 text-zinc-700 mx-auto mb-3" /><p className="text-[13px] font-black text-zinc-600">No vehicles found</p></div>}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[800] bg-black/70 backdrop-blur-sm overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelected(null)}>
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="min-h-screen bg-[var(--pm-bg)]">
              <div className="h-52 relative overflow-hidden">
                <img src={selected.image} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--pm-bg)] to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"><X className="w-4 h-4 text-white" /></button>
              </div>
              <div className="px-4 pb-8">
                <div className="flex items-center gap-2 mb-1"><h2 className="text-lg font-black text-white">{selected.title}</h2>{selected.verified && <BadgeCheck className="w-5 h-5 text-cyan-400" />}</div>
                <p className="text-2xl font-black text-slate-300 mb-4">{formatPrice(selected)}</p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[{ l: "Year", v: selected.year }, { l: "Mileage", v: selected.mileage }, { l: "Fuel", v: selected.fuel }, { l: "Trans.", v: selected.transmission }, { l: "Seats", v: selected.seats }, { l: "Color", v: selected.color }].map(({ l, v }) => (
                    <div key={l} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05] text-center">
                      <p className="text-[11px] font-black text-slate-300">{v}</p>
                      <p className="text-[8px] text-zinc-600 mt-0.5">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{selected.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {selected.features.map(f => <span key={f} className="px-2.5 py-1 rounded-xl bg-slate-500/10 border border-slate-500/20 text-[10px] font-black text-slate-400">{f}</span>)}
                </div>
                <button onClick={() => { toast.success(`Contacting ${selected.seller}...`); }} className="w-full py-4 rounded-2xl bg-slate-600 hover:bg-slate-500 text-white font-black text-[13px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4" /> Contact Seller
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
