import React, { useState } from 'react';
import { MoreVertical, Edit3, Rocket, PauseCircle, Trash2, Eye, ShoppingCart, BarChart3, Plus } from 'lucide-react';
import { SellerProduct, useSellerDashboardStore } from '@/modules/seller/sellerDashboardStore';
import { formatBDT } from '@/lib/format';
import { cn } from '@/lib/utils';
import { AddProductModal } from './AddProductModal';
import { toast } from 'sonner';

interface SellerProductGridProps {
  products: SellerProduct[];
}

export const SellerProductGrid: React.FC<SellerProductGridProps> = ({ products }) => {
  const { deleteProduct, updateProduct } = useSellerDashboardStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      toast.success("Product deleted successfully");
    }
  };

  const handleEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => setEditingProduct(null), 300); // clear after animation
  };

  const toggleBoost = (product: SellerProduct) => {
    updateProduct(product.id, { isBoosted: !product.isBoosted });
    toast.success(product.isBoosted ? "Boost removed" : "Product boosted successfully!");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Your Products</h2>
        <button 
          onClick={() => {
            setEditingProduct(null);
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)] text-black font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white/5 border border-[var(--pm-border)] rounded-2xl p-4 flex gap-4 group hover:border-[var(--pm-accent)]/30 transition-all backdrop-blur-md">
            {/* Image */}
            <div className="w-24 h-24 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] overflow-hidden shrink-0 relative">
              <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
              {product.isBoosted && (
                  <div className="absolute top-1 left-1 bg-[var(--pm-accent)] text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter flex items-center gap-0.5">
                      <Rocket className="w-2 h-2" /> BOOSTED
                  </div>
              )}
              {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest -rotate-12 border border-rose-400 px-1 py-0.5">Sold Out</span>
                  </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-white truncate leading-tight">{product.title}</h3>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="p-1.5 hover:bg-rose-500/20 rounded-lg text-zinc-400 hover:text-rose-400 cursor-pointer transition-colors"
                    title="Delete Product"
                  >
                      <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-xs font-mono font-black text-[var(--pm-accent)] mt-1">{formatBDT(product.price)}</p>

              <div className="grid grid-cols-3 gap-2 mt-3">
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> Views</span>
                    <span className="text-[10px] font-mono font-bold text-white leading-none mt-1">{product.views}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><ShoppingCart className="w-2.5 h-2.5" /> Sales</span>
                    <span className="text-[10px] font-mono font-bold text-[var(--pm-accent)] leading-none mt-1">{product.sales}</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[8px] uppercase font-bold text-zinc-500 flex items-center gap-1"><BarChart3 className="w-2.5 h-2.5" /> CR</span>
                    <span className="text-[10px] font-mono font-bold text-amber-400 leading-none mt-1">{product.conversion}%</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--pm-border)]">
                  <button 
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
                  >
                      <Edit3 className="w-3 h-3" /> Edit
                  </button>
                  <button 
                    onClick={() => toggleBoost(product)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                      product.isBoosted ? "bg-[var(--pm-accent)] text-black hover:bg-[var(--pm-accent)] shadow-[0_0_10px_var(--pm-accent)/30]" : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                  )}>
                      {product.isBoosted ? "Boosted" : "Boost"}
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={handleCloseModal} 
        product={editingProduct}
      />
    </div>
  );
};
