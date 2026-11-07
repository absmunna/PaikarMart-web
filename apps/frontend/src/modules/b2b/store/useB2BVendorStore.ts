import { create } from 'zustand';
import { B2BVendor } from '../types/b2bTypes';

interface B2BVendorState {
  vendors: B2BVendor[];
  isLoading: boolean;
  error: string | null;
}

export const MOCK_B2B_VENDORS: B2BVendor[] = [
  {
    id: 'f-1',
    name: 'Narayanganj Knitwear & Textile Ltd (নারায়ণগঞ্জ নিটওয়্যার)',
    type: 'factory',
    isVerified: true,
    rating: 4.8,
    location: 'Kanchpur Industrial Zone, Narayanganj',
    banner: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1516841273335-e39b37888115?w=150&auto=format&fit=crop',
    industry: 'Garments',
    description: 'We specialize in export-grade jersey knit, cotton t-shirts, activewear production, and yarn spinning since 2008. Certified by OEKO-TEX and GOTS.',
    employeeCount: 1600,
    establishedYear: 2008,
    exportMarkets: ['Germany', 'USA', 'Italy', 'UK', 'Spain'],
    certifications: ['OEKO-TEX Standard 100', 'GOTS Organic Cert', 'BSCI Audited'],
  },
  {
    id: 'f-2',
    name: 'Savar Agro-Processing Industries (সাভার এগ্রো অ্যান্ড ফ্রুটস)',
    type: 'exporter',
    isVerified: true,
    rating: 4.6,
    location: 'Savar BSCIC, Dhaka',
    banner: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1594897030264-ab7d87efc473?w=150&auto=format&fit=crop',
    industry: 'Agro',
    description: 'Largest bulk cold-chain storage and organic mango, potato, and spice processing plant in Savar. Exporting premium agricultural goods under government subsidies.',
    employeeCount: 450,
    establishedYear: 2014,
    exportMarkets: ['Saudi Arabia', 'UAE', 'Malaysia', 'Singapore'],
    certifications: ['HALAL Certified', 'ISO 22000', 'HACCP Foods'],
  },
  {
    id: 'f-3',
    name: 'Gazipur Smart-Tech Assembling Line (গাজীপুর স্মার্ট-টেক পার্টস)',
    type: 'factory',
    isVerified: true,
    rating: 4.7,
    location: 'Konabari, Gazipur',
    banner: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop',
    industry: 'Electronics',
    description: 'Direct manufacturer of circuit boards, smart LED bulb modules, home appliance PCB assembly, and premium voltage stabilizers.',
    employeeCount: 780,
    establishedYear: 2017,
    exportMarkets: ['India', 'Vietnam', 'Turkey'],
    certifications: ['CE Mark', 'ISO 9001:2015', 'RoHS Compliance'],
  },
  {
    id: 's-4',
    name: 'Khatunganj Trading & Spice Importers (চাটগাঁ মসলা ট্রেডিং)',
    type: 'importer',
    isVerified: true,
    rating: 4.5,
    location: 'Khatunganj Wholesale Area, Chattogram',
    banner: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop',
    industry: 'Agro',
    description: 'Bulk importer of premium cardamoms, cinnamon, dry ginger, and garlic from Indonesia, Brazil, and Vietnam. Serving wholesalers nationwide.',
    employeeCount: 120,
    establishedYear: 1999,
    exportMarkets: ['Bangladesh Nationwide Distribution'],
    certifications: ['BSTI Standard Food Clearance', 'Customs Import License'],
  },
  {
    id: 's-5',
    name: 'Islampur Textile Brokerage & Fabrics (ইসলামপুর ফ্যাব্রিক সোর্স)',
    type: 'supplier',
    isVerified: false,
    rating: 4.4,
    location: 'Islampur Wholesale Market, Old Dhaka',
    banner: 'https://images.unsplash.com/photo-1524295981997-ec4f540702e5?w=800&auto=format&fit=crop',
    logo: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=150&auto=format&fit=crop',
    industry: 'Garments',
    description: 'Bulk supplier of premium local silk, cotton voile, print fabric rolls, and traditional Bangladeshi lungi and sharees directly from tat (loom) mills.',
    employeeCount: 85,
    establishedYear: 2011,
    exportMarkets: ['Local Wholesalers'],
    certifications: ['Dhaka Merchant Association Trade License'],
  }
];

export const useB2BVendorStore = create<B2BVendorState>((set) => ({
  vendors: MOCK_B2B_VENDORS,
  isLoading: false,
  error: null,
}));
