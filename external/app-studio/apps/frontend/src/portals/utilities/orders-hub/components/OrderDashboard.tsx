import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Package, Banknote } from 'lucide-react';
import { Order } from '@/types';

interface OrderDashboardProps {
  orders: Order[];
}

const data = [
  { month: 'Jan', orders: 2, spending: 3400 },
  { month: 'Feb', orders: 4, spending: 6200 },
  { month: 'Mar', orders: 3, spending: 4800 },
  { month: 'Apr', orders: 6, spending: 11200 },
  { month: 'May', orders: 5, spending: 8900 },
  { month: 'Jun', orders: 8, spending: 15400 }
];

export const OrderDashboard: React.FC<OrderDashboardProps> = ({ orders }) => {
  return (
    <div className="p-6 bg-[var(--pm-card)] text-[var(--pm-text)] rounded-[2rem] border border-[var(--pm-border)] space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-[var(--pm-accent-soft)] rounded-[1.25rem] text-[var(--pm-accent)]">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-black text-[var(--pm-text)]">
            Order Spend & Fulfillment Analytics
          </h2>
          <p className="text-xs text-[var(--pm-muted)]">Order volume and BDT spend over the last 6 months</p>
        </div>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--pm-accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--pm-accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.14} />
            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--pm-card)',
                borderColor: 'var(--pm-border)',
                borderRadius: '14px',
                fontSize: '11px',
                color: 'var(--pm-text)'
              }}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="var(--pm-accent)"
              fillOpacity={1}
              fill="url(#colorSpending)"
              name="Spend (৳)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <div className="flex items-center gap-2 text-[var(--pm-muted)] mb-1">
            <Package className="w-4 h-4" />
            <span className="text-[11px] font-bold">Total Orders</span>
          </div>
          <p className="text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            {orders.length}
          </p>
        </div>
        <div className="p-4 rounded-[1.5rem] bg-[var(--pm-surface)] border border-[var(--pm-border)]">
          <div className="flex items-center gap-2 text-[var(--pm-muted)] mb-1">
            <Banknote className="w-4 h-4" />
            <span className="text-[11px] font-bold">Total Spent</span>
          </div>
          <p className="text-2xl font-mono tabular-nums font-black text-[var(--pm-text)]">
            ৳{orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};
