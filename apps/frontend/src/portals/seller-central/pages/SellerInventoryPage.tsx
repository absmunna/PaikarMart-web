import React from 'react';
import { CommerceSubDashboard, CommerceSubDashboardProps } from '@/portals/seller-central/components/CommerceSubDashboard';

/** Route-level inventory page boundary for future inventory data loading and permissions. */
export const SellerInventoryPage: React.FC<CommerceSubDashboardProps> = (props) => (
  <div className="space-y-4 sm:space-y-6 animate-fadeIn pb-16">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--pm-accent)]">Seller Central · Inventory</p>
      <h1 className="text-xl sm:text-2xl font-black text-[var(--pm-text)]">Product Inventory</h1>
      <p className="text-xs text-[var(--pm-muted)] mt-1">Manage catalog items, stock state and promotional listings.</p>
    </div>
    <CommerceSubDashboard {...props} />
  </div>
);
