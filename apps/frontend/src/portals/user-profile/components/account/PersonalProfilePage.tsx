import React, { useState } from 'react';
import { User, Camera, Mail, Phone, MapPin, AtSign, Check, Sparkles } from 'lucide-react';
import { User as UserType } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { CURRENT_USER } from '@/data/mockData';
import { syncAuthenticatedProfile } from '@/features/auth';

interface PersonalProfilePageProps {
  currentUser?: UserType;
  onUpdateUser?: (updatedUser: UserType) => void;
}

export const PersonalProfilePage: React.FC<PersonalProfilePageProps> = ({
  currentUser = CURRENT_USER,
  onUpdateUser = () => {},
}) => {
  const { language } = useLanguage();
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle || '@alexrivera');
  const [email] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [bio, setBio] = useState('Product enthusiast, wholesale sourcer, and passionate creator on PaikarMart.');
  const [location, setLocation] = useState(currentUser.location || 'Dhaka, Bangladesh');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await syncAuthenticatedProfile({ name, handle, location, phone });
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Profile sync failed.');
      setIsSaving(false);
      return;
    }
    onUpdateUser({
      ...currentUser,
      name,
      handle,
      location,
      phone,
      bio,
    });
    setSavedSuccess(true);
    setIsSaving(false);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const isBn = language === 'bn';

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'ব্যক্তিগত তথ্য ও প্রোফাইল' : 'Personal Information & Profile'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn 
            ? 'আপনার নাম, ইউজারনেম, যোগাযোগের তথ্য এবং পাবলিক প্রোফাইল পরিচালনা করুন' 
            : 'Manage your public name, username handle, contact email, and bio'}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'প্রোফাইলের তথ্য সফলভাবে সংরক্ষিত হয়েছে!' : 'Personal profile updated successfully!'}</span>
        </div>
      )}
      {saveError && <div role="alert" className="p-3.5 rounded-2xl bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-xs font-bold">{saveError}</div>}

      {/* Avatar & Cover Photo Preview */}
      <div className="p-5 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex flex-col sm:flex-row items-center gap-5">
        <div className="relative group">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-[var(--pm-card)] shadow-md"
          />
          <button
            type="button"
            className="absolute bottom-0 right-0 p-1.5 rounded-full bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-md hover:bg-[var(--pm-accent-hover)] transition-transform active:scale-90 cursor-pointer"
            title={isBn ? 'ছবি পরিবর্তন করুন' : 'Change Avatar'}
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h4 className="text-base font-bold text-[var(--pm-text)]">{name}</h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]">
              {currentUser.isVendor ? (isBn ? 'ভেন্ডর' : 'Verified Vendor') : (isBn ? 'সদস্য' : 'Member')}
            </span>
          </div>
          <p className="text-xs text-[var(--pm-muted)] font-mono">{handle}</p>
          <p className="text-[11px] text-[var(--pm-muted)]">
            {isBn ? 'JPG, PNG বা WEBP সমর্থনযোগ্য। সর্বোচ্চ ৫ মেগাবাইট।' : 'JPG, PNG or WEBP recommended. Max size 5MB.'}
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>{isBn ? 'পূর্ণ নাম' : 'Full Name'}</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <AtSign className="w-3.5 h-3.5 text-purple-500" />
              <span>{isBn ? 'ইউজারনেম (@হ্যান্ডেল)' : 'Username Handle'}</span>
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[var(--pm-warning)]" />
              <span>{isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}</span>
            </label>
            <input
              type="email"
              value={email}
              readOnly
              title={isBn ? 'নিরাপত্তার জন্য Firebase account email পরিবর্তন করা যায় না' : 'Account email is managed by Firebase Authentication'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[var(--pm-success)]" />
              <span>{isBn ? 'মোবাইল নম্বর' : 'Phone Number'}</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[var(--pm-danger)]" />
            <span>{isBn ? 'বর্তমান শহর / এলাকা' : 'Current City / Area'}</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-semibold text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <span>{isBn ? 'বায়ো ও বিবরণ' : 'About / Bio'}</span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-xs font-medium text-[var(--pm-text)] focus:outline-hidden focus:border-[var(--pm-accent)]"
          />
        </div>

        <div className="pt-2 flex justify-end">
            <button
            type="submit"
              disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isSaving ? (isBn ? 'সংরক্ষণ হচ্ছে...' : 'Saving...') : (isBn ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Profile Changes')}
          </button>
        </div>
      </form>
    </div>
  );
};
