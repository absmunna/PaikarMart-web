import React, { useState } from 'react';
import { Landmark, Smartphone, Calendar, AlertCircle, Check, DollarSign, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const PayoutSettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'mfs'>('bank');
  
  // Bank fields
  const [bankName, setBankName] = useState('BRAC Bank PLC');
  const [accountHolder, setAccountHolder] = useState('Urban Tech Wholesale Enterprise');
  const [accountNumber, setAccountNumber] = useState('1501204859382001');
  const [branchName, setBranchName] = useState('Gulshan-1 Corporate Branch');
  const [routingNumber, setRoutingNumber] = useState('060261748');

  // MFS fields
  const [mfsProvider, setMfsProvider] = useState<'bkash' | 'nagad' | 'rocket'>('bkash');
  const [mfsNumber, setMfsNumber] = useState('01911223344');
  const [mfsType, setMfsType] = useState<'merchant' | 'personal'>('merchant');

  // Schedules
  const [schedule, setSchedule] = useState<'daily' | 'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [minThreshold, setMinThreshold] = useState('2000');
  const [autoPayoutEnabled, setAutoPayoutEnabled] = useState(true);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'পেআউট ও ব্যাংক অ্যাকাউন্ট সেটিংস' : 'Payout & Settlement Accounts'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn
            ? 'বিক্রিত পণ্যের লাভ ও পেমেন্ট সরাসরি ব্যাংক একাউন্ট বা বিকাশ/নগদ মার্চেন্ট ওয়ালেটে গ্রহণ করার সেটিংস'
            : 'Configure settlement bank accounts, MFS merchant numbers, and automatic payout cycle'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'পেআউট তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Payout preferences updated successfully!'}</span>
        </div>
      )}

      {/* Available Balance Quick Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-200 bg-emerald-800/60 px-2.5 py-1 rounded-full border border-emerald-400/20">
            {isBn ? 'বর্তমান উত্তোলনের ব্যালেন্স' : 'Withdrawable Payout Balance'}
          </span>
          <h4 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">৳ 48,920.00</h4>
          <p className="text-xs text-emerald-100/80 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
            {isBn ? 'পরবর্তী স্বয়ংক্রিয় সেটেলমেন্ট: রবিবার রাত ১২টায়' : 'Next auto-settlement: Sunday at 11:59 PM'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSavedSuccess(true);
            setTimeout(() => setSavedSuccess(false), 2500);
          }}
          className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 text-xs font-bold shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          {isBn ? 'তাত্ক্ষণিক উইথড্র রিকোয়েস্ট' : 'Request Instant Payout'}
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-6">
        {/* Method Switcher */}
        <div>
          <label className="text-xs font-black text-[var(--pm-text)] block mb-2.5">
            {isBn ? 'পেমেন্ট গ্রহণের মাধ্যম নির্বাচন করুন' : 'Select Primary Settlement Channel'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPayoutMethod('bank')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                payoutMethod === 'bank'
                  ? 'border-[var(--pm-accent)] bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] ring-2 ring-[var(--pm-accent)]/20'
                  : 'border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[var(--pm-accent-border)] text-[var(--pm-text)]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${payoutMethod === 'bank' ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]' : 'bg-[var(--pm-card)] text-[var(--pm-muted)]'}`}>
                <Landmark className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">{isBn ? 'ব্যাংক ট্রান্সফার (BEFTN/NPSB)' : 'Direct Bank Deposit'}</p>
                <p className="text-[10px] text-[var(--pm-muted)]">{isBn ? 'বড় পরিমাণের জন্য প্রযোজ্য, ০% ফি' : 'Recommended for high volume, 0% fee'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPayoutMethod('mfs')}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                payoutMethod === 'mfs'
                  ? 'border-pink-600 bg-pink-500/10 text-pink-500 ring-2 ring-pink-500/20'
                  : 'border-[var(--pm-border)] bg-[var(--pm-surface)] hover:border-[var(--pm-accent-border)] text-[var(--pm-text)]'
              }`}
            >
              <div className={`p-2.5 rounded-xl ${payoutMethod === 'mfs' ? 'bg-pink-600 text-white' : 'bg-[var(--pm-card)] text-[var(--pm-muted)]'}`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">{isBn ? 'বিকাশ / নগদ ওয়ালেট' : 'Mobile Banking (MFS)'}</p>
                <p className="text-[10px] text-[var(--pm-muted)]">{isBn ? 'তাত্ক্ষণিক ট্রান্সফার, ২৪/৭ সক্রিয়' : 'Instant settlement, 24/7 active'}</p>
              </div>
            </button>
          </div>
        </div>

        {payoutMethod === 'bank' ? (
          /* Bank Details */
          <div className="space-y-4 pt-4 border-t border-[var(--pm-border)]">
            <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">
              {isBn ? 'ব্যাংক অ্যাকাউন্টের বিবরণ' : 'Bank Account Information'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'ব্যাংকের নাম' : 'Bank Name'}
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
                  placeholder="e.g. BRAC Bank PLC"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'অ্যাকাউন্ট হোল্ডারের নাম' : 'Account Title / Holder Name'}
                </label>
                <input
                  type="text"
                  value={accountHolder}
                  onChange={(e) => setAccountHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
                  placeholder="As written on checkbook"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'অ্যাকাউন্ট নম্বর' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs font-mono focus:border-[var(--pm-accent)] focus:outline-hidden"
                  placeholder="13-16 digit account number"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'শাখা ও রাউটিং নম্বর' : 'Branch & 9-digit Routing Number'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
                    placeholder="Branch Name"
                  />
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-32 px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs font-mono focus:border-[var(--pm-accent)] focus:outline-hidden"
                    placeholder="Routing No"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MFS Details */
          <div className="space-y-4 pt-4 border-t border-[var(--pm-border)]">
            <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider">
              {isBn ? 'মোবাইল ওয়ালেট বিবরণ' : 'MFS Wallet Details'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['bkash', 'nagad', 'rocket'] as const).map((prov) => (
                <button
                  type="button"
                  key={prov}
                  onClick={() => setMfsProvider(prov)}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold text-xs capitalize ${
                    mfsProvider === prov
                      ? 'border-pink-600 bg-pink-500/10 text-pink-500 ring-2 ring-pink-500/20'
                      : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                  }`}
                >
                  {prov === 'bkash' ? 'bKash Merchant' : prov === 'nagad' ? 'Nagad Islamic / Business' : 'DBBL Rocket'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'ওয়ালেট মোবাইল নম্বর' : 'MFS Account Mobile Number'}
                </label>
                <input
                  type="text"
                  value={mfsNumber}
                  onChange={(e) => setMfsNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs font-mono focus:border-[var(--pm-accent)] focus:outline-hidden"
                  placeholder="01XXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                  {isBn ? 'অ্যাকাউন্টের ধরন' : 'Account Category'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMfsType('merchant')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      mfsType === 'merchant'
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)]'
                        : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                    }`}
                  >
                    {isBn ? 'মার্চেন্ট ওয়ালেট' : 'Merchant Wallet'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setMfsType('personal')}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      mfsType === 'personal'
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)]'
                        : 'border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                    }`}
                  >
                    {isBn ? 'ব্যক্তিগত / পার্সোনাল' : 'Personal Wallet'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payout Schedule & Threshold */}
        <div className="pt-4 border-t border-[var(--pm-border)] space-y-4">
          <h4 className="text-xs font-black text-[var(--pm-text)] uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            {isBn ? 'স্বয়ংক্রিয় সেটেলমেন্ট শিডিউল' : 'Automatic Settlement Schedule'}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'পেআউট ফ্রিকোয়েন্সি' : 'Payout Cycle'}
              </label>
              <select
                value={schedule}
                onChange={(e) => setSchedule(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs focus:border-[var(--pm-accent)] focus:outline-hidden"
              >
                <option value="daily">{isBn ? 'প্রতিদিন রাত ১২টায় (ডেইলি)' : 'Daily (Every midnight)'}</option>
                <option value="weekly">{isBn ? 'সাপ্তাহিক (প্রতি রবিবার)' : 'Weekly (Every Sunday)'}</option>
                <option value="biweekly">{isBn ? 'পাক্ষিক (প্রতি ১৫ দিনে)' : 'Bi-weekly (Every 15 days)'}</option>
                <option value="monthly">{isBn ? 'মাসিক (মাসের ১ম কর্মদিবসে)' : 'Monthly (1st business day)'}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--pm-text)] block mb-1">
                {isBn ? 'ন্যূনতম ব্যালেন্স থ্রেশহোল্ড (টাকা)' : 'Minimum Auto-Payout Threshold (BDT)'}
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[var(--pm-muted)]">৳</span>
                <input
                  type="number"
                  value={minThreshold}
                  onChange={(e) => setMinThreshold(e.target.value)}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] cursor-pointer">
            <input
              type="checkbox"
              checked={autoPayoutEnabled}
              onChange={(e) => setAutoPayoutEnabled(e.target.checked)}
              className="w-4 h-4 accent-[var(--pm-accent)] rounded-sm"
            />
            <div className="text-xs">
              <span className="font-bold text-[var(--pm-text)] block">
                {isBn ? 'অটো-উইথড্র সক্রিয় রাখুন' : 'Enable Automated Scheduled Payouts'}
              </span>
              <span className="text-[11px] text-[var(--pm-muted)]">
                {isBn
                  ? 'থ্রেশহোল্ড অতিক্রম করলে নির্ধারিত দিনে ব্যাংক অ্যাকাউন্টে স্বয়ংক্রিয়ভাবে ব্যালেন্স জমা হবে'
                  : 'Balances exceeding minimum threshold will be automatically transferred without manual requests'}
              </span>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[var(--pm-border)]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            {isBn ? 'পেআউট সেটিংস সংরক্ষণ করুন' : 'Save Payout Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
};
