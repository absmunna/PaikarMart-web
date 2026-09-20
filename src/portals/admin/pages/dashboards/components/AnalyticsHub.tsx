import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area, 
  ReferenceLine, Cell
} from "recharts";
import { 
  TrendingUp, Users, DollarSign, Package, 
  ShieldCheck, ShieldAlert, Award, Star, 
  ChevronRight, ArrowUpRight, Zap, CheckCircle2, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatPrice } from "@/modules/app/utils/formatPrice";
import { Card } from "@/components/ui/card";

const SALES_DATA = [
  { day: "Sat", sales: 45000, visitors: 120, conversions: 5 },
  { day: "Sun", sales: 52000, visitors: 145, conversions: 6 },
  { day: "Mon", sales: 38000, visitors: 110, conversions: 4.5 },
  { day: "Tue", sales: 65000, visitors: 190, conversions: 8 },
  { day: "Wed", sales: 48000, visitors: 130, conversions: 5.5 },
  { day: "Thu", sales: 72000, visitors: 210, conversions: 9 },
  { day: "Fri", sales: 55000, visitors: 155, conversions: 7 },
];

const TIER_STATS = [
  { level: "Bronze", minOrders: 0, current: true },
  { level: "Silver Pro", minOrders: 50, current: false },
  { level: "Gold Partner", minOrders: 200, current: false },
  { level: "Platinum Elite", minOrders: 1000, current: false },
];

const CustomTooltip = ({ active, payload, label, mode }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl shadow-2xl">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1.5">{label} Report</p>
        <p className="text-sm font-black text-white">
          {mode === "sales" ? formatPrice(payload[0].value) : `${payload[0].value} Visitors`}
        </p>
        <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-white/5">
           <Zap className="w-3 h-3 text-[var(--pm-accent)]" />
           <span className="text-[9px] font-black text-[var(--pm-accent)] uppercase">Status: Volatile</span>
        </div>
      </div>
    );
  }
  return null;
};

