import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plus, Trash2, Home, Briefcase, Warehouse, Store, Compass, Check } from 'lucide-react';
import { BDAddressSelector, AddressDetails } from '@/components/common/BDAddressSelector';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLanguage } from '@/features/language/LanguageContext';

export interface AddressBookItem {
  id: string;
  tag: 'home' | 'office' | 'warehouse' | 'shop' | 'custom';
  tagNameEn: string;
  tagNameBn: string;
  name: string;
  phone: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  zipCode: string;
  roadHouseLandmark: string;
  deliveryNote?: string;
  isDefault: boolean;
}

const INITIAL_ADDRESSES: AddressBookItem[] = [
  {
    id: 'addr-1',
    tag: 'home',
    tagNameEn: 'Home',
    tagNameBn: 'বাসা',
    name: 'Rahim Chowdhury',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Dhanmondi',
    area: 'Dhanmondi Road 27',
    zipCode: '1209',
    roadHouseLandmark: 'House 45A, Apartment 4B',
    deliveryNote: 'Call before arriving',
    isDefault: true
  },
  {
    id: 'addr-2',
    tag: 'office',
    tagNameEn: 'Office',
    tagNameBn: 'অফিস',
    name: 'Rahim Chowdhury',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Gulshan',
    area: 'Gulshan 2 Circle',
    zipCode: '1212',
    roadHouseLandmark: 'Sourcing Tower, Level 8',
    deliveryNote: 'Deliver to reception only',
    isDefault: false
  },
  {
    id: 'addr-3',
    tag: 'warehouse',
    tagNameEn: 'Central Warehouse',
    tagNameBn: 'প্রধান ওয়্যারহাউজ',
    name: 'Rahim Traders Logistics',
    phone: '01998765432',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Tejgaon',
    area: 'Tejgaon Industrial Area',
    zipCode: '1208',
    roadHouseLandmark: 'Plot 22, Near Channel I Road',
    deliveryNote: 'Bulk truck loading access available',
    isDefault: false
  },
  {
    id: 'addr-4',
    tag: 'shop',
    tagNameEn: 'Chawkbazar Wholesaler Shop',
    tagNameBn: 'চকবাজার হোলসেল শপ',
    name: 'Rahim Traders Outlet',
    phone: '01811223344',
    division: 'Dhaka',
    district: 'Dhaka',
    upazila: 'Lalbagh',
    area: 'Chawkbazar Chowrasta',
    zipCode: '1211',
    roadHouseLandmark: 'Holding 14, Royal Plaza Ground Floor',
    deliveryNote: 'Wholesale delivery center',
    isDefault: false
  }
];

