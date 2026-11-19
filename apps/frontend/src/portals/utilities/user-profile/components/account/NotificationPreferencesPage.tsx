import React, { useState } from 'react';
import { Bell, Mail, Smartphone, ShieldCheck, Tag, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserNotificationPreferences } from '@/types';

const DEFAULT_PREFS: UserNotificationPreferences = {
  orderUpdatesEmail: true,
  orderUpdatesSms: true,
  deliveryPushAlerts: true,
  socialInteractions: true,
  promotionalOffers: false,
  securityLoginAlerts: true,
};

export const NotificationPreferencesPage: React.FC = () => {
  const { language } = useLanguage();
  const [prefs, setPrefs] = useState<UserNotificationPreferences>(() => {
    try {
      const stored = localStorage.getItem('paikarmart_user_notification_prefs');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_PREFS;
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isBn = language === 'bn';

  const toggle = (key: keyof UserNotificationPreferences) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem('paikarmart_user_notification_prefs', JSON.stringify(next));
      } catch {}
      return next;
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const notificationItems = [
    {
      key: 'orderUpdatesEmail' as const,
      title: isBn ? 'অর্ডার ইমেইল আপডেট' : 'Order Confirmation & Invoice Email',
      desc: isBn ? 'অর্ডার প্লেস, ইনভয়েস এবং ট্র্যাকিং লিঙ্ক ইমেইলে পাঠানো হবে' : 'Receive instant digital invoices and receipts via email',
      icon: Mail,
      iconColor: 'text-blue-500'
    },
    {
      key: 'orderUpdatesSms' as const,
      title: isBn ? 'ডেলিভারি SMS অ্যালার্ট' : 'Courier Rider Delivery SMS',
      desc: isBn ? 'পার্সেল পিকআপ এবং রাইডারের আগমন সংক্রান্ত জরুরি SMS' : 'Real-time SMS alerts when rider is nearby with OTP pin',
      icon: Smartphone,
      iconColor: 'text-emerald-500'
    },
    {
      key: 'deliveryPushAlerts' as const,
      title: isBn ? 'লাইভ পুশ নোটিফিকেশন' : 'Live Delivery Radar Push',
      desc: isBn ? 'রিয়েল-টাইম প্যাকেজ ট্র্যাকিং এবং স্ট্যাটাস চেঞ্জ পপআপ' : 'Instant in-app push notifications when shipping status advances',
      icon: Bell,
      iconColor: 'text-purple-500'
    },
    {
      key: 'socialInteractions' as const,
      title: isBn ? 'সোশ্যাল ইন্টারঅ্যাকশন' : 'Social Likes, Comments & Mentions',
      desc: isBn ? 'পোস্টে লাইক, কমেন্ট ও রিপ্লাই পেলে নোটিফিকেশন' : 'Get notified when community members interact with your posts',
      icon: Bell,
      iconColor: 'text-amber-500'
    },
    {
      key: 'securityLoginAlerts' as const,
      title: isBn ? 'নিরাপত্তা ও লগইন অ্যালার্ট' : 'Security & Login Alerts',
      desc: isBn ? 'নতুন কোনো ডিভাইস থেকে অ্যাকাউন্টে ঢুকলে তাৎক্ষণিক অ্যালার্ট' : 'Urgent alerts when a new browser or device logs into your account',
      icon: ShieldCheck,
      iconColor: 'text-red-500'
    },
    {
      key: 'promotionalOffers' as const,
      title: isBn ? 'প্রমোশনাল অফার ও ডিসকাউন্ট' : 'Exclusive Flash Sales & Coupons',
      desc: isBn ? 'বিশেষ ছাড় ও ক্যাশব্যাক ক্যাম্পেইনের তথ্য' : 'Weekly wholesale discounts and vendor promotional coupons',
      icon: Tag,
      iconColor: 'text-pink-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-black text-[var(--pm-text)]">
          {isBn ? 'নোটিফিকেশন প্রিফারেন্স' : 'Notification Preferences'}
        </h3>
        <p className="text-xs text-[var(--pm-muted)]">
          {isBn 
            ? 'ইমেইল, SMS এবং মোবাইল পুশ অ্যালার্ট কাস্টমাইজ করুন' 
            : 'Choose what updates and alerts you wish to receive'}
        </p>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)] text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 shrink-0" />
          <span>{isBn ? 'পছন্দসমূহ সংরক্ষিত হয়েছে!' : 'Notification preferences saved!'}</span>
        </div>
      )}

      <div className="space-y-3">
        {notificationItems.map(item => {
          const Icon = item.icon;
          const isEnabled = prefs[item.key];

          return (
            <div
              key={item.key}
              className="p-4 rounded-3xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className={`p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-2xs ${item.iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--pm-text)]">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)]">
                    {item.desc}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isEnabled ? 'bg-[var(--pm-accent)]' : 'bg-[var(--pm-border)]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
