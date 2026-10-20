import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Factory, ShoppingBag, Search, Filter, 
  ArrowUpDown, Package, FileText, CheckCircle2,
  ChevronRight, Star, Plus, ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { useCartStore } from '@/modules/cart';
import { toast } from 'sonner';
import { PortalProduct } from '../types';

const MOCK_WHOLESALE_PRODUCTS: PortalProduct[] = [
  {
    id: 'w1',
    title: 'Cotton Polo Shirts (Pack of 50)',
    titleBn: 'কটন পোলো শার্ট (৫০ পিসের প্যাক)',
    price: 7500,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80',
    portalType: 'WHOLESALE',
    category: 'Fashion',
    rating: 4.8,
    reviews: 124,
    stock: 500,
    moq: 10,
    tieredPricing: [
      { minUnits: 10, unitPrice: 7500 },
      { minUnits: 50, unitPrice: 6800 },
      { minUnits: 100, unitPrice: 5900 }
    ]
  },
  {
    id: 'w2',
    title: 'Wireless Earbuds Bulk (20 Units)',
    titleBn: 'ওয়্যারলেস ইয়ারবাডস বাল্ক (২০ ইউনিট)',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80',
    portalType: 'WHOLESALE',
    category: 'Electronics',
    rating: 4.9,
    reviews: 89,
    stock: 200,
    moq: 5,
    tieredPricing: [
      { minUnits: 5, unitPrice: 18000 },
      { minUnits: 20, unitPrice: 16500 },
      { minUnits: 50, unitPrice: 14500 }
    ]
  }
];

export const WholesalePortal: React.FC = () => {
  const { addItem } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddToCart = (product: PortalProduct) => {
    addItem({
      id: product.id,
      sourceId: product.id,
      name: product.title,
      price: product.price,
      quantity: product.moq || 1,
      image: product.imageUrl,
      domain: 'wholesale',
      metadata: { portal: 'WHOLESALE', moq: product.moq }
    });
    toast.success(`${product.title} added to cart with MOQ ${product.moq}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0c101c] border border-white/5 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Factory className="w-10 h-10 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Market / Paikar</h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">B2B Bulk Wholesale & Factory Direct</p>
            </div>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest px-8 rounded-2xl h-14 shadow-lg shadow-indigo-600/20 transition-all active:scale-95">
            <FileText className="w-4 h-4 mr-2" /> Request RFQ
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <Input 
            placeholder="Search wholesale products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl text-sm font-bold"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-14 rounded-2xl border-white/10 px-6 font-black uppercase text-[10px] tracking-widest">
            <Filter className="w-4 h-4 mr-2" /> Categories
          </Button>
          <Button variant="outline" className="h-14 rounded-2xl border-white/10 px-6 font-black uppercase text-[10px] tracking-widest">
            <ArrowUpDown className="w-4 h-4 mr-2" /> Sort By
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_WHOLESALE_PRODUCTS.map((product) => (
          <Card key={product.id} className="bg-[#111625] border-white/5 overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-xl rounded-[2rem]">
            <div className="aspect-square relative overflow-hidden">
              <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge className="bg-indigo-600 text-white font-black text-[9px] uppercase tracking-widest border-none px-3 py-1">
                  MOQ: {product.moq} UNITS
                </Badge>
                {product.tieredPricing && (
                  <Badge className="bg-emerald-600 text-white font-black text-[9px] uppercase tracking-widest border-none px-3 py-1">
                    Volume Discount
                  </Badge>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                 <Button 
                   onClick={() => handleAddToCart(product)}
                   className="w-full bg-white text-black font-black text-xs uppercase tracking-widest h-12 rounded-xl"
                 >
                   Bulk Add to Cart
                 </Button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-black text-white leading-tight uppercase group-hover:text-indigo-400 transition-colors">{product.title}</h3>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-xs font-black">{product.rating}</span>
                </div>
              </div>

              {/* Tiered Pricing Table */}
              <div className="bg-white/5 rounded-2xl p-4 space-y-2 border border-white/5">
                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">Bulk Pricing Tiers</p>
                {product.tieredPricing?.map((tier, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-zinc-400">{tier.minUnits}+ Units</span>
                    <span className="text-white">৳{tier.unitPrice.toLocaleString()} / unit</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div>
                  <p className="text-2xl font-black text-white tracking-tighter">৳{product.price.toLocaleString()}</p>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase mt-1">Starting Price</p>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl bg-white/5 text-zinc-400">
                      <Plus className="w-5 h-5" />
                   </Button>
                   <Button 
                    onClick={() => toast.info("Opening RFQ Form")}
                    className="h-10 px-4 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-indigo-500/20"
                   >
                     RFQ
                   </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
