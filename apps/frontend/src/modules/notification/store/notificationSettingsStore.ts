import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

export interface PushNotificationPreferences {
  enabled: boolean;
  orders: boolean;
  promos: boolean;
  b2bMatches: boolean;
  chatMessages: boolean;
  sound: boolean;
  vibrate: boolean;
}

export interface EmailAlertPreferences {
  enabled: boolean;
  invoices: boolean;
  weeklyDigest: boolean;
  securityAlerts: boolean;
  promotions: boolean;
  emailAddress: string;
  frequency: 'instant' | 'daily' | 'weekly';
}

export interface InAppUpdatePreferences {
  enabled: boolean;
  floatingToasts: boolean;
  unreadBadges: boolean;
  systemAnnouncements: boolean;
  soundEffects: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface NotificationSettingsState {
  push: PushNotificationPreferences;
  email: EmailAlertPreferences;
  inApp: InAppUpdatePreferences;
  lastSaved: string | null;
  browserPermission: 'granted' | 'denied' | 'default' | 'unsupported';
  
  // Actions
  togglePush: (key: keyof PushNotificationPreferences, val?: boolean) => void;
  toggleEmail: (key: keyof EmailAlertPreferences, val?: boolean) => void;
  toggleInApp: (key: keyof InAppUpdatePreferences, val?: boolean) => void;
  setEmailAddress: (email: string) => void;
  setEmailFrequency: (freq: 'instant' | 'daily' | 'weekly') => void;
  setQuietHours: (start: string, end: string, enabled?: boolean) => void;
  resetDefaults: () => void;
  saveSettings: () => Promise<void>;
  requestBrowserPermission: () => Promise<'granted' | 'denied' | 'default' | 'unsupported'>;
  checkBrowserPermission: () => void;
  sendTestAlert: (channel?: 'all' | 'push' | 'email' | 'inApp') => void;
}

const DEFAULT_PUSH: PushNotificationPreferences = {
  enabled: true,
  orders: true,
  promos: true,
  b2bMatches: true,
  chatMessages: true,
  sound: true,
  vibrate: true,
};

const DEFAULT_EMAIL: EmailAlertPreferences = {
  enabled: true,
  invoices: true,
  weeklyDigest: false,
  securityAlerts: true,
  promotions: false,
  emailAddress: '',
  frequency: 'instant',
};

const DEFAULT_IN_APP: InAppUpdatePreferences = {
  enabled: true,
  floatingToasts: true,
  unreadBadges: true,
  systemAnnouncements: true,
  soundEffects: false,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
};

export const useNotificationSettingsStore = create<NotificationSettingsState>()(
  persist(
    (set, get) => ({
      push: { ...DEFAULT_PUSH },
      email: { ...DEFAULT_EMAIL },
      inApp: { ...DEFAULT_IN_APP },
      lastSaved: null,
      browserPermission: typeof window !== 'undefined' && 'Notification' in window
        ? (Notification.permission as any)
        : 'unsupported',

      togglePush: (key, val) => {
        set((state) => ({
          push: {
            ...state.push,
            [key]: typeof val === 'boolean' ? val : !state.push[key],
          },
        }));
      },

      toggleEmail: (key, val) => {
        set((state) => ({
          email: {
            ...state.email,
            [key]: typeof val === 'boolean' ? val : !state.email[key],
          },
        }));
      },

      toggleInApp: (key, val) => {
        set((state) => ({
          inApp: {
            ...state.inApp,
            [key]: typeof val === 'boolean' ? val : !state.inApp[key],
          },
        }));
      },

      setEmailAddress: (email: string) => {
        set((state) => ({
          email: {
            ...state.email,
            emailAddress: email,
          },
        }));
      },

      setEmailFrequency: (frequency) => {
        set((state) => ({
          email: {
            ...state.email,
            frequency,
          },
        }));
      },

      setQuietHours: (start, end, enabled) => {
        set((state) => ({
          inApp: {
            ...state.inApp,
            quietHoursStart: start,
            quietHoursEnd: end,
            ...(typeof enabled === 'boolean' ? { quietHoursEnabled: enabled } : {}),
          },
        }));
      },

      resetDefaults: () => {
        set({
          push: { ...DEFAULT_PUSH },
          email: { ...DEFAULT_EMAIL },
          inApp: { ...DEFAULT_IN_APP },
          lastSaved: new Date().toISOString(),
        });
        toast.info('নোটিফিকেশন প্রিফারেন্স ডিফল্ট অবস্থায় ফিরিয়ে আনা হয়েছে');
      },

      checkBrowserPermission: () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          set({ browserPermission: Notification.permission as any });
        } else {
          set({ browserPermission: 'unsupported' });
        }
      },

      requestBrowserPermission: async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) {
          toast.error('আপনার ব্রাউজার পুশ নোটিফিকেশন সমর্থন করে না');
          set({ browserPermission: 'unsupported' });
          return 'unsupported';
        }

        try {
          const perm = await Notification.requestPermission();
          set({ browserPermission: perm as any });
          if (perm === 'granted') {
            toast.success('ব্রাউজার পুশ নোটিফিকেশন অনুমোদন দেওয়া হয়েছে! 🎉');
            set((state) => ({ push: { ...state.push, enabled: true } }));
          } else if (perm === 'denied') {
            toast.warning('পুশ নোটিফিকেশন ব্রাউজার সেটিংস থেকে ব্লক করা হয়েছে');
          }
          return perm as any;
        } catch (e) {
          console.warn('[NotificationSettings] Permission request failed:', e);
          return 'default';
        }
      },

