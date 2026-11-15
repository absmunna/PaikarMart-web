import React from 'react';
import { Store } from 'lucide-react';
import { VendorProfile } from '@/types';

interface VendorWorkspaceSwitcherProps {
  profiles: VendorProfile[];
  activeVendorId: string;
  onChange: (vendorId: string) => void;
}

export const VendorWorkspaceSwitcher: React.FC<VendorWorkspaceSwitcherProps> = ({ profiles, activeVendorId, onChange }) => {
  if (profiles.length <= 1) return null;

  return (
    <label className="flex items-center gap-2 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] px-2.5 py-1.5 text-xs text-[var(--pm-text)]">
      <Store className="w-3.5 h-3.5 text-[var(--pm-accent)] shrink-0" />
      <span className="text-[10px] font-bold text-[var(--pm-muted)] whitespace-nowrap">Workspace</span>
      <select
        value={activeVendorId}
        onChange={(event) => onChange(event.target.value)}
        className="max-w-[170px] bg-transparent font-bold outline-none cursor-pointer"
        aria-label="Active vendor workspace"
      >
        {profiles.map((profile) => (
          <option key={profile.id} value={profile.id}>{profile.storeName}</option>
        ))}
      </select>
    </label>
  );
};
