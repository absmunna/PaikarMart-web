import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Activity, Lock, Search, Plus, Bot, 
  KeyRound, AlertTriangle, CheckCircle2, Package, Trash2, 
  FileCheck, XCircle, Clock, UserCheck, Terminal, DollarSign,
  TrendingUp, RefreshCw, Sliders, ShieldAlert, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProductStore } from '@/modules/product';
import { useKycStore } from '@/modules/admin';
import { 
  PendingVendorsPanel, 
  VendorPerformanceDashboard,
  EscrowManagementPanel,
  DevOpsFlagsPanel,
  ModerationQueuePanel
} from '@/portals/admin/components';
import { useAdminGovernanceStore } from '@/modules/admin';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pending-vendors' | 'escrow' | 'moderation' | 'devops' | 'inventory' | 'delegation' | 'security'>('overview');
  const { products, addProduct, removeProduct } = useProductStore();
  const { submissions, updateStatus } = useKycStore();
  const { metrics, health, isLoading, lastUpdated, fetchAllAdminData } = useAdminGovernanceStore();

  useEffect(() => {
    fetchAllAdminData();
  }, [fetchAllAdminData]);

  const pkStoreProducts = products.filter(p => p.portal === 'pk-store');

  const TAB_CONFIG = [
    { id: 'overview', icon: Activity, label: 'ওভারভিউ (Overview)' },
    { id: 'pending-vendors', icon: UserCheck, label: `ভেন্ডর অনুমোদন (${metrics.pendingVendors})` },
    { id: 'escrow', icon: ShieldCheck, label: `এসক্রো ও ডিসপুট (${metrics.activeEscrowCount})` },
    { id: 'moderation', icon: ShieldAlert, label: `সোশ্যাল মডারেশন (${metrics.pendingModerationCount})` },
    { id: 'devops', icon: Terminal, label: 'DevOps ও ফ্ল্যাগস' },
    { id: 'inventory', icon: Package, label: `পিকে স্টোর (${pkStoreProducts.length})` },
    { id: 'delegation', icon: Users, label: 'টিম এক্সেস' },
    { id: 'security', icon: Lock, label: 'সিকিউরিটি' }
  ];

  const currentTabObj = TAB_CONFIG.find(t => t.id === activeTab);

  return (
    <div className="flex flex-col min-h-full bg-[var(--pm-bg)] relative pb-20 lg:pb-8">
      
      {/* Top Header with Breadcrumb & Quick Stats */}
      <header className="p-6 pb-2 border-b border-[var(--pm-border)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            {/* Breadcrumb Trail */}
            <div className="flex items-center gap-2 text-xs text-[var(--pm-text-muted)] mb-1">
              <span>Admin Console</span>
              <span>/</span>
              <span>Governance</span>
              <span>/</span>
              <span className="text-[var(--pm-text)] font-semibold">{currentTabObj?.label}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--pm-text)] tracking-tight">
                  সুপার অ্যাডমিন গভর্ন্যান্স কন্ট্রোল প্যানেল
                </h1>
                <p className="text-xs text-[var(--pm-text-muted)] font-medium">
                  Multi-Vendor Governance, Escrow Finance, Social Moderation & Global DevOps
                </p>
              </div>
            </div>
          </div>

          {/* Quick System Telemetry */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text-muted)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>DB Pool: <strong className="text-[var(--pm-text)] font-mono tabular-nums">{health.apiLatency}ms</strong></span>
              <span className="text-zinc-600">·</span>
              <span>Sessions: <strong className="text-[var(--pm-text)] font-mono tabular-nums">{health.activeSessions}</strong></span>
            </div>

            <button
              onClick={() => fetchAllAdminData()}
              className="p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <div className="px-6 py-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {TAB_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--pm-accent)] text-white shadow-md shadow-[var(--pm-accent)]/20' 
                    : 'bg-[var(--pm-surface)] text-[var(--pm-text-muted)] border border-[var(--pm-border)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface-hover)]'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 px-6 space-y-6">
        <AnimatePresence mode="wait">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div 
              key="overview" 
              initial={{ opacity: 0, y: 8 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              className="space-y-6"
            >
              {/* Executive Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <p className="text-[11px] font-semibold text-[var(--pm-text-muted)]">মোট মার্কেটপ্লেস জিএমভি (GMV)</p>
                  <p className="text-xl font-bold font-mono tabular-nums text-[var(--pm-text)] mt-1">
                    ৳ {(metrics.totalGMV / 1000000).toFixed(2)}M
                  </p>
                  <div className="flex items-center gap-1 text-xs text-emerald-500 font-medium mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> +16.4% এই মাসে
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <p className="text-[11px] font-semibold text-[var(--pm-text-muted)]">প্ল্যাটফর্ম প্রফিট (Take-Rate)</p>
                  <p className="text-xl font-bold font-mono tabular-nums text-emerald-400 mt-1">
                    ৳ {metrics.platformProfit.toLocaleString()}
                  </p>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-1">৫% গড়ে কমিশন ও ফি</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <p className="text-[11px] font-semibold text-[var(--pm-text-muted)]">এসক্রো ভল্ট ডিপোজিট (Held)</p>
                  <p className="text-xl font-bold font-mono tabular-nums text-amber-400 mt-1">
                    ৳ {metrics.heldEscrowAmount.toLocaleString()}
                  </p>
                  <p className="text-xs text-amber-500 mt-1">{metrics.activeEscrowCount} টি অর্ডার হোল্ডে</p>
                </div>

                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <p className="text-[11px] font-semibold text-[var(--pm-text-muted)]">মোট নিবন্ধিত ইউজার</p>
                  <p className="text-xl font-bold font-mono tabular-nums text-[var(--pm-text)] mt-1">
                    {metrics.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-cyan-400 mt-1">Wholesale + Retail</p>
                </div>
              </div>

              {/* Vendor Performance & Analytics Chart */}
              <VendorPerformanceDashboard />

              {/* Quick Action Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div 
                  onClick={() => setActiveTab('pending-vendors')}
                  className="p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-[var(--pm-accent)] transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--pm-text)]">ভেন্ডর অনুমোদন কিউ</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                    {metrics.pendingVendors} টি নতুন ট্রেড লাইসেন্স ও এনআইডি ভেরিফিকেশন পেন্ডিং।
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('escrow')}
                  className="p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-cyan-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--pm-text)]">এসক্রো ও ডিসপুট ডেস্ক</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                    ৳ {metrics.heldEscrowAmount.toLocaleString()} মূল্যের ট্রানজেকশন সুরক্ষা ও সালিশি।
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('devops')}
                  className="p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] hover:border-emerald-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--pm-text)]">DevOps ও ফিচার ফ্ল্যাগস</h3>
                  <p className="text-xs text-[var(--pm-text-muted)] mt-1">
                    রিয়েল-টাইম হট টগল, রোলআউট স্লাইডার ও গিট ডিপ্লয়মেন্ট হেলথ।
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* 2. PENDING VENDORS TAB */}
          {activeTab === 'pending-vendors' && (
            <motion.div key="pending-vendors" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <PendingVendorsPanel />
            </motion.div>
          )}

          {/* 3. ESCROW & DISPUTES TAB */}
          {activeTab === 'escrow' && (
            <motion.div key="escrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <EscrowManagementPanel />
            </motion.div>
          )}

          {/* 4. SOCIAL MODERATION TAB */}
          {activeTab === 'moderation' && (
            <motion.div key="moderation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ModerationQueuePanel />
            </motion.div>
          )}

          {/* 5. DEVOPS & FEATURE FLAGS TAB */}
          {activeTab === 'devops' && (
            <motion.div key="devops" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <DevOpsFlagsPanel />
            </motion.div>
          )}

          {/* 6. PK STORE INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              {/* Add Product Form */}
              <div className="p-6 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                <h3 className="font-bold text-[var(--pm-text)] mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[var(--pm-accent)]" /> নতুন পিকে স্টোর কিউরেটেড প্রোডাক্ট যোগ করুন
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    addProduct({
                      name: formData.get('name') as string,
                      price: Number(formData.get('price')),
                      originalPrice: Number(formData.get('originalPrice')),
                      coinCashback: Number(formData.get('cashback')),
                      tag: formData.get('tag') as string,
                      image: formData.get('image') as string,
                      portal: 'pk-store'
                    });
                    e.currentTarget.reset();
                  }}
                  className="space-y-3"
                >
                  <input name="name" required placeholder="পণ্যের নাম (Product Name)" className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="price" type="number" required placeholder="বিক্রয় মূল্য ৳ (Price)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                    <input name="originalPrice" type="number" required placeholder="প্রকৃত মূল্য ৳ (Original Price)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="cashback" type="number" required placeholder="পিকে কয়েন ক্যাশব্যাক" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                    <input name="tag" required placeholder="ট্যাগ (যেমন: Premium, Exclusive, 100% Pure)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                  </div>
                  <input name="image" required placeholder="ইমেজ লিঙ্ক (Image URL: https://...)" className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2.5 text-xs text-[var(--pm-text)] outline-none focus:border-[var(--pm-accent)]" />
                  
                  <button type="submit" className="w-full py-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-bold rounded-xl transition-all cursor-pointer">
                    পণ্যটি পিকে স্টোরে পাবলিশ করুন
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                <h3 className="font-bold text-[var(--pm-text)] text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--pm-accent)]" /> বর্তমান পিকে স্টোর ইনভেন্টরি ({pkStoreProducts.length})
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkStoreProducts.map(product => (
                    <div key={product.id} className="flex gap-3 p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] relative group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/10 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">{product.name}</h4>
                        <p className="text-xs text-[var(--pm-accent)] font-mono font-bold mt-1">৳ {product.price}</p>
                      </div>
                      <button 
                        onClick={() => removeProduct(product.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer shrink-0 self-center"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* 7. DELEGATION TAB */}
          {activeTab === 'delegation' && (
            <motion.div key="delegation" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
                <h2 className="font-bold text-base text-[var(--pm-text)] flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-indigo-400" /> রোল ডেলিগেশন ও টিম অ্যাক্সেস কন্ট্রোল
                </h2>
                <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
                  সুপার অ্যাডমিন হিসেবে আপনি নির্দিষ্ট স্টাফ সদস্যদের 'মডারেটর', 'ফিনান্স অফিসার' বা 'ইনভেন্টরি ম্যানেজার' রোল প্রদান করতে পারেন। এতে মূল ফিনান্সিয়াল ব্যালেন্স বা সিস্টেম ডাটাবেজ উন্মুক্ত না করেই টিম পরিচালনা করা যায়।
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'আরিফ হোসেন (Arif Hossain)', role: 'ইনভেন্টরি মডারেটর (Inventory Moderator)', email: 'arif@paikarmart.com', status: 'সক্রিয়' },
                  { name: 'তানিয়া আক্তার (Tania Akter)', role: 'অর্ডার ও ডেলিভারি ডিসপুট অফিসার', email: 'tania@paikarmart.com', status: 'সক্রিয়' },
                  { name: 'ফারহান মাহমুদ (Farhan Mahmud)', role: 'সোশ্যাল কনটেন্ট ও বিড কমপ্লায়েন্স অফিসার', email: 'farhan@paikarmart.com', status: 'সক্রিয়' },
                ].map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                        {mod.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-[var(--pm-text)]">{mod.name}</p>
                        <p className="text-[11px] text-[var(--pm-text-muted)]">{mod.role} · {mod.email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      {mod.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* 8. SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <ShieldCheck className="w-6 h-6 text-cyan-400 mb-2" />
                  <p className="text-xs font-bold text-[var(--pm-text)]">ক্লাউড সিকিউরিটি ও আরবিক গার্ড</p>
                  <p className="text-[11px] text-[var(--pm-text-muted)] mt-0.5">Firebase Token Verification & JWT RBAC সক্রিয়</p>
                </div>
                <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
                  <Lock className="w-6 h-6 text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-[var(--pm-text)]">এন্ড-টু-এন্ড এনক্রিপশন</p>
                  <p className="text-[11px] text-[var(--pm-text-muted)] mt-0.5">SSL / TLS 1.3 ও সিকিউর সল্ট হ্যাশিং এনফোর্সড</p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3">
                <h3 className="font-bold text-xs text-[var(--pm-text)]">সাম্প্রতিক অথেনটিকেশন ও অ্যাক্সেস লগস</h3>
                <div className="space-y-2">
                  {[
                    { event: 'সুপার অ্যাডমিন সেশন ভেরিফাইড', ip: '103.42.xxx.xxx', time: 'এইমাত্র', ok: true },
                    { event: 'ভেন্ডর পিন রিকোয়েস্ট (Nagad Payout)', ip: '118.179.xxx.xxx', time: '৪৫ মিনিট পূর্বে', ok: true },
                    { event: 'অননুমোদিত রুট রিকোয়েস্ট ব্লকড (/api/v1/admin/secret)', ip: '45.134.xxx.xxx', time: '২ ঘণ্টা পূর্বে', ok: false }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--pm-surface-hover)] text-xs">
                      <div className="flex items-center gap-2.5">
                        {log.ok ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        <span className="text-[var(--pm-text)]">{log.event}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">{log.ip} · {log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};

export default AdminDashboard;
