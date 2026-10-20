import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Store, ShoppingBag, Plus, Settings, BarChart3, Package, Users, ExternalLink, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useSeller } from '@/modules/seller';

export function PersonalStoreTab({ onNavigateTab }: { onNavigateTab?: (tab: string) => void }) {
  const navigate = useNavigate();
  const { products, orders } = useSeller();

  const totalSales = useMemo(() => {
    return orders.reduce((sum, order) => sum + (order.total || 0), 0);
  }, [orders]);

  const storeStats = [
    { label: 'Total Products', value: String(products.length), icon: Package, color: 'text-blue-400' },
    { label: 'Total Sales', value: `৳${totalSales.toLocaleString()}`, icon: BarChart3, color: 'text-cyan-400' },
    { label: 'Followers', value: '১,৪২০', icon: Users, color: 'text-indigo-400' },
  ];

  const recentProductsList = useMemo(() => {
    return products.slice(0, 3).map(p => ({
      id: p.id,
      name: p.title,
      price: `৳${p.price}`,
      stock: p.stock,
      status: p.stock > 0 ? 'Active' : 'Out of Stock'
    }));
  }, [products]);

  return (
    <div className="space-y-8 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Store className="w-6 h-6 text-amber-400" />
            My Store Management / আমার স্টোর ম্যানেজমেন্ট
          </h2>
          <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-wider">
            Manage your products, view analytics and configure your business profile.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              if (onNavigateTab) {
                onNavigateTab('storefront');
              } else {
                toast.info('Switching to Storefront Preview...');
              }
            }}
            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-cyan-400 transition-all flex items-center gap-2"
          >
            <Eye className="w-3.5 h-3.5" />
            View Storefront
          </button>
          <button 
            onClick={() => navigate('/seller')}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Seller Central
          </button>
          <button 
            onClick={() => toast.info('Opening product creator...')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {storeStats.map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider block">{stat.label}</span>
              <span className="text-xl font-black text-white">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-cyan-400 uppercase tracking-[0.2em]">Recent Products / সাম্প্রতিক পণ্য</h3>
          <button className="text-[10px] font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-all">View All Products</button>
        </div>
        
        <div className="overflow-hidden border border-white/5 rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Product</th>
                <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Price</th>
                <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Stock</th>
                <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentProductsList.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/10" />
                      <span className="text-xs font-bold text-white uppercase truncate">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-black text-cyan-400">{p.price}</td>
                  <td className="px-4 py-4 text-xs font-bold text-zinc-300">{p.stock}</td>
                  <td className="px-4 py-4">
                    <span className={`text-[9px] px-2 py-1 rounded-md font-black uppercase ${
                      p.status === 'Active' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-zinc-400 hover:text-white">
                      <Settings className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Marketing/Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 to-transparent border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <h4 className="text-sm font-black text-white uppercase tracking-tight">Boost Your Sales with Ad Credits</h4>
          <p className="text-xs text-zinc-400 font-medium max-w-md">আপনার স্টোরের দৃশ্যমানতা বাড়াতে এবং বেশি ক্রেতার কাছে পৌঁছাতে অ্যাড ক্রেডিট ব্যবহার করুন।</p>
        </div>
        <button className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all whitespace-nowrap">
          Boost Now / বুস্ট করুন
        </button>
      </div>
    </div>
  );
}
