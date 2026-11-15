import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Building2, Trash2, Check, Star, Edit3, X } from 'lucide-react';
import { SavedAddress } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/features/auth';
import { createSavedAddress, deleteSavedAddress, fetchSavedAddresses, setDefaultSavedAddress } from '@/features/auth';

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    label: 'Home Apartment',
    recipientName: 'Alex Rivera',
    phone: '+880 1712-345678',
    streetAddress: 'House 42, Road 11, Block D, Banani',
    apartment: 'Flat 5B',
    city: 'Dhaka',
    postalCode: '1213',
    tag: 'home',
    isDefault: true,
    notes: 'Please call before arriving, lift is working'
  },
  {
    id: 'addr_2',
    label: 'Corporate Office HQ',
    recipientName: 'Alex Rivera',
    phone: '+880 1819-987654',
    streetAddress: 'Gulshan Centre Point, Plot 23-26, Road 90',
    apartment: 'Floor 12, Suite 1204',
    city: 'Dhaka',
    postalCode: '1212',
    tag: 'office',
    isDefault: false,
    notes: 'Leave with reception security desk'
  }
];

export const SavedAddressesPage: React.FC = () => {
  const { language } = useLanguage();
  const { firebaseUser } = useAuth();
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem('paikarmart_user_addresses');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_ADDRESSES;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [label, setLabel] = useState('');
  const [recipientName, setRecipientName] = useState('Alex Rivera');
  const [phone, setPhone] = useState('+880 1712-345678');
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [tag, setTag] = useState<'home' | 'office' | 'other'>('home');
  const [notes, setNotes] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isBn = language === 'bn';

  useEffect(() => {
    if (!firebaseUser) return;
    void fetchSavedAddresses().then((remote) => {
      if (remote.length > 0) setAddresses(remote);
    });
  }, [firebaseUser]);

  useEffect(() => {
    try {
      localStorage.setItem('paikarmart_user_addresses', JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  const handleSetDefault = (id: string) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    if (firebaseUser && !id.startsWith('addr_')) void setDefaultSavedAddress(id).catch(() => undefined);
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetAddress.trim()) return;

    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: label.trim() || (tag === 'home' ? 'Home' : tag === 'office' ? 'Office' : 'Other Place'),
      recipientName,
      phone,
      streetAddress: streetAddress.trim(),
      apartment: apartment.trim() || undefined,
      city,
      tag,
      isDefault: addresses.length === 0,
      notes: notes.trim() || undefined
    };

    setAddresses(prev => [newAddr, ...prev]);
    if (firebaseUser) void createSavedAddress(newAddr).catch((error) => console.warn('Address API sync unavailable:', error));
    setShowAddForm(false);
    setStreetAddress('');
    setApartment('');
    setLabel('');
    setNotes('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[var(--pm-text)]">
            {isBn ? 'সংরক্ষিত ডেলিভারি ঠিকানা' : 'Saved Delivery Addresses'}
          </h3>
          <p className="text-xs text-[var(--pm-muted)]">
            {isBn 
              ? 'ই-কমার্স পণ্য এবং রাইড ড্রপ-অফের জন্য ঠিকানা সংরক্ষণ ও পরিচালনা করুন' 
              : 'Manage frequent delivery drop-off locations for instant express checkout'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md active:scale-95 cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? (isBn ? 'বাতিল' : 'Cancel') : (isBn ? 'নতুন ঠিকানা' : 'Add Address')}</span>
        </button>
      </div>

      {/* Add Address Form Drawer/Card */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-[var(--pm-text)]">
            {isBn ? 'নতুন ডেলিভারি ঠিকানা যোগ করুন' : 'Add New Delivery Address'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'ঠিকানার ধরন' : 'Address Type'}
              </label>
              <div className="flex gap-1.5">
                {(['home', 'office', 'other'] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTag(t)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border capitalize transition-all cursor-pointer ${
                      tag === t 
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)] shadow-2xs' 
                        : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'ঠিকানার শিরোনাম' : 'Label / Nickname'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: বাসা / ফার্মগেট ফ্ল্যাট' : 'e.g. My Apartment'}
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'শহর' : 'City'}
              </label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text)]">
              {isBn ? 'রাস্তা, বাড়ি ও এলাকা' : 'Street Address & Road'}
            </label>
            <input
              type="text"
              placeholder={isBn ? 'বাড়ি নং, রোড নং, সেক্টর/ব্লক' : 'House / Road / Block / Area'}
              value={streetAddress}
              onChange={e => setStreetAddress(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'ফ্ল্যাট / তলা (ঐচ্ছিক)' : 'Apt / Floor / Unit (Optional)'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: ফ্ল্যাট ৪সি, লিফটের ৩' : 'e.g. Suite 402, 4th Floor'}
                value={apartment}
                onChange={e => setApartment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'ডেলিভারি নোট (রাইডারের জন্য)' : 'Rider Instructions Note'}
              </label>
              <input
                type="text"
                placeholder={isBn ? 'যেমন: গেটে বেল বাজাবেন' : 'e.g. Ring the bell at gate'}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)] font-bold text-xs cursor-pointer transition-colors"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              {isBn ? 'ঠিকানা সেভ করুন' : 'Save Address'}
            </button>
          </div>
        </form>
      )}

      {/* Address Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {addresses.map(addr => {
          const Icon = addr.tag === 'home' ? Home : addr.tag === 'office' ? Building2 : MapPin;

          return (
            <div
              key={addr.id}
              className={`p-4 rounded-3xl border transition-all relative flex flex-col justify-between ${
                addr.isDefault 
                  ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)]'
                  : 'bg-[var(--pm-card)] border-[var(--pm-border)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl ${addr.isDefault ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)]'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--pm-text)]">{addr.label}</h4>
                      <p className="text-[10px] text-[var(--pm-muted)] capitalize">{addr.tag}</p>
                    </div>
                  </div>

                  {addr.isDefault ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-2xs">
                      {isBn ? 'ডিফল্ট ঠিকানা' : 'Default'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[10px] font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
                    >
                      {isBn ? 'ডিফল্ট করুন' : 'Set Default'}
                    </button>
                  )}
                </div>

                <div className="text-xs text-[var(--pm-muted)] space-y-0.5 pt-1">
                  <p className="font-semibold text-[var(--pm-text)]">
                    {addr.streetAddress}{addr.apartment ? `, ${addr.apartment}` : ''}
                  </p>
                  <p className="text-[11px] text-[var(--pm-muted)]">
                    {addr.city}{addr.postalCode ? ` - ${addr.postalCode}` : ''} · {addr.phone}
                  </p>
                  {addr.notes && (
                    <p className="text-[10px] text-[var(--pm-warning)] italic pt-1">
                      Note: "{addr.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--pm-border)] mt-3">
                {deleteConfirmId === addr.id ? (
                  <>
                    <span className="text-[10px] text-[var(--pm-muted)]">{isBn ? 'মুছে ফেলবেন?' : 'Delete this address?'}</span>
                    <button type="button" onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg text-[10px] font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)]">{isBn ? 'না' : 'Cancel'}</button>
                    <button type="button" onClick={() => { setAddresses(prev => prev.filter(a => a.id !== addr.id)); if (firebaseUser && !addr.id.startsWith('addr_')) void deleteSavedAddress(addr.id).catch(() => undefined); setDeleteConfirmId(null); }} className="px-2 py-1 rounded-lg bg-[var(--pm-danger)] text-white text-[10px] font-bold">{isBn ? 'হ্যাঁ, মুছুন' : 'Delete'}</button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 text-[var(--pm-muted)] hover:text-[var(--pm-danger)] transition-colors cursor-pointer"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete Address'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
