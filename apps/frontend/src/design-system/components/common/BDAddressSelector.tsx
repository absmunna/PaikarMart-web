import React, { useState, useEffect } from 'react';

export interface AddressDetails {
  fullName?: string;
  phone?: string;
  division: string;
  district: string;
  upazila: string;
  area: string;
  zipCode?: string;
}

interface BDAddressSelectorProps {
  initialValue?: any;
  onChange?: (details: AddressDetails, isValid: boolean) => void;
  onAddressChange?: (details: AddressDetails, isValid: boolean) => void;
}

const BD_DATA: Record<string, string[]> = {
  "Dhaka (ঢাকা)": ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi", "Manikganj", "Munshiganj", "Faridpur"],
  "Chattogram (চট্টগ্রাম)": ["Chattogram", "Cox's Bazar", "Cumilla", "Feni", "Noakhali", "Brahmanbaria", "Rangamati", "Chandpur"],
  "Sylhet (সিলেট)": ["Sylhet", "Moulvibazar", "Habiganj", "Sunamganj"],
  "Rajshahi (রাজশাহী)": ["Rajshahi", "Bogura", "Pabna", "Naogaon", "Natore", "Chapai Nawabganj"],
  "Khulna (খুলনা)": ["Khulna", "Jashore", "Kushtia", "Satkhira", "Bagerhat", "Jhenaidah"],
  "Barishal (বরিশাল)": ["Barishal", "Bhola", "Patuakhali", "Pirojpur", "Barguna", "Jhalokati"],
  "Rangpur (রংপুর)": ["Rangpur", "Dinajpur", "Kurigram", "Gaibandha", "Lalmonirhat", "Nilphamari"],
  "Mymensingh (ময়মনসিংহ)": ["Mymensingh", "Jamalpur", "Netrokona", "Sherpur"]
};

export const BDAddressSelector: React.FC<BDAddressSelectorProps> = ({
  initialValue,
  onChange,
  onAddressChange
}) => {
  const [division, setDivision] = useState(initialValue?.division || '');
  const [district, setDistrict] = useState(initialValue?.district || '');
  const [upazila, setUpazila] = useState(initialValue?.upazila || '');
  const [area, setArea] = useState(initialValue?.area || '');
  const [zipCode, setZipCode] = useState(initialValue?.zipCode || '');

  // Get list of districts for selected division
  const districts = division ? BD_DATA[division] || [] : [];

  // Whenever any state changes, propagate to parent callbacks
  useEffect(() => {
    const details: AddressDetails = {
      division,
      district,
      upazila,
      area,
      zipCode
    };

    // Valid if division, district, and area are filled out
    const isValid = !!(division && district && area.trim());

    if (onChange) {
      onChange(details, isValid);
    }
    if (onAddressChange) {
      onAddressChange(details, isValid);
    }
  }, [division, district, upazila, area, zipCode]);

  // Handle division change
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDivision(val);
    setDistrict(''); // Reset district when division changes
  };

  return (
    <div className="space-y-3.5">
      {/* Division and District Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">বিভাগ (Division)</label>
          <select
            value={division}
            onChange={handleDivisionChange}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none cursor-pointer transition-all"
          >
            <option value="">নির্বাচন করুন</option>
            {Object.keys(BD_DATA).map((div) => (
              <option key={div} value={div} className="bg-[var(--pm-surface)] text-[var(--pm-text)]">{div}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">জেলা (District)</label>
          <select
            value={district}
            disabled={!division}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none cursor-pointer disabled:opacity-40 transition-all"
          >
            <option value="">নির্বাচন করুন</option>
            {districts.map((dist) => (
              <option key={dist} value={dist} className="bg-[var(--pm-surface)] text-[var(--pm-text)]">{dist}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Upazila and Post Code Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">থানা / উপজেলা (Upazila)</label>
          <input
            type="text"
            placeholder="e.g. Banani / Mirpur"
            value={upazila}
            onChange={(e) => setUpazila(e.target.value)}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">পোস্ট কোড (ZIP Code)</label>
          <input
            type="text"
            placeholder="e.g. 1213"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none transition-all"
          />
        </div>
      </div>

      {/* Street Area Details */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase text-[var(--pm-muted)] tracking-wider">হোল্ডিং নং, রোড, এলাকা (Street Address)</label>
        <input
          type="text"
          placeholder="e.g. House 45, Road 11, Block G"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl px-3 py-2.5 text-xs text-[var(--pm-text)] placeholder-[var(--pm-muted)]/60 focus:border-[var(--pm-accent)] focus:ring-1 focus:ring-[var(--pm-accent)]/30 outline-none transition-all"
        />
      </div>
    </div>
  );
};
