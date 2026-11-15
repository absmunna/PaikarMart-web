import React, { useState } from 'react';
import { CreditCard, Plus, ShieldCheck, Check, Trash2, Smartphone, Wallet, X } from 'lucide-react';
import { PaymentMethodItem } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

const DEFAULT_METHODS: PaymentMethodItem[] = [
  {
    id: 'pay_1',
    type: 'visa',
    holderName: 'Alex Rivera',
    last4: '4242',
    expiry: '08/28',
    isDefault: true
  },
  {
    id: 'pay_2',
    type: 'bkash',
    holderName: 'Alex Rivera',
    walletNumber: '01712-345678',
    isDefault: false
  }
];

export const PaymentMethodsPage: React.FC = () => {
  const { language } = useLanguage();
  const [methods, setMethods] = useState<PaymentMethodItem[]>(() => {
    try {
      const stored = localStorage.getItem('paikarmart_user_payment_methods');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_METHODS;
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<'visa' | 'mastercard' | 'bkash' | 'nagad'>('visa');
  const [holderName, setHolderName] = useState('Alex Rivera');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('12/27');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const isBn = language === 'bn';

  const handleSetDefault = (id: string) => {
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));
  };

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim()) return;

    const isCard = type === 'visa' || type === 'mastercard';
    const newMethod: PaymentMethodItem = {
      id: `pay_${Date.now()}`,
      type,
      holderName,
      last4: isCard ? number.slice(-4) : undefined,
      walletNumber: !isCard ? number : undefined,
      expiry: isCard ? expiry : undefined,
      isDefault: methods.length === 0
    };

    setMethods(prev => [newMethod, ...prev]);
    setShowAddForm(false);
    setNumber('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-[var(--pm-text)]">
            {isBn ? 'পেমেন্ট মেথড ও ওয়ালেট' : 'Payment Methods & Cards'}
          </h3>
          <p className="text-xs text-[var(--pm-muted)]">
            {isBn 
              ? 'নিরাপদ চেকআউটের জন্য কার্ড এবং বিকাশ/নগদ অ্যাকাউন্ট ম্যানেজ করুন' 
              : 'Saved credit cards, debit cards, and digital wallet providers'}
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md active:scale-95 cursor-pointer"
        >
          {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{showAddForm ? (isBn ? 'বাতিল' : 'Cancel') : (isBn ? 'নতুন কার্ড/ওয়ালেট' : 'Add Method')}</span>
        </button>
      </div>

      {/* PCI-DSS Security Banner */}
      <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span className="text-[11px] font-medium leading-relaxed">
          {isBn 
            ? 'আপনার সকল পেমেন্ট তথ্য এনক্রিপ্টেড এবং ব্যাংকিং গ্রেড সিকিউরিটি দ্বারা সুরক্ষিত।' 
            : 'All payment information is tokenized and protected by banking-grade PCI-DSS compliance.'}
        </span>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddSubmit} className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-4 animate-fadeIn">
          <h4 className="text-sm font-bold text-[var(--pm-text)]">
            {isBn ? 'নতুন পেমেন্ট মেথড যোগ করুন' : 'Add New Payment Method'}
          </h4>

          <div className="flex gap-2">
            {[
              { id: 'visa', label: 'Visa Card' },
              { id: 'mastercard', label: 'Mastercard' },
              { id: 'bkash', label: 'bKash' },
              { id: 'nagad', label: 'Nagad' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as any)}
                className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  type === item.id 
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)] shadow-2xs' 
                    : 'bg-[var(--pm-card)] border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {type === 'visa' || type === 'mastercard' 
                  ? (isBn ? 'কার্ড নম্বর' : 'Card Number') 
                  : (isBn ? 'ওয়ালেট মোবাইল নম্বর' : 'Mobile Wallet Number')}
              </label>
              <input
                type="text"
                placeholder={type === 'visa' || type === 'mastercard' ? '4242 •••• •••• 4242' : '01712-345678'}
                value={number}
                onChange={e => setNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'অ্যাকাউন্ট হোল্ডারের নাম' : 'Account Holder Name'}
              </label>
              <input
                type="text"
                value={holderName}
                onChange={e => setHolderName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
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
              {isBn ? 'সংরক্ষণ করুন' : 'Save Method'}
            </button>
          </div>
        </form>
      )}

      {/* Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {methods.map(method => {
          const isCard = method.type === 'visa' || method.type === 'mastercard';

          return (
            <div
              key={method.id}
              className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                method.isDefault 
                  ? 'bg-[var(--pm-accent-soft)] border-[var(--pm-accent-border)]'
                  : 'bg-[var(--pm-card)] border-[var(--pm-border)]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center font-black">
                      {isCard ? <CreditCard className="w-5 h-5" /> : <Smartphone className="w-5 h-5 text-pink-500" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[var(--pm-text)] uppercase">
                        {method.type}
                      </h4>
                      <p className="text-[10px] text-[var(--pm-muted)]">{method.holderName}</p>
                    </div>
                  </div>

                  {method.isDefault ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]">
                      {isBn ? 'ডিফল্ট' : 'Default'}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetDefault(method.id)}
                      className="text-[10px] font-bold text-[var(--pm-accent)] hover:underline cursor-pointer"
                    >
                      {isBn ? 'ডিফল্ট করুন' : 'Set Default'}
                    </button>
                  )}
                </div>

                <div className="font-mono text-sm font-bold text-[var(--pm-text)]">
                  {isCard ? `•••• •••• •••• ${method.last4}` : method.walletNumber}
                </div>

                {method.expiry && (
                  <p className="text-[10px] text-[var(--pm-muted)] font-mono">Expires {method.expiry}</p>
                )}
              </div>

              <div className="flex justify-end items-center gap-2 pt-3 border-t border-[var(--pm-border)] mt-3">
                {deleteConfirmId === method.id ? (
                  <>
                    <span className="text-[10px] text-[var(--pm-muted)]">{isBn ? 'মুছে ফেলবেন?' : 'Remove this method?'}</span>
                    <button type="button" onClick={() => setDeleteConfirmId(null)} className="px-2 py-1 rounded-lg text-[10px] font-bold text-[var(--pm-muted)] hover:text-[var(--pm-text)]">{isBn ? 'না' : 'Cancel'}</button>
                    <button type="button" onClick={() => { setMethods(prev => prev.filter(m => m.id !== method.id)); setDeleteConfirmId(null); }} className="px-2 py-1 rounded-lg bg-[var(--pm-danger)] text-white text-[10px] font-bold">{isBn ? 'হ্যাঁ, মুছুন' : 'Remove'}</button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDelete(method.id)}
                    className="p-1.5 text-[var(--pm-muted)] hover:text-[var(--pm-danger)] transition-colors cursor-pointer"
                    title={isBn ? 'মুছে ফেলুন' : 'Delete'}
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
