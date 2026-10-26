import React, { useState } from 'react';
import { Store, Package, TrendingUp, Users, DollarSign, Plus, Settings, BarChart3, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'analytics'>('overview');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Mock Orders State for Preview
  const [orders, setOrders] = useState([
    { id: 'ORD-1001', customer: 'Rahim Uddin', date: 'Oct 24, 2026', total: '৳ 1,250', status: 'Pending' },
    { id: 'ORD-1002', customer: 'Karim Store', date: 'Oct 24, 2026', total: '৳ 5,400', status: 'Processing' },
    { id: 'ORD-1003', customer: 'Jamil Enterprise', date: 'Oct 23, 2026', total: '৳ 3,200', status: 'Delivered' },
  ]);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[var(--pm-bg)] pb-20 lg:pb-6">
      {/* Header */}
      <header className="p-6 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--pm-accent)]/20 border border-[var(--pm-accent)]/50 flex items-center justify-center">
              <Store className="w-5 h-5 text-[var(--pm-accent)]" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight">Seller Hub</h1>
              <p className="text-xs text-[var(--pm-text-muted)] font-medium">Manage your business operations</p>
            </div>
          </div>
          <button className="p-2 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text-muted)]">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {[
            { id: 'overview', icon: BarChart3, label: 'Overview' },
            { id: 'products', icon: Package, label: 'My Products' },
            { id: 'orders', icon: TrendingUp, label: 'Sales & Orders' },
            { id: 'analytics', icon: DollarSign, label: 'Earnings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-[var(--pm-accent)] text-white shadow-lg shadow-[var(--pm-accent)]/20' 
                : 'bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] border border-[var(--pm-border)] hover:text-[var(--pm-text)]'
              }`}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Today Orders', value: '12', trend: '+20%', icon: Package },
            { label: 'Revenue', value: '৳ 4,500', trend: '+15%', icon: DollarSign },
            { label: 'Store Views', value: '840', trend: '+5%', icon: Users },
            { label: 'Store Rating', value: '4.8', trend: 'Excellent', icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="glass p-4 rounded-2xl border border-[var(--pm-border)]/50 relative overflow-hidden">
              <p className="text-[10px] uppercase font-bold text-[var(--pm-text-muted)] mb-1">{stat.label}</p>
              <p className="text-lg font-black text-[var(--pm-text)]">{stat.value}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-[var(--pm-accent)]">{stat.trend}</span>
                <stat.icon className="w-3 h-3 text-[var(--pm-text-muted)] opacity-30" />
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Content Based on Tab */}
        {activeTab === 'orders' ? (
          <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[var(--pm-text)] text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[var(--pm-accent)]" /> 
                Order Management
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--pm-border)] text-[var(--pm-text-muted)]">
                    <th className="pb-2 font-medium">Order ID</th>
                    <th className="pb-2 font-medium">Customer</th>
                    <th className="pb-2 font-medium">Total</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--pm-border)]/50">
                  {orders.map((order) => (
                    <tr key={order.id} className="text-[var(--pm-text)]">
                      <td className="py-3 font-bold">{order.id}</td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3 font-bold">{order.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          order.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' : 
                          order.status === 'Processing' ? 'bg-blue-500/20 text-blue-500' : 
                          'bg-green-500/20 text-green-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-lg px-2 py-1 text-xs outline-none focus:border-[var(--pm-accent)]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[var(--pm-text)] text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[var(--pm-accent)]" /> 
                {activeTab === 'overview' ? 'Order Velocity' : 'Recent Updates'}
              </h3>
              <button className="text-[10px] font-bold text-[var(--pm-accent)]">View Full Report</button>
            </div>

            <div className="h-32 flex items-end gap-2 px-2">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="flex-1 bg-[var(--pm-accent)]/20 rounded-t-lg relative group transition-all hover:bg-[var(--pm-accent)]/40" style={{ height: `${h}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--pm-accent)] text-white text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between px-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <span key={i} className="text-[9px] font-bold text-[var(--pm-text-muted)]">{d}</span>
              ))}
            </div>
          </div>
        )}

        {/* Warning Banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-[10px] text-amber-200/80 leading-snug">
            Your trade license is expiring in 15 days. Please update it in the settings to avoid store deactivation.
          </p>
        </div>

        {/* Quick Action / Add Product Form */}
        {showAddProduct ? (
          <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50">
            <div className="flex items-center justify-between xl mb-4">
              <h3 className="font-bold text-[var(--pm-text)] flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--pm-accent)]" /> Add New Product
              </h3>
              <button onClick={() => setShowAddProduct(false)} className="text-[10px] text-[var(--pm-text-muted)] p-1">Cancel</button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                // Logic to save the product
                setShowAddProduct(false);
                setImagePreview(null);
              }}
              className="space-y-3"
            >
              <input name="name" required placeholder="Product Name" className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <input name="price" type="number" required placeholder="Price (৳)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                <input name="stock" type="number" required placeholder="Stock" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
              </div>
              
              {/* File Upload Component */}
              <div className="w-full">
                <label className="block text-xs font-bold text-[var(--pm-text-muted)] mb-2 mt-2">
                  Product Photo
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/10 flex-shrink-0 border-2 border-dashed border-[var(--pm-border)] flex items-center justify-center relative">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-[10px] text-center text-[var(--pm-text-muted)] p-2">No Photo</div>
                    )}
                    <input 
                      type="file" 
                      name="imageFile" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      name="image" 
                      value={imagePreview || ''}
                      readOnly
                      className="w-full hidden" 
                    />
                    <button 
                      type="button"
                      className="relative px-4 py-2 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl text-sm font-bold text-[var(--pm-text)] hover:text-[var(--pm-accent)] transition-colors overflow-hidden border border-[var(--pm-border)]"
                    >
                      Choose Photo
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </button>
                    <p className="text-[10px] text-[var(--pm-text-muted)] mt-2">Recommended: 800x800px, under 2MB.</p>
                  </div>
                </div>
              </div>
              
              <button type="submit" className="w-full py-3 bg-[var(--pm-accent)] text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[var(--pm-accent)]/20 mt-2">
                Publish Product
              </button>
            </form>
          </div>
        ) : (
          <button onClick={() => setShowAddProduct(true)} className="w-full py-4 bg-[var(--pm-accent)] text-white font-black text-sm rounded-2xl shadow-xl shadow-[var(--pm-accent)]/20 active:scale-95 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        )}
      </div>
    </div>
  );
};

