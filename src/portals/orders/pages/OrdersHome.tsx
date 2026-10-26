import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag, Clock, Truck, CheckCircle2, XCircle,
  Package, ChevronDown, ChevronUp, RefreshCw, ChevronRight,
  ArrowLeft, RotateCcw, ShieldCheck, CreditCard, Search, MapPin
} from "lucide-react";
import { format } from "date-fns";
import { useLanguage } from "@/features/language/LanguageContext";
import { motion, AnimatePresence } from "motion/react";
import { useOrderTrackingStore, Order as StoreOrder, OrderState } from "@/modules/orders/orderTrackingStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TabType = "all" | "pending" | "processing" | "shipping" | "delivered" | "cancelled" | "refund";

const TAB_CONFIG: Record<TabType, { label: string; bn: string; color: string; bg: string }> = {
  all:        { label: "All Orders",       bn: "সব অর্ডার",        color: "text-zinc-300",    bg: "bg-zinc-800/20" },
  pending:    { label: "Pending",          bn: "অপেক্ষারত",        color: "text-amber-400",   bg: "bg-amber-500/10" },
  processing: { label: "Processing",       bn: "প্রক্রিয়ারত",       color: "text-blue-400",    bg: "bg-blue-500/10" },
  shipping:   { label: "In Transit",       bn: "শিপিং হচ্ছে",       color: "text-purple-400",  bg: "bg-purple-500/10" },
  delivered:  { label: "Delivered",        bn: "পৌঁছে গেছে",       color: "text-emerald-400", bg: "bg-emerald-500/10" },
  cancelled:  { label: "Cancelled",        bn: "বাতিলকৃত",        color: "text-rose-400",    bg: "bg-rose-500/10" },
  refund:     { label: "Refund / Escrow",  bn: "রিফান্ড ও এসক্রো",   color: "text-cyan-400",    bg: "bg-cyan-500/10" },
};

// Map store statuses to categories
const getOrderTabCategory = (status: string, escrowStatus?: any): TabType => {
  const s = status.toUpperCase();
  if (s === 'ORDER_CREATED' || s === 'PENDING') return 'pending';
  if (s === 'PAYMENT_CONFIRMED' || s === 'PACKING' || s === 'READY_FOR_PICKUP' || s === 'PROCESSING') return 'processing';
  if (s === 'PICKED_UP' || s === 'IN_TRANSIT' || s === 'OUT_FOR_DELIVERY' || s === 'SHIPPED') return 'shipping';
  if (s === 'DELIVERED' || s === 'COMPLETED') return 'delivered';
  if (s === 'CANCELLED') return 'cancelled';
  if (escrowStatus?.refundEligible) return 'refund';
  return 'all';
};

async function fetchOrders(): Promise<any[]> {
  const res = await fetch("/api/v1/orders");
  if (!res.ok) throw new Error("Failed to load orders");
  return res.json();
}

