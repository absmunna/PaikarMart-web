import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, ArrowLeft, Navigation, X, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

const BD_CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh", "Comilla", "Narayanganj", "Gazipur", "Jessore", "Bogra", "Dinajpur", "Cumilla"];

interface NearbyProduct {
  id: number;
  name: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  seller_type: string;
  location: string;
}

const mockProducts: NearbyProduct[] = [
  { id: 1, name: "তাজা সবজি ও ফলমূল", price: "৳ ৫০০", rating: "4.8", reviews: "156", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop", seller_type: "nearby_shop", location: "Dhaka" },
  { id: 2, name: "বেকারি ও মিষ্টান্ন", price: "৳ ৩০০", rating: "4.6", reviews: "89", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop", seller_type: "nearby_shop", location: "Chittagong" },
  { id: 3, name: "ফার্মেসি ও ওষুধ", price: "৳ ১৫০", rating: "4.9", reviews: "234", image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop", seller_type: "nearby_shop", location: "Dhaka" },
  { id: 4, name: "স্টেশনারি ও বই", price: "৳ ২০০", rating: "4.4", reviews: "45", image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=400&fit=crop", seller_type: "nearby_shop", location: "Sylhet" },
];

export default function NearbyHome() {
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [detectedCity, setDetectedCity] = useState("");
  const [locating, setLocating] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || "";
          if (city) { 
            setDetectedCity(city); 
            setCityFilter(city); 
          }
        } catch (_) {}
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 6000 }
    );
  }, []);

  const activeCity = cityFilter || detectedCity;
  const filtered = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCity = !activeCity || p.location.toLowerCase().includes(activeCity.toLowerCase());
    return matchSearch && matchCity;
  });

  return (
    <div className="pt-2 pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-3">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-all"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <div>
          <h1 className="font-extrabold text-lg text-[var(--pm-text)]">📍 Nearby Shops</h1>
          <p className="text-[11px] text-[var(--pm-text-muted)]">Local stores · Pickup available</p>
        </div>
      </div>

      {/* Location bar */}
      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          {locating
            ? <Loader2 className="w-4 h-4 animate-spin text-[var(--pm-accent)]" />
            : <Navigation className="w-4 h-4 text-[var(--pm-accent)]" />
          }
          <span className="flex-1 text-sm text-[var(--pm-text)]">
            {locating ? "Detecting..." : activeCity || "Location not detected"}
          </span>
          {activeCity && (
            <button onClick={() => { setCityFilter(""); setDetectedCity(""); }}>
              <X className="w-3.5 h-3.5 text-[var(--pm-text-muted)]" />
            </button>
          )}
          <button onClick={() => setShowPicker(v => !v)}
            className="text-[11px] font-semibold px-2 py-1 rounded-full border text-[var(--pm-accent)] border-[var(--pm-accent)]">
            Change
          </button>
        </div>

        {showPicker && (
          <div className="mt-2 rounded-2xl border p-3"
            style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
            <p className="text-xs font-semibold mb-2 text-[var(--pm-text)]">শহর বেছে নিন</p>
            <div className="flex flex-wrap gap-2">
              {BD_CITIES.map(city => (
                <button key={city}
                  onClick={() => { setCityFilter(city); setDetectedCity(""); setShowPicker(false); }}
                  className="px-3 py-1 rounded-full text-xs border transition-all"
                  style={activeCity === city
                    ? { background: "var(--pm-accent)", color: "#fff", borderColor: "var(--pm-accent)" }
                    : { background: "var(--pm-surface)", color: "var(--pm-text)", borderColor: "var(--pm-border)" }
                  }>
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-3 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
          <input type="text" placeholder="দোকান বা পণ্য খুঁজুন..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-[var(--pm-text)]" />
        </div>
      </div>

      <div className="px-3 mb-2">
        <p className="text-[11px] text-[var(--pm-text-muted)]">
          {filtered.length}টি দোকান পাওয়া গেছে{activeCity ? ` "${activeCity}"-এ` : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">📍</p>
          <p className="text-sm text-[var(--pm-text-muted)]">কাছের কোনো দোকান পাওয়া যায়নি</p>
        </div>
      ) : (
        <div className="px-3 grid grid-cols-2 gap-3">
          {filtered.map(p => (
            <div key={p.id} className="flex flex-col">
              <ProductCard product={p} className="w-full" />
              {p.location && (
                <div className="flex items-center gap-1 mt-1 px-1">
                  <MapPin className="w-2.5 h-2.5 text-[var(--pm-accent)]" />
                  <span className="text-[9px] truncate text-[var(--pm-text-muted)]">{p.location}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
