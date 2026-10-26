import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Eye, 
  Package,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useAuth } from "../../../context/AuthContext";

interface Product {
  id: string;
  content: string;
  price: string;
  category: string;
  image?: string;
  createdAt: any;
}

export default function Inventory() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchInventory() {
      if (!user) return;
      try {
        const q = query(
          collection(db, "posts"), 
          where("sellerId", "==", user.id)
        );
        const querySnapshot = await getDocs(q);
        const items = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInventory();
  }, [user]);

  const filteredProducts = products.filter(p => 
    p.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-transparent pb-24">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">ইনভেন্টরি ম্যানেজমেন্ট</h1>
          <p className="text-gray-400 text-sm">আপনার সব প্রোডাক্ট এবং স্টকের তালিকা এখানে ম্যানেজ করুন</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white px-6 py-3.5 rounded-[1.25rem] font-bold transition-all shadow-xl shadow-[#FF7A00]/25 shrink-0">
          <Plus className="h-5 w-5" />
          নতুন প্রোডাক্ট যোগ করুন
        </button>
      </div>

      {/* Filters & Search - Premium Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="প্রোডাক্টের নাম দিয়ে খুঁজুন..."
            className="w-full bg-[#1e2136] border border-white/5 rounded-[1.25rem] pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-[#FF7A00]/50 focus:ring-4 focus:ring-[#FF7A00]/5 transition-all shadow-lg"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#1e2136] border border-white/5 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-gray-400 hover:text-white transition-all shadow-lg hover:border-white/10">
            <Filter className="h-4 w-4" />
            ফিল্টার
          </button>
          <button className="flex items-center gap-2 bg-[#1e2136] border border-white/5 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-gray-400 hover:text-white transition-all shadow-lg hover:border-white/10">
            <ArrowUpDown className="h-4 w-4" />
            সর্টিং
          </button>
        </div>
      </div>

      {/* Inventory Table Container */}
      <div className="bg-[#1e2136] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">প্রোডাক্ট ডিটেইলস</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">ক্যাটাগরি</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">প্রাইস (৳)</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">ম্যানেজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-white/5"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-48 bg-white/5 rounded"></div>
                          <div className="h-3 w-24 bg-white/5 rounded"></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-[#0f111a] border border-white/5 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                          {product.image ? (
                            <img src={product.image} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <Package className="h-7 w-7 text-gray-700" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[15px] font-bold text-white group-hover:text-[#FF7A00] transition-colors truncate max-w-[240px]">{product.content}</span>
                          <span className="text-[10px] text-gray-500 font-mono mt-0.5">#{product.id.substring(0, 8).toUpperCase()}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[11px] font-bold uppercase tracking-wider border border-blue-500/20">
                        {product.category || "খুচরা"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-base font-bold text-white tracking-tight">৳ {product.price || "০.০০"}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]"></div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">স্টক আছে</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="দেখুন">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-[#FF7A00] hover:bg-white/5 rounded-xl transition-all" title="এডিট">
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-rose-400 hover:bg-white/5 rounded-xl transition-all" title="ডিলিট">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center">
                        <Package className="h-10 w-10 text-gray-600" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className="text-lg font-bold text-white">কোনো প্রোডাক্ট পাওয়া যায়নি</p>
                        <p className="text-sm text-gray-500">আপনার শপে নতুন প্রোডাক্ট যোগ করতে উপরের বাটনে ক্লিক করুন</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
