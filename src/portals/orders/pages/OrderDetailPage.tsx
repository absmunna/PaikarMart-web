import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/format";
import { 
  ArrowLeft, Truck, Clock, ShieldCheck, CheckCircle2, 
  MapPin, Phone, MessageSquare, AlertCircle, Package, 
  Settings, ShoppingBag, Landmark, Info
} from "lucide-react";
import { useLanguage } from "@/features/language/LanguageContext";
import { useOrderTrackingStore } from "@/modules/orders/orderTrackingStore";
import { LiveTrackingSheet } from "@/portals/orders/components/LiveTrackingSheet";

const formatPrice = formatBDT;

// Build beautiful 6-stage universal timeline requested by user
function buildTimeline(status: string, placedAt: string) {
  const placed = new Date(placedAt);
  const fmt = (d: Date) =>
    d.toLocaleString("en-BD", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  const stages = [
    "ORDER_CREATED",
    "CONFIRMED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "DELIVERED",
    "COMPLETED"
  ];
  
  let currentIdx = stages.indexOf(status.toUpperCase());
  if (currentIdx === -1) {
    if (status.toUpperCase() === 'PENDING') currentIdx = 0;
    else currentIdx = 2; // default processing
  }

  // 6 user specified states + completed
  const timelineSteps = [
    { label: "Order Created", desc: "Placed and verified in corporate escrow ledger", icon: Clock },
    { label: "Confirmed", desc: "Supplier accepted lot and locked escrow payout", icon: ShieldCheck },
    { label: "Processing", desc: "Material preparation and quality inspection", icon: Package },
    { label: "Packed", desc: "Consignment secure-sealed with tamper tags", icon: Info },
    { label: "Shipped", desc: "Dispatched onto PaikarForce transport route", icon: Truck },
    { label: "Delivered", desc: "Arrived at consignee warehouse hub", icon: CheckCircle2 }
  ];

  return timelineSteps.map((step, i) => {
    const isDone = i <= currentIdx;
    const isActive = i === currentIdx;
    return {
      ...step,
      done: isDone,
      active: isActive,
      date: isDone ? fmt(new Date(placed.getTime() + i * 3 * 3600000)) : "Waiting..."
    };
  });
}

export default function OrderDetailPage() {
  const { id, orderId } = useParams();
  const activeId = id || orderId;
  const { isBn } = useLanguage();
  const navigate = useNavigate();
  const [trackOpen, setTrackOpen] = useState(false);
  const { orders } = useOrderTrackingStore();
  const [order, setOrder] = useState<any | null | undefined>(undefined);

  useEffect(() => {
    if (!activeId) return;
    
    // Check local store first
    const found = orders.find(o => o.id === activeId || o.orderNo === activeId);
    if (found) {
      setOrder(found);
      return;
    }

    // Fallback to API
    fetch(`/api/v1/orders/${activeId}`)
      .then(res => res.json())
      .then(o => setOrder(o ?? null))
      .catch(() => setOrder(null));
  }, [activeId, orders]);

  if (order === undefined) {
    return (
      <div className="min-h-screen bg-[#020604] px-4 pt-6 flex flex-col gap-6 max-w-[480px] mx-auto text-white">
        <div className="h-10 w-48 bg-zinc-900 animate-pulse rounded-2xl" />
        <div className="h-32 bg-zinc-900 animate-pulse rounded-3xl" />
        <div className="h-64 bg-zinc-900 animate-pulse rounded-[2rem]" />
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="min-h-screen bg-[#020604] px-8 flex flex-col items-center justify-center text-center gap-6 max-w-[480px] mx-auto text-white">
        <div className="w-20 h-20 bg-zinc-900 rounded-[2rem] flex items-center justify-center border border-white/5">
           <AlertCircle className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h1 className="text-sm font-black text-white uppercase tracking-wider">Transmission Not Found</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 max-w-[240px] mx-auto">This order hash does not exist in our corporate ledger.</p>
        </div>
        <Button onClick={() => navigate("/orders")} className="bg-zinc-900 text-white border-white/5">Back to Orders</Button>
      </div>
    );
  }

  const timeline = buildTimeline(order.status || 'pending', order.createdAt || new Date().toISOString());
  const shortId = order.orderNo || order.id || `TXN-${activeId?.slice(0, 8).toUpperCase()}`;
  const items = order.items || [];

  // Parse total financials
  const displayTotal = order.total || 0;
  const deliveryCost = order.breakdown?.shippingFee || (order.deliveryMethod === 'express' ? 150 : order.deliveryMethod === 'self_pickup' ? 0 : 60);
  const displaySubtotal = order.breakdown?.subtotal || (displayTotal - deliveryCost);

  return (
    <div className="min-h-screen bg-[#020604] pb-40 px-4 pt-6 flex flex-col gap-6 select-none max-w-[480px] mx-auto text-white">
      {/* Header bar */}
      <div className="flex items-center justify-between sticky top-0 z-40 bg-[#020604]/90 backdrop-blur-md py-2 -mx-2 px-2 border-b border-white/[0.04]">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="h-11 w-11 flex items-center justify-center rounded-2xl bg-zinc-950 border border-white/5 hover:bg-zinc-900 active:scale-90 transition-all cursor-pointer">
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
          <div>
             <h1 className="text-sm font-black text-white uppercase tracking-widest">{isBn ? "অর্ডারের বিবরণ" : "Order Logistics"}</h1>
             <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mt-0.5">Live Ledger Stream</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
           <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
           <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Secured Escrow</span>
        </div>
      </div>

      {/* Main Hash Info */}
      <Card className="p-6 bg-zinc-950 border-white/5 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />
        <div className="flex justify-between items-start mb-6 relative z-10">
           <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1.5">Consignment Hash</p>
              <h2 className="font-black text-xl text-white tracking-tight">{shortId}</h2>
           </div>
           <span className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-cyan-400 font-black text-[9px] uppercase tracking-widest">
              {order.status?.replace('_', ' ')}
           </span>
        </div>
        <div className="flex items-center gap-3 pt-6 border-t border-white/5 relative z-10">
           <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center">
              <Clock className="w-5 h-5 text-zinc-400" />
           </div>
           <div>
              <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Transmission Date</p>
              <p className="text-xs font-bold text-zinc-300">
                {new Date(order.createdAt).toLocaleString("en-BD", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
           </div>
        </div>
      </Card>

      {/* Universal 6-Stage Timeline */}
      <Card className="p-6 bg-zinc-950 border-white/5 rounded-[2.5rem]">
        <h3 className="font-black text-xs text-white mb-6 uppercase tracking-widest flex items-center gap-2">
           <Truck className="h-4 w-4 text-cyan-400" /> Journey Checkpoints
        </h3>
        <div className="space-y-8 relative">
          <div className="absolute left-[13px] top-2 bottom-2 w-[1px] bg-white/10" />
          {timeline.map((step, i) => {
            return (
              <div key={i} className="flex gap-6 relative z-10 items-start group">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step.done ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.25)]" : "bg-zinc-900 border border-white/10 text-zinc-500"
                } ${step.active ? "ring-4 ring-cyan-500/20" : ""}`}>
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>
                <div className="flex-1">
                   <div className="flex items-center justify-between">
                      <p className={`font-black text-xs uppercase tracking-tight ${step.done ? "text-zinc-100" : "text-zinc-600"}`}>
                        {step.label}
                      </p>
                      <span className="text-[8px] font-black text-zinc-600 uppercase tracking-tighter">{step.date}</span>
                   </div>
                   <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
                      {step.desc}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Organized Lots (Ordered items) */}
      <Card className="p-6 bg-zinc-950 border-white/5 rounded-[2.5rem]">
        <h3 className="font-black text-xs text-white mb-6 uppercase tracking-widest">Organized Lots ({items.length})</h3>
        <div className="space-y-4">
          {items.map((it: any, i: number) => (
            <div key={i} className="flex items-center gap-4 bg-black/25 p-3 rounded-2xl border border-white/5 hover:border-cyan-500/10 transition-colors group">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-900 border border-white/5 shrink-0">
                 {it.productImage ? (
                   <img src={it.productImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                 ) : (
                   <Package className="w-6 h-6 text-zinc-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                 )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black text-zinc-100 uppercase tracking-tight line-clamp-1 mb-1">{it.productTitle}</p>
                <div className="flex items-center gap-2">
                   <p className="text-[9px] text-cyan-400 font-black uppercase tracking-widest">{it.vendorName || "Verified Wholesaler"}</p>
                   <div className="w-1 h-1 bg-white/10 rounded-full" />
                   <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">QTY: {it.quantity}</p>
                </div>
              </div>
              <p className="text-xs font-black text-zinc-200">{formatPrice(it.lineTotal || (it.unitPrice * it.quantity))}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Sourcing Destination */}
      <Card className="p-6 bg-zinc-950 border-white/5 rounded-[2.5rem] space-y-4 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full -mr-12 -mt-12" />
        <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-2">
           <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-cyan-400" />
           </div>
           <h4 className="text-xs font-black text-white uppercase tracking-widest">Sourcing Destination</h4>
        </div>
        <div className="space-y-2 relative z-10">
           <p className="text-[11px] font-black text-zinc-100 uppercase leading-normal tracking-tight">
              {order.address || order.deliveryAddress || "Consignee Hub"}
           </p>
           {order.deliveryDistrict && (
             <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">
                District Hub: {order.deliveryDistrict}
             </p>
           )}
        </div>
      </Card>

      {/* Financial Ledger */}
      <Card className="p-6 bg-zinc-950 border-white/5 rounded-[2.5rem] space-y-4">
        <h3 className="font-black text-xs text-white uppercase tracking-widest">Financial Ledger</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <span>Aggregated Subtotal</span>
            <span className="text-zinc-300 font-black">{formatPrice(displaySubtotal)}</span>
          </div>
          <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
            <span>Sourcing Freight</span>
            <span className="text-zinc-300 font-black">+{formatPrice(deliveryCost)}</span>
          </div>
          <div className="h-[1px] w-full bg-white/5 my-3" />
          <div className="flex justify-between items-end pt-1">
             <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Final Escrow Locked Total</p>
                <p className="text-2xl font-black text-white leading-none tracking-tighter">{formatPrice(displayTotal)}</p>
             </div>
             <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-wider">
               <Landmark className="w-3.5 h-3.5" /> Escrow Locked
             </div>
          </div>
        </div>
      </Card>

      {/* Persistent Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pt-3 pb-10 sm:pb-6 bg-[#020604]/90 backdrop-blur-md border-t border-white/5 z-50">
        <div className="max-w-[480px] mx-auto flex gap-3">
           <a 
             href="tel:01712000000"
             className="w-14 h-14 rounded-2xl bg-zinc-950 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white transition-all active:scale-90 cursor-pointer"
           >
              <Phone className="w-5 h-5" />
           </a>
           <button 
             onClick={() => setTrackOpen(true)}
             className="flex-1 h-14 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-cyan-500/10 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer"
           >
              <Truck className="w-5 h-5 stroke-[2.5]" /> Live Track Consignment
           </button>
        </div>
      </div>

      <LiveTrackingSheet 
        orderId={activeId || ''} 
        isOpen={trackOpen} 
        onClose={() => setTrackOpen(false)} 
      />
    </div>
  );
}
