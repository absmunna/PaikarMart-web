import React, { useState } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Briefcase, Globe, Phone, User as UserIcon } from 'lucide-react';
import { User, SavedAddress } from '@/types';

interface SavedAddressesTabProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
}

export const SavedAddressesTab: React.FC<SavedAddressesTabProps> = ({ currentUser, onUpdateUser }) => {
  const [isAdding, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Partial<SavedAddress> | null>(null);

  const savedAddresses = currentUser.savedAddresses || [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    const newAddress: SavedAddress = {
      id: editingAddress.id || `addr_${Date.now()}`,
      label: editingAddress.label || 'Other',
      recipientName: editingAddress.recipientName || currentUser.name,
      phone: editingAddress.phone || currentUser.handle || '',
      streetAddress: editingAddress.streetAddress || '',
      city: editingAddress.city || '',
      tag: editingAddress.tag || 'other',
      isDefault: editingAddress.isDefault || savedAddresses.length === 0,
      ...editingAddress
    };

    let updatedAddresses = [...savedAddresses];
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(a => ({ ...a, isDefault: false }));
    }

    const existingIndex = updatedAddresses.findIndex(a => a.id === newAddress.id);
    if (existingIndex > -1) {
      updatedAddresses[existingIndex] = newAddress;
    } else {
      updatedAddresses.push(newAddress);
    }

    onUpdateUser({ ...currentUser, savedAddresses: updatedAddresses });
    setIsEditing(false);
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    const updated = savedAddresses.filter(a => a.id !== id);
    onUpdateUser({ ...currentUser, savedAddresses: updated });
  };

  const handleSetDefault = (id: string) => {
    const updated = savedAddresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    onUpdateUser({ ...currentUser, savedAddresses: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[var(--pm-text)]">Saved Delivery Addresses</h3>
          <p className="text-xs text-[var(--pm-muted)]">Manage your shipping destinations for faster checkout.</p>
        </div>
        <button 
          onClick={() => {
            setEditingAddress({ tag: 'home', isDefault: false });
            setIsEditing(true);
          }}
          className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {savedAddresses.map((addr) => (
          <div 
            key={addr.id} 
            className={`p-5 rounded-3xl border transition-all relative ${
              addr.isDefault 
                ? 'border-[var(--pm-accent-border)] bg-[var(--pm-accent-soft)]' 
                : 'border-[var(--pm-border)] bg-[var(--pm-card)]'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'bg-[var(--pm-surface)] text-[var(--pm-muted)] border border-[var(--pm-border)]'}`}>
                  {addr.tag === 'home' ? <Home className="w-4 h-4" /> : addr.tag === 'office' ? <Briefcase className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-[var(--pm-text)]">{addr.label}</span>
                {addr.isDefault && <span className="text-[9px] font-black bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent-border)] px-1.5 py-0.5 rounded-md uppercase">Default</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => handleDelete(addr.id)} className="p-1.5 text-[var(--pm-muted)] hover:text-[var(--pm-danger)] transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[var(--pm-text)] font-bold">
                <UserIcon className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                {addr.recipientName}
              </div>
              <div className="flex items-center gap-2 text-[var(--pm-muted)]">
                <Phone className="w-3.5 h-3.5 text-[var(--pm-muted)]" />
                {addr.phone}
              </div>
              <div className="flex items-start gap-2 text-[var(--pm-muted)]">
                <MapPin className="w-3.5 h-3.5 text-[var(--pm-muted)] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{addr.streetAddress}, {addr.city}</span>
              </div>
            </div>

            {!addr.isDefault && (
              <button 
                onClick={() => handleSetDefault(addr.id)}
                className="mt-4 w-full py-2 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] text-[10px] font-black uppercase text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-all cursor-pointer"
              >
                Set as Default
              </button>
            )}
          </div>
        ))}

        {savedAddresses.length === 0 && (
          <div className="col-span-full py-12 text-center bg-[var(--pm-surface)] rounded-[2.5rem] border border-dashed border-[var(--pm-border)]">
            <MapPin className="w-12 h-12 text-[var(--pm-muted)] mx-auto mb-3 opacity-50" />
            <p className="text-sm font-bold text-[var(--pm-muted)]">No saved addresses yet.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleSave} className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-black text-[var(--pm-text)]">Add Delivery Address</h3>
              <p className="text-xs text-[var(--pm-muted)]">Enter precise coordinates for quick sourcing.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Label (e.g. Home)</label>
                  <input required type="text" value={editingAddress?.label} onChange={e => setEditingAddress({...editingAddress, label: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Type</label>
                  <select value={editingAddress?.tag} onChange={e => setEditingAddress({...editingAddress, tag: e.target.value as any})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none font-bold">
                    <option value="home">Home</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Recipient Name</label>
                <input required type="text" value={editingAddress?.recipientName} onChange={e => setEditingAddress({...editingAddress, recipientName: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Phone Number</label>
                <input required type="tel" value={editingAddress?.phone} onChange={e => setEditingAddress({...editingAddress, phone: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none font-mono" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Street Address</label>
                <textarea required value={editingAddress?.streetAddress} onChange={e => setEditingAddress({...editingAddress, streetAddress: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none min-h-[80px]" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">City</label>
                <input required type="text" value={editingAddress?.city} onChange={e => setEditingAddress({...editingAddress, city: e.target.value})} className="w-full p-3 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs border border-[var(--pm-border)] focus:border-[var(--pm-accent)] outline-none" />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={editingAddress?.isDefault} onChange={e => setEditingAddress({...editingAddress, isDefault: e.target.checked})} className="rounded border-[var(--pm-border)] accent-[var(--pm-accent)]" />
                <span className="text-[10px] font-black uppercase text-[var(--pm-muted)]">Set as default address</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-muted)] text-xs font-bold transition-colors cursor-pointer">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-lg transition-colors cursor-pointer">Save Address</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
