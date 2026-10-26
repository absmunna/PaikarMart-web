import React, { useState } from "react";
import {
  Box,
  AlertTriangle,
  RefreshCcw,
  Edit2,
  Save,
  Tag,
  Package,
  Search,
  Download,
  Filter,
} from "lucide-react";
import { SellerProduct, useSellerDashboardStore } from "@/modules/seller/sellerDashboardStore";
import { formatBDT } from "@/lib/format";
import { Button, GlassCard } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface InventoryManagerProps {
  products: SellerProduct[];
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
}) => {
  const { updateProduct } = useSellerDashboardStore();
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);

  // Quick edit form state
  const [stock, setStock] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [wholesalePrice, setWholesalePrice] = useState<string>("");
  const [status, setStatus] = useState<"active" | "paused" | "out_of_stock">("active");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "paused" | "out_of_stock">("all");


  const openQuickEdit = (product: SellerProduct) => {
    setEditingProduct(product);
    setStock(product.stock.toString());
    setPrice(product.price.toString());
    setWholesalePrice(product.wholesalePrice?.toString() || "");
    setStatus(product.status);
  };

  const closeQuickEdit = () => {
    setEditingProduct(null);
  };

  const handleSave = () => {
    if (!editingProduct) return;
    
    const numStock = parseInt(stock, 10);
    const numPrice = parseFloat(price);
    const numWholesale = wholesalePrice ? parseFloat(wholesalePrice) : undefined;
    
    if (isNaN(numStock) || numStock < 0) {
      toast.error("Invalid stock value.");
      return;
    }
    if (isNaN(numPrice) || numPrice < 0) {
      toast.error("Invalid price value.");
      return;
    }

    let finalStatus = status;
    if (numStock === 0) {
      finalStatus = "out_of_stock";
    } else if (finalStatus === "out_of_stock" && numStock > 0) {
      finalStatus = "active";
    }

    updateProduct(editingProduct.id, {
      stock: numStock,
      price: numPrice,
      wholesalePrice: numWholesale,
      status: finalStatus
    });

    toast.success("Inventory updated successfully!");
    closeQuickEdit();
  };

  
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'Title', 'Retail Price', 'Wholesale Price', 'Stock', 'Status'];
    const rows = filteredProducts.map(p => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.price,
      p.wholesalePrice || '',
      p.stock,
      p.status
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Inventory exported as CSV!");
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xs uppercase tracking-wider text-[var(--pm-secondary)] font-bold flex items-center gap-2">
            <Box className="w-4 h-4 text-[var(--pm-accent)]" /> Sourcing Hub / Inventory
          </h3>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tight">
            Manage your stock, wholesale prices, and product visibility
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
             <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--pm-text-muted)] opacity-50" />
             <input 
               type="text" 
               placeholder="Search products..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-[var(--pm-card)] border border-[var(--pm-border)] rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white placeholder:text-zinc-600 focus:outline-none focus:border-[var(--pm-accent)] transition-colors"
             />
          </div>
          <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
            <SelectTrigger className="w-full sm:w-36 bg-[var(--pm-card)] border-[var(--pm-border)] text-white text-xs font-bold h-9">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-[var(--pm-border)] text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Hidden</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
          <button onClick={handleExportCSV} className="p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-zinc-500 hover:text-[var(--pm-accent)] transition-colors cursor-pointer flex items-center gap-2 px-3" title="Export CSV">
            <Download className="w-4 h-4" />
            <span className="text-xs font-bold hidden md:inline">Export CSV</span>
          </button>
          <button className="p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-zinc-500 hover:text-[var(--pm-accent)] transition-colors cursor-pointer" title="Refresh">
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      <GlassCard className="rounded-[1.5rem] overflow-hidden border-[var(--pm-border)] p-0 bg-[var(--pm-card)]">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--pm-border)] bg-white/[0.03]">
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">
                  Asset Details
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">
                  Pricing (Retail / Wholesale)
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">
                  Units
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap">
                  Status
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] whitespace-nowrap text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.length === 0 ? (<tr><td colSpan={5} className="px-6 py-12 text-center text-zinc-500 text-xs font-bold uppercase tracking-wider">No products found matching your search.</td></tr>) : filteredProducts.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-white/[0.04] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.image}
                        className="w-10 h-10 rounded-lg object-cover border border-[var(--pm-border)] shadow-xl"
                        alt={p.title}
                      />
                      <div>
                        <p className="text-xs font-bold text-white truncate max-w-[160px] tracking-tight">
                          {p.title}
                        </p>
                        <p className="text-[9px] font-black text-zinc-500 uppercase mt-0.5 tracking-widest">
                          ID: {p.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-black text-[var(--pm-accent)]">
                        {formatBDT(p.price)} <span className="text-[9px] text-zinc-500 uppercase">(Retail)</span>
                      </span>
                      {p.wholesalePrice && (
                         <span className="text-[10px] font-bold text-amber-400">
                           {formatBDT(p.wholesalePrice)} <span className="text-[8px] text-zinc-500 uppercase">(WS)</span>
                         </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                       <span className="text-sm font-black text-white">{p.stock}</span>
                       {p.stock === 0 ? (
                         <span className="flex items-center gap-1 text-[9px] font-bold text-rose-500 uppercase w-fit">
                           <AlertTriangle className="w-3 h-3" /> Critical
                         </span>
                       ) : p.stock < 20 ? (
                         <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 uppercase w-fit">
                           <AlertTriangle className="w-3 h-3" /> Low
                         </span>
                       ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     {p.status === 'active' ? (
                       <span className="text-[10px] font-black text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                         Active
                       </span>
                     ) : p.status === 'paused' ? (
                        <span className="text-[10px] font-black text-amber-400 uppercase bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                         Hidden
                       </span>
                     ) : (
                        <span className="text-[10px] font-black text-rose-400 uppercase bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
                         Out of Stock
                       </span>
                     )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => openQuickEdit(p)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Quick Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && closeQuickEdit()}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--pm-surface)]/95 border-[var(--pm-border)] text-white backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Package className="w-5 h-5 text-[var(--pm-accent)]" /> Inventory Manager
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--pm-border)]">
                <img src={editingProduct.image} alt={editingProduct.title} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                   <p className="text-sm font-bold text-white truncate max-w-[250px]">{editingProduct.title}</p>
                   <p className="text-[10px] text-zinc-500 font-medium">SKU: {editingProduct.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-zinc-500 flex items-center gap-1">
                     <Tag className="w-3 h-3" /> Retail Price (BDT)
                  </label>
                  <Input 
                    type="number" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    className="bg-[var(--pm-card)] border-[var(--pm-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-zinc-500 flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Wholesale (BDT)
                  </label>
                  <Input 
                    type="number" 
                    value={wholesalePrice} 
                    onChange={(e) => setWholesalePrice(e.target.value)}
                    placeholder="Optional"
                    className="bg-[var(--pm-card)] border-[var(--pm-border)] placeholder:text-zinc-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-zinc-500">
                    Stock Quantity
                  </label>
                  <Input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)}
                    className="bg-[var(--pm-card)] border-[var(--pm-border)]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase font-bold text-zinc-500">
                    Visibility Status
                  </label>
                  <Select value={status} onValueChange={(v: "active"|"paused"|"out_of_stock") => setStatus(v)}>
                    <SelectTrigger className="bg-[var(--pm-card)] border-[var(--pm-border)]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-[var(--pm-border)] text-white">
                      <SelectItem value="active">Active (Visible)</SelectItem>
                      <SelectItem value="paused">Hidden (Paused)</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={closeQuickEdit} className="text-white hover:bg-white/5">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)] text-black font-bold shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
