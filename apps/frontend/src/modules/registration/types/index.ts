import { AppRole } from "@/config/roles.config";

export type AccountType = AppRole;

export interface AccountTypeConfig {
  id: AccountType;
  labelEn: string;
  labelBn: string;
  icon: any;
  color: string;
  bgColor: string;
  borderColor: string;
  securityRequired: boolean;
  expectedTrustLevel: number;
  descEn: string;
  descBn: string;
  group: 'buyer' | 'seller' | 'logistics' | 'service';
}

export interface AddressDetails {
  division: string;
  district: string;
  upazila: string;
  area: string;
}

export interface RegistrationFormState {
  // Step 1: Universal credentials
  fullName: string;
  phone: string;
  email: string;
  password: string;

  // Step 2: Role & Business information
  shopName: string;
  address: string;
  addressDetails: AddressDetails | null;
  category: string;
  tradeLicenseNo: string;
  tinNumber: string;
  binNumber: string;
  
  // Factory details
  factoryCategory: string;
  employees: string;
  established: string;
  productionCapacity: string;
  minOrderQty: string;
  exportCountries: string[];
  certifications: string[];
  membershipBody: string;
  
  // Wholesale details
  wholesaleMarket: string;
  moq: string;
  priceTier1Qty: string;
  priceTier1Price: string;
  priceTier2Qty: string;
  priceTier2Price: string;
  sourceFactory: string;

  // Rural details
  village: string;
  union: string;
  hatName: string;
  hatDay: string;
  hatDay2: string;
  ruralCategory: string;

  // Exporter/Importer details
  ercNumber: string;
  ircNumber: string;
  preferredIncoterms: string;

  // Rider details
  vehicleType: "bike" | "bicycle" | "car" | "pickup" | "truck";
  vehiclePlate: string;
  drivingLicenseNo: string;

  // Services details
  serviceSpecialty: string;
  rateType: "fixed" | "hourly";
  rateAmount: string;

  // Universal Payout Settings
  payoutMethod: "bkash" | "nagad" | "rocket" | "bank";
  payoutNumber: string;
  bankName: string;
  bankBranch: string;
  accountName: string;
  accountNo: string;
  swiftCode: string;
  routingNo: string;

  // Step 3: Identity & Verification
  idType: "nid" | "passport" | "trade_license";
  idNumber: string;
  idFile: string | null;
}

export type BusinessType = 'physical' | 'services' | 'logistics' | 'local_shop' | 'wholesale' | 'digital';

export interface BusinessTypeOption {
  id: BusinessType;
  label: string;
  labelBn: string;
  icon: any;
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
    division?: string;
    district?: string;
    upazila?: string;
    area?: string;
    zipCode?: string;
    deliveryRadius: number;
  };
  deliveryMethods: string[];
  storeSetup: {
    description: string;
    bannerUrl?: string;
    logoUrl?: string;
  };
  paymentSetup: {
    method: string;
    details?: string;
  };
  verification: {
    status: string;
    documents: { type: string; url: string; number: string }[];
  };
}
