import React, { useState, useMemo } from 'react';
import { Edit2, Box, Search, Filter, ArrowUpDown, X, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { SellerProduct } from '@/modules/seller/types';
import { useSellerContext } from '@/modules/seller/SellerContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export const InventoryManager: React.FC<{ products: SellerProduct[] }> = ({ products }) => {
  const { updateProduct } = useSellerContext();
  
  // Search, Filter, Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ stock: "", price: "", status: "active" });
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = (product: SellerProduct) => {
    setEditingId(product.id);
    setEditForm({
      stock: (product.stock ?? 0).toString(),
      price: (product.price ?? 0).toString(),
      status: product.status || "active"
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleSave = async (id: string) => {
    const numStock = parseInt(editForm.stock, 10);
    const numPrice = parseFloat(editForm.price);
    
    if (isNaN(numStock) || numStock < 0) {
      toast.error("Invalid stock value.");
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error("Invalid price value.");
      return;
    }

    setIsSaving(true);
    try {
      await updateProduct(id, {
        stock: numStock,
        price: numPrice,
        status: editForm.status as 'active' | 'paused' | 'out_of_stock'
      });
      toast.success("Inventory updated successfully!");
      setEditingId(null);
    } catch (e) {
      toast.error("Failed to update inventory.");
    } finally {
      setIsSaving(false);
    }
  };

  // Memoized Filtering & Sorting
  const processedProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }

    // Filter
    if (statusFilter !== "all") {
      result = result.filter(p => p.status === statusFilter);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return (a.price || 0) - (b.price || 0);
        case 'price_desc': return (b.price || 0) - (a.price || 0);
        case 'stock_asc': return (a.stock || 0) - (b.stock || 0);
        case 'stock_desc': return (b.stock || 0) - (a.stock || 0);
        case 'newest': 
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
    });

    return result;
  }, [products, searchQuery, statusFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header & Controls */}
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-amber-500 font-bold flex items-center gap-2">
            <Box className="w-4 h-4 text-cyan-400" /> Sourcing Hub / Inventory
          </h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">
            Manage your stock and product visibility
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
             <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-[#1e2136] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF7A00] transition-colors"
             />
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#1e2136] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF7A00] transition-colors cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#1e2136] border border-white/10 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-white outline-none focus:border-[#FF7A00] transition-colors cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="stock_asc">Stock: Low to High</option>
                <option value="stock_desc">Stock: High to Low</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <GlassCard className="rounded-[1.5rem] overflow-hidden p-0 bg-white/5">
        <div className="hidden md:block overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.03]">
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Asset</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Price</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Stock</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
                    No products match your criteria.
                  </td>
                </tr>
              ) : (
                processedProducts.map((p) => {
                  const isEditing = editingId === p.id;
                  
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.04] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={p.images?.[0] || (p as any).image || ''} className="w-10 h-10 rounded-lg object-cover bg-zinc-900" alt={p.title} />
                          <p className="text-xs font-bold text-white truncate max-w-[160px]">{p.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">৳</span>
                            <input 
                              type="number" 
                              value={editForm.price} 
                              onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                              className="w-24 bg-zinc-950 border border-white/10 rounded-lg pl-6 pr-2 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                            />
                          </div>
                        ) : (
                          <span className="text-xs font-black text-cyan-400">৳{p.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editForm.stock} 
                            onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                            className="w-20 bg-zinc-950 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                          />
                        ) : (
                          <span className="text-sm font-black text-white">{p.stock}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                         {isEditing ? (
                           <select 
                             value={editForm.status} 
                             onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                             className="bg-zinc-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-cyan-500"
                           >
                             <option value="active">Active</option>
                             <option value="paused">Paused</option>
                             <option value="out_of_stock">Out of Stock</option>
                           </select>
                         ) : (
                           <span className={cn(
                             "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider",
                             p.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500"
                           )}>
                             {p.status}
                           </span>
                         )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleSave(p.id)} 
                              disabled={isSaving}
                              className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white p-2 rounded-lg transition-all"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={cancelEdit}
                              disabled={isSaving}
                              className="bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500 hover:text-white p-2 rounded-lg transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => startEdit(p)} 
                            className="bg-white/5 hover:bg-white/10 p-2 rounded-lg transition-all cursor-pointer text-zinc-400 hover:text-white"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Mobile View */}
        <div className="md:hidden divide-y divide-white/5">
          {processedProducts.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs font-bold uppercase tracking-widest">
              No products match your criteria.
            </div>
          ) : (
            processedProducts.map((p) => {
              const isEditing = editingId === p.id;

              return (
                <div key={p.id} className="p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img src={p.images?.[0] || (p as any).image || ''} className="w-12 h-12 rounded-xl object-cover bg-zinc-900" alt={p.title} />
                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                      {!isEditing && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-cyan-400">৳{p.price}</span>
                          <span className="text-[10px] text-zinc-500 font-bold">• Stock: {p.stock}</span>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ml-auto",
                            p.status === 'active' ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-500/10 text-zinc-500"
                          )}>
                            {p.status}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => startEdit(p)}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white transition-all shrink-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="bg-zinc-900 border border-white/10 rounded-xl p-3 space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Price (৳)</label>
                          <input 
                            type="number" 
                            value={editForm.price} 
                            onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Stock</label>
                          <input 
                            type="number" 
                            value={editForm.stock} 
                            onChange={(e) => setEditForm({...editForm, stock: e.target.value})}
                            className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Status</label>
                        <select 
                           value={editForm.status} 
                           onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                           className="w-full bg-zinc-950 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-cyan-500"
                         >
                           <option value="active">Active</option>
                           <option value="paused">Paused</option>
                           <option value="out_of_stock">Out of Stock</option>
                         </select>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-white/5">
                        <button 
                          onClick={() => handleSave(p.id)} 
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px] tracking-wider py-2 rounded-lg"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button 
                          onClick={cancelEdit}
                          disabled={isSaving}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-500/20 text-zinc-400 font-bold uppercase text-[10px] tracking-wider py-2 rounded-lg"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </GlassCard>
    </div>
  );
};
