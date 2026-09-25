import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, Settings2, ShieldCheck, HelpCircle, Bell, Info, 
  Palette, Check, User, Lock, Eye, Trash2, LogOut, ChevronRight, 
  Smartphone, Mail, Globe, Moon, Sun, Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../providers/ThemeProvider';
import { useAppStore } from '../store/appStore';
import { useAuthStore } from '../modules/auth/store/authStore';
import { useTranslation } from '../lib/i18n';

export const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useAppStore();
  const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const themeList = [
    { id: 'deepDark', name: 'ডিপ ডার্ক (Dark)', desc: 'ডার্ক মোড' },
    { id: 'colourful', name: 'কালারফুল (Vibrant)', desc: 'উজ্জ্বল ব্যাকগ্রাউন্ড' },
    { id: 'nakshiLight', name: 'নকশী লাইট (Light)', desc: 'ঐতিহ্যবাহী আরামদায়ক লাইট' },
    { id: 'greenField', name: 'সবুজ মাঠ (Emerald)', desc: 'প্রাকৃতিক গ্রিন ফিল্ড' }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleToggleLang = (selectedLang: 'bn' | 'en') => {
    setLang(selectedLang);
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-4 px-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--pm-border)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer text-[var(--pm-text)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[var(--pm-text)]">সেটিংস ও নিরাপত্তা</h1>
            <p className="text-xs text-[var(--pm-text-muted)]">অ্যাপ প্রিফারেন্স ও অ্যাকাউন্ট কন্ট্রোল</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* User Card */}
        {isAuthenticated && user ? (
          <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl border-2 border-[var(--pm-accent)] overflow-hidden">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-black text-sm text-[var(--pm-text)]">{user.name}</h3>
                <p className="text-xs text-[var(--pm-text-muted)]">{user.email || user.phone}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] text-[10px] font-black uppercase">
                  রোল: {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="text-xs font-bold text-[var(--pm-accent)] hover:underline"
            >
              প্রোফাইল
            </button>
          </div>
        ) : (
          <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl flex items-center justify-between shadow-xs">
            <div>
              <h3 className="font-bold text-sm text-[var(--pm-text)]">গেস্ট ইউজার হিসেবে আছেন</h3>
              <p className="text-xs text-[var(--pm-text-muted)]">অ্যাকাউন্টে সাইন ইন করে সম্পূর্ণ সুবিধা নিন</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-[var(--pm-accent)] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              লগইন করুন
            </button>
          </div>
        )}

        {/* Theme Settings */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-5 h-5 text-[var(--pm-accent)]" />
            <h2 className="font-black text-sm text-[var(--pm-text)]">থিম এবং কালার মোড</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {themeList.map((tItem) => (
              <button
                key={tItem.id}
                onClick={() => setTheme(tItem.id as any)}
                className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  theme === tItem.id
                    ? 'border-[var(--pm-accent)] bg-[var(--pm-accent)]/10'
                    : 'border-[var(--pm-border)] bg-[var(--pm-bg)] hover:border-[var(--pm-border)]/80'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-[var(--pm-text)]">{tItem.name}</h4>
                  <p className="text-[10px] text-[var(--pm-text-muted)]">{tItem.desc}</p>
                </div>
                {theme === tItem.id && <Check className="w-4 h-4 text-[var(--pm-accent)]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-[var(--pm-accent)]" />
            <h2 className="font-black text-sm text-[var(--pm-text)]">ভাষা পরিবর্তন (Language)</h2>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => handleToggleLang('bn')}
              className={`flex-1 py-3 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                lang === 'bn'
                  ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-sm'
                  : 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)] border-[var(--pm-border)]'
              }`}
            >
              বাংলা (Bengali)
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`flex-1 py-3 rounded-2xl font-black text-xs border transition-all cursor-pointer ${
                lang === 'en'
                  ? 'bg-[var(--pm-accent)] text-white border-[var(--pm-accent)] shadow-sm'
                  : 'bg-[var(--pm-bg)] text-[var(--pm-text-muted)] border-[var(--pm-border)]'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Security & Notification Controls */}
        <div className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--pm-accent)]" />
            <h2 className="font-black text-sm text-[var(--pm-text)]">নিরাপত্তা ও নোটিফিকেশন</h2>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[var(--pm-border)]/50">
            <div>
              <p className="text-xs font-bold text-[var(--pm-text)]">পুশ নোটিফিকেশন</p>
              <p className="text-[10px] text-[var(--pm-text-muted)]">অর্ডার ও দামের আপডেট এসএমএস/ইন-অ্যাপ পাবেন</p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                notificationsEnabled ? 'bg-[var(--pm-accent)]' : 'bg-zinc-600'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-xs font-bold text-[var(--pm-text)]">টু-ফ্যাক্টর অথেনটিকেশন (2FA)</p>
              <p className="text-[10px] text-[var(--pm-text-muted)]">এসএমএস ওটিপি ভিত্তিক নিরাপদ সুরক্ষা</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
              সক্রিয় রয়েছে
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="w-full py-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            অ্যাকাউন্ট থেকে লগআউট করুন
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
