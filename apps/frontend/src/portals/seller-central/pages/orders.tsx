import React, { useState } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  Truck, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreVertical,
  ChevronRight,
  Download
} from "lucide-react";

interface Order {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

const mockOrders: Order[] = [
  { id: "ORD-8829", customer: "হাসান মাহমুদ", items: 3, total: 2500, status: 'pending', date: "১২ মিনিট আগে" },
  { id: "ORD-8828", customer: "রকিবুল ইসলাম", items: 1, total: 1200, status: 'delivered', date: "২ ঘণ্টা আগে" },
  { id: "ORD-8827", customer: "জান্নাতুল ফেরদৌস", items: 5, total: 8500, status: 'shipped', date: "৫ ঘণ্টা আগে" },
  { id: "ORD-8826", customer: "আব্দুর রহমান", items: 2, total: 4200, status: 'processing', date: "১ দিন আগে" },
  { id: "ORD-8825", customer: "মারুফ আহমেদ", items: 1, total: 800, status: 'cancelled', date: "২ দিন আগে" },
];

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState('all');

  const statusMap = {
    pending: { label: "পেন্ডিং", color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", icon: Clock },
    processing: { label: "প্রসেসিং", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: ShoppingBag },
    shipped: { label: "শিপড", color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", icon: Truck },
    delivered: { label: "ডেলিভারড", color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20", icon: CheckCircle2 },
    cancelled: { label: "ক্যান্সেলড", color: "text-rose-400", bg: "bg-rose-400/10", border: "border-rose-400/20", icon: XCircle },
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 bg-transparent pb-24">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-white tracking-tight">অর্ডার ম্যানেজমেন্ট</h1>
          <p className="text-gray-400 text-sm">আপনার সব অর্ডারের স্ট্যাটাস এবং বিবরণ এখানে পাবেন</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-[#1e2136] border border-white/5 hover:text-white text-gray-300 px-6 py-3.5 rounded-[1.25rem] font-bold transition-all shadow-xl hover:border-white/10 shrink-0">
          <Download className="h-5 w-5 text-[#FF7A00]" />
          রিপোর্ট ডাউনলোড
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`
              px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border
              ${activeStatus === status 
                ? "bg-[#FF7A00] text-white border-transparent shadow-lg shadow-[#FF7A00]/20" 
                : "bg-[#1e2136] text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10"
              }
            `}
          >
            {status === 'all' ? "সব অর্ডার" : statusMap[status as keyof typeof statusMap].label}
          </button>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-[#FF7A00] transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার আইডি বা কাস্টমারের নাম..."
            className="w-full bg-[#1e2136] border border-white/5 rounded-[1.25rem] pl-14 pr-6 py-4 text-sm text-white focus:outline-none focus:border-[#FF7A00]/50 transition-all shadow-lg"
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-[#1e2136] border border-white/5 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-gray-400 hover:text-white transition-all shadow-lg hover:border-white/10">
            <Filter className="h-4 w-4" />
            ফিল্টার
          </button>
          <button className="flex items-center gap-2 bg-[#1e2136] border border-white/5 rounded-[1.25rem] px-6 py-4 text-sm font-bold text-gray-400 hover:text-white transition-all shadow-lg hover:border-white/10">
            <ArrowUpDown className="h-4 w-4" />
            তারিখ
          </button>
        </div>
      </div>

      {/* Orders List Container */}
      <div className="bg-[#1e2136] rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">অর্ডার আইডি</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">কাস্টমার</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">আইটেম ও টোটাল</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">স্ট্যাটাস</th>
                <th className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] text-right">ম্যানেজ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockOrders.map((order) => {
                const status = statusMap[order.status];
                return (
                  <tr key={order.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-white group-hover:text-[#FF7A00] transition-colors">{order.id}</span>
                        <span className="text-[11px] text-gray-500 font-bold uppercase mt-1">{order.date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                          {order.customer.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-white">{order.customer}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white">৳ {order.total.toLocaleString()}</span>
                        <span className="text-[11px] text-gray-500 mt-1">{order.items} টি প্রোডাক্ট</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${status.bg} ${status.border} border`}>
                        <status.icon className={`h-3.5 w-3.5 ${status.color}`} />
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 sm:opacity-0 group-hover:opacity-100 transition-all">
                        <button className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="অর্ডার দেখুন">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="p-2.5 text-gray-500 hover:text-[#FF7A00] hover:bg-white/5 rounded-xl transition-all" title="আপডেট">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
