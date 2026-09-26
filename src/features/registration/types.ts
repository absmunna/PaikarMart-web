import { LucideIcon } from 'lucide-react';

export type BusinessType = 
  | 'physical' 
  | 'services' 
  | 'logistics' 
  | 'local_shop' 
  | 'wholesale' 
  | 'digital';

export interface BusinessTypeOption {
  id: BusinessType;
  label: string;
  labelBn: string;
  icon: LucideIcon;
  description: string;
  descriptionBn: string;
}

export interface SellerRegistrationState {
  step: number;
  selectedTypes: BusinessType[];
  categories: string[];
  basicInfo: {
    storeName: string;
    businessName: string;
    ownerName: string;
    phone: string;
    email: string;
  };
  location: {
    address: string;
    mapPin?: { lat: number; lng: number };
    deliveryRadius: number;
  };
  deliveryMethods: string[];
  storeSetup: {
    logo?: string;
    banner?: string;
    description: string;
  };
  paymentSetup: {
    method: 'wallet' | 'mobile' | 'bank' | 'later';
    details?: any;
  };
  verification: {
    status: 'pending' | 'verified' | 'unverified';
    type?: 'nid' | 'trade_license';
    documents: string[];
  };
}
