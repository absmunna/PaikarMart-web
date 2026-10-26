import React, { useState } from "react";
import { Search, ArrowLeft, TrendingUp, Package, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../modules/products/productStore";
import { useCartStore } from "../../../modules/cart/cartStore";
import { useCartDrawerStore } from "../../../modules/cart/cartDrawerStore";

// B2B-specific interface extending Product
interface B2BProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  image: string;
  coinCashback: number;
  tag: string;
  portal: "wholesale";
  moq?: number; // Minimum Order Quantity
}

// B2B-specific mock products (in addition to store products)
const b2bProducts: B2BProduct[] = [
  {
    id: "b2b-01",
    name: "Bulk Cotton T-Shirts (100 pcs)",
    price: 15000,
    originalPrice: 20000,
    rating: 4.5,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop",
    coinCashback: 150,
    tag: "Wholesale",
    portal: "wholesale",
    moq: 100, // Minimum Order Quantity
  },
  {
    id: "b2b-02",
    name: "Wholesale Electronics Lot",
    price: 50000,
    originalPrice: 65000,
    rating: 4.3,
    reviews: 45,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    coinCashback: 500,
    tag: "Bulk Deal",
    portal: "wholesale" as const,
    moq: 50,
  },
  {
    id: "b2b-03",
    name: "Factory Direct Shoes (50 pairs)",
    price: 25000,
    originalPrice: 32000,
    rating: 4.6,
    reviews: 112,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    coinCashback: 250,
    tag: "Factory Price",
    portal: "wholesale" as const,
    moq: 50,
  },
  {
    id: "b2b-04",
    name: "Wholesale Household Items Set",
    price: 8000,
    originalPrice: 11000,
    rating: 4.1,
    reviews: 67,
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
    coinCashback: 80,
    tag: "Combo Pack",
    portal: "wholesale" as const,
    moq: 20,
  },
];

export const B2BHome = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const storeProductsRaw = useProductStore((state) => state.products || []);

  // Memoize the product list to avoid infinite re-renders
  const storeProducts = React.useMemo(
    () => storeProductsRaw.filter((p) => p.portal === "wholesale"),
    [storeProductsRaw],
  );

  const allProducts = React.useMemo(
    () => [...storeProducts, ...b2bProducts],
    [storeProducts],
  );

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      portal: "wholesale",
      coinCashback: product.coinCashback,
    });
    openCart();
  };

  return (
    <div className="pt-2 pb-4 px-3">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <motion.button
          onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border transition-all active:scale-95 glass"
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: "var(--pm-text)" }} />
        </motion.button>
        <div>
          <h1
            className="font-black text-lg leading-tight"
            style={{ color: "var(--pm-text)" }}
          >
            🏭 পাইকারি B2B
          </h1>
          <p className="text-[11px]" style={{ color: "var(--pm-text-muted)" }}>
            বাল্ক ক্রয় · ট্রেড ডিল · ফ্যাক্টরি ডিরেক্ট
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          {
            label: "মোট পণ্য",
            value: allProducts.length,
            icon: Package,
            color: "var(--pm-accent)",
          },
          {
            label: "গড় MOQ",
            value: "৫০ পিস",
            icon: TrendingUp,
            color: "#22c55e",
          },
          { label: "ভেরিফায়েড", value: "৮০%", icon: Users, color: "#3b82f6" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-2xl p-2.5 border glass text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <stat.icon
              className="w-4 h-4 mx-auto mb-1"
              style={{ color: stat.color }}
            />
            <p className="font-black text-sm" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p
              className="text-[9px] mt-0.5"
              style={{ color: "var(--pm-text-muted)" }}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="flex items-center gap-2 rounded-2xl px-3.5 py-2.5 border glass">
          <Search
            className="w-4 h-4 flex-shrink-0"
            style={{ color: "var(--pm-text-muted)" }}
          />
          <input
            type="text"
            placeholder="পাইকারি পণ্য খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: "var(--pm-text)" }}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-2">🏭</p>
          <p className="text-sm" style={{ color: "var(--pm-text-muted)" }}>
            কোন পণ্য পাওয়া যায়নি
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              className="glass rounded-3xl border border-[var(--pm-border)]/30 overflow-hidden flex flex-col shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              {/* Product Image */}
              <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/10">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-blue-900/80 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-1 rounded-full border border-blue-500/20">
                  {product.tag}
                </span>
                {"moq" in product && (product as B2BProduct).moq && (
                  <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[8px] font-bold px-2 py-0.5 rounded-full">
                    MOQ: {(product as B2BProduct).moq}
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col gap-2">
                <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-2 leading-tight">
                  {product.name}
                </h4>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  <svg
                    className="w-3 h-3 fill-amber-400 stroke-amber-400"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="text-[10px] font-bold text-[var(--pm-text)]">
                    {product.rating}
                  </span>
                  <span className="text-[8px] text-[var(--pm-text-muted)]">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-black text-[var(--pm-accent)]">
                      ৳ {product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-[var(--pm-text-muted)] line-through">
                      ৳ {product.originalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-[var(--pm-accent)] text-white py-2 rounded-xl text-[10px] font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 hover:opacity-90"
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  কার্টে যোগ করুন
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
