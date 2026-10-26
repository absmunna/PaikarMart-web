import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  ChevronDown,
  ArrowUpRight,
  PieChart,
  LineChart
} from "lucide-react";

import BusinessMetrics from "../components/BusinessMetrics";

export default function Analytics() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-transparent pb-24">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">বিজনেস অ্যানালিটিক্স</h1>
          <p className="text-gray-400 text-sm">আপনার ব্যবসার গ্রোথ এবং পারফরম্যান্স রিয়েল-টাইম ট্র্যাক করুন</p>
        </div>
        <button className="flex items-center gap-2 bg-[#1e2136] border border-white/5 rounded-[1.25rem] px-5 py-3 text-sm font-bold text-gray-300 hover:text-white transition-all shadow-lg hover:border-white/10">
          <Calendar className="h-4 w-4 text-[#FF7A00]" />
          সেপ্টেম্বর, ২০২৪
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard 
          label="মোট রেভিনিউ" 
          value="৳ ১২৫,৪০০" 
          change="+১৮.২%" 
          positive={true} 
          icon={DollarSign} 
          color="text-emerald-400"
          bgColor="bg-emerald-400/10"
        />
        <MetricCard 
          label="অর্ডার সংখ্যা" 
          value="৩৪০" 
          change="+১২.৫%" 
          positive={true} 
          icon={ShoppingBag} 
          color="text-blue-400"
          bgColor="bg-blue-400/10"
        />
        <MetricCard 
          label="কাস্টমার ভিউ" 
          value="৮,৯২০" 
          change="-২.৪%" 
          positive={false} 
          icon={Users} 
          color="text-purple-400"
          bgColor="bg-purple-400/10"
        />
        <MetricCard 
          label="কনভার্সন রেট" 
          value="৩.৮%" 
          change="+০.৫%" 
          positive={true} 
          icon={TrendingUp} 
          color="text-[#FF7A00]"
          bgColor="bg-[#FF7A00]/10"
        />
      </div>
      
      {/* Charts Section */}
      <BusinessMetrics />

      {/* Top Products - Premium List */}
      <div className="bg-[#1e2136] rounded-[2rem] p-8 border border-white/5 shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-400/10">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
            </div>
            বেস্ট সেলিং প্রোডাক্টস
          </h3>
          <button className="text-xs font-bold text-gray-500 hover:text-white transition-colors">রিপোর্ট ডাউনলোড করুন</button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-4 p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all group">
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-2xl bg-[#0f111a] flex items-center justify-center font-bold text-gray-700 text-xl border border-white/5 group-hover:scale-110 transition-transform">
                  {i}
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+১৮%</span>
                  <ArrowUpRight className="h-4 w-4 text-emerald-400 mt-1" />
                </div>
              </div>
              <div className="flex flex-col mt-2">
                <span className="text-base font-bold text-white group-hover:text-[#FF7A00] transition-colors">প্রিমিয়াম প্রোডাক্ট লিস্টিং {i}</span>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">সেলস</span>
                    <span className="text-sm font-bold text-white mt-0.5">১৮০টি</span>
                  </div>
                  <div className="h-6 w-px bg-white/5"></div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">রেভিনিউ</span>
                    <span className="text-sm font-bold text-white mt-0.5">৳ ২৮,৫০০</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, positive, icon: Icon, color, bgColor }: any) {
  return (
    <div className="bg-[#1e2136] rounded-[2rem] p-6 border border-white/5 shadow-xl relative overflow-hidden group">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${bgColor} blur-[40px] group-hover:blur-[30px] transition-all`}></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className={`p-3 rounded-2xl ${bgColor} border border-white/5`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/20 border border-white/5 text-[10px] font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
          {change} {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1.5">{label}</p>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function CategoryProgress({ label, percent, color, count }: { label: string, percent: number, color: string, count: string }) {
  return (
    <div className="flex flex-col gap-3 group/prog">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-gray-400 group-hover/prog:text-white transition-colors">{label}</span>
        <span className="text-white font-mono">{count} <span className="text-gray-600 ml-1">({percent}%)</span></span>
      </div>
      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,122,0,0.2)]`} 
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
