import React, { useState } from 'react';
import { Lock, ShieldCheck, Smartphone, KeyRound, Check, Laptop, LogOut, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SecuritySettingsPage: React.FC = () => {
  const { language } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isBn = language === 'bn';

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (newPassword.length < 6) {
      setErrorMessage(isBn ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage(isBn ? 'নতুন পাসওয়ার্ড দুটি মিলছে না।' : 'New passwords do not match.');
      return;
    }

    setSaveStatus(isBn ? 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!' : 'Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'লগইন ও অ্যাকাউন্ট নিরাপত্তা' : 'Login & Account Security'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn 
            ? 'পাসওয়ার্ড পরিবর্তন, টু-ফ্যাক্টর অথেনটিকেশন (2FA) এবং সক্রিয় সেশন নিয়ন্ত্রণ করুন' 
            : 'Manage passwords, two-factor authentication (2FA), and active session devices'}
        </p>
      </div>

      {saveStatus && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2FA Card */}
      <div className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-[var(--pm-text)]">
              {isBn ? 'টু-ফ্যাক্টর অথেনটিকেশন (2FA)' : 'Two-Factor Authentication (2FA)'}
            </h4>
            <p className="text-[11px] text-[var(--pm-muted)]">
              {isBn 
                ? 'লগইনের সময় ফোনে বা অথেন্টিকেটর অ্যাপে ৬-সংখ্যার কোড প্রয়োজন হবে' 
                : 'Requires a 6-digit verification code when logging in on new devices'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIs2FAEnabled(!is2FAEnabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
            is2FAEnabled ? 'bg-[var(--pm-success)]' : 'bg-[var(--pm-border)]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              is2FAEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Change Password Form */}
      <div className="p-5 rounded-3xl bg-[var(--pm-card)] border border-[var(--pm-border)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[var(--pm-border)] pb-3">
          <KeyRound className="w-4 h-4 text-[var(--pm-accent)]" />
          <h4 className="text-sm font-bold text-[var(--pm-text)]">
            {isBn ? 'পাসওয়ার্ড পরিবর্তন করুন' : 'Change Security Password'}
          </h4>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-[var(--pm-text)]">
              {isBn ? 'বর্তমান পাসওয়ার্ড' : 'Current Password'}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'নতুন পাসওয়ার্ড' : 'New Password'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-[var(--pm-text)]">
                {isBn ? 'নতুন পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm New Password'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] text-xs font-semibold focus:outline-hidden focus:border-[var(--pm-accent)]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {isBn ? 'পাসওয়ার্ড আপডেট করুন' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      {/* Active Session Devices */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--pm-muted)]">
          {isBn ? 'সক্রিয় লগইন ডিভাইস ও সেশন' : 'Active Login Devices & Sessions'}
        </h4>

        <div className="space-y-2">
          <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-[var(--pm-text)]">Chrome on macOS</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)]">
                    {isBn ? 'বর্তমান ডিভাইস' : 'Current Device'}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--pm-muted)] font-mono">Dhaka, Bangladesh · Active now</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--pm-text)]">PaikarMart Mobile App (iOS)</p>
                <p className="text-[10px] text-[var(--pm-muted)] font-mono">Chittagong, Bangladesh · 2 days ago</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSaveStatus(isBn ? 'ডিভাইস অ্যাকসেস প্রত্যাহার করা হয়েছে।' : 'Device session revoked.');
                setTimeout(() => setSaveStatus(null), 2500);
              }}
              className="text-xs font-bold text-[var(--pm-danger)] hover:underline cursor-pointer"
            >
              {isBn ? 'লগআউট' : 'Revoke'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
