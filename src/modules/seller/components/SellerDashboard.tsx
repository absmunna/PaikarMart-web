import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { SellerLayout } from './SellerLayout';
import { useSellerDashboardStore } from '../sellerDashboardStore';
import { RevenueAnalyticsChart } from './RevenueAnalyticsChart';
import { SellerOrderPanel } from './SellerOrderPanel';
import { SellerProductGrid } from './SellerProductGrid';
import { InventoryManager } from './InventoryManager';
import { SellerAIInsightsPanel } from './SellerAIInsightsPanel';
import { useSeller } from '../SellerContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const SellerDashboard: React.FC = () => {
  const { isSeller, profile } = useSeller();
  const { kpis, products, orders, insights, setProducts, setOrders, setKPIs, setInsights, updateOrder } = useSellerDashboardStore();

  useEffect(() => {
    // Populate mock data if empty
    if (products.length === 0) {
      setKPIs({
        totalSales: 154500,
        totalOrders: 342,
        conversionRate: 4.2,
        pendingOrders: 15,
        refundRate: 1.2,
        stockAlerts: 3
      });

      setProducts([
        { id: 'p1', title: 'Premium Organic Honey 500g', price: 850, image: 'https://images.unsplash.com/photo-1587049352847-4d4b126a51d8?auto=format&fit=crop&q=80&w=200', stock: 45, views: 1200, sales: 85, conversion: 7.1, isBoosted: true, status: 'active' },
        { id: 'p2', title: 'Aarong Dairy Butter 200g', price: 220, image: 'https://images.unsplash.com/photo-1589132204642-1e96a40a5a41?auto=format&fit=crop&q=80&w=200', stock: 12, views: 450, sales: 42, conversion: 9.3, isBoosted: false, status: 'active' },
        { id: 'p3', title: 'Sundarban Pure Ghee 1kg', price: 1450, image: 'https://images.unsplash.com/photo-1628189851610-d09f7a77e923?auto=format&fit=crop&q=80&w=200', stock: 0, views: 890, sales: 120, conversion: 13.4, isBoosted: false, status: 'out_of_stock' }
      ]);

      setOrders([
        { id: 'ORD-9912', buyerName: 'Rahim Uddin', amount: 1700, status: 'new', createdAt: new Date().toISOString(), itemCount: 2 },
        { id: 'ORD-9911', buyerName: 'Karim Store', amount: 8500, status: 'processing', createdAt: new Date(Date.now() - 86400000).toISOString(), itemCount: 10 },
        { id: 'ORD-9910', buyerName: 'Nusrat Jahan', amount: 220, status: 'shipped', createdAt: new Date(Date.now() - 172800000).toISOString(), itemCount: 1 },
      ]);

      setInsights([
        { id: 'i1', type: 'trending', message: 'Organic Honey is trending in your area. Consider boosting it to increase visibility.', ctaLabel: 'Boost Now', ctaAction: 'boost' },
        { id: 'i2', type: 'price_demand', message: 'Ghee prices have increased locally. Updating your price might improve margins.', ctaLabel: 'Update Price', ctaAction: 'price' }
      ]);
    }
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current tab from pathname, defaulting to overview
  const currentPath = location.pathname;
  let activeTab = 'overview';
  if (currentPath.includes('/orders')) activeTab = 'orders';
  if (currentPath.includes('/products')) activeTab = 'products';
  if (currentPath.includes('/analytics')) activeTab = 'analytics';

  const handleTabChange = (value: string) => {
    if (value === 'overview') navigate('/seller');
    else navigate(`/seller/${value}`);
  };

  const handleAccept = (id: string) => updateOrder(id, 'processing');
  const handleShip = (id: string) => updateOrder(id, 'shipped');

  if (!isSeller) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-white text-sm font-medium">
        Loading Seller Central or User is not a verified seller...
      </div>
    );
  }

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-400">Welcome back to {profile?.shopName}. Here's what's happening today.</p>
        </div>

                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="bg-[var(--pm-card)] border border-[var(--pm-border)] mb-4 p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--pm-accent)]/20 data-[state=active]:text-[var(--pm-accent)] text-xs">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-[var(--pm-accent)]/20 data-[state=active]:text-[var(--pm-accent)] text-xs">Recent Orders</TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[var(--pm-accent)]/20 data-[state=active]:text-[var(--pm-accent)] text-xs">Products & Inventory</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[var(--pm-accent)]/20 data-[state=active]:text-[var(--pm-accent)] text-xs">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RevenueAnalyticsChart />
              </div>
              <div className="lg:col-span-1">
                <SellerAIInsightsPanel insights={insights} />
              </div>
            </div>
            <SellerOrderPanel orders={orders} onAccept={handleAccept} onShip={handleShip} />
          </TabsContent>

          <TabsContent value="orders" className="mt-0 space-y-6">
            <SellerOrderPanel orders={orders} onAccept={handleAccept} onShip={handleShip} />
          </TabsContent>

          <TabsContent value="products" className="mt-0 space-y-6">
            <SellerProductGrid products={products} />
            <InventoryManager products={products} />
          </TabsContent>
          
                    <TabsContent value="analytics" className="mt-0 space-y-6">
             <RevenueAnalyticsChart />
             <SellerAIInsightsPanel insights={insights} />
          </TabsContent>
        </Tabs>
      </div>
    </SellerLayout>
  );
};
