import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductCard from "../../components/ProductCard";
import { QuickViewModal, QuickViewProduct } from "../../components/QuickViewModal";
import { Filter, SlidersHorizontal, Tag, Building2, ShoppingBag } from "lucide-react";

const MOCK_RETAIL = [
  { id: "r1", title: "Premium Cotton T-Shirt - Summer Collection", storeName: "Fashion Hub Bd", price: 450, originalPrice: 600, rating: 4.8, reviews: 124, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500", variants: ["S", "M", "L", "XL"], colors: ["Black", "Navy", "White"] },
  { id: "r2", title: "Wireless Noise Cancelling Headphones", storeName: "TechGadgets", price: 3200, rating: 4.5, reviews: 89, imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", colors: ["Matte Black", "Silver"] },
  { id: "r3", title: "Organic Honey 500gm", storeName: "Nature's Gift", price: 850, originalPrice: 950, rating: 4.9, reviews: 412, imageUrl: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?w=500" },
  { id: "r4", title: "Men's Classic Leather Wallet", storeName: "LeatherCraft", price: 1200, rating: 4.6, reviews: 56, imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=500", colors: ["Tan Brown", "Classic Black"] },
  { id: "r5", title: "Smartphone Tripod with Bluetooth Remote", storeName: "Camera Plus", price: 650, originalPrice: 800, rating: 4.3, reviews: 34, imageUrl: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500" },
  { id: "r6", title: "Skincare Vitamin C Serum 30ml", storeName: "Glow Beauty", price: 1100, rating: 4.7, reviews: 215, imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500" },
  { id: "r7", title: "Ergonomic Office Chair", storeName: "FurniTech", price: 6500, rating: 4.2, reviews: 18, imageUrl: "https://images.unsplash.com/photo-1580481072645-022f9a6d1290?w=500" },
  { id: "r8", title: "Fitness Resistance Bands Set", storeName: "ActiveLife", price: 950, originalPrice: 1200, rating: 4.8, reviews: 320, imageUrl: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500" },
];

const MOCK_WHOLESALE = [
  { id: "w1", title: "Plain T-Shirts Bulk (100% Cotton)", storeName: "Dhaka Garments Ltd.", price: 120, isWholesale: true, moq: 100, rating: 4.7, reviews: 85, imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500", variants: ["Assorted Sizes"] },
  { id: "w2", title: "LED Bulbs 12W B22", storeName: "Mega Electronics BD", price: 65, isWholesale: true, moq: 500, rating: 4.4, reviews: 112, imageUrl: "https://images.unsplash.com/photo-1550525811-e5869dd03032?w=500" },
  { id: "w3", title: "Jute Shopping Bags - Export Quality", storeName: "Eco Jute Mills", price: 45, isWholesale: true, moq: 1000, rating: 4.9, reviews: 67, imageUrl: "https://images.unsplash.com/photo-1597484661643-2f5f6e71e16d?w=500" },
  { id: "w4", title: "Ceramic Coffee Mugs (Blank for Printing)", storeName: "Bengal Ceramics", price: 85, isWholesale: true, moq: 200, rating: 4.6, reviews: 43, imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500" },
];

export default function Marketplace({ initialTab }: { initialTab?: "retail" | "wholesale" }) {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get("tab") as "retail" | "wholesale" | null;
  const isWholesalePath = location.pathname.includes("wholesale") || location.pathname.includes("b2b");

  const [activeTab, setActiveTab] = useState<"retail" | "wholesale">(
    initialTab || tabFromQuery || (isWholesalePath ? "wholesale" : "retail")
  );

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (tabFromQuery) {
      setActiveTab(tabFromQuery);
    } else if (isWholesalePath) {
      setActiveTab("wholesale");
    }
  }, [initialTab, tabFromQuery, isWholesalePath]);

  const [selectedProduct, setSelectedProduct] = useState<QuickViewProduct | null>(null);

  return (
    <div className="flex flex-col px-4 py-6 md:px-6 md:py-8 min-h-screen max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Discover products from verified sellers across Bangladesh.</p>
        </div>
        
        {/* Actions / Filters */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4 text-[#FF7A00]" />
            Categories
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-white/10 transition-colors">
            <SlidersHorizontal className="h-4 w-4 text-[#FF7A00]" />
            Filters
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center rounded-xl bg-gray-100 dark:bg-white/5 p-1 mb-6 w-full max-w-sm border border-gray-200/50 dark:border-white/5">
        <button
          onClick={() => setActiveTab("retail")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            activeTab === "retail" ? "bg-white dark:bg-[#121522] text-[#FF7A00] shadow-sm font-bold" : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          Retail
        </button>
        <button
          onClick={() => setActiveTab("wholesale")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
            activeTab === "wholesale" ? "bg-white dark:bg-[#121522] text-[#FF7A00] shadow-sm font-bold" : "text-gray-600 dark:text-gray-400 hover:text-gray-900"
          }`}
        >
          Wholesale (B2B)
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 md:gap-6">
        {(activeTab === "retail" ? MOCK_RETAIL : MOCK_WHOLESALE).map((product) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            onQuickView={(p) => setSelectedProduct(p)}
          />
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal 
        isOpen={!!selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        product={selectedProduct} 
      />
    </div>
  );
}
