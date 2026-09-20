import React from 'react';

export interface AddressDetails {
  division: string;
  district: string;
  upazila: string;
  area: string;
}

interface BDAddressSelectorProps {
  initialValue?: any;
  onChange: (details: AddressDetails, isValid: boolean) => void;
}

export const BDAddressSelector: React.FC<BDAddressSelectorProps> = ({ initialValue, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <select className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none">
          <option>Division</option>
          <option>Dhaka</option>
          <option>Chattogram</option>
        </select>
        <select className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-white text-xs outline-none">
          <option>District</option>
        </select>
      </div>
      <input 
        type="text" 
        placeholder="Area / Road / House"
        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs outline-none focus:border-cyan-500"
      />
    </div>
  );
};
