import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck, Package, ShoppingCart, Users, Plus,
  Search, CheckCircle2, Clock, AlertCircle, Trash2,
  Edit3, RefreshCw, ChevronRight, Lock, Phone,
  MapPin, DollarSign, Eye, X, ArrowLeft, Send, UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAuth } from '@/modules/auth';
import { pkShopApi } from '../services/pkShopApi';
import { PKShopProduct, PKShopOrder, PKShopTeamMember, PKShopStats } from '../types';

export const PKShopAdminView: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Role Gate Evaluation
  const isSuperAdmin = useMemo(() => {
    if (!isAuthenticated || !user) return false;
    const role = String(user.role || '').toLowerCase();
    const email = user.email?.toLowerCase();
    return role === 'admin' || role === 'super_admin' || email === 'abs.munna1@gmail.com';
  }, [isAuthenticated, user]);

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'team'>('products');
  const [stats, setStats] = useState<PKShopStats | null>(null);
  const [products, setProducts] = useState<PKShopProduct[]>([]);
  const [orders, setOrders] = useState<PKShopOrder[]>([]);
  const [team, setTeam] = useState<PKShopTeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Product Form State (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<PKShopProduct> | null>(null);

  // Team Invite Form State
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePhone, setInvitePhone] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState<'STORE_MANAGER' | 'MODERATOR'>('STORE_MANAGER');

  // Order Filter
  const [orderFilter, setOrderFilter] = useState('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, productsData, ordersData, teamData] = await Promise.all([
        pkShopApi.getAdminStats().catch(() => null),
        pkShopApi.getProducts().catch(() => []),
        pkShopApi.getOrders().catch(() => []),
        pkShopApi.getTeamMembers().catch(() => [])
      ]);

      if (statsData) setStats(statsData);
      setProducts(productsData);
      setOrders(ordersData);
      setTeam(teamData);
    } catch (err) {
      console.warn('Admin load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ─── SECURITY ACCESS GUARD ───
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--pm-bg)] flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full p-8 rounded-[36px] bg-[var(--pm-surface)] border border-white/10 space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">প্রবেশাধিকার প্রয়োজন</h2>
            <p className="text-xs text-zinc-400">
              পিকে শপ ম্যানেজমেন্ট ককপিটে প্রবেশ করতে অনুগ্রহ করে অনুমোদিত অ্যাকাউন্টে লগইন করুন।
            </p>
          </div>
          <Link
            to="/auth/login"
            className="inline-flex w-full py-3.5 bg-[var(--pm-accent)] hover:opacity-90 text-white font-black text-xs rounded-2xl items-center justify-center gap-2 shadow-lg"
          >
            লগইন পেজে যান <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || editingProduct?.price === undefined || editingProduct?.stock === undefined) {
      return toast.error('দয়া করে শিরোনাম, মূল্য এবং স্টক পূরণ করুন');
    }

    try {
      await pkShopApi.saveProduct(editingProduct);
      toast.success(editingProduct.id ? 'পণ্য আপডেট সফল হয়েছে!' : 'নতুন ফ্ল্যাগশিপ পণ্য যুক্ত হয়েছে!');
      setIsProductModalOpen(false);
      setEditingProduct(null);
      loadData();
    } catch (err: any) {
      toast.error('পণ্য সেভ করতে ব্যর্থ: ' + (err.response?.data?.error || err.message));
    }
  };

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('আপনি কি নিশ্চিত যে এই পণ্যটি মুছে ফেলতে চান?')) return;
    try {
      await pkShopApi.deleteProduct(id);
      toast.success('পণ্যটি সফলভাবে মুছে ফেলা হয়েছে');
      loadData();
    } catch (err: any) {
      toast.error('মুছে ফেলতে ব্যর্থ');
    }
  };

  // Handle Order Status Change
  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await pkShopApi.updateOrderStatus(orderId, newStatus);
      toast.success(`অর্ডার স্ট্যাটাস ${newStatus} এ আপডেট হয়েছে!`);
      loadData();
    } catch (err: any) {
      toast.error('স্ট্যাটাস আপডেট ব্যর্থ');
    }
  };

  // Handle Team Member Invite (Super Admin Only)
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail && !invitePhone) {
      return toast.error('ইমেইল অথবা ফোন নম্বর দিন');
    }

    try {
      await pkShopApi.addTeamMember({
        email: inviteEmail,
        phone: invitePhone,
        name: inviteName || (inviteEmail ? inviteEmail.split('@')[0] : 'Staff'),
        role: inviteRole,
        permissions: inviteRole === 'STORE_MANAGER'
          ? ["products:write", "orders:write", "inventory:write"]
          : ["orders:write", "inventory:read"]
      });
      toast.success(`নতুন ${inviteRole} সফলভাবে যোগ করা হয়েছে!`);
      setInviteEmail('');
      setInvitePhone('');
      setInviteName('');
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'যোগ করতে ব্যর্থ');
    }
  };

  // Handle Team Member Revocation
  const handleRemoveTeamMember = async (id: string) => {
    if (!confirm('আপনি কি এই স্টাফের অ্যাক্সেস বাতিল করতে চান?')) return;
    try {
      await pkShopApi.removeTeamMember(id);
      toast.success('স্টাফ অ্যাক্সেস বাতিল করা হয়েছে');
      loadData();
    } catch (err: any) {
      toast.error('বাতিল করতে ব্যর্থ');
    }
  };

  // Filtered Orders
  const displayedOrders = useMemo(() => {
    if (orderFilter === 'all') return orders;
    return orders.filter(o => o.status.toLowerCase() === orderFilter.toLowerCase());
  }, [orders, orderFilter]);

  return (
    <div className="w-full pb-28 space-y-6 bg-[var(--pm-bg)] min-h-screen text-[var(--pm-text)] select-none">

      {/* ─── TOP HEADER ─── */}
      <div className="border-b border-[var(--pm-border)] bg-[var(--pm-surface)]/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/pk-shop"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              title="ফ্ল্যাগশিপ স্টোরে ফিরে যান"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-white">PK Shop ম্যানেজমেন্ট ককপিট</h1>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase">
                  {isSuperAdmin ? 'Super Admin' : 'Staff Manager'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-bold">
                অফিশিয়াল ফ্ল্যাগশিপ ক্যাটালগ, ইনভেন্টরি ও অর্ডার প্রসেসিং হাব
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <Link
              to="/pk-shop"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-black border border-white/10"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>লাইভ স্টোর দেখুন</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ─── KPI METRICS SUMMARY ROW ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">মোট ফ্ল্যাগশিপ বিক্রি</span>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              ৳{(stats?.totalSales || 8150).toLocaleString('bn-BD')}
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">সরাসরি এসক্রো সুরক্ষিত</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">মোট অর্ডার সংখ্যা</span>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {orders.length}
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">পেন্ডিং: {orders.filter(o => o.status === 'pending').length}টি</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">সক্রিয় ইনভেন্টরি</span>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {products.reduce((s, p) => s + p.stock, 0)} ইউনিট
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">{products.length}টি লাইভ প্রোডাক্ট</span>
          </div>

          <div className="p-4 sm:p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] shadow-sm space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">স্টাফ টিম মেম্বার</span>
            <p className="text-xl sm:text-2xl font-black text-white tabular-nums">
              {team.length}
            </p>
            <span className="text-[10px] text-zinc-400 font-medium">অনুমোদিত ম্যানেজার/মডারেটর</span>
          </div>
        </div>

        {/* ─── TAB NAVIGATION BAR ─── */}
        <div className="flex items-center gap-2 border-b border-[var(--pm-border)] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'products'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>প্রোডাক্ট ম্যানেজমেন্ট ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>অর্ডার প্রসেসিং বোর্ড ({orders.length})</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('team')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>টিম গভর্ন্যান্স ({team.length})</span>
            </button>
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: PRODUCT UPLOAD & MANAGEMENT ENGINE                          */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">পিকে শপ অফিশিয়াল প্রোডাক্ট তালিকা</h3>
                <p className="text-xs text-zinc-400">নতুন পণ্য যুক্ত করুন বা বিদ্যমান পণ্যের স্টক ও মূল্য পরিবর্তন করুন।</p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct({
                    title: '',
                    sku: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
                    price: 2500,
                    stock: 50,
                    category: 'Luxury Fashion',
                    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'],
                    coinCashbackPercent: 8,
                    shippingOption: 'Standard Express (24-48h)',
                    status: 'ACTIVE'
                  });
                  setIsProductModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ফ্ল্যাগশিপ প্রোডাক্ট যুক্ত করুন</span>
              </button>
            </div>

            {/* Products Table/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="bg-[var(--pm-surface)] rounded-3xl p-4 border border-[var(--pm-border)] flex flex-col justify-between space-y-4 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex gap-3">
                    <img
                      src={p.images[0] || 'https://via.placeholder.com/150'}
                      alt={p.title}
                      className="w-20 h-20 rounded-2xl object-cover bg-black/40 shrink-0 border border-white/5"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] font-black uppercase text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                          {p.sku}
                        </span>
                        <span className="text-[9px] font-bold text-zinc-400">{p.category}</span>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-tight">
                        {p.title}
                      </h4>

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-black text-amber-400 tabular-nums">
                          ৳{p.price.toLocaleString('bn-BD')}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          p.stock > 10 ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                        }`}>
                          স্টক: {p.stock}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-zinc-500 font-bold">
                      ক্যাশব্যাক: +{p.coinCashbackPercent}% Coins
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(p);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                        title="এডিট করুন"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: ORDER PROCESSING PIPELINE BOARD                             */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">অর্ডার প্রসেসিং ও ডেলিভারি বোর্ড</h3>
                <p className="text-xs text-zinc-400">লাইভ পাইপলাইন: পেন্ডিং অর্ডার অনুমোদন করুন এবং ট্র্যাকিং স্ট্যাটাস আপডেট করুন।</p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase transition-all border cursor-pointer ${
                      orderFilter === st
                        ? 'bg-amber-500 text-black border-amber-400 shadow-sm'
                        : 'bg-white/5 text-zinc-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {displayedOrders.length === 0 ? (
                <div className="p-12 text-center bg-[var(--pm-surface)] rounded-3xl border border-dashed border-[var(--pm-border)] space-y-2">
                  <ShoppingCart className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-sm font-bold text-white">কোনো অর্ডার পাওয়া যায়নি</p>
                </div>
              ) : (
                displayedOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-white">{order.orderNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                            order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            order.status === 'shipped' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' :
                            order.status === 'processing' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                            order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-medium">
                          তারিখ: {new Date(order.createdAt).toLocaleString('bn-BD')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-white/5 text-zinc-300 border border-white/10">
                          পেমেন্ট: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                        </span>
                        <span className="text-sm font-black text-amber-400 tabular-nums">
                          ৳{order.totalAmount.toLocaleString('bn-BD')}
                        </span>
                      </div>
                    </div>

                    {/* Buyer Information & Ordered Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1.5 p-3 rounded-2xl bg-black/30 border border-white/5">
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">ক্রেতার তথ্য ও ডেলিভারি ঠিকানা</span>
                        <p className="font-bold text-white flex items-center gap-1.5">
                          <span>{order.buyerName}</span>
                          <span className="text-zinc-500">•</span>
                          <span className="text-zinc-400 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-emerald-400" /> {order.buyerPhone}
                          </span>
                        </p>
                        <p className="text-[11px] text-zinc-300 flex items-start gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{order.deliveryAddress}</span>
                        </p>
                      </div>

                      <div className="space-y-2 p-3 rounded-2xl bg-black/30 border border-white/5">
                        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider">অর্ডারকৃত আইটেম</span>
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover bg-black" />
                              <span className="font-medium text-white line-clamp-1">{item.title}</span>
                            </div>
                            <span className="font-bold text-zinc-400">
                              {item.quantity}x ৳{item.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status Update Quick Action Buttons */}
                    <div className="pt-2 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-zinc-500 mr-1">স্ট্যাটাস পরিবর্তন:</span>

                      {order.status !== 'processing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                          className="px-3 py-1.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 transition-all cursor-pointer"
                        >
                          Mark Processing
                        </button>
                      )}

                      {order.status !== 'shipped' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[10px] font-bold border border-cyan-500/30 transition-all cursor-pointer"
                        >
                          Mark Shipped
                        </button>
                      )}

                      {order.status !== 'delivered' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 transition-all cursor-pointer"
                        >
                          Confirm Delivered
                        </button>
                      )}

                      {order.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 text-[10px] font-bold border border-rose-500/30 transition-all cursor-pointer ml-auto"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: TEAM & ACCESS GOVERNANCE (SUPER ADMIN ONLY)                */}
        {/* ════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'team' && isSuperAdmin && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Form to Invite / Assign Staff */}
              <div className="p-6 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4 lg:col-span-1 shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-amber-400" />
                    <span>নতুন টিম মেম্বার নিয়োগ</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    ইমেইল বা ফোন দিয়ে স্টোর ম্যানেজার বা মডারেটর হিসেবে অনুমোদন দিন।
                  </p>
                </div>

                <form onSubmit={handleAddTeamMember} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ইমেইল এড্রেস</label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="manager@paikarmart.com"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ফোন নম্বর (ঐচ্ছিক)</label>
                    <input
                      type="text"
                      value={invitePhone}
                      onChange={(e) => setInvitePhone(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">পূর্ণ নাম</label>
                    <input
                      type="text"
                      value={inviteName}
                      onChange={(e) => setInviteName(e.target.value)}
                      placeholder="স্টাফের নাম"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">নির্ধারিত ভূমিকা (Role)</label>
                    <select
                      value={inviteRole}
                      onChange={(e) => setInviteRole(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                    >
                      <option value="STORE_MANAGER" className="bg-[#12141f]">STORE_MANAGER (পণ্য ও অর্ডার পূর্ণ অ্যাক্সেস)</option>
                      <option value="MODERATOR" className="bg-[#12141f]">MODERATOR (অর্ডার ট্র্যাকিং ও ইনভেন্টরি ভিউ)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                  >
                    টিম মেম্বার অনুমোদন করুন
                  </button>
                </form>
              </div>

              {/* Existing Staff Roster List */}
              <div className="p-6 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4 lg:col-span-2 shadow-sm">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>অনুমোদিত পিকে শপ স্টাফ টিম</span>
                  </h4>
                  <p className="text-[11px] text-zinc-400">
                    এই ব্যবহারকারীরা পিকে শপের পণ্য ও অর্ডার ম্যানেজ করার অনুমতি রাখেন।
                  </p>
                </div>

                <div className="space-y-3">
                  {team.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white">{member.name}</span>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[9px] font-black">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 truncate">
                          {member.email} {member.phone && `• ${member.phone}`}
                        </p>
                        <p className="text-[9px] text-zinc-500 font-mono">
                          অনুমতি: {member.permissions.join(', ')}
                        </p>
                      </div>

                      {member.email !== 'abs.munna1@gmail.com' && (
                        <button
                          onClick={() => handleRemoveTeamMember(member.id)}
                          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          title="অ্যাক্সেস প্রত্যাহার করুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── MODAL: PRODUCT UPLOAD / EDIT ─── */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-[32px] p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-black text-white">
                  {editingProduct?.id ? 'প্রোডাক্ট এডিট করুন' : 'নতুন ফ্ল্যাগশিপ প্রোডাক্ট যুক্ত করুন'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">পণ্যের নাম (Title) *</label>
                    <input
                      type="text"
                      required
                      value={editingProduct?.title || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      placeholder="উদাঃ রয়্যাল সিল্ক পাঞ্জাবি"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">SKU কোড</label>
                    <input
                      type="text"
                      value={editingProduct?.sku || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      placeholder="PK-SKU-1001"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ক্যাটাগরি</label>
                    <select
                      value={editingProduct?.category || 'Luxury Fashion'}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Luxury Fashion" className="bg-[#12141f]">Luxury Fashion</option>
                      <option value="Premium Electronics" className="bg-[#12141f]">Premium Electronics</option>
                      <option value="Curated Organics" className="bg-[#12141f]">Curated Organics</option>
                      <option value="Exclusive Catalog" className="bg-[#12141f]">Exclusive Catalog</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">বিক্রয় মূল্য (৳) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct?.price || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      placeholder="4500"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">পূর্বের মূল্য / ডিসকাউন্ট (৳)</label>
                    <input
                      type="number"
                      value={editingProduct?.originalPrice || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                      placeholder="5800"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ইনভেন্টরি স্টক সংখ্যা *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct?.stock || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      placeholder="30"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">পিকে কয়েন ক্যাশব্যাক (%)</label>
                    <input
                      type="number"
                      value={editingProduct?.coinCashbackPercent || 5}
                      onChange={(e) => setEditingProduct({ ...editingProduct, coinCashbackPercent: Number(e.target.value) })}
                      placeholder="8"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">ইমেজ URL</label>
                    <input
                      type="url"
                      value={editingProduct?.images?.[0] || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">শিপিং বিকল্প</label>
                    <input
                      type="text"
                      value={editingProduct?.shippingOption || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shippingOption: e.target.value })}
                      placeholder="Same-Day Express / Next-Day Delivery"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-bold text-zinc-400 mb-1">বিবরণ (Description)</label>
                    <textarea
                      rows={3}
                      value={editingProduct?.description || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                      placeholder="পণ্যটির বিশেষ বৈশিষ্ট্য এবং মেটেরিয়াল বিবরণ লিখুন..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-md shadow-amber-500/20 active:scale-95"
                  >
                    {editingProduct?.id ? 'আপডেট সম্পন্ন করুন' : 'পণ্য প্রকাশ করুন'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PKShopAdminView;
