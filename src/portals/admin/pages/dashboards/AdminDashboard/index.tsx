import React, { useState } from 'react';
import { ShieldCheck, Users, Activity, Lock, Search, Plus, Bot, KeyRound, AlertTriangle, CheckCircle2, Package, Trash2, FileCheck, XCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProductDataStore } from '@/modules/product/store/useProductDataStore';
import { useKycStore } from '@/modules/admin/useKycStore';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'delegation' | 'inventory' | 'security' | 'ai' | 'kyc'>('overview');
  const [showAiChat, setShowAiChat] = useState(false);
  const { products, addProduct, removeProduct } = useProductDataStore();
  const { submissions, updateStatus } = useKycStore();

  const pkStoreProducts = products.filter(p => p.portal === 'pk-store');

  return (
    <div className="flex flex-col min-h-full bg-[var(--pm-bg)] relative pb-20 lg:pb-6">
      
      {/* Header */}
      <header className="p-6 pb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[var(--pm-text)] tracking-tight">Super Admin Panel</h1>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">Complete Access, KYC Verification & PK Store Ownership</p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-6 py-4 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 min-w-max">
          {[
            { id: 'overview', icon: Activity, label: 'Overview' },
            { id: 'kyc', icon: FileCheck, label: `KYC Queue (${submissions.filter(s => s.status === 'pending').length})` },
            { id: 'delegation', icon: Users, label: 'Delegation' },
            { id: 'inventory', icon: Package, label: 'Inventory' },
            { id: 'security', icon: Lock, label: 'Security' },
            { id: 'ai', icon: Bot, label: 'AI Analytics' },
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

      {/* Main Content Area */}
      <div className="flex-1 px-6 space-y-6">
        
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Total Revenue', value: '৳ 2.4M', trend: '+14%' },
                  { label: 'Active Sellers', value: '1,204', trend: '+5%' },
                  { label: 'PK Store Sales', value: '840', trend: '+22%' },
                  { label: 'Security Threats', value: '0', trend: 'Safe', color: 'text-cyan-500' }
                ].map((stat, i) => (
                  <div key={i} className="glass p-4 rounded-2xl border border-[var(--pm-border)]/50">
                    <p className="text-[10px] uppercase font-bold text-[var(--pm-text-muted)] mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-[var(--pm-text)]">{stat.value}</p>
                    <p className={`text-xs font-bold mt-2 ${stat.color || 'text-[var(--pm-accent)]'}`}>{stat.trend}</p>
                  </div>
                ))}
              </div>

              <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50">
                <h3 className="font-bold text-[var(--pm-text)] mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--pm-accent)]" /> System Health
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--pm-text-muted)]">Database Status</span>
                    <span className="text-cyan-500 font-bold flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Optimal</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--pm-text-muted)]">API Latency</span>
                    <span className="text-[var(--pm-text)] font-bold">42ms</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* KYC VERIFICATION QUEUE TAB */}
          {activeTab === 'kyc' && (
            <motion.div key="kyc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50 border-l-4 border-l-[var(--pm-accent)] relative overflow-hidden">
                <h2 className="font-black text-lg text-[var(--pm-text)] mb-1 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[var(--pm-accent)]" /> Vendor & Merchant KYC Queue
                </h2>
                <p className="text-sm text-[var(--pm-text-muted)]">
                  Inspect and verify vendor trade licenses, NID documents, and business credentials. Approving instantly grants verified trust badges and unlocks merchant payout capabilities.
                </p>
              </div>

              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="text-center py-12 glass rounded-3xl border border-[var(--pm-border)]/50">
                    <p className="text-sm text-[var(--pm-text-muted)] font-bold">No KYC submissions in queue.</p>
                  </div>
                ) : (
                  submissions.map((item) => (
                    <div key={item.id} className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50 space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] flex items-center justify-center font-black text-lg">
                            {item.vendorName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-black text-[var(--pm-text)]">{item.storeName}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                item.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30' :
                                item.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/30' :
                                'bg-amber-500/10 text-amber-500 border border-amber-500/30'
                              }`}>
                                {item.status.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--pm-text-muted)] mt-0.5">
                              Owner: <strong className="text-[var(--pm-text)]">{item.vendorName}</strong> ({item.phone}) • Role: {item.role}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          {item.status === 'pending' ? (
                            <>
                              <button 
                                onClick={() => updateStatus(item.id, 'verified', 5)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Approve & Grant Badge
                              </button>
                              <button 
                                onClick={() => updateStatus(item.id, 'rejected')}
                                className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-[var(--pm-text-muted)] flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" /> Reviewed • Trust Level: {item.trustLevel}★
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[var(--pm-border)]/50 text-xs">
                        <div>
                          <span className="text-[var(--pm-text-muted)] block text-[10px] uppercase font-bold">Trade License</span>
                          <span className="font-mono font-bold text-[var(--pm-text)]">{item.tradeLicenseNo}</span>
                        </div>
                        <div>
                          <span className="text-[var(--pm-text-muted)] block text-[10px] uppercase font-bold">NID Number</span>
                          <span className="font-mono font-bold text-[var(--pm-text)]">{item.nidNumber}</span>
                        </div>
                        <div>
                          <span className="text-[var(--pm-text-muted)] block text-[10px] uppercase font-bold">Submitted At</span>
                          <span className="font-medium text-[var(--pm-text)]">{item.submittedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* DELEGATION TAB */}
          {activeTab === 'delegation' && (
            <motion.div key="delegation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50 border-l-4 border-l-indigo-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <KeyRound className="w-24 h-24" />
                </div>
                <h2 className="font-black text-lg text-[var(--pm-text)] mb-2">PK Store Ownership</h2>
                <p className="text-sm text-[var(--pm-text-muted)] max-w-[80%]">
                  PaikarMart Super Admin has full ownership of the PK Store. You can safely delegate "Moderator" access to staff to manage inventory without exposing core financials.
                </p>
              </div>

              <div className="flex justify-between items-center">
                <h3 className="font-bold text-[var(--pm-text)]">Assigned Moderators</h3>
                <button className="flex items-center gap-1 px-3 py-1.5 bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] rounded-lg text-xs font-bold hover:bg-[var(--pm-accent)]/20 transition-colors">
                  <Plus className="w-3 h-3" /> Add Moderator
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Arif Hossain', role: 'Inventory Moderator', email: 'arif@paikarmart.com', status: 'Active' },
                  { name: 'Tania Akter', role: 'Order Fulfillment', email: 'tania@paikarmart.com', status: 'Active' },
                ].map((mod, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 glass rounded-2xl border border-[var(--pm-border)]/50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-500 flex items-center justify-center font-bold">
                        {mod.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[var(--pm-text)]">{mod.name}</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">{mod.role} • {mod.email}</p>
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-red-500/30 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/10 transition-colors">
                      Revoke
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Add Product Form */}
              <div className="glass p-5 rounded-3xl border border-[var(--pm-border)]/50">
                <h3 className="font-bold text-[var(--pm-text)] mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[var(--pm-accent)]" /> Add New PK Store Product
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
                  <input name="name" required placeholder="Product Name" className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="price" type="number" required placeholder="Price (৳)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                    <input name="originalPrice" type="number" required placeholder="Original Price (৳)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input name="cashback" type="number" required placeholder="PK Coin Cashback" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                    <input name="tag" required placeholder="Tag (e.g. Pure, Exclusive)" className="bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                  </div>
                  <input name="image" required placeholder="Image URL (https://...)" className="w-full bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none" />
                  
                  <button type="submit" className="w-full py-3 bg-[var(--pm-accent)] text-white font-bold rounded-xl active:scale-95 transition-all shadow-lg shadow-[var(--pm-accent)]/20">
                    Publish Product
                  </button>
                </form>
              </div>

              {/* Product List */}
              <div className="space-y-3">
                <h3 className="font-bold text-[var(--pm-text)] flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--pm-accent)]" /> Current Inventory ({pkStoreProducts.length})
                </h3>
                {pkStoreProducts.map(product => (
                  <div key={product.id} className="flex gap-3 p-3 glass rounded-2xl border border-[var(--pm-border)]/50 relative group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/10 shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">{product.name}</h4>
                      <p className="text-xs text-[var(--pm-accent)] font-black mt-1">৳ {product.price}</p>
                    </div>
                    <button 
                      onClick={() => removeProduct(product.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
                  <ShieldCheck className="w-6 h-6 text-cyan-500 mb-2" />
                  <p className="text-xs font-bold text-[var(--pm-text)]">DDoS Protection</p>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">Active & Blocking</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5">
                  <Lock className="w-6 h-6 text-cyan-500 mb-2" />
                  <p className="text-xs font-bold text-[var(--pm-text)]">End-to-End Encrypted</p>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">AES-256 Enabled</p>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[var(--pm-text)] mb-4">Recent Access Logs</h3>
                <div className="space-y-2">
                  {[
                    { event: 'Admin Login', ip: '192.168.1.1', time: 'Just now', type: 'success' },
                    { event: 'Failed Login Attempt', ip: '103.45.xx.xx', time: '2 hours ago', type: 'danger' },
                    { event: 'Moderator Access Granted', ip: 'System', time: 'Yesterday', type: 'info' }
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-3 glass rounded-xl border border-[var(--pm-border)]/50 text-xs">
                      <div className="flex items-center gap-3">
                        {log.type === 'danger' ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <ShieldCheck className="w-4 h-4 text-cyan-500" />}
                        <div>
                          <p className={`font-bold ${log.type === 'danger' ? 'text-red-500' : 'text-[var(--pm-text)]'}`}>{log.event}</p>
                          <p className="text-[10px] text-[var(--pm-text-muted)]">IP: {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[var(--pm-text-muted)]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* AI ANALYTICS TAB */}
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="h-full min-h-[400px] flex flex-col">
              <div className="flex-1 glass rounded-t-3xl border border-[var(--pm-border)]/50 p-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center relative">
                  <Bot className="w-10 h-10 text-indigo-500" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-cyan-500 rounded-full border-2 border-[var(--pm-surface)] animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[var(--pm-text)]">PaikarMart AI Shield</h2>
                  <p className="text-sm text-[var(--pm-text-muted)] max-w-[250px] mt-2">
                    I am actively monitoring the store for fraud, predicting sales trends, and auditing logs.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-white/5 border border-[var(--pm-border)] rounded-full text-[10px] font-bold text-[var(--pm-text)]">Analyze Sales</span>
                  <span className="px-3 py-1 bg-white/5 border border-[var(--pm-border)] rounded-full text-[10px] font-bold text-[var(--pm-text)]">Check Anomalies</span>
                  <span className="px-3 py-1 bg-white/5 border border-[var(--pm-border)] rounded-full text-[10px] font-bold text-[var(--pm-text)]">Generate Report</span>
                </div>
              </div>
              <div className="p-4 glass rounded-b-3xl border border-t-0 border-[var(--pm-border)]/50 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask AI Assistant to analyze store data..." 
                  className="flex-1 bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] rounded-xl px-4 py-2 text-sm text-[var(--pm-text)] outline-none"
                />
                <button className="px-4 py-2 bg-[var(--pm-accent)] text-white rounded-xl text-sm font-bold shadow-lg shadow-[var(--pm-accent)]/20 active:scale-95">
                  Ask
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