export const PersonalAddressesTab: React.FC = () => {
  const { isBn } = useLanguage();
  const [addresses, setAddresses] = useState<AddressBookItem[]>(INITIAL_ADDRESSES);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedTag, setSelectedTag] = useState<AddressBookItem['tag']>('home');
  
  // Track address inputs from BDAddressSelector
  const [tempAddress, setTempAddress] = useState<AddressDetails | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);

  const tagOptions: { key: AddressBookItem['tag']; icon: React.ElementType; labelEn: string; labelBn: string }[] = [
    { key: 'home', icon: Home, labelEn: 'Home', labelBn: 'বাসা' },
    { key: 'office', icon: Briefcase, labelEn: 'Office', labelBn: 'অফিস' },
    { key: 'warehouse', icon: Warehouse, labelEn: 'Warehouse', labelBn: 'ওয়্যারহাউজ' },
    { key: 'shop', icon: Store, labelEn: 'Retail Shop', labelBn: 'দোকান / আউটলেট' },
    { key: 'custom', icon: Compass, labelEn: 'Custom Site', labelBn: 'অন্যান্য ঠিকানা' }
  ];

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast.success(isBn ? "ডিফল্ট ঠিকানা সফলভাবে আপডেট করা হয়েছে!" : "Default address successfully updated!");
  };

  const handleDelete = (id: string) => {
    const target = addresses.find(a => a.id === id);
    if (target?.isDefault) {
      toast.error(isBn ? "ডিফল্ট ঠিকানা ডিলিট করা যাবে না।" : "Cannot delete default address.");
      return;
    }
    setAddresses(prev => prev.filter(addr => addr.id !== id));
    toast.success(isBn ? "ঠিকানাটি মুছে ফেলা হয়েছে!" : "Address removed successfully.");
  };

  const handleSaveClick = () => {
    if (!tempAddress || !isAddressValid) {
      toast.error(isBn ? "দয়া করে সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন" : "Please complete all required fields correctly.");
      return;
    }

    const newAddr: AddressBookItem = {
      id: `addr-${Date.now()}`,
      tag: selectedTag,
      tagNameEn: tagOptions.find(t => t.key === selectedTag)?.labelEn || 'Custom',
      tagNameBn: tagOptions.find(t => t.key === selectedTag)?.labelBn || 'অন্যান্য',
      name: tempAddress.fullName,
      phone: tempAddress.phone,
      division: tempAddress.division,
      district: tempAddress.district,
      upazila: tempAddress.upazila,
      area: tempAddress.area,
      zipCode: tempAddress.zipCode,
      roadHouseLandmark: tempAddress.area, // Base location fallback
      deliveryNote: '',
      isDefault: addresses.length === 0
    };

    setAddresses(prev => [...prev, newAddr]);
    setIsAdding(false);
    setTempAddress(null);
    setIsAddressValid(false);
    toast.success(isBn ? "নতুন ঠিকানা সফলভাবে সংরক্ষণ করা হয়েছে!" : "New address added to your profile book!");
  };

  const renderTagIcon = (tag: AddressBookItem['tag']) => {
    switch (tag) {
      case 'home': return <Home className="w-4 h-4 text-cyan-400" />;
      case 'office': return <Briefcase className="w-4 h-4 text-cyan-400" />;
      case 'warehouse': return <Warehouse className="w-4 h-4 text-purple-400" />;
      case 'shop': return <Store className="w-4 h-4 text-orange-400" />;
      default: return <MapPin className="w-4 h-4 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6 text-left select-none">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>ঠিকানা বুক ম্যানেজার / Escrow Address Book Registry</span>
          </h2>
          <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
            Manage your preset locations for Home, Office, Bulk Warehouse and Wholesale Shops.
          </p>
        </div>
        
        {!isAdding && (
          <Button
            onClick={() => {
              setSelectedTag('home');
              setIsAdding(true);
            }}
            className="h-9 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isBn ? "নতুন ঠিকানা" : "Add Address"}</span>
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-6"
          >
            {/* Tag Category Selector */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase font-black text-zinc-400 tracking-wider block">
                {isBn ? "ঠিকানার ক্যাটাগরি নির্ধারণ করুন" : "Select Address Category Tag"}
              </span>
              <div className="flex flex-wrap gap-2">
                {tagOptions.map(option => {
                  const IconComp = option.icon;
                  const isSelected = selectedTag === option.key;
                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => setSelectedTag(option.key)}
                      className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-cyan-500/10 border-cyan-400/40 text-cyan-400 font-bold" 
                          : "bg-zinc-900/60 border-white/5 text-zinc-400 hover:text-white"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <div className="flex flex-col text-left leading-none">
                        <span className="text-[11px] font-bold">{option.labelEn}</span>
                        <span className="text-[9px] opacity-70 mt-0.5">{option.labelBn}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standard BDAddressSelector with onChange callback */}
            <BDAddressSelector
              onChange={(address, isValid) => {
                setTempAddress(address);
                setIsAddressValid(isValid);
              }}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
              <Button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setTempAddress(null);
                }}
                className="h-11 px-5 rounded-xl bg-zinc-900 border border-white/5 text-white hover:bg-white/5 text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                {isBn ? "বাতিল" : "Cancel"}
              </Button>
              <Button
                type="button"
                disabled={!isAddressValid}
                onClick={handleSaveClick}
                className="h-11 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-500/10"
              >
                {isBn ? "ঠিকানা সংরক্ষণ করুন" : "Register Address"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {addresses.map(addr => (
              <div
                key={addr.id}
                className={`p-5 rounded-3xl border text-left flex flex-col justify-between transition-all relative group ${
                  addr.isDefault 
                    ? "bg-[#040f09]/80 border-cyan-500/30" 
                    : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 bg-white/[0.02] border border-white/5 px-2.5 py-1 rounded-lg">
                      {renderTagIcon(addr.tag)}
                      <span>{isBn ? addr.tagNameBn : addr.tagNameEn}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      {addr.isDefault ? (
                        <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                          {isBn ? "ডিফল্ট" : "Default"}
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[8px] bg-white/[0.02] border border-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/20 hover:text-cyan-400 text-zinc-500 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider cursor-pointer transition-all"
                        >
                          {isBn ? "ডিফল্ট করুন" : "Set Default"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="font-extrabold text-zinc-100">{addr.name}</p>
                    <p className="font-mono text-zinc-400 font-semibold text-[11px]">{addr.phone}</p>
                    
                    <div className="text-zinc-300 leading-relaxed text-[11.5px] font-medium pt-1">
                      <p>{addr.roadHouseLandmark}</p>
                      <p className="text-zinc-400 text-[11px] font-semibold mt-0.5">
                        {addr.area}, {addr.upazila}, {addr.district}, {addr.division} - {addr.zipCode}
                      </p>
                    </div>

                    {addr.deliveryNote && (
                      <p className="text-[10px] text-cyan-400 font-semibold italic bg-cyan-500/5 px-2.5 py-1.5 rounded-xl border border-cyan-500/10 mt-2">
                        💡 {addr.deliveryNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 justify-end border-t border-white/5 pt-3.5 mt-4">
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-2 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 text-red-400 cursor-pointer transition-all opacity-80 hover:opacity-100"
                    title={isBn ? "মুছে ফেলুন" : "Delete Address"}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
