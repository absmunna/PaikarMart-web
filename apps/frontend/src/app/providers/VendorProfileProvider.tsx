import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SellerProfile } from '@/modules/seller/types';
import axios from 'axios';

interface VendorContextType {
  vendorProfile: SellerProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  hasAccessToPortal: (portalId: string) => boolean;
}

const VendorContext = createContext<VendorContextType | undefined>(undefined);

export const VendorProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vendorProfile, setVendorProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // Replace with actual API endpoint for current vendor profile
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/seller/profile`, { timeout: 3000 });
      setVendorProfile(response.data);
    } catch (error) {
      console.warn("Failed to fetch vendor profile from backend, using fallback demo profile:", error);
      setVendorProfile({
        id: 'seller-demo-1',
        businessName: 'Paikar Mart Wholesaler Hub',
        ownerName: 'Rahim Uddin',
        phone: '+8801712345678',
        email: 'wholesaler@paikarmart.com',
        status: 'ACTIVE',
        tier: 'DIAMOND',
        accessiblePortals: ['b2b', 'marketplace', 'services', 'logistics', 'community', 'pk_store', 'pos'],
      } as any);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refreshProfile = async () => {
    await fetchProfile();
  };

  // Logic to determine if vendor has access to a specific portal
  const hasAccessToPortal = (portalId: string) => {
    if (!vendorProfile) return false;
    // Assume vendor profile contains an array of accessible portal IDs
    // Adjust logic based on actual backend structure
    return (vendorProfile as any)?.accessiblePortals?.includes(portalId) || true; // Temp true for dev
  };

  return (
    <VendorContext.Provider value={{ vendorProfile, loading, refreshProfile, hasAccessToPortal }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendorProfile = () => {
  const context = useContext(VendorContext);
  if (context === undefined) {
    throw new Error('useVendorProfile must be used within a VendorProfileProvider');
  }
  return context;
};
