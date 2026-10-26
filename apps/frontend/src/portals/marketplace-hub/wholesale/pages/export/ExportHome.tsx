import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Globe, Package, Factory, TrendingUp, FileText, Search,
  MapPin, Shield, BadgeCheck, ChevronRight, ArrowRight,
  Plane, Anchor, Truck, BarChart3, X, Check, Clock,
  Building2, Users, Phone, Star, Award, AlertCircle
} from "lucide-react";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { StoryBar } from "@shared/StoryBar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ExportProduct = {
  id: string; name: string; category: string; minOrderValue: string;
  countries: string[]; lead_time: string; rating: number; reviews: number;
  company: string; location: string; verified: boolean; image: string;
  description: string; hs_code?: string; certifications?: string[];
};

const EXPORT_CATEGORIES = [
  { id: "all", label: "All Sectors", emoji: "🌐" },
  { id: "garments", label: "Garments & RMG", emoji: "👕" },
  { id: "leather", label: "Leather Goods", emoji: "👜" },
  { id: "jute", label: "Jute Products", emoji: "🌿" },
  { id: "agro", label: "Agro Products", emoji: "🌾" },
  { id: "pharma", label: "Pharma", emoji: "💊" },
  { id: "ceramic", label: "Ceramics", emoji: "🏺" },
  { id: "it", label: "IT & Software", emoji: "💻" },
];

const EXPORT_PRODUCTS: ExportProduct[] = [
  {
    id: "e1", name: "Men's Woven Shirts (Export Quality)", category: "garments",
    minOrderValue: "$10,000", countries: ["USA", "EU", "UK", "Canada"],
    lead_time: "45–60 days", rating: 4.9, reviews: 312,
    company: "Ananta Group", location: "Ashulia, Dhaka",
    verified: true,
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=300&q=80",
    description: "Export-ready woven shirts for international buyers. Custom fit, fabric, and branding available.",
    hs_code: "HS 6205", certifications: ["BSCI", "GOTS", "ISO 9001", "OEKO-TEX"],
  },
  {
    id: "e2", name: "Full-Grain Leather Bags", category: "leather",
    minOrderValue: "$5,000", countries: ["Italy", "Germany", "France", "USA"],
    lead_time: "30–45 days", rating: 4.8, reviews: 187,
    company: "BATA Industries BD", location: "Tongi, Gazipur",
    verified: true,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300&q=80",
    description: "Premium full-grain leather bags and accessories. CFL compliant. Custom designs accepted.",
    hs_code: "HS 4202", certifications: ["LWG", "ISO 14001"],
  },
  {
    id: "e3", name: "Jute Tote Bags (Eco-Friendly)", category: "jute",
    minOrderValue: "$2,000", countries: ["EU", "Australia", "Japan", "Canada"],
    lead_time: "20–35 days", rating: 4.7, reviews: 256,
    company: "Sonali Jute Mills", location: "Khulna",
    verified: true,
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=300&q=80",
    description: "Eco-friendly jute bags for retail and wholesale. Custom print, size, and handle options.",
    hs_code: "HS 4602", certifications: ["OEKO-TEX", "Control Union Organic"],
  },
  {
    id: "e4", name: "Frozen Hilsa Fish (IQF)", category: "agro",
    minOrderValue: "$8,000", countries: ["UAE", "India", "UK", "USA"],
    lead_time: "14–21 days", rating: 4.9, reviews: 98,
    company: "Bay Fish Export Ltd.", location: "Chittagong",
    verified: true,
    image: "https://images.unsplash.com/photo-1567168540030-b3bb09fd4003?w=300&q=80",
    description: "Premium frozen Hilsa (Ilish) exported globally. HACCP certified cold chain logistics.",
    hs_code: "HS 0303", certifications: ["HACCP", "EU Approved"],
  },
  {
    id: "e5", name: "Generic Pharmaceutical Tablets", category: "pharma",
    minOrderValue: "$15,000", countries: ["Africa", "Southeast Asia", "Middle East"],
    lead_time: "60–90 days", rating: 4.8, reviews: 134,
    company: "Square Pharmaceuticals", location: "Pabna",
    verified: true,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80",
    description: "WHO-GMP certified generic medicines for export to 80+ countries.",
    hs_code: "HS 3004", certifications: ["WHO-GMP", "EU GMP", "ISO 9001"],
  },
  {
    id: "e6", name: "Software Development Services", category: "it",
    minOrderValue: "$1,000", countries: ["USA", "Canada", "UK", "Australia"],
    lead_time: "2–4 weeks", rating: 4.7, reviews: 445,
    company: "BASIS Member Companies", location: "Dhaka",
    verified: false,
    image: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=300&q=80",
    description: "Software development, BPO, and IT services from Bangladesh's skilled tech workforce.",
    certifications: ["BASIS Certified", "ISO 27001"],
  },
];

