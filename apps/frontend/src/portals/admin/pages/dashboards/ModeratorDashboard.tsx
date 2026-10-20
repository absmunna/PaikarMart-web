import React, { useState } from 'react';
import { ShieldAlert, Package, ShoppingBag, CheckCircle, Clock, Search, Filter, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ModeratorDashboard = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'inventory' | 'reports'>('pending');

  return (
    <div className="flex flex-col min-h-full bg-[var(--pm-bg)] pb-20 lg:pb-6">
      <header className="p-6 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight">Staff Panel</h1>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">PK Shop Moderation & Oversight</p>
          </div>
        </div>
      </header>

      <div className="px-6 py-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {[
            { id: 'pending', icon: Clock, label: 'Pending Orders' },
            { id: 'inventory', icon: Package, label: 'Stock Guard' },
            { id: 'reports', icon: ShieldAlert, label: 'Disputes' },
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
        <div className="flex gap-2">
          <div className="flex-1 glass flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--pm-border)]/50 focus-within:border-[var(--pm-accent)]/50 transition-colors">
            <Search className="w-4 h-4 text-[var(--pm-text-muted)]" />
            <input type="text" placeholder="Search orders, products..." className="w-full bg-transparent outline-none text-xs text-[var(--pm-text)]" />
          </div>
          <button className="p-2.5 glass border border-[var(--pm-border)]/50 rounded-xl text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">
              {activeTab === 'pending' ? 'Ready for Ship' : activeTab === 'inventory' ? 'Low Stock Alerts' : 'Active Disputes'}
            </h3>
            <span className="text-[10px] font-bold text-[var(--pm-accent)] bg-[var(--pm-accent-soft)] px-2 py-0.5 rounded-full">8 Tasks</span>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass p-4 rounded-2xl border border-[var(--pm-border)]/50 hover:border-amber-500/30 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/10 shrink-0 border border-[var(--pm-border)]/30">
                    <img src={`https://images.unsplash.com/photo-15${i}4592094714-0f0654e20314?w=100&h=100&fit=crop`} alt="Item" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">#PM-ORDER-{1000 + i}</h4>
                    <p className="text-[10px] text-[var(--pm-text-muted)] mt-1 flex items-center gap-1">
                      <ShoppingBag className="w-3 h-3" /> PK Shop Item • 2 units
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors">
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-indigo-500/5 border border-indigo-500/20 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <h4 className="text-[11px] font-black text-indigo-200 uppercase">Delegated Authority</h4>
          </div>
          <p className="text-[10px] text-indigo-200/60 leading-snug">
            As a Moderator, your actions are logged and audited daily by the Super Admin. Please ensure all PK Shop order processing follows the standardized quality check protocols.
          </p>
        </div>
      </div>
    </div>
  );
};

