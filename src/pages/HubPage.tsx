import { LayoutGrid, Zap, ShieldCheck, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { COMMERCE_HUBS, PERSONAL_NAV, UTILITY_NAV } from "../constants/navigation";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

// Constants migrated to src/constants/navigation.ts

export default function HubPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 lg:p-10 space-y-12 pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-6 w-6 rounded-lg bg-[#FF7A00]/20 flex items-center justify-center">
              <LayoutGrid className="h-4 w-4 text-[#FF7A00]" />
            </div>
            <span className="text-[10px] font-black text-[#FF7A00] uppercase tracking-[0.2em]">Platform Hub</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter italic">Paikar<span className="text-[#FF7A00]">Mart</span> Apps</h1>
          <p className="text-zinc-500 font-medium mt-2 max-w-md">Access all marketplace portals, business tools, and logistics services from one unified dashboard.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-bold text-zinc-500 uppercase">System Status</p>
            <p className="text-xs font-black text-emerald-500 flex items-center gap-1 justify-end">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> All Systems Operational
            </p>
          </div>
        </div>
      </div>

      {/* Main Hubs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {COMMERCE_HUBS.map((hub, index) => (
          <motion.button
            key={hub.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(hub.href)}
            className={cn(
              "group relative flex flex-col items-center justify-center p-8 rounded-[2.5rem] bg-white/5 border hover:bg-white/10 transition-all text-center overflow-hidden h-64 shadow-2xl shadow-black/20",
              hub.border || "border-white/10"
            )}
          >
            <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-20 transition-all group-hover:opacity-40", hub.bg.replace('/10', '/30'))} />
            
            <div className={cn("p-5 rounded-3xl mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-3", hub.bg, hub.color)}>
              <hub.icon className="h-10 w-10" />
            </div>
            
            <h3 className="text-xl font-black text-white mb-1 group-hover:text-[#FF7A00] transition-colors tracking-tight">{hub.label}</h3>
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{hub.desc}</p>
            
            <div className="mt-6 h-1 w-12 rounded-full bg-zinc-800 overflow-hidden">
               <div className={cn("h-full w-0 group-hover:w-full transition-all duration-500", hub.bg.replace('/10', ''))} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Utilities & Management Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 px-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-bold text-white italic tracking-tight">Quick Actions & Tools</h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...UTILITY_NAV, ...PERSONAL_NAV].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.href)}
              className="flex flex-col items-center gap-3 p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-[#FF7A00]/30 hover:bg-white/5 transition-all group"
            >
              <div className={cn("p-3 rounded-2xl bg-zinc-800 group-hover:bg-[#FF7A00]/10 transition-all", item.color)}>
                <item.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-zinc-400 group-hover:text-white transition-colors text-center">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Promotional / Info Banner */}
      <div className="relative rounded-[3rem] p-10 bg-gradient-to-br from-blue-600/20 via-zinc-900 to-[#FF7A00]/10 border border-white/10 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FF7A00]/10 blur-[100px]" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
              <ShieldCheck className="h-3 w-3" /> Secure Marketplace
            </div>
            <h2 className="text-3xl font-black text-white leading-none">Trust. Quality. <span className="text-blue-500">PaikarMart.</span></h2>
            <p className="text-sm text-zinc-400 max-w-lg font-medium leading-relaxed">
              Our smart verification system ensures you only deal with genuine wholesalers and verified manufacturers across Bangladesh.
            </p>
          </div>
          
          <button className="px-8 py-4 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white font-bold text-sm shadow-xl shadow-[#FF7A00]/20 transition-all hover:-translate-y-1 active:scale-95">
            Learn More About Security
          </button>
        </div>
      </div>
    </div>
  );
}