const STATS = [
  { icon: Globe, label: "Export Countries", value: "160+", color: "text-blue-400" },
  { icon: Factory, label: "Verified Exporters", value: "3,200+", color: "text-cyan-400" },
  { icon: TrendingUp, label: "Annual Export", value: "$55B+", color: "text-purple-400" },
  { icon: Award, label: "Sectors", value: "28 Major", color: "text-amber-400" },
];

const InquiryModal = ({ product, onClose }: { product: ExportProduct; onClose: () => void }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ company: "", country: "", email: "", quantity: "", timeline: "" });

  const handleNext = () => {
    if (step < 2) setStep(s => s + 1);
    else {
      toast.success("Trade inquiry sent! Exporter will respond in 24 hours.");
      onClose();
    }
  };

  const steps = [
    {
      title: "Your Company", fields: (
        <div className="space-y-3">
          <input placeholder="Company / Organization Name" value={formData.company} onChange={e => setFormData(f => ({ ...f, company: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40" />
          <input placeholder="Country of Import" value={formData.country} onChange={e => setFormData(f => ({ ...f, country: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40" />
        </div>
      )
    },
    {
      title: "Order Details", fields: (
        <div className="space-y-3">
          <input placeholder="Required Quantity / Value (USD)" value={formData.quantity} onChange={e => setFormData(f => ({ ...f, quantity: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40" />
          <input placeholder="Target Timeline" value={formData.timeline} onChange={e => setFormData(f => ({ ...f, timeline: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40" />
        </div>
      )
    },
    {
      title: "Contact", fields: (
        <div className="space-y-3">
          <input placeholder="Business Email" type="email" value={formData.email} onChange={e => setFormData(f => ({ ...f, email: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-[13px] text-white outline-none focus:border-blue-500/40" />
          <div className="p-3 rounded-xl bg-blue-500/8 border border-blue-500/20 text-[10px] text-blue-300">
            By submitting, you agree the exporter may contact you for business enquiries.
          </div>
        </div>
      )
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[900] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28 }} className="w-full max-w-[500px] bg-[var(--pm-bg)] border border-white/10 rounded-t-3xl sm:rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black">Trade Inquiry — Step {step + 1}/3</p>
            <h3 className="text-sm font-black text-white">{steps[step].title}</h3>
          </div>
          <button onClick={onClose}><X className="w-5 h-5 text-zinc-400" /></button>
        </div>

        <div className="flex gap-1 mb-5">
          {[0, 1, 2].map(i => (
            <div key={i} className={cn("flex-1 h-1 rounded-full transition-all", i <= step ? "bg-blue-500" : "bg-white/10")} />
          ))}
        </div>

        <div className="mb-5">{steps[step].fields}</div>

        <button onClick={handleNext} disabled={step === 2 && !formData.email} className="w-full py-3.5 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:opacity-50 text-white font-black text-[12px] uppercase tracking-wide transition-all flex items-center justify-center gap-2">
          {step < 2 ? <><span>Continue</span><ArrowRight className="w-4 h-4" /></> : <><Check className="w-4 h-4" /><span>Submit Inquiry</span></>}
        </button>
      </motion.div>
    </motion.div>
  );
};

export function ExportHome() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ExportProduct | null>(null);

  const filtered = EXPORT_PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col gap-6 pb-28 pt-0">
      <section className="mt-2"><StoryBar context="export" /></section>
      <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 px-4">
        <CategoryNavBar context="export" />
      </div>

      <div className="px-4 mt-4">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-blue-500/20 p-5 bg-gradient-to-br from-blue-900/20 via-[var(--pm-surface)]/60 to-[var(--pm-bg)] mb-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.10)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-3xl shrink-0">🌐</div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[9px] font-black text-blue-400 uppercase tracking-widest">Bangladesh Export Hub</span>
              </div>
              <h1 className="text-lg font-black text-white">Global Trade Portal</h1>
              <p className="text-[11px] text-zinc-400 mt-0.5">Connect buyers & verified Bangladeshi exporters</p>
            </div>
          </div>
          <div className="relative z-10 grid grid-cols-2 gap-2">
            {STATS.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Icon className={cn("w-4 h-4", color)} />
                </div>
                <div>
                  <p className="text-[12px] font-black text-white">{value}</p>
                  <p className="text-[9px] text-zinc-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipping modes */}
        <div className="flex gap-2 mb-4">
          {[
            { icon: Anchor, label: "Sea Freight", sub: "FCL / LCL" },
            { icon: Plane, label: "Air Cargo", sub: "Express" },
            { icon: Truck, label: "Land", sub: "India / Myanmar" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex-1 flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <Icon className="w-5 h-5 text-blue-400" />
              <p className="text-[10px] font-black text-white">{label}</p>
              <p className="text-[8px] text-zinc-500">{sub}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5 focus-within:border-blue-500/40 transition-all mb-3">
          <Search className="w-4 h-4 text-blue-400" />
          <input type="text" placeholder="Search exporters or products..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent text-[12px] text-white placeholder-zinc-600 outline-none font-semibold" />
          {searchQuery && <button onClick={() => setSearchQuery("")}><X className="w-3.5 h-3.5 text-zinc-500" /></button>}
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-4">
          {EXPORT_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] font-black transition-all",
                  isActive ? "bg-blue-500/15 border-blue-500/30 text-blue-400" : "bg-white/[0.03] border-white/[0.05] text-zinc-500"
                )}
              >
                {cat.emoji} {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards */}
        <div className="space-y-4">
          {filtered.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
            >
              <div className="flex gap-3 p-4">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-1.5 mb-1">
                    <h3 className="text-[12px] font-black text-white leading-tight flex-1">{product.name}</h3>
                    {product.verified && <BadgeCheck className="w-4 h-4 text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-[10px] text-blue-400 font-bold mb-1">{product.company}</p>
                  <div className="flex items-center gap-1 mb-2">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    <span className="text-[9px] text-zinc-500">{product.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {product.countries.slice(0, 3).map(c => (
                      <span key={c} className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[8px] text-zinc-400 font-bold">{c}</span>
                    ))}
                    {product.countries.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[8px] text-zinc-500">+{product.countries.length - 3}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 border-t border-white/[0.04] pt-3">
                <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Min Value</p>
                    <p className="text-[11px] font-black text-white">{product.minOrderValue}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">Lead Time</p>
                    <p className="text-[11px] font-black text-white">{product.lead_time}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-600 uppercase tracking-widest">HS Code</p>
                    <p className="text-[11px] font-black text-white">{product.hs_code || "—"}</p>
                  </div>
                </div>
                {product.certifications && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.certifications.map(cert => (
                      <span key={cert} className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg bg-cyan-500/8 border border-cyan-500/20 text-[8px] text-cyan-400 font-bold">
                        <Shield className="w-2 h-2" />{cert}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedProduct(product)}
                    className="flex-1 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[11px] font-black flex items-center justify-center gap-1.5 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" /> Send Trade Inquiry
                  </button>
                  <button className="px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[11px] font-black text-zinc-400 flex items-center gap-1 hover:text-white transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Inquiry Modal */}
      <AnimatePresence>
        {selectedProduct && <InquiryModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </AnimatePresence>
    </div>
  );
}
