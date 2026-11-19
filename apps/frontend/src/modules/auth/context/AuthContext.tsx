import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { 
  auth, 
  db, 
  googleProvider, 
  facebookProvider, 
  getAccessToken as getFirebaseToken,
  logout as firebaseLogout,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInAnonymously,
  sendEmailVerification,
  FirebaseError,
  type User as FirebaseUser
} from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { safeStorage } from "@/modules/app";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "@/config/roles.config";
import { toast } from "sonner";
import { buildApiUrl } from "@/core/api";
import type { ConfirmationResult } from "firebase/auth";
import { firebaseAuthService } from "@/modules/auth/services/firebaseAuthService";

export type { AppRole, RoleGroup };

export interface VerificationData {
  status: "unverified" | "pending" | "verified" | "rejected";
  idType?: "nid" | "passport" | "birth_certificate" | "trade_license";
  idNumber?: string;
  idDocumentUrl?: string;
  submittedAt?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  documents?: string[];
}

export interface SellerProfileData {
  shopName: string;
  type: "retail" | "wholesale" | "service";
  subType?: string;
  category?: string;
  location?: string;
  address?: string;
  nidOrTradeLicense?: string;
  payoutMethod?: { kind: "bank" | "mobile"; details?: Record<string, string> };
}

export interface FactoryProfileData {
  companyName: string;
  district: string;
  address: string;
  tradeLicenseNo?: string;
  productCategories: string[];
  exportCountries: string[];
  certifications: string[];
  employees: string;
  established: string;
  minOrderQty: string;
  productionCapacity: string;
  membershipBody: string;
  verified: boolean;
  website: string;
}

export interface AppUser {
  id: string;
  fullName: string;
  name?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  avatar?: string;
  handle?: string;
  role: AppRole;
  roles: AppRole[];
  roleGroup: RoleGroup;
  permissions: string[];
  emailVerified?: boolean;
  verification?: VerificationData;
  seller?: SellerProfileData;
  factory?: FactoryProfileData;
  createdAt: string;
}

export interface AuthContextValue {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  role: AppRole;
  roles: AppRole[];
  roleGroup: RoleGroup;
  isCustomer: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  /** Phone OTP: prefer sendPhoneOtp then verifyPhoneOtp */
  loginWithPhone: (phone: string, otpCode: string) => Promise<AppUser>;
  sendPhoneOtp: (phone: string, recaptchaContainerId?: string) => Promise<{ success: boolean; phone: string }>;
  verifyPhoneOtp: (code: string) => Promise<AppUser>;
  login: (email: string, password: string) => Promise<AppUser>;
  loginWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerification: (identifier: string) => Promise<any>;
  verifyVerification: (identifier: string, code: string) => Promise<any>;
  reloadUser: () => Promise<void>;
  resendEmailVerification: () => Promise<{ sent?: boolean; alreadyVerified?: boolean }>;
  submitVerification: (data: VerificationData) => Promise<void>;
  registerUser: (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string }) => Promise<AppUser>;
  registerSeller: (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string; seller: SellerProfileData }) => Promise<AppUser>;
  registerFactory: (input: { fullName: string; phone: string; email: string; password?: string; factory: Record<string, any> }) => Promise<AppUser>;
  hasRole: (roles: AppRole | AppRole[] | string | string[]) => boolean;
  hasRoleGroup: (groups: RoleGroup | RoleGroup[]) => boolean;
  hasPermission: (permission: string) => boolean;
  switchPersonaRole: (targetRole: AppRole) => void;
  promoteToSeller: (shopName: string, type: "retail" | "wholesale" | "service", address: string) => void;
  promoteToCreator: () => Promise<void>;
  syncStatus: SyncStatus;
}

