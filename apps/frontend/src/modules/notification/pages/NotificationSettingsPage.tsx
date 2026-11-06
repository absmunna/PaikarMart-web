import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Bell, BellRing, Mail, Smartphone, Shield, Check, 
  RefreshCw, Volume2, SmartphoneCharging, Moon, Sparkles, Send, 
  Clock, AlertCircle, CheckCircle2, ChevronRight, Package, Tag, 
  Briefcase, MessageSquare, FileText, BarChart3, Lock, Flame
} from 'lucide-react';
import { useNotificationSettingsStore } from '../store/notificationSettingsStore';
import { useAuth } from '@/modules/auth';
import { toast } from 'sonner';
import { safeBack } from '@/lib/navigation';

export const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const {
    push,
    email,
    inApp,
    lastSaved,
    browserPermission,
    togglePush,
    toggleEmail,
    toggleInApp,
    setEmailAddress,
    setEmailFrequency,
    setQuietHours,
    resetDefaults,
    saveSettings,
    requestBrowserPermission,
    checkBrowserPermission,
    sendTestAlert
  } = useNotificationSettingsStore();

  const [emailInput, setEmailInput] = useState(email.emailAddress || user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    checkBrowserPermission();
    if (!email.emailAddress && user?.email) {
      setEmailAddress(user.email);
      setEmailInput(user.email);
    }
  }, [user, email.emailAddress, checkBrowserPermission, setEmailAddress]);

  const handleEmailSave = () => {
    if (emailInput && !emailInput.includes('@')) {
      toast.error('সঠিক ইমেইল ঠিকানা প্রদান করুন');
      return;
    }
    setEmailAddress(emailInput);
    setHasChanges(true);
    toast.success('অ্যালার্ট ইমেইল ঠিকানা আপডেট করা হয়েছে');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (emailInput !== email.emailAddress) {
        setEmailAddress(emailInput);
      }
      await saveSettings();
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  const formatLastSavedTime = (isoString: string | null) => {
    if (!isoString) return 'ডিফল্ট সক্রিয়';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'সংরক্ষিত';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] pb-32 pt-3 px-4 max-w-2xl mx-auto selection:bg-[var(--pm-accent)] selection:text-white">
      {/* ━━━ HEADER ━━━ */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--pm-border)]">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => safeBack(navigate, '/notifications')}
            className="w-10 h-10 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-center hover:bg-[var(--pm-surface-hover)] transition-all cursor-pointer text-[var(--pm-text)]"
            title="ফিরে যান"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight">নোটিফিকেশন সেটিংস</h1>
              <span className="px-2 py-0.5 rounded-full bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] text-[10px] font-black uppercase">
                App Settings
              </span>
            </div>
            <p className="text-xs text-[var(--pm-text-muted)]">
              পুশ, ইমেইল এবং ইন-অ্যাপ নোটিফিকেশন প্রিফারেন্স
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={resetDefaults}
            className="text-[11px] font-bold text-[var(--pm-text-muted)] hover:text-white px-2.5 py-1.5 rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] transition-all flex items-center gap-1.5"
            title="ডিফল্টে রিসেট করুন"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">রিসেট</span>
          </motion.button>
        </div>
      </div>

      {/* ━━━ QUICK SUMMARY BANNER ━━━ */}
      <div className="p-4 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-[var(--pm-accent)]" />
            <span className="text-xs font-black uppercase tracking-wider text-[var(--pm-text)]">
              অ্যালার্ট চ্যানেল ওভারভিউ
            </span>
          </div>
          <span className="text-[10px] text-[var(--pm-text-muted)]">
            সর্বশেষ আপডেট: {formatLastSavedTime(lastSaved)}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Push Status */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
            push.enabled 
              ? 'bg-[var(--pm-accent)]/10 border-[var(--pm-accent)]/40 text-[var(--pm-accent)]' 
              : 'bg-zinc-800/20 border-[var(--pm-border)] text-zinc-500'
          }`}>
            <Smartphone className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-black">পুশ অ্যালার্ট</span>
            <span className="text-[9px] font-bold opacity-80">{push.enabled ? 'সক্রিয় (Active)' : 'বন্ধ (Off)'}</span>
          </div>

          {/* Email Status */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
            email.enabled 
              ? 'bg-blue-500/10 border-blue-500/40 text-blue-400' 
              : 'bg-zinc-800/20 border-[var(--pm-border)] text-zinc-500'
          }`}>
            <Mail className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-black">ইমেইল অ্যালার্ট</span>
            <span className="text-[9px] font-bold opacity-80">{email.enabled ? 'সক্রিয় (Active)' : 'বন্ধ (Off)'}</span>
          </div>

          {/* In-App Status */}
          <div className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all ${
            inApp.enabled 
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
              : 'bg-zinc-800/20 border-[var(--pm-border)] text-zinc-500'
          }`}>
            <Sparkles className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-black">ইন-অ্যাপ আপডেট</span>
            <span className="text-[9px] font-bold opacity-80">{inApp.enabled ? 'সক্রিয় (Active)' : 'বন্ধ (Off)'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            1. PUSH NOTIFICATIONS
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--pm-border)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)]/10 text-[var(--pm-accent)] flex items-center justify-center border border-[var(--pm-accent)]/20">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--pm-text)]">পুশ নোটিফিকেশন (Push Notifications)</h2>
                <p className="text-[11px] text-[var(--pm-text-muted)]">
                  মোবাইল ও ব্রাউজারে ইনস্ট্যান্ট সরাসরি মেসেজ ও অ্যালার্ট
                </p>
              </div>
            </div>

            {/* Master Push Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                togglePush('enabled');
                setHasChanges(true);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                push.enabled ? 'bg-[var(--pm-accent)]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  push.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </motion.button>
          </div>

          {/* Browser Permission Info Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-[var(--pm-bg)] border border-[var(--pm-border)] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              {browserPermission === 'granted' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <span className="text-[11px] text-[var(--pm-text)]">
                {browserPermission === 'granted' && 'ব্রাউজার পুশ পারমিশন সক্রিয় রয়েছে'}
                {browserPermission === 'default' && 'ব্রাউজার পুশ নোটিফিকেশন পারমিশন পেন্ডিং'}
                {browserPermission === 'denied' && 'ব্রাউজারে পুশ ব্লক করা আছে (সেটিংস থেকে আনব্লক করুন)'}
                {browserPermission === 'unsupported' && 'এই ডিভাইসে ওয়েব পুশ সমর্থিত নয়'}
              </span>
            </div>

            {browserPermission !== 'granted' && browserPermission !== 'unsupported' && (
              <button
                onClick={requestBrowserPermission}
                className="px-2.5 py-1 rounded-xl bg-[var(--pm-accent)] text-white text-[10px] font-bold shrink-0 hover:opacity-90 transition-opacity"
              >
                অনুমোদন দিন
              </button>
            )}
          </div>

          {/* Sub-toggles under Push */}
          <AnimatePresence>
            {push.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-[var(--pm-border)]/40 mt-3 pt-1 space-y-1"
              >
                {/* Orders */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-[var(--pm-text-muted)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">অর্ডার ও ডেলিভারি স্ট্যাটাস</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">অর্ডার কনফার্ম, প্যাকেজিং এবং লাইভ কুরিয়ার ট্র্যাকিং</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={push.orders}
                    onChange={() => {
                      togglePush('orders');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-[var(--pm-accent)] rounded cursor-pointer"
                  />
                </div>

                {/* Promos */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Tag className="w-4 h-4 text-[var(--pm-text-muted)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">ফ্ল্যাশ সেল ও ডিসকাউন্ট অফার</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">সীমিত সময়ের মেগা ডিল এবং এক্সক্লুসিভ কুপন অ্যালার্ট</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={push.promos}
                    onChange={() => {
                      togglePush('promos');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-[var(--pm-accent)] rounded cursor-pointer"
                  />
                </div>

                {/* B2B Matches */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-[var(--pm-text-muted)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">B2B পাইকারি চাহিদা ও কোটেশন</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">বাল্ক ডিমান্ড পোস্টিং এবং সাপ্লায়ার প্রাইস বিড অ্যালার্ট</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={push.b2bMatches}
                    onChange={() => {
                      togglePush('b2bMatches');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-[var(--pm-accent)] rounded cursor-pointer"
                  />
                </div>

                {/* Direct Messages */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-[var(--pm-text-muted)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">চ্যাট ও কাস্টমার ইনকোয়ারি</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">ক্রেতা এবং সেলারদের থেকে আসা সরাসরি বার্তা</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={push.chatMessages}
                    onChange={() => {
                      togglePush('chatMessages');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-[var(--pm-accent)] rounded cursor-pointer"
                  />
                </div>

                {/* Sound & Vibration */}
                <div className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-[var(--pm-text-muted)]" />
                    <div>
                      <p className="text-xs font-bold text-[var(--pm-text)]">সাউন্ড ও ভাইব্রেশন</p>
                      <p className="text-[10px] text-[var(--pm-text-muted)]">নোটিফিকেশনে সাউন্ড রিং ও ফোন ভাইব্রেট হবে</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 text-[11px] text-[var(--pm-text-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={push.sound}
                        onChange={() => {
                          togglePush('sound');
                          setHasChanges(true);
                        }}
                        className="w-3.5 h-3.5 accent-[var(--pm-accent)] rounded"
                      />
                      <span>শব্দ</span>
                    </label>
                    <label className="flex items-center gap-1.5 text-[11px] text-[var(--pm-text-muted)] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={push.vibrate}
                        onChange={() => {
                          togglePush('vibrate');
                          setHasChanges(true);
                        }}
                        className="w-3.5 h-3.5 accent-[var(--pm-accent)] rounded"
                      />
                      <span>ভাইব্রেশন</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            2. EMAIL ALERTS
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--pm-border)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--pm-text)]">ইমেইল অ্যালার্ট (Email Alerts)</h2>
                <p className="text-[11px] text-[var(--pm-text-muted)]">
                  ইনভয়েস, সিকিউরিটি অ্যালার্ট এবং মার্কেট সামারি
                </p>
              </div>
            </div>

            {/* Master Email Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleEmail('enabled');
                setHasChanges(true);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                email.enabled ? 'bg-blue-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  email.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </motion.button>
          </div>

          <AnimatePresence>
            {email.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {/* Recipient Email Address Input */}
                <div className="p-3.5 rounded-2xl bg-[var(--pm-bg)] border border-[var(--pm-border)]">
                  <label className="text-[11px] font-bold text-[var(--pm-text-muted)] block mb-1.5">
                    অ্যালার্ট রিসিভ করার ইমেইল ঠিকানা
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="আপনার ইমেইল ঠিকানা লিখুন"
                      className="flex-1 bg-[var(--pm-surface)] border border-[var(--pm-border)] text-xs text-[var(--pm-text)] px-3 py-2 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={handleEmailSave}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      সেট করুন
                    </button>
                  </div>
                </div>

                {/* Email Frequency Selector */}
                <div>
                  <label className="text-[11px] font-bold text-[var(--pm-text-muted)] block mb-2">
                    ইমেইল পাঠানোর ফ্রিকোয়েন্সি
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'instant', label: 'রিয়েল-টাইম', desc: 'প্রতিটি ইভেন্টে' },
                      { id: 'daily', label: 'দৈনিক ডাইজেস্ট', desc: 'সকাল ৯টায় একবারে' },
                      { id: 'weekly', label: 'সাপ্তাহিক', desc: 'প্রতি রবিবার' },
                    ].map((freq) => (
                      <button
                        key={freq.id}
                        onClick={() => {
                          setEmailFrequency(freq.id as any);
                          setHasChanges(true);
                        }}
                        className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          email.frequency === freq.id
                            ? 'bg-blue-500/10 border-blue-500 text-blue-400'
                            : 'bg-[var(--pm-bg)] border-[var(--pm-border)] text-[var(--pm-text-muted)]'
                        }`}
                      >
                        <p className="text-xs font-bold">{freq.label}</p>
                        <p className="text-[9px] opacity-70">{freq.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-options for Email */}
                <div className="divide-y divide-[var(--pm-border)]/40 pt-1">
                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-[var(--pm-text-muted)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">ইনভয়েস ও ক্রয়ের রসিদ</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">অর্ডার কনফার্মেশনের সাথে পিডিএফ ইনভয়েস সংযুক্ত থাকবে</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={email.invoices}
                      onChange={() => {
                        toggleEmail('invoices');
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Lock className="w-4 h-4 text-[var(--pm-text-muted)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">সিকিউরিটি ও লগইন অ্যালার্ট</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">অপরিচিত ডিভাইস লগইন ও পাসওয়ার্ড পরিবর্তনের সতর্কতা</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={email.securityAlerts}
                      onChange={() => {
                        toggleEmail('securityAlerts');
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-4 h-4 text-[var(--pm-text-muted)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">সাপ্তাহিক মার্কেট ট্রেন্ড ও ডাইজেস্ট</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">পাইকারি পণ্যের বাজারদর এবং জনপ্রিয় ডিমান্ড রিপোর্ট</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={email.weeklyDigest}
                      onChange={() => {
                        toggleEmail('weeklyDigest');
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <Flame className="w-4 h-4 text-[var(--pm-text-muted)]" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">প্রমোশনাল অফার ও পার্টনার ডিসকাউন্ট</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">সিজনাল মেগা ক্যাম্পেইন ও ক্যাশব্যাক আপডেট</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={email.promotions}
                      onChange={() => {
                        toggleEmail('promotions');
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. IN-APP UPDATES & BADGES
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section className="bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-3xl p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between pb-4 border-b border-[var(--pm-border)]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-[var(--pm-text)]">ইন-অ্যাপ আপডেট ও ব্যাজ (In-App)</h2>
                <p className="text-[11px] text-[var(--pm-text-muted)]">
                  অ্যাপ ব্যবহারের সময় ফ্লোটিং টোস্ট, ব্যাজ কাউন্টার ও সাউন্ড
                </p>
              </div>
            </div>

            {/* Master In-App Switch */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleInApp('enabled');
                setHasChanges(true);
              }}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                inApp.enabled ? 'bg-emerald-500' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  inApp.enabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </motion.button>
          </div>

          <AnimatePresence>
            {inApp.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="divide-y divide-[var(--pm-border)]/40 mt-3 pt-1 space-y-1"
              >
                {/* Floating Toasts */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-bold text-[var(--pm-text)]">ফ্লোটিং টোস্ট অ্যালার্ট (Toast Popups)</p>
                    <p className="text-[10px] text-[var(--pm-text-muted)]">নতুন অর্ডার বা মেসেজ এলে উপরে পপআপ নোটিফিকেশন আসবে</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inApp.floatingToasts}
                    onChange={() => {
                      toggleInApp('floatingToasts');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                {/* Unread Badges */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-bold text-[var(--pm-text)]">অপঠিত কাউন্ট ব্যাজ (Badge Counters)</p>
                    <p className="text-[10px] text-[var(--pm-text-muted)]">নিচের নেভিগেশন বার এবং বেল আইকনে লাল কাউন্টার প্রদর্শন</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inApp.unreadBadges}
                    onChange={() => {
                      toggleInApp('unreadBadges');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                {/* System Announcements */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-bold text-[var(--pm-text)]">সিস্টেম ও চেঞ্জলগ আপডেট</p>
                    <p className="text-[10px] text-[var(--pm-text-muted)]">অ্যাপে নতুন ফিচার ও রক্ষণাবেক্ষণের নোটিশ পাবেন</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inApp.systemAnnouncements}
                    onChange={() => {
                      toggleInApp('systemAnnouncements');
                      setHasChanges(true);
                    }}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                {/* Quiet Hours / DND */}
                <div className="py-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-purple-400" />
                      <div>
                        <p className="text-xs font-bold text-[var(--pm-text)]">নিরব সময় (Quiet Hours / DND)</p>
                        <p className="text-[10px] text-[var(--pm-text-muted)]">নির্দিষ্ট সময়ে নোটিফিকেশন সাউন্ড ও পপআপ বন্ধ থাকবে</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={inApp.quietHoursEnabled}
                      onChange={() => {
                        toggleInApp('quietHoursEnabled');
                        setHasChanges(true);
                      }}
                      className="w-4 h-4 accent-purple-500 rounded cursor-pointer"
                    />
                  </div>

                  {inApp.quietHoursEnabled && (
                    <div className="p-3 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-2xl flex items-center justify-between gap-3 text-xs mt-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--pm-text-muted)]" />
                        <span className="text-[11px] text-[var(--pm-text-muted)]">শুরু:</span>
                        <input
                          type="time"
                          value={inApp.quietHoursStart}
                          onChange={(e) => {
                            setQuietHours(e.target.value, inApp.quietHoursEnd);
                            setHasChanges(true);
                          }}
                          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] px-2 py-1 rounded-lg text-xs"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[var(--pm-text-muted)]">শেষ:</span>
                        <input
                          type="time"
                          value={inApp.quietHoursEnd}
                          onChange={(e) => {
                            setQuietHours(inApp.quietHoursStart, e.target.value);
                            setHasChanges(true);
                          }}
                          className="bg-[var(--pm-surface)] border border-[var(--pm-border)] px-2 py-1 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* ━━━ BOTTOM FLOATING ACTION BAR ━━━ */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--pm-bg)]/95 backdrop-blur-md border-t border-[var(--pm-border)] py-3 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => sendTestAlert('all')}
            className="px-3 py-2.5 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] text-[var(--pm-text)] text-xs font-bold hover:bg-[var(--pm-surface-hover)] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
            <span>টেস্ট অ্যালার্ট পাঠান</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-2.5 px-4 rounded-2xl bg-[var(--pm-accent)] text-white text-xs font-black shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সেটিংস সংরক্ষণ করুন'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsPage;
