import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

const TYPES = ["সব", "eBook", "Course", "Template", "Software", "Music", "Art"];

interface DigitalProduct {
  id: number;
  name: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  seller_type: string;
  location: string;
  type: string;
}

const mockProducts: DigitalProduct[] = [
  { id: 1, name: "React & TypeScript কোর্স", price: "৳ ৯৯৯", rating: "4.9", reviews: "312", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Course" },
  { id: 2, name: "গ্রাফিক ডিজাইন টেমপ্লেট প্যাক", price: "৳ ২৯৯", rating: "4.7", reviews: "189", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Template" },
  { id: 3, name: "বাংলা ই-বুক সংকলন", price: "৳ ১৫০", rating: "4.5", reviews: "78", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "eBook" },
  { id: 4, name: "ওয়েব ডেভেলপমেন্ট স্টার্টার কিট", price: "৳ ৪৯৯", rating: "4.8", reviews: "145", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=400&fit=crop", seller_type: "digital_seller", location: "অনলাইন", type: "Software" },
];

export default function DigitalHome() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("সব");
  const navigate = useNavigate();

  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "সব" || p.type === activeType;
    return matchSearch && matchType;
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
          <h1 className="font-extrabold text-lg text-[var(--pm-text)]">💻 Digital Store</h1>
          <p className="text-[11px] text-[var(--pm-text-muted)]">eBooks · Courses · Software · Templates</p>
        </div>
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
          <input type="text" placeholder="ডিজিটাল পণ্য খুঁজুন..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 pb-3 hide-scrollbar">
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={activeType === t
              ? { background: "var(--pm-accent)", color: "#fff", borderColor: "var(--pm-accent)" }
              : { background: "var(--pm-surface)", color: "var(--pm-text-muted)", borderColor: "var(--pm-border)" }
            }>
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">💻</p>
          <p className="text-sm text-[var(--pm-text-muted)]">কোনো ডিজিটাল পণ্য পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="px-3 grid grid-cols-2 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} className="w-full" />)}
        </div>
      )}
    </div>
  );
}
