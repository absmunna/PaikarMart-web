import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KycSubmission {
  id: string;
  vendorName: string;
  storeName: string;
  phone: string;
  role: string;
  tradeLicenseNo: string;
  nidNumber: string;
  documentUrl?: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
  trustLevel: number;
}

interface KycStoreState {
  submissions: KycSubmission[];
  submitKyc: (data: Omit<KycSubmission, 'id' | 'status' | 'submittedAt' | 'trustLevel'>) => void;
  updateStatus: (id: string, status: 'verified' | 'rejected', trustLevel?: number) => void;
}

export const useKycStore = create<KycStoreState>()(
  persist(
    (set) => ({
      submissions: [
        {
          id: 'kyc-1',
          vendorName: 'Rafiqul Islam',
          storeName: 'Rafiq Traders & General Store',
          phone: '01712345678',
          role: 'b2b_wholesale',
          tradeLicenseNo: 'TRD-2026-98214',
          nidNumber: '1992837465910',
          status: 'pending',
          submittedAt: '2026-09-11 10:30 AM',
          trustLevel: 3,
        },
        {
          id: 'kyc-2',
          vendorName: 'Nazma Begum',
          storeName: 'Bangla Organic Agro',
          phone: '01898765432',
          role: 'retail_seller',
          tradeLicenseNo: 'TRD-2026-44321',
          nidNumber: '1985748392011',
          status: 'verified',
          submittedAt: '2026-09-10 02:15 PM',
          trustLevel: 5,
        }
      ],
      submitKyc: (data) => set((state) => ({
        submissions: [
          {
            ...data,
            id: `kyc-${Date.now()}`,
            status: 'pending',
            submittedAt: new Date().toLocaleString(),
            trustLevel: 2,
          },
          ...state.submissions
        ]
      })),
      updateStatus: (id, status, trustLevel) => set((state) => ({
        submissions: state.submissions.map(item => 
          item.id === id ? { 
            ...item, 
            status, 
            trustLevel: trustLevel !== undefined ? trustLevel : (status === 'verified' ? 5 : item.trustLevel) 
          } : item
        )
      })),
    }),
    {
      name: 'pm-kyc-store-v1',
    }
  )
);
