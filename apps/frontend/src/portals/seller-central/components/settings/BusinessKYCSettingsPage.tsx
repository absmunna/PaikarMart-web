import React, { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, Building2, UploadCloud, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const BusinessKYCSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [tradeLicense, setTradeLicense] = useState('TRAD/DSCC/019284/2024');
  const [tinNumber, setTinNumber] = useState('748291048291');
  const [vatNumber, setVatNumber] = useState('BIN-002948192-0102');
  const [businessType, setBusinessType] = useState('Private Limited Company');
  const [legalName, setLegalName] = useState('Urban Tech Solutions BD Ltd.');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isBn = language === 'bn';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'ব্যবসা ও KYC ভেরিফিকেশন' : 'Business Legal Entity & KYC'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn 
            ? 'ট্রেড লাইসেন্স, ট্যাক্স (TIN) এবং আইনগত ব্যবসায়িক ডকুমেন্টস পরিচালনা করুন' 
            : 'Government compliance, Trade License, and Tax Identification Numbers'}
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'KYC তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'KYC compliance details saved successfully!'}</span>
        </div>
      )}

      {/* KYC Status Strip */}
      <div className="p-5 rounded-3xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[var(--pm-success)] text-white flex items-center justify-center shadow-lg shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-[var(--pm-text)]">
                {isBn ? 'লেভেল ২ ভেরিফিকেশন সম্পন্ন' : 'Level 2 Enterprise Verified'}
              </h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[var(--pm-success)] text-white">
                Active
              </span>
            </div>
            <p className="text-xs text-[var(--pm-muted)] mt-0.5">
              {isBn 
                ? 'আপনার দোকান পাইকারমার্ট হোলসেল ও রিটেল উভয় ক্যাটাগরিতে পণ্য বিক্রির জন্য অনুমোদিত' 
                : 'Your merchant account is approved for unlimited retail and bulk wholesale trade'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'নিবন্ধিত আইনগত নাম' : 'Registered Legal Business Name'}</span>
            </label>
            <input
              type="text"
              value={legalName}
              onChange={e => setLegalName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)]">
              {isBn ? 'ব্যবসার ধরন' : 'Business Structure'}
            </label>
            <select
              value={businessType}
              onChange={e => setBusinessType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            >
              <option value="Sole Proprietorship">Sole Proprietorship (একমালিকানা)</option>
              <option value="Partnership">Partnership (অংশীদারি)</option>
              <option value="Private Limited Company">Private Limited Company (প্রাইভেট লিমিটেড)</option>
              <option value="Registered Corporation">Registered Corporation</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-500" />
              <span>{isBn ? 'ট্রেড লাইসেন্স নম্বর' : 'Trade License Number'}</span>
            </label>
            <input
              type="text"
              value={tradeLicense}
              onChange={e => setTradeLicense(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold font-mono focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[var(--pm-warning)]" />
              <span>{isBn ? 'টিন (TIN) সার্টিফিকেট নম্বর' : 'Tax Identification (TIN)'}</span>
            </label>
            <input
              type="text"
              value={tinNumber}
              onChange={e => setTinNumber(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold font-mono focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)]">
            {isBn ? 'ভ্যাট / BIN নম্বর (ঐচ্ছিক)' : 'VAT / BIN Registration (Optional)'}
          </label>
          <input
            type="text"
            value={vatNumber}
            onChange={e => setVatNumber(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-semibold font-mono focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        {/* Uploaded Documents List */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--pm-muted)]">
            {isBn ? 'ভেরিফাইড ডকুমেন্টস ফাইল' : 'Verified Supporting Documents'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[var(--pm-accent)]" />
                <div>
                  <p className="text-xs font-bold text-[var(--pm-text)]">Trade_License_2024.pdf</p>
                  <p className="text-[10px] text-[var(--pm-success)] font-bold">Verified & Active</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[var(--pm-success)]" />
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[var(--pm-warning)]" />
                <div>
                  <p className="text-xs font-bold text-[var(--pm-text)]">TIN_Certificate.pdf</p>
                  <p className="text-[10px] text-[var(--pm-success)] font-bold">Verified & Active</p>
                </div>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[var(--pm-success)]" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isBn ? 'ডকুমেন্টস তথ্য সংরক্ষণ' : 'Save KYC Information'}
          </button>
        </div>
      </form>
    </div>
  );
};
