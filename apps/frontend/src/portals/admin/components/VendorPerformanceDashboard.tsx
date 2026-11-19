import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line, AreaChart, Area 
} from 'recharts';

// Mock data for demonstration
const salesData = [
  { month: 'Jan', sales: 4000, vendors: 2400 },
  { month: 'Feb', sales: 3000, vendors: 1398 },
  { month: 'Mar', sales: 2000, vendors: 9800 },
  { month: 'Apr', sales: 2780, vendors: 3908 },
  { month: 'May', sales: 1890, vendors: 4800 },
  { month: 'Jun', sales: 2390, vendors: 3800 },
];

const topVendorsData = [
  { name: 'Silk City', sales: 4000 },
  { name: 'Meghna Agro', sales: 3000 },
  { name: 'China Tech', sales: 2000 },
];

export const VendorPerformanceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl border border-[var(--pm-border)]/50">
        <h3 className="font-black text-lg text-white mb-6">Platform Sales Growth</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#0e1017', borderColor: '#333' }} />
              <Area type="monotone" dataKey="sales" stroke="#06b6d4" fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass p-6 rounded-3xl border border-[var(--pm-border)]/50">
        <h3 className="font-black text-lg text-white mb-6">Top Performing Vendors</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topVendorsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ backgroundColor: '#0e1017', borderColor: '#333' }} />
              <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
