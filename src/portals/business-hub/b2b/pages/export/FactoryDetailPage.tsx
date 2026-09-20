import { useParams, Link } from "react-router-dom";
import {
  Factory, Globe, BadgeCheck, MapPin, Star, Users, Package,
  ArrowLeft, Shield, Truck, Calendar, Lock, CheckCircle2
} from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

// Matches data in ExportMarketplace — in production fetched from API
const FACTORY_DATA: Record<string, any> = {
  f1: {
    id: "f1", companyName: "Dhaka Textile Industries Ltd.", district: "Dhaka",
    companyAddress: "Plot 12, BSCIC Industrial Area, Gazipur", postcode: "1700",
    productCategories: ["Readymade Garments (RMG)", "Home Textiles"],
    exportCountries: ["USA", "UK", "Germany", "France", "Italy", "Canada"],
    certifications: ["ISO 9001", "OEKO-TEX", "BSCI", "WRAP", "SEDEX"],
    employees: "2,400", established: "1996", minOrderQty: "5,000 pcs/style",
    productionCapacity: "150,000 pcs/month", annualRevenue: "$12M",
    membershipBody: "BGMEA", membershipNo: "BGMEA-4821",
    verified: true, rating: 4.8, reviewCount: 34,
    description: "Dhaka Textile Industries is one of Bangladesh's leading woven & knit garment manufacturers with 30+ years of export experience. We supply directly to major retailers and brands across the USA, UK, and EU with full compliance documentation and ethical sourcing certification.\n\nOur modern facility in Gazipur BSCIC Industrial Zone is equipped with German cutting machines, Japanese sewing equipment, and a fully automated finishing line.",
    contactName: "MD. Kamal Hossain",
    website: "https://dhaka-textile-bd.com",
  },
  f2: {
    id: "f2", companyName: "Chittagong Leather Works", district: "Chittagong",
    companyAddress: "EPZ Road, Chittagong Export Processing Zone", postcode: "4200",
    productCategories: ["Leather & Leather Goods", "Footwear"],
    exportCountries: ["Italy", "Spain", "Japan", "UAE", "South Korea"],
    certifications: ["ISO 9001", "LEED", "SEDEX"],
    employees: "850", established: "2003", minOrderQty: "500 pairs",
    productionCapacity: "40,000 units/month", annualRevenue: "$4.5M",
    membershipBody: "LFMEAB", verified: true, rating: 4.6, reviewCount: 21,
    description: "Premium leather goods & footwear manufacturer specializing in EU market compliance. REACH-compliant. Tannery-to-shelf integrated supply chain with in-house QC laboratory.",
    contactName: "Farhana Begum",
    website: "https://clt-leather.com",
  },
  f3: {
    id: "f3", companyName: "Sylhet Agro Exports", district: "Sylhet",
    companyAddress: "Moulvibazar Road, Sylhet", postcode: "3100",
    productCategories: ["Agro Products", "Frozen Food / Seafood"],
    exportCountries: ["UK", "USA", "UAE", "Saudi Arabia", "Australia", "Canada"],
    certifications: ["Halal", "FDA", "ISO 14001"],
    employees: "320", established: "2009", minOrderQty: "1 FCL",
    productionCapacity: "200 MT/month", annualRevenue: "$6.2M",
    membershipBody: "FBCCI", verified: true, rating: 4.9, reviewCount: 52,
    description: "Certified Halal & FDA-approved agro exporter. We specialize in fresh & frozen hilsa, shrimp, organic rice, and spices. HACCP-certified cold chain facility.",
    contactName: "Rafiqul Islam",
    website: "",
  },
  f4: {
    id: "f4", companyName: "Rajshahi Silk & Fabrics", district: "Rajshahi",
    companyAddress: "Silk Factory Road, Rajshahi", postcode: "6000",
    productCategories: ["Textile Fabrics", "Handicrafts"],
    exportCountries: ["India", "Japan", "South Korea"],
    certifications: ["GOTS", "OEKO-TEX"],
    employees: "180", established: "2011", minOrderQty: "500 meters",
    productionCapacity: "15,000 meters/month", annualRevenue: "$800K",
    membershipBody: "BTMA", verified: false, rating: 4.4, reviewCount: 12,
    description: "Traditional Rajshahi silk & hand-loom fabrics with modern export packaging and dyeing standards.",
    contactName: "Nasrin Akhter",
    website: "",
  },
};

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/[0.05] last:border-0">
      {Icon && <Icon className="h-4 w-4 text-[var(--pm-text-muted)] mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-[var(--pm-text-muted)] mb-0.5">{label}</div>
        <div className="text-xs text-[#ffffff] font-semibold">{value || "—"}</div>
      </div>
    </div>
  );
}