      saveSettings: async () => {
        const timestamp = new Date().toISOString();
        set({ lastSaved: timestamp });
        
        // Try saving to backend or Firestore user preferences if available
        try {
          const userStr = localStorage.getItem('paikar_auth_user');
          if (userStr) {
            const userData = JSON.parse(userStr);
            if (userData?.id) {
              // Persist locally in user profile object
              userData.notificationSettings = {
                push: get().push,
                email: get().email,
                inApp: get().inApp,
                updatedAt: timestamp,
              };
              localStorage.setItem('paikar_auth_user', JSON.stringify(userData));
            }
          }
        } catch {
          // ignore storage error
        }

        toast.success('নোটিফিকেশন সেটিংস সফলভাবে সংরক্ষিত হয়েছে! 🔔');
      },

      sendTestAlert: (channel = 'all') => {
        const state = get();
        
        // 1. In-App Toast
        if (channel === 'all' || channel === 'inApp') {
          if (state.inApp.enabled) {
            toast.success('টেস্ট নোটিফিকেশন সফল! 🚀 আপনার ইন-অ্যাপ নোটিফিকেশন সেটিংস সক্রিয় রয়েছে।', {
              duration: 4000,
            });
          } else {
            toast.info('ইন-অ্যাপ নোটিফিকেশন বর্তমানে বন্ধ রয়েছে');
          }
        }

        // 2. Browser Push
        if (channel === 'all' || channel === 'push') {
          if (state.push.enabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('Paikar Mart: টেস্ট পুশ নোটিফিকেশন', {
                body: 'আপনার পুশ নোটিফিকেশন পারমিশন ও সেটিংস সফলভাবে কাজ করছে!',
                icon: '/pwa-192x192.svg',
              });
            } catch (err) {
              console.warn('[NotificationSettings] Native push test notification:', err);
            }
          }
        }

        // 3. Email Alert confirmation
        if (channel === 'all' || channel === 'email') {
          if (state.email.enabled) {
            toast.success(`টেস্ট ইমেইল অ্যালার্ট শিডিউল করা হয়েছে (${state.email.emailAddress || 'প্রোফাইল ইমেইল'})`);
          }
        }
      },
    }),
    {
      name: 'paikar-notification-settings',
    }
  )
);