export const AnalyticsHub = () => {
  const [metricMode, setMetricMode] = useState<"sales" | "traffic">("sales");
  const totalOrders = 842; // Simulation
  const currentTierIndex = 2; // Simulation: Gold Partner
  const progress = (totalOrders / 1000) * 100;

  return (
    <div className="space-y-8 pb-12">
      {/* 🛡️ Tier Verification Milestone Terminal */}
      <Card className="p-8 bg-white/[0.02] border-white/5 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Award className="w-5 h-5 text-amber-400" />
               <h3 className="text-sm font-black text-white uppercase tracking-widest">Merchant Ascension Path</h3>
            </div>
            <p className="text-xs text-white/40 font-bold uppercase tracking-tight">Current Standing: <span className="text-amber-400 underline decoration-amber-400/30 underline-offset-4">Gold Strategic Partner</span></p>
          </div>
          <div className="flex -space-x-3">
             {[1, 2, 3, 4].map((i) => (
               <div key={i} className={`w-10 h-10 rounded-xl border-2 border-slate-900 bg-white/5 flex items-center justify-center transition-transform hover:-translate-y-1 hover:z-20 cursor-help ${i <= currentTierIndex + 1 ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "opacity-20"}`}>
                  <Star className="w-4 h-4 fill-current" />
               </div>
             ))}
          </div>
        </div>

        {/* Milestone Progress Bar */}
        <div className="mt-10 space-y-3 relative z-10">
           <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
              <span className="text-white/40">Tier Progress: {totalOrders} / 1000 Deliveries</span>
              <span className="text-amber-400">{Math.round(progress)}% to Platinum</span>
           </div>
           <div className="h-3 w-full bg-black/40 rounded-full border border-white/5 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
              />
           </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
           {TIER_STATS.map((tier, i) => (
             <div key={i} className={`p-4 rounded-2xl border transition-all ${i <= currentTierIndex ? "bg-white/5 border-white/10" : "bg-black/20 border-white/5 opacity-30"}`}>
                <p className={`text-[10px] font-black uppercase tracking-tighter ${i <= currentTierIndex ? "text-white" : "text-white/20"}`}>{tier.level}</p>
                <div className="flex items-center justify-between mt-1">
                   <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{tier.minOrders}+ Orders</span>
                   {i <= currentTierIndex && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </div>
             </div>
           ))}
        </div>
      </Card>

      {/* 📈 Vector Analytics Terminal */}
      <Card className="p-8 bg-[#0a0a14] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--pm-accent)]/[0.03] blur-3xl rounded-full -ml-48 -mt-48" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
          <div>
            <h3 className="text-lg font-black text-white tracking-tight uppercase">Operational Matrix</h3>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mt-1">Real-time Performance Telemetry</p>
          </div>
          
          <div className="flex items-center gap-1.5 p-1.5 bg-black/40 border border-white/5 rounded-2xl">
             <button 
               onClick={() => setMetricMode("sales")}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${metricMode === "sales" ? "bg-[var(--pm-accent)] text-white shadow-xl shadow-[var(--pm-accent)]/20" : "text-white/40 hover:text-white"}`}
             >
                Volume (৳)
             </button>
             <button 
               onClick={() => setMetricMode("traffic")}
               className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${metricMode === "traffic" ? "bg-[var(--pm-accent)] text-white shadow-xl shadow-[var(--pm-accent)]/20" : "text-white/40 hover:text-white"}`}
             >
                Traffic (👥)
             </button>
          </div>
        </div>

        <div className="h-[320px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            {metricMode === "sales" ? (
              <AreaChart data={SALES_DATA}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--pm-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--pm-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip mode="sales" />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="var(--pm-accent)" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                  animationDuration={2000}
                />
              </AreaChart>
            ) : (
              <BarChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip mode="traffic" />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                <Bar 
                  dataKey="visitors" 
                  radius={[10, 10, 0, 0]} 
                  animationDuration={1500}
                >
                   {SALES_DATA.map((entry, index) => (
                     <Cell 
                        key={`cell-${index}`} 
                        fill={index === 5 ? "var(--pm-accent)" : "rgba(255,255,255,0.1)"} 
                     />
                   ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Quick Micro-Stats Bar */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/5 relative z-10">
           <div className="space-y-1">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Success Rate
              </div>
              <h4 className="text-xl font-black text-white tracking-tighter">98.4%</h4>
           </div>
           <div className="space-y-1">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" /> Avg Order Value
              </div>
              <h4 className="text-xl font-black text-white tracking-tighter">৳ ৪,২৮০</h4>
           </div>
           <div className="space-y-1">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5 border-amber-500/30">
                 <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Repeat Buyers
              </div>
              <h4 className="text-xl font-black text-white tracking-tighter">24.5%</h4>
           </div>
           <div className="space-y-1">
              <div className="text-[9px] font-black text-white/30 uppercase tracking-widest flex items-center gap-1.5">
                 <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Disputed Lots
              </div>
              <h4 className="text-xl font-black text-white tracking-tighter">0.02%</h4>
           </div>
        </div>
      </Card>
      
      {/* 🚀 AI Insight Capsule */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 via-slate-900/40 to-transparent border border-indigo-500/20 shadow-xl flex items-center gap-6 group"
      >
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shrink-0 group-hover:rotate-12 transition-transform duration-500">
           <Zap className="w-8 h-8 text-indigo-400" />
        </div>
        <div className="space-y-1.5">
           <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Growth Signal Detected
           </p>
           <p className="text-xs text-indigo-100/70 font-bold leading-relaxed">
             আপনার "Home Decor" ক্যাটাগরিতে সোর্সিং বাড়ছে। সামনের সপ্তাহে ১৫% স্টক বাড়িয়ে "Gold Tier" দ্রুত অর্জন করতে পারেন।
           </p>
        </div>
        <ChevronRight className="w-6 h-6 text-white/20 ml-auto group-hover:text-white/60 transition-colors" />
      </motion.div>
    </div>
  );
};