export default function FactoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const f = FACTORY_DATA[id ?? ""];

  if (!f) {
    return (
      <div className="py-16 text-center text-[var(--pm-text-muted)]">
        ফ্যাক্টরি পাওয়া যায়নি। <Link to="/export" className="text-cyan-400 hover:underline">রপ্তানি বাজারে ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-5 text-[var(--pm-text)]">
      {/* Back */}
      <Link to="/export" className="flex items-center gap-2 text-xs text-[var(--pm-text-secondary)] hover:text-white transition-colors w-fit">
        <ArrowLeft className="h-4 w-4" /> Export Marketplace-এ ফিরে যান
      </Link>

      {/* Hero card */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/15 p-6 md:p-8 bg-gradient-to-br from-[rgba(13,13,26,0.92)] to-[rgba(26,26,46,0.95)] shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.08)_0%,transparent_60%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-lg">
            <Factory className="h-8 w-8 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl md:text-2xl font-black text-[#ffffff]">{f.companyName}</h1>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <div className="flex items-center gap-1 text-xs text-[var(--pm-text-secondary)] font-bold">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />{f.district}, Bangladesh
                  </div>
                  {f.membershipBody && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/5 border border-white/5 text-[var(--pm-text-muted)] font-black uppercase tracking-wide">{f.membershipBody} {f.membershipNo && `· #${f.membershipNo}`}</span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                {f.verified && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-black tracking-wide uppercase">
                    <BadgeCheck className="h-3.5 w-3.5" /> PaikarMart Verified
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-white font-black">{f.rating}</span>
                  <span className="text-[var(--pm-text-muted)]">({f.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="mt-4 text-xs text-[var(--pm-text-secondary)] leading-relaxed whitespace-pre-wrap">{f.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          {/* Stats grid */}
          <div className="glass-card p-5">
            <h2 className="text-xs font-black text-[#ffffff] uppercase tracking-widest mb-4 flex items-center gap-1.5">
               <Package className="h-3.5 w-3.5 text-cyan-400" /> Factory Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "Employees",    value: f.employees,          Icon: Users,      color: "text-cyan-400" },
                { label: "Established",  value: f.established,        Icon: Calendar,   color: "text-blue-400" },
                { label: "MOQ",          value: f.minOrderQty,        Icon: Package,    color: "text-purple-400" },
                { label: "Capacity / mo",  value: f.productionCapacity, Icon: Factory,    color: "text-cyan-400" },
                { label: "Annual Export",value: f.annualRevenue,      Icon: Globe,      color: "text-amber-400" },
                { label: "Ships to",     value: `${f.exportCountries.length} countries`, Icon: Truck, color: "text-rose-400" },
              ].map(({ label, value, Icon, color }) => (
                <div key={label} className="p-3.5 rounded-2xl border border-white/[0.04] bg-white/[0.02] flex flex-col">
                  <Icon className={cn("h-4 w-4 mb-2", color)} />
                  <div className="text-sm font-extrabold text-[#ffffff] truncate">{value}</div>
                  <div className="text-[8px] text-[var(--pm-text-muted)] uppercase tracking-wider mt-0.5 font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Certifications */}
          <div className="glass-card p-5">
            <h2 className="text-xs font-black text-[#ffffff] uppercase tracking-widest mb-4 flex items-center gap-1.5">
               <Shield className="h-3.5 w-3.5 text-cyan-400" /> Certifications & Compliance
            </h2>
            <div className="flex flex-wrap gap-2">
              {f.certifications.map((cert: string) => (
                <div key={cert} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-300 text-xs font-bold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {cert}
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-[var(--pm-text-muted)] leading-relaxed">
              * This exporter represents standard legal compliant certifications. All records have been audited and updated by PaikarMart Quality Control body.
            </p>
          </div>
        </div>

        {/* Right — Contact Card (Guarded) */}
        <div className="flex flex-col gap-4">
          <div className="glass-card p-5 bg-gradient-to-b from-white/3 to-transparent border border-white/5">
            <h2 className="text-xs font-black text-white uppercase tracking-widest mb-3">Contact Exporter</h2>

            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <div className="p-3.5 bg-cyan-950/20 border border-cyan-500/10 rounded-2xl">
                  <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-extrabold">Exporters Desk</div>
                  <div className="text-sm font-extrabold text-white mt-1">{f.contactName}</div>
                  <div className="text-xs text-[var(--pm-text-muted)] mt-0.5">Global Trade Officer</div>
                </div>

                <InfoRow label="Business Address" value={`${f.companyAddress}, Postcode: ${f.postcode}`} />
                {f.website && (
                  <InfoRow label="Official Website" value={f.website} />
                )}

                <button className="w-full mt-2 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-xs font-extrabold transition-all shadow-md cursor-pointer text-center">
                  Request Quotation / RFQ
                </button>
              </div>
            ) : (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <div className="h-10 w-10 bg-slate-950/80 rounded-full border border-white/10 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-cyan-400 animate-pulse" />
                </div>
                <h3 className="text-xs font-black text-white">Contact Info Hidden</h3>
                <p className="text-[10px] text-[var(--pm-text-muted)] px-3 leading-relaxed">
                  রপ্তানিকারকের যোগাযোগের তথ্য এবং সরাসরি কোটেশন পাঠানোর সুযোগ পেতে দয়া করে আগে লগইন করুন।
                </p>
                <Link to="/login" className="w-full">
                  <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-95 text-[#ffffff] text-xs font-black transition-all cursor-pointer">
                    Click to Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
