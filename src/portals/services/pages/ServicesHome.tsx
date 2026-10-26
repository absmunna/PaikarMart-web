import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

const TAGS = ["সব", "Plumbing", "Electric", "Cleaning", "AC Repair", "Painting", "IT Support", "Tutoring"];

interface ServiceProduct {
  id: number;
  name: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  seller_type: string;
  location: string;
  tags?: string[];
}

const mockProducts: ServiceProduct[] = [
  { id: 1, name: "AC সার্ভিসিং ও মেরামত", price: "৳ ৮০০", rating: "4.8", reviews: "145", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=400&fit=crop", seller_type: "service_provider", location: "Dhaka", tags: ["AC Repair"] },
  { id: 2, name: "ইলেকট্রিক্যাল ওয়ার্ক", price: "৳ ৫০০", rating: "4.6", reviews: "89", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", seller_type: "service_provider", location: "Chittagong", tags: ["Electric"] },
  { id: 3, name: "হোম ক্লিনিং সার্ভিস", price: "৳ ১,২০০", rating: "4.9", reviews: "234", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop", seller_type: "service_provider", location: "Sylhet", tags: ["Cleaning"] },
  { id: 4, name: "প্লাম্বিং সার্ভিস", price: "৳ ৪০০", rating: "4.5", reviews: "67", image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop", seller_type: "service_provider", location: "Rajshahi", tags: ["Plumbing"] },
];

export default function ServicesHome() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("সব");
  const navigate = useNavigate();

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "সব" || p.tags?.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-4">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg text-[var(--pm-text)]">🔧 Services</h1>
          <p className="text-[11px] text-[var(--pm-text-muted)]">Book trusted service providers</p>
        </div>
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
          <input type="text" placeholder="সার্ভিস খুঁজুন..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 pb-3 hide-scrollbar">
        {TAGS.map(t => (
          <button key={t} onClick={() => setActiveTag(t)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={activeTag === t
              ? { background: "var(--pm-accent)", color: "#fff", borderColor: "var(--pm-accent)" }
              : { background: "var(--pm-surface)", color: "var(--pm-text-muted)", borderColor: "var(--pm-border)" }
            }>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🔧</p>
          <p className="text-sm text-[var(--pm-text-muted)]">কোনো সার্ভিস পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="px-3 grid grid-cols-2 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} className="w-full" />)}
        </div>
      )}
    </div>
  );
}
