import React, { useEffect, useState, useMemo } from 'react';
import { useSellerDashboardStore } from '@/modules/seller/sellerDashboardStore';
import { RevenueAnalyticsChart } from '../components/RevenueAnalyticsChart';
import { SellerOrderPanel } from '../components/SellerOrderPanel';
import { SellerProductGrid } from '../components/SellerProductGrid';
import { InventoryManager } from '../components/InventoryManager';
import { SellerAIInsightsPanel } from '../components/SellerAIInsightsPanel';
import { useSellerContext as useSeller } from '@/modules/seller/SellerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Store, ShieldAlert, CheckCircle2, Save } from 'lucide-react';
import { RoleUploadModal } from '@/components/upload/RoleUploadModal';
import { Link } from 'react-router-dom';

export default function SellerDashboard() {
  const { isSeller, profile, products, orders, loading: isLoading, updateProfile } = useSeller();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Store Settings Form State
  const [shopName, setShopName] = useState(profile?.shopName || '');
  const [tagline, setTagline] = useState(profile?.tagline || '');
  const [location, setLocation] = useState(profile?.location || '');
  const [contactPhone, setContactPhone] = useState(profile?.contactPhone || '');
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setShopName(profile.shopName || '');
      setTagline(profile.tagline || '');
      setLocation(profile.location || '');
      setContactPhone(profile.contactPhone || '');
    }
  }, [profile]);

  // Calculate real KPIs from data synchronously
  const kpis = useMemo(() => {
    const totalSales = orders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const stockAlerts = products.filter(p => p.stock !== undefined && p.stock < 5).length;
    return {
      totalSales,
      totalOrders: orders.length,
      conversionRate: 4.2,
      pendingOrders,
      refundRate: 1.2,
      stockAlerts
    };
  }, [orders, products]);

  // Use local state for insights to avoid Zustand store loop issues
  const [insights] = useState([
    { id: 'i1', type: 'trending', message: 'Optimize your listings with more details to boost sales.', ctaLabel: 'Add Products', ctaAction: 'products' },
  ]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        shopName,
        tagline,
        location,
        contactPhone
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to update store settings", err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white">Loading dashboard...</div>;
  }

  // Conditional Rendering based on Role
  if (!isSeller) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="w-20 h-20 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Seller Role Required</h1>
          <p className="text-zinc-400 text-sm max-w-md mx-auto">
            You need to activate your Retail Seller or Wholesale role to access Seller Central inventory management, analytics, and store tools.
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/profile"
            className="w-full sm:w-auto bg-[#FF7A00] hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FF7A00]/20 flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" /> Go to Profile & Activate Role
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Dashboard Overview</h1>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Welcome back, {profile?.shopName || 'Merchant'}.</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-[#FF7A00] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors shadow-lg shadow-[#FF7A00]/20"
        >
          <Plus className="w-4 h-4" /> Upload Product
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueAnalyticsChart kpis={kpis} />
        </div>
        <div className="lg:col-span-1">
          <SellerAIInsightsPanel insights={insights} />
        </div>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-zinc-900 border border-white/5 mb-4 flex-wrap h-auto p-1 gap-1">
          <TabsTrigger value="orders" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl">Recent Orders</TabsTrigger>
          <TabsTrigger value="products" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl">Products</TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl">Inventory</TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-[#FF7A00] data-[state=active]:text-white text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl">Store Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <SellerOrderPanel orders={orders} />
        </TabsContent>
        <TabsContent value="products">
          <SellerProductGrid products={products} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryManager products={products} />
        </TabsContent>
        <TabsContent value="settings">
          <div className="bg-[#141624] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <h2 className="text-lg font-bold text-white">Store Profile & Details</h2>
              <p className="text-xs text-zinc-400 mt-0.5">Manage your public storefront information visible to buyers on PaikarMart.</p>
            </div>

            {saveSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Store settings successfully updated!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-2xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Shop Name / Business Title</label>
                <input 
                  type="text" 
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full bg-[#1e2136] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                  placeholder="e.g. Dhaka Traders & Co."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Store Tagline / Slogan</label>
                <input 
                  type="text" 
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full bg-[#1e2136] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                  placeholder="e.g. Wholesale & Retail Quality Assured"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Business Location / City</label>
                  <input 
                    type="text" 
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full bg-[#1e2136] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="e.g. Uttara, Dhaka"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">Contact Phone Number</label>
                  <input 
                    type="text" 
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full bg-[#1e2136] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF7A00]"
                    placeholder="e.g. +8801700000000"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="bg-[#FF7A00] hover:bg-orange-600 text-white font-bold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#FF7A00]/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSavingSettings ? 'Saving Changes...' : 'Save Store Details'}
                </button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
      
      <RoleUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        defaultRole="product" 
        onSuccess={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
