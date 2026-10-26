import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from 'date-fns';
import { 
  ChevronLeft, 
  Package, 
  Clock, 
  CheckCircle2,
  Truck,
  AlertCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/features/language/LanguageContext";
import { useOrderTrackingStore } from "@/modules/orders/orderTrackingStore";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
      return {
        icon: Clock,
        className: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        labelBn: "অপেক্ষমান",
        labelEn: "Pending"
      };
    case "processing":
      return {
        icon: Loader2,
        className: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
        labelBn: "প্রক্রিয়াধীন",
        labelEn: "Processing"
      };
    case "shipped":
      return {
        icon: Truck,
        className: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
        labelBn: "শিপড",
        labelEn: "Shipped"
      };
    case "delivered":
      return {
        icon: CheckCircle2,
        className: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
        labelBn: "ডেলিভারড",
        labelEn: "Delivered"
      };
    case "cancelled":
    case "canceled":
      return {
        icon: XCircle,
        className: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        labelBn: "বাতিল",
        labelEn: "Cancelled"
      };
    default:
      return {
        icon: AlertCircle,
        className: "bg-muted text-muted-foreground border border-border",
        labelBn: status,
        labelEn: status
      };
  }
};

export default function OrderHistoryPage() {
  const { isBn } = useLanguage();
  const { orders: storeOrders } = useOrderTrackingStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const filters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  
  // Combine store orders and API orders
  const allOrders = [...storeOrders, ...orders.filter(o => !storeOrders.find(so => so.id === o.id))].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredOrders = filter === 'all' ? allOrders : allOrders.filter(o => o.status.toLowerCase().includes(filter.toLowerCase()));

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Fetch Orders Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-28 max-w-[480px] mx-auto">
      <header className="sticky top-0 z-50 bg-[var(--pm-bg)]/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-black text-white">{isBn ? "অর্ডার ইতিহাস" : "Order History"}</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Track your past purchases</p>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {filters.map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)} 
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filter === f ? 'bg-[var(--pm-accent)] text-white border-transparent' : 'bg-white/5 text-zinc-500 border-white/5 hover:border-white/10'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center">
              <Package className="w-8 h-8 text-zinc-700" />
            </div>
            <p className="text-zinc-500 text-sm font-bold">{isBn ? "কোনো অর্ডার পাওয়া যায়নি" : "No orders found"}</p>
            <Link to="/marketplace" className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[var(--pm-accent)]/20">কেনাকাটা শুরু করুন</Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-zinc-600 text-xs font-bold uppercase tracking-widest">
            {isBn ? "এই ফিল্টারে কোনো অর্ডার নেই" : "No orders matching filter"}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;
              return (
                <div 
                  key={order.id} 
                  onClick={() => navigate(`/orders/track/${order.id}`)}
                  className="bg-white/[0.02] p-4 rounded-[24px] border border-white/5 space-y-4 hover:border-white/15 transition-all duration-300 cursor-pointer shadow-xl"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Package className="w-5 h-5 text-[var(--pm-accent)]" />
                      </div>
                      <div>
                        <span className="font-black text-[12px] text-white">#{order.orderNo || order.id.slice(-6).toUpperCase()}</span>
                        <p className="text-[10px] text-zinc-500 font-bold">
                          {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${statusConfig.className}`}>
                      <StatusIcon className="w-3 h-3" />
                      <span>{isBn ? statusConfig.labelBn : statusConfig.labelEn}</span>
                    </span>
                  </div>
                
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{order.items?.length || 0} ITEMS</p>
                    <p className="text-[14px] font-black text-[var(--pm-accent)]">৳{order.total?.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