export default function OrdersHome() {
  const { isBn } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  // Store and API orders query
  const { data: apiOrders = [], isLoading, refetch, isFetching } = useQuery({
    queryKey: ["buyer-orders"],
    queryFn: fetchOrders,
    refetchInterval: 8000,
    staleTime: 0,
  });

  const { orders: storeOrders } = useOrderTrackingStore();

  // Combine both sources seamlessly
  const orders = useMemo(() => {
    const combined: StoreOrder[] = [...storeOrders];
    
    // Merge API orders ensuring no duplication
    apiOrders.forEach(apiOrd => {
      const exists = combined.some(o => o.id === apiOrd.id || o.orderNo === apiOrd.orderNo);
      if (!exists) {
        combined.push({
          id: apiOrd.id,
          orderNo: apiOrd.orderNo,
          total: apiOrd.total,
          status: apiOrd.status.toUpperCase() as OrderState,
          createdAt: apiOrd.createdAt,
          updatedAt: apiOrd.createdAt,
          address: apiOrd.deliveryAddress || "Consignee Warehouse Hub",
          deliveryMethod: apiOrd.breakdown?.shippingLabel || "Standard Courier",
          paymentMethod: apiOrd.paymentMethod || "COD",
          items: (apiOrd.items || []).map((item: any) => ({
            id: item.id || Math.random().toString(),
            productTitle: item.productTitle || item.name || "Sourced Merchandise",
            productImage: item.productImage || item.image || "https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=200&q=80",
            vendorName: item.vendorName || "Verified Supplier",
            unitPrice: item.unitPrice || item.price || 0,
            quantity: item.quantity || 1,
            lineTotal: item.lineTotal || ((item.unitPrice || item.price || 0) * (item.quantity || 1))
          })),
          activities: apiOrd.statusHistory ? apiOrd.statusHistory.map((h: any) => ({
            status: h.status.toUpperCase() as OrderState,
            timestamp: h.at,
            source: 'system',
            description: h.note || `Status changed to ${h.status}`
          })) : [],
          escrowStatus: {
            lockedAmount: apiOrd.total,
            releaseCondition: apiOrd.deliveryPolicy || 'Delivery verification',
            isReleased: apiOrd.status === 'delivered',
            refundEligible: ['pending', 'processing'].includes(apiOrd.status)
          }
        });
      }
    });

    // Filter by tab
    let filtered = combined;
    if (activeTab !== "all") {
      filtered = combined.filter(o => {
        if (activeTab === 'refund') {
          return o.escrowStatus?.refundEligible || (o.status as string) === 'CANCELLED';
        }
        return getOrderTabCategory(o.status, o.escrowStatus) === activeTab;
      });
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        (o.orderNo || "").toLowerCase().includes(q) || 
        (o.id || "").toLowerCase().includes(q) ||
        o.items.some(item => (item.productTitle || "").toLowerCase().includes(q))
      );
    }

    // Sort by date desc
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [apiOrders, storeOrders, activeTab, searchQuery]);

  const toggle = (id: string) => {
    setExpanded((s) => { 
      const n = new Set(s); 
      n.has(id) ? n.delete(id) : n.add(id); 
      return n; 
    });
  };

  const handleReleaseEscrow = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    useOrderTrackingStore.getState().updateOrder(orderId, {
      status: 'COMPLETED',
      escrowStatus: {
        lockedAmount: 0,
        releaseCondition: 'Successfully closed and authorized',
        isReleased: true,
        refundEligible: false
      }
    });
    // Add success activity
    const existing = storeOrders.find(o => o.id === orderId);
    if (existing) {
      const updatedActs = [
        ...existing.activities,
        {
          status: 'COMPLETED' as OrderState,
          timestamp: new Date().toISOString(),
          source: 'system' as const,
          description: 'Buyer verified matching lots and authorized escrow release.'
        }
      ];
      useOrderTrackingStore.getState().updateOrder(orderId, { activities: updatedActs });
    }
    toast.success(isBn ? "এসক্রো পেমেন্ট সফলভাবে রিলিজ করা হয়েছে!" : "Escrow payout successfully authorized to the seller!");
  };

  return (
    <div className="min-h-screen bg-[#020604] pb-32 text-white">
      {/* Search Header */}
      <div className="sticky top-0 z-50 bg-[#020604]/90 backdrop-blur-md px-4 py-4 border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-wider">
                {isBn ? "আমার অর্ডার ও ট্র্যাকিং" : "Sourcing Operations Hub"}
              </h1>
              <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-0.5">
                {orders.length} {isBn ? "টি অর্ডার পাওয়া গেছে" : "Active Ledger Streams"}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className={`p-2.5 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer ${isFetching ? "animate-spin" : ""}`}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Search Box */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder={isBn ? "অর্ডার আইডি বা পণ্যের নাম খুঁজুন..." : "Search Order ID, merchandise or items..."}
            className="w-full bg-zinc-950 border border-white/5 rounded-2xl py-2.5 pl-10 pr-4 text-[10px] font-black uppercase tracking-wider text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Staggered Horizontal Scroll Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar py-1">
          {(Object.keys(TAB_CONFIG) as TabType[]).map((tab) => {
            const isActive = activeTab === tab;
            const config = TAB_CONFIG[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 border",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400 shadow-md"
                    : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300"
                )}
                style={{ minHeight: '38px' }}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-400 animate-pulse" : "bg-zinc-700")} />
                <span>{isBn ? config.bn : config.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main List Area */}
      <div className="max-w-[640px] mx-auto px-4 mt-6 space-y-4">
        {isLoading && orders.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-zinc-900/30 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center select-none">
            <div className="w-20 h-20 rounded-[2.5rem] bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl">
              <ShoppingBag className="w-10 h-10 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                {isBn ? "কোনো অর্ডার পাওয়া যায়নি" : "No Ledger Entries"}
              </h2>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest max-w-[280px] mx-auto mt-1.5 leading-relaxed">
                {isBn ? "আপনার নির্বাচিত ফিল্টারে কোনো সক্রিয় ট্র্যাকিং বা অর্ডার পাওয়া যায়নি।" : "Your filters are dry. Head to the marketplace to launch secure sourcing operations."}
              </p>
            </div>
            <Link to="/marketplace">
              <Button className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-black rounded-xl px-6 h-11 font-black uppercase text-[9px] tracking-widest shadow-xl">
                {isBn ? "কেনাকাটা শুরু করুন" : "Access Marketplace"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const tabCat = getOrderTabCategory(order.status, order.escrowStatus);
              const config = TAB_CONFIG[tabCat] || TAB_CONFIG.all;
              const isOpen = expanded.has(order.id);
              
              return (
                <div 
                  key={order.id} 
                  className={cn(
                    "bg-zinc-950 rounded-[2rem] border border-white/5 overflow-hidden transition-all duration-300 hover:border-emerald-500/20",
                    isOpen ? "shadow-[0_15px_40px_rgba(2,6,4,0.6)]" : ""
                  )}
                >
                  {/* Basic Card Overview */}
                  <div className="p-5 flex items-start gap-4">
                    <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-100 font-black text-xs sm:text-sm tracking-tight">{order.orderNo || order.id}</span>
                          <span className={cn(
                            "text-[8px] font-black px-2 py-0.5 rounded-lg uppercase tracking-wider border",
                            config.color,
                            config.bg,
                            "border-white/5"
                          )}>
                            {isBn ? config.bn : order.status.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-[9px] text-zinc-500 font-bold">
                          {format(new Date(order.createdAt), "d MMM, h:mm a")}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mt-3.5 pt-2 border-t border-white/[0.03]">
                        <span className="text-sm font-black text-emerald-400">{formatBDT(order.total)}</span>
                        
                        <div className="flex items-center gap-2">
                          {/* Live Track Action link */}
                          <Link 
                            to={`/orders/track/${order.id}`}
                            className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all"
                          >
                            {isBn ? "ট্র্যাক করুন" : "Live Track"}
                          </Link>

                          <button 
                            onClick={() => toggle(order.id)} 
                            className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                          >
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail drop-down view */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: 'auto', opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.04] bg-black/40"
                      >
                        <div className="p-5 space-y-4">
                          {/* Sourced Items list */}
                          <div className="space-y-2.5">
                            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">Ordered Consignments</span>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-zinc-900/30 p-3 rounded-2xl border border-white/5">
                                <img src={item.productImage} className="w-11 h-11 rounded-xl object-cover shrink-0 bg-zinc-800 border border-white/5" alt="" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-[11px] font-black text-zinc-100 truncate">{item.productTitle}</p>
                                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mt-0.5">
                                    Supplier: {item.vendorName} | Qty: {item.quantity}
                                  </p>
                                </div>
                                <span className="text-[11px] font-mono font-black text-zinc-200">{formatBDT(item.lineTotal)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Address, Payment, Delivery meta info */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-white/5">
                              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1 mb-1.5">
                                <MapPin className="w-3.5 h-3.5 text-zinc-500" /> Sourcing Destination
                              </span>
                              <p className="text-[10px] font-black text-zinc-200 leading-normal">{order.address}</p>
                            </div>

                            <div className="p-4 bg-zinc-900/40 rounded-2xl border border-white/5 space-y-2.5">
                              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                                <span>SHIPPING FREIGHT</span>
                                <span className="text-zinc-200 font-black uppercase">{order.deliveryMethod}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
                                <span>PAYMENT GATEWAY</span>
                                <span className="text-zinc-200 font-black uppercase">{order.paymentMethod}</span>
                              </div>
                              
                              {/* Escrow Status block and release actions */}
                              {order.escrowStatus && (
                                <div className="pt-2 border-t border-white/[0.04] flex justify-between items-center text-[10px]">
                                  <span className="text-cyan-400 font-black uppercase flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Escrow Locked
                                  </span>
                                  <span className="font-mono text-zinc-100 font-black">{formatBDT(order.escrowStatus.lockedAmount || order.total)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Order actions: Escrow Authorization Release or Reorder */}
                          <div className="pt-2 border-t border-white/[0.03] flex gap-3">
                            {order.status !== 'COMPLETED' && order.status !== 'DELIVERED' && (
                              <button 
                                onClick={(e) => handleReleaseEscrow(order.id, e)}
                                className="flex-1 h-11 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.25)] flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                                {isBn ? "এসক্রো রিলিজ করুন" : "Release Escrow Payout"}
                              </button>
                            )}

                            <button 
                              onClick={() => {
                                toast.success(isBn ? "প্রোডাক্ট আপনার কার্টে পুনরায় যুক্ত করা হচ্ছে..." : "Restoring sourcing lot items back to active shopping basket...");
                                navigate('/marketplace');
                              }}
                              className="px-4 h-11 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-white/5 hover:border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              {isBn ? "আবার কিনুন" : "Reorder Lot"}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
