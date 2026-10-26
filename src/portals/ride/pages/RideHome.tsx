import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft, MapPin } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

interface RideProduct {
  id: number;
  name: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  seller_type: string;
  location: string;
}

const mockRides: RideProduct[] = [
  { id: 1, name: "CNG অটোরিকশা সার্ভিস", price: "৳ ৮০/কিমি", rating: "4.6", reviews: "234", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", seller_type: "ride_provider", location: "Dhaka" },
  { id: 2, name: "মোটরসাইকেল রাইড", price: "৳ ৫০/কিমি", rating: "4.8", reviews: "456", image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop", seller_type: "ride_provider", location: "Chittagong" },
  { id: 3, name: "প্রাইভেট কার ভাড়া", price: "৳ ৫০০/ঘণ্টা", rating: "4.7", reviews: "123", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop", seller_type: "ride_provider", location: "Sylhet" },
  { id: 4, name: "মাইক্রোবাস ভাড়া", price: "৳ ২,০০০/দিন", rating: "4.5", reviews: "89", image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=400&fit=crop", seller_type: "ride_provider", location: "Rajshahi" },
];

export default function RideHome() {
  const [search, setSearch] = useState("");
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const filtered = mockRides.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-4">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg text-[var(--pm-text)]">🚗 Ride Share</h1>
          <p className="text-[11px] text-[var(--pm-text-muted)]">Book rides · Safe · Affordable</p>
        </div>
      </div>

      {/* Book a ride card */}
      <div className="px-3 mb-4">
        <div className="rounded-2xl p-4 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)", backdropFilter: "blur(14px)" }}>
          <p className="text-sm font-bold mb-3 text-[var(--pm-text)]">রাইড বুক করুন</p>
          <div className="space-y-2">
            {[
              { placeholder: "পিকআপ লোকেশন", value: pickup, setter: setPickup, color: "var(--pm-accent)" },
              { placeholder: "গন্তব্য", value: destination, setter: setDestination, color: "#22c55e" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-xl px-3 py-2.5 border"
                style={{ background: "var(--pm-border)", borderColor: "var(--pm-border)" }}>
                <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: item.color }} />
                <input type="text" placeholder={item.placeholder} value={item.value}
                  onChange={e => item.setter(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 rounded-xl text-white text-sm font-bold active:scale-95 transition-all"
            style={{ background: "var(--pm-accent)" }}>
            রাইড খুঁজুন 🚗
          </button>
        </div>
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
          <input type="text" placeholder="রাইড প্রোভাইডার খুঁজুন..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🚗</p>
          <p className="text-sm text-[var(--pm-text-muted)]">কোনো রাইড পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="px-3 grid grid-cols-2 gap-3">
          {filtered.map(p => <ProductCard key={p.id} product={p} className="w-full" />)}
        </div>
      )}
    </div>
  );
}