const STORAGE_KEY = "pm.auth.v2";
const TOKEN_KEY = "pm.auth.token.v2";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AppUser | null {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function persistUser(u: AppUser | null) {
  if (u) safeStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  else safeStorage.removeItem(STORAGE_KEY);
}

function persistToken(t: string | null) {
  if (t) {
    safeStorage.setItem(TOKEN_KEY, t);
    safeStorage.setItem("pm_token", t);
    safeStorage.setItem("accessToken", t);
  } else {
    [TOKEN_KEY, "pm_token", "accessToken", "refreshToken", "pm_user_id"].forEach(k => safeStorage.removeItem(k));
  }
}

type SyncStatus = 'idle' | 'syncing' | 'synced' | 'failed';

async function syncUserWithBackend(
  payload: { fullName?: string; name?: string; phone?: string; avatarUrl?: string },
  retryCount = 0
): Promise<any> {
  const MAX_RETRIES = 3;
  try {
    const idToken = await getFirebaseToken(true);
    if (!idToken) return null;
    const res = await fetch(buildApiUrl('/auth/sync'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      const serverToken = data.token || data.accessToken;
      if (serverToken) persistToken(serverToken);
      return data;
    }
    const errorData = await res.json().catch(() => ({}));
    if (res.status === 409) {
      toast.error("Account Conflict: This email is already linked to another account.");
      return null;
    }
    throw new Error(errorData.error || 'Sync failed');
  } catch (err: any) {
    if (retryCount < MAX_RETRIES && (!err.message || !err.message.includes('Conflict'))) {
      await new Promise(r => setTimeout(r, Math.pow(2, retryCount) * 1000));
      return syncUserWithBackend(payload, retryCount + 1);
    }
    throw err;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [user, setUser] = useState<AppUser | null>(() => readStoredUser());
  const lastSyncedUid = React.useRef<string | null>(null);
  const phoneConfirmationRef = React.useRef<ConfirmationResult | null>(null);

  useEffect(() => { persistUser(user); }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
        if (lastSyncedUid.current === currentUser.uid && syncStatus === 'synced') {
          setLoading(false);
          return;
        }
        try {
          setSyncStatus('syncing');
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          let appUser: AppUser;
          if (snap.exists()) {
            const data = snap.data();
            const primaryRole: AppRole = (data.role as AppRole) || "buyer";
            appUser = {
              id: currentUser.uid,
              fullName: data.name || currentUser.displayName || "PaikarMart User",
              name: data.name || currentUser.displayName || "PaikarMart User",
              email: currentUser.email || data.email || "",
              phone: data.phone || currentUser.phoneNumber || "",
              avatarUrl: currentUser.photoURL || data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || currentUser.uid}`,
              avatar: currentUser.photoURL || data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || currentUser.uid}`,
              role: primaryRole,
              roles: Array.isArray(data.roles) ? data.roles : [primaryRole],
              roleGroup: getRoleGroup(primaryRole),
              permissions: getPermissionsForRole(primaryRole, data.verification?.status === "verified"),
              emailVerified: currentUser.emailVerified,
              verification: data.verification || { status: "unverified" },
              seller: data.seller,
              createdAt: data.createdAt || new Date().toISOString(),
            };
          } else {
            const primaryRole: AppRole = "buyer";
            const newDoc = {
              id: currentUser.uid,
              name: currentUser.displayName || (currentUser.isAnonymous ? "Guest User" : "PaikarMart User"),
              email: currentUser.email || "",
              phone: currentUser.phoneNumber || "",
              role: primaryRole,
              roles: [primaryRole],
              avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userRef, newDoc);
            appUser = {
              ...newDoc,
              fullName: newDoc.name,
              roleGroup: getRoleGroup(primaryRole),
              permissions: getPermissionsForRole(primaryRole, false),
              emailVerified: currentUser.emailVerified,
              verification: { status: "unverified" },
            } as AppUser;
          }
          setUser(appUser);
          const syncResult = await syncUserWithBackend({
            fullName: appUser.fullName,
            phone: appUser.phone,
            avatarUrl: appUser.avatarUrl
          });
          if (syncResult) {
            setSyncStatus('synced');
            lastSyncedUid.current = currentUser.uid;
            if (syncResult.user) {
              setUser(prev => prev ? ({ ...prev, role: syncResult.user.role as AppRole } as AppUser) : null);
            }
          } else {
            setSyncStatus('failed');
          }
        } catch (err) {
          console.error("Auth sync fatal error:", err);
          setSyncStatus('failed');
        }
      } else {
        setUser(null);
        persistToken(null);
        setSyncStatus('idle');
        lastSyncedUid.current = null;
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const u = result.user;
        const token = await u.getIdToken();
        persistToken(token);
        syncUserWithBackend({
          fullName: u.displayName || 'Google User',
          phone: u.phoneNumber || '',
          avatarUrl: u.photoURL || undefined
        });
        toast.success("Successfully logged in with Google!");
      }
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) return;
      console.error("Google popup login error:", error);
      toast.error("Google Login failed. Please try again.");
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      if (result.user) toast.success("Successfully logged in with Facebook!");
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') return;
      toast.error("Facebook Login failed");
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      await signInAnonymously(auth);
      setUser({
        id: `guest_${Date.now()}`,
        fullName: "Guest Visitor",
        name: "Guest Visitor",
        phone: "",
        role: "guest" as AppRole,
        roles: ["guest" as AppRole],
        roleGroup: getRoleGroup("buyer"),
        permissions: [],
        createdAt: new Date().toISOString(),
      });
      toast.info("Logged in as Guest");
    } catch (err) {
      console.error("Guest login error:", err);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const u = cred.user;

    if (!u.emailVerified) {
      try { await sendEmailVerification(u); } catch (e) { console.warn('sendEmailVerification on login failed', e); }
      try { await firebaseLogout(); } catch {}
      persistToken(null);
      setUser(null);
      setFirebaseUser(null);
      toast.error('ইমেইল ভেরিফাই করুন। আপনার ইনবক্সে লিংক পাঠানো হয়েছে।');
      const err = new Error('EMAIL_NOT_VERIFIED');
      (err as any).code = 'EMAIL_NOT_VERIFIED';
      throw err;
    }

    const userRef = doc(db, "users", u.uid);
    const snap = await getDoc(userRef);
    let userData: any = snap.exists() ? snap.data() : null;
    if (!userData) {
      userData = {
        id: u.uid,
        email: u.email || email,
        name: u.displayName || email.split("@")[0],
        role: "buyer",
        roles: ["buyer"],
        createdAt: new Date().toISOString(),
      };
      await setDoc(userRef, userData);
    }
    const token = await u.getIdToken();
    persistToken(token);
    const primaryRole: AppRole = (userData.role as AppRole) || "buyer";
    const appUser: AppUser = {
      id: u.uid,
      fullName: userData.name || u.displayName || email.split("@")[0],
      name: userData.name || u.displayName || email.split("@")[0],
      email: userData.email || email,
      phone: userData.phone || "",
      avatarUrl: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || u.uid}`,
      avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || u.uid}`,
      role: primaryRole,
      roles: Array.isArray(userData.roles) ? userData.roles : [primaryRole],
      roleGroup: getRoleGroup(primaryRole),
      permissions: getPermissionsForRole(primaryRole, userData.verification?.status === "verified"),
      emailVerified: u.emailVerified,
      verification: userData.verification || { status: "unverified" },
      seller: userData.seller,
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    setUser(appUser);
    syncUserWithBackend({ fullName: appUser.fullName, phone: appUser.phone, avatarUrl: appUser.avatarUrl });
    toast.success("Logged in successfully!");
    return appUser;
  }, []);

  const sendPhoneOtp = useCallback(async (phone: string, _recaptchaContainerId = 'recaptcha-container') => {
    try {
      const e164 = firebaseAuthService.normalizePhoneE164(phone);
      const confirmation = await firebaseAuthService.sendOtp(e164);
      phoneConfirmationRef.current = confirmation;
      toast.success('OTP পাঠানো হয়েছে');
      return { success: true, phone: e164 };
    } catch (err: any) {
      console.error('sendPhoneOtp', err);
      phoneConfirmationRef.current = null;
      const code = String(err?.code || err?.message || '');
      if (code.includes('invalid-phone') || err?.message === 'INVALID_PHONE') {
        toast.error('সঠিক মোবাইল নম্বর দিন (01XXXXXXXXX)');
      } else if (code.includes('too-many-requests')) {
        toast.error('অনেকবার চেষ্টা হয়েছে — কিছুক্ষণ পর আবার চেষ্টা করুন');
      } else {
        toast.error('OTP পাঠানো যায়নি। Firebase Phone Auth ও domain চেক করুন।');
      }
      throw err;
    }
  }, []);

  const verifyPhoneOtp = useCallback(async (code: string): Promise<AppUser> => {
    const confirmation = phoneConfirmationRef.current;
    if (!confirmation) {
      toast.error('আগে OTP পাঠান');
      throw new Error('OTP_SESSION_EXPIRED');
    }
    try {
      await firebaseAuthService.verifyOtp(confirmation, code);
      const u = auth.currentUser;
      if (!u) throw new Error('PHONE_AUTH_FAILED');

      const token = await u.getIdToken(true);
      persistToken(token);

      const phone = u.phoneNumber || '';
      const userRef = doc(db, 'users', u.uid);
      const snap = await getDoc(userRef);
      let userData: any = snap.exists() ? snap.data() : null;
      if (!userData) {
        userData = {
          id: u.uid,
          name: phone || 'PaikarMart User',
          email: u.email || '',
          phone,
          role: 'buyer',
          roles: ['buyer'],
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, userData);
      }

      const primaryRole: AppRole = (userData.role as AppRole) || 'buyer';
      const appUser: AppUser = {
        id: u.uid,
        fullName: userData.name || phone || 'PaikarMart User',
        name: userData.name || phone || 'PaikarMart User',
        email: userData.email || u.email || '',
        phone: userData.phone || phone,
        avatarUrl: u.photoURL || userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
        avatar: u.photoURL || userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
        role: primaryRole,
        roles: Array.isArray(userData.roles) ? userData.roles : [primaryRole],
        roleGroup: getRoleGroup(primaryRole),
        permissions: getPermissionsForRole(primaryRole, userData.verification?.status === 'verified'),
        emailVerified: u.emailVerified,
        verification: userData.verification || { status: 'unverified' },
        seller: userData.seller,
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      setUser(appUser);
      setFirebaseUser(u);
      phoneConfirmationRef.current = null;
      syncUserWithBackend({ fullName: appUser.fullName, phone: appUser.phone, avatarUrl: appUser.avatarUrl });
      toast.success('মোবাইল OTP দিয়ে লগইন সফল');
      return appUser;
    } catch (err: any) {
      console.error('verifyPhoneOtp', err);
      if (String(err?.code || '').includes('invalid-verification-code') || err?.message === 'INVALID_OTP') {
        toast.error('ভুল OTP কোড');
      } else if (String(err?.code || '').includes('code-expired')) {
        toast.error('OTP মেয়াদ শেষ — আবার পাঠান');
        phoneConfirmationRef.current = null;
      } else {
        toast.error('OTP যাচাই ব্যর্থ');
      }
      throw err;
    }
  }, []);

  const loginWithPhone = useCallback(async (phone: string, otpCode: string): Promise<AppUser> => {
    if (!phoneConfirmationRef.current) {
      await sendPhoneOtp(phone);
    }
    return verifyPhoneOtp(otpCode);
  }, [sendPhoneOtp, verifyPhoneOtp]);

  const logout = useCallback(async () => {
    try { await firebaseLogout(); } catch {}
    setUser(null);
    setFirebaseUser(null);
    persistToken(null);
    phoneConfirmationRef.current = null;
    toast.info("Logged out successfully");
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    await firebaseSendPasswordResetEmail(auth, email);
    toast.success("Password reset email sent!");
  }, []);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setFirebaseUser(auth.currentUser);
      if (user) setUser({ ...user, emailVerified: auth.currentUser.emailVerified });
    }
  }, [user]);

  const resendEmailVerification = useCallback(async () => {
    const u = auth.currentUser;
    if (!u) {
      toast.error('আগে লগইন করুন');
      throw new Error('NOT_SIGNED_IN');
    }
    await u.reload();
    if (u.emailVerified) {
      toast.success('ইমেইল ইতিমধ্যে ভেরিফাইড');
      if (user) setUser({ ...user, emailVerified: true });
      return { alreadyVerified: true as const };
    }
    await sendEmailVerification(u);
    toast.success('ভেরিফিকেশন ইমেইল আবার পাঠানো হয়েছে');
    return { sent: true as const };
  }, [user]);

  const submitVerification = useCallback(async (data: VerificationData) => {
    if (user) {
      setUser({ ...user, verification: { ...data, status: "pending", submittedAt: new Date().toISOString() } });
      toast.success("Verification documents submitted successfully!");
    }
  }, [user]);

  const sendVerification = useCallback(async (identifier: string) => {
    const id = String(identifier || '').trim();
    if (!id.includes('@')) {
      return sendPhoneOtp(id);
    }
    const endpoint = buildApiUrl('/auth/send-otp');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: id, purpose: 'register' }),
    });
    if (!res.ok) throw new Error('কোড পাঠানো সম্ভব হয়নি');
    return res.json();
  }, [sendPhoneOtp]);

  const verifyVerification = useCallback(async (identifier: string, code: string) => {
    const id = String(identifier || '').trim();
    if (!id.includes('@')) {
      return verifyPhoneOtp(code);
    }
    const endpoint = buildApiUrl('/auth/verify-otp');
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: id, otp: code }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'ভুল ওটিপি কোড');
    }
    return res.json();
  }, [verifyPhoneOtp]);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string }): Promise<AppUser> => {
    const cleanEmail = input.email && input.email.includes('@') ? input.email.trim().toLowerCase() : '';
    const cleanPhone = input.phone ? input.phone.trim().replace(/[^0-9]/g, '') : '';
    if (!cleanEmail) {
      toast.error('ইমেইল প্রয়োজন — অথবা মোবাইল OTP দিয়ে sendPhoneOtp/verifyPhoneOtp ব্যবহার করুন');
      throw new Error('EMAIL_REQUIRED_FOR_PASSWORD_REGISTER');
    }
    const password = input.password || 'Paikar123456!';
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    const u = cred.user;
    try {
      await sendEmailVerification(u);
      toast.message('ইমেইল ভেরিফিকেশন লিংক পাঠানো হয়েছে — ইনবক্স চেক করুন');
    } catch {}
    try { await firebaseLogout(); } catch {}
    persistToken(null);
    setUser(null);
    toast.success('রেজিস্ট্রেশন সম্পন্ন! ইমেইল ভেরিফাই করে তারপর লগইন করুন।');
    return {
      id: u.uid,
      fullName: input.fullName || input.name || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: cleanPhone,
      role: 'buyer',
      roles: ['buyer'],
      roleGroup: getRoleGroup('buyer'),
      permissions: getPermissionsForRole('buyer', false),
      emailVerified: false,
      verification: { status: 'unverified' },
      createdAt: new Date().toISOString(),
    };
  }, []);

  const registerSeller = useCallback(async (input: any): Promise<AppUser> => {
    const userEmail = (input.email || '').trim().toLowerCase();
    const password = input.password || 'Paikar123456!';
    const cred = await createUserWithEmailAndPassword(auth, userEmail, password);
    const u = cred.user;
    try { await sendEmailVerification(u); } catch {}
    toast.success('Seller registered — verify email then login');
    try { await firebaseLogout(); } catch {}
    return {
      id: u.uid,
      fullName: input.fullName || userEmail,
      email: userEmail,
      role: 'seller' as AppRole,
      roles: ['seller' as AppRole],
      roleGroup: getRoleGroup('seller' as AppRole),
      permissions: [],
      emailVerified: false,
      seller: input.seller,
      createdAt: new Date().toISOString(),
    };
  }, []);

  const registerFactory = useCallback(async (input: any): Promise<AppUser> => {
    toast.success('Factory account registered successfully!');
    return {
      id: `factory_${Date.now()}`,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      role: 'buyer',
      roles: ['buyer'],
      roleGroup: getRoleGroup('buyer'),
      permissions: [],
      createdAt: new Date().toISOString(),
    };
  }, []);

  const hasRole = useCallback((roles: AppRole | AppRole[] | string | string[]) => {
    if (!user) return false;
    const list = Array.isArray(roles) ? roles : [roles];
    return list.some(r => user.roles?.includes(r as AppRole) || user.role === r);
  }, [user]);

  const hasRoleGroup = useCallback((groups: RoleGroup | RoleGroup[]) => {
    if (!user) return false;
    const list = Array.isArray(groups) ? groups : [groups];
    return list.includes(user.roleGroup);
  }, [user]);

  const hasPermission = useCallback((permission: string) => !!user?.permissions?.includes(permission), [user]);

  const switchPersonaRole = useCallback((targetRole: AppRole) => {
    if (!user) return;
    setUser({ ...user, role: targetRole, roles: Array.from(new Set([...(user.roles || []), targetRole])), roleGroup: getRoleGroup(targetRole) });
  }, [user]);

  const promoteToSeller = useCallback((shopName: string, type: "retail" | "wholesale" | "service", address: string) => {
    if (!user) return;
    setUser({
      ...user,
      role: 'seller' as AppRole,
      roles: Array.from(new Set([...(user.roles || []), 'seller' as AppRole])),
      roleGroup: getRoleGroup('seller' as AppRole),
      seller: { shopName, type, address },
    });
  }, [user]);

  const promoteToCreator = useCallback(async () => {
    if (!user) return;
    setUser({ ...user, role: 'creator' as AppRole, roles: Array.from(new Set([...(user.roles || []), 'creator' as AppRole])), roleGroup: getRoleGroup('creator' as AppRole) });
  }, [user]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    firebaseUser,
    isAuthenticated: !!user && user.role !== ('guest' as AppRole),
    isLoading: loading,
    loading,
    role: user?.role || ('guest' as AppRole),
    roles: user?.roles || [],
    roleGroup: user?.roleGroup || getRoleGroup('buyer'),
    isCustomer: user?.roleGroup === 'customer' || user?.role === 'buyer',
    isVendor: user?.roleGroup === 'vendor' || !!user?.seller,
    isAdmin: user?.role === 'admin',
    isSeller: !!user?.seller || user?.role === 'seller',
    loginWithPhone,
    sendPhoneOtp,
    verifyPhoneOtp,
    login,
    loginWithGoogle,
    signInWithGoogle: loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    logout,
    signOut: logout,
    sendPasswordReset,
    sendVerification,
    verifyVerification,
    reloadUser,
    resendEmailVerification,
    submitVerification,
    registerUser,
    registerSeller,
    registerFactory,
    hasRole,
    hasRoleGroup,
    hasPermission,
    switchPersonaRole,
    promoteToSeller,
    promoteToCreator,
    syncStatus,
  }), [user, firebaseUser, loading, syncStatus, loginWithPhone, sendPhoneOtp, verifyPhoneOtp, login, loginWithGoogle, loginWithFacebook, loginAsGuest, logout, sendPasswordReset, sendVerification, verifyVerification, reloadUser, resendEmailVerification, submitVerification, registerUser, registerSeller, registerFactory, hasRole, hasRoleGroup, hasPermission, switchPersonaRole, promoteToSeller, promoteToCreator]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
