import React from "react";
import {
  BarChart3 as BarChartIcon,
  LineChart as LineChartIcon,
  TrendingUp,
  Package as PackageIcon
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Cell,
  Legend
} from "recharts";

const salesData = [
  { name: "জানু", sales: 4000, revenue: 2400 },
  { name: "ফেব্রু", sales: 3000, revenue: 1398 },
  { name: "মার্চ", sales: 2000, revenue: 9800 },
  { name: "এপ্রিল", sales: 2780, revenue: 3908 },
  { name: "মে", sales: 1890, revenue: 4800 },
  { name: "জুন", sales: 2390, revenue: 3800 },
  { name: "জুলাই", sales: 3490, revenue: 4300 },
  { name: "আগস্ট", sales: 4000, revenue: 2400 },
  { name: "সেপ্ট", sales: 3000, revenue: 1398 },
  { name: "অক্টো", sales: 2000, revenue: 9800 },
  { name: "নভে", sales: 2780, revenue: 3908 },
  { name: "ডিসে", sales: 1890, revenue: 4800 },
];

const inventoryData = [
  { category: "ইলেকট্রনিক্স", stock: 120, status: "High" },
  { category: "পোশাক", stock: 85, status: "Medium" },
  { category: "খাদ্য", stock: 45, status: "Low" },
  { category: "হোম ও গার্ডেন", stock: 65, status: "Medium" },
  { category: "বিউটি", stock: 30, status: "Low" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e2136] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <p className="text-sm font-bold text-white">
              {entry.name}: <span className="text-[#FF7A00]">৳{entry.value.toLocaleString()}</span>
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const SalesPerformanceChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FF7A00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#FF7A00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            name="রেভিনিউ"
            stroke="#FF7A00" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const InventoryStatusChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={inventoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
          />
          <Tooltip 
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            content={({ active, payload, label }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-[#1e2136] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                    <p className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-bold text-white">
                      স্টক: <span className="text-blue-400">{payload[0].value} টি</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar 
            dataKey="stock" 
            name="স্টক"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
          >
            {inventoryData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.stock < 50 ? '#F43F5E' : entry.stock < 100 ? '#3B82F6' : '#10B981'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const BusinessMetrics = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sales Performance Card */}
      <div className="bg-[#1e2136] rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF7A00]/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-[#FF7A00]/10 transition-all"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#FF7A00]/10">
              <LineChartIcon className="h-5 w-5 text-[#FF7A00]" />
            </div>
            সেলস পারফরম্যান্স
          </h3>
          <div className="px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 text-[10px] font-bold text-emerald-400">
            +১২.৫% বৃদ্ধি
          </div>
        </div>
        <SalesPerformanceChart />
      </div>

      {/* Inventory Status Card */}
      <div className="bg-[#1e2136] rounded-[2rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-blue-500/10 transition-all"></div>
        <div className="flex items-center justify-between mb-8 relative z-10">
          <h3 className="text-lg font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10">
              <BarChartIcon className="h-5 w-5 text-blue-400" />
            </div>
            ইনভেন্টরি স্ট্যাটাস
          </h3>
          <div className="px-3 py-1.5 bg-black/20 rounded-xl border border-white/5 text-[10px] font-bold text-gray-400">
            ৫টি ক্যাটাগরি
          </div>
        </div>
        <InventoryStatusChart />
      </div>
    </div>
  );
};

export default BusinessMetrics;
