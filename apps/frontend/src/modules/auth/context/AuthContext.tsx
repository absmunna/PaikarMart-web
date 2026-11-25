import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  auth,
  db,
  googleProvider,
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
  type User as FirebaseUser,
} from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
  registerUser: (input: any) => Promise<AppUser>;
  registerSeller: (input: any) => Promise<AppUser>;
  registerFactory: (input: any) => Promise<AppUser>;
  hasRole: (roles: AppRole | AppRole[] | string | string[]) => boolean;
  hasRoleGroup: (groups: RoleGroup | RoleGroup[]) => boolean;
  hasPermission: (permission: string) => boolean;
  switchPersonaRole: (targetRole: AppRole) => void;
  promoteToSeller: (shopName: string, type: "retail" | "wholesale" | "service", address: string) => void;
  promoteToCreator: () => Promise<void>;
  syncStatus: "idle" | "syncing" | "synced" | "failed";
}

const STORAGE_KEY = "pm.auth.v2";
const TOKEN_KEY = "pm.auth.token.v2";
const AuthContext = createContext<AuthContextValue | null>(null);

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
    [TOKEN_KEY, "pm_token", "accessToken", "refreshToken", "pm_user_id"].forEach((k) => safeStorage.removeItem(k));
  }
}

async function syncUserWithBackend(payload: { fullName?: string; phone?: string; avatarUrl?: string }) {
  try {
    const idToken = await getFirebaseToken(true);
    if (!idToken) return null;
    const res = await fetch(buildApiUrl("/auth/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.token || data.accessToken) persistToken(data.token || data.accessToken);
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

function mapDocToUser(uid: string, data: any, currentUser: FirebaseUser): AppUser {
  const primaryRole: AppRole = (data?.role as AppRole) || "buyer";
  return {
    id: uid,
    fullName: data?.name || currentUser.displayName || "PaikarMart User",
    name: data?.name || currentUser.displayName || "PaikarMart User",
    email: currentUser.email || data?.email || "",
    phone: data?.phone || currentUser.phoneNumber || "",
    avatarUrl: currentUser.photoURL || data?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
    avatar: currentUser.photoURL || data?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
    role: primaryRole,
    roles: Array.isArray(data?.roles) ? data.roles : [primaryRole],
    roleGroup: getRoleGroup(primaryRole),
    permissions: getPermissionsForRole(primaryRole, data?.verification?.status === "verified"),
    emailVerified: currentUser.emailVerified,
    verification: data?.verification || { status: "unverified" },
    seller: data?.seller,
    createdAt: data?.createdAt || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "synced" | "failed">("idle");
  const [user, setUser] = useState<AppUser | null>(null);
  const phoneConfirmationRef = React.useRef<ConfirmationResult | null>(null);

  useEffect(() => {
    persistUser(user);
  }, [user]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      if (!currentUser) {
        setUser(null);
        persistToken(null);
        setSyncStatus("idle");
        setLoading(false);
        return;
      }
      try {
        setSyncStatus("syncing");
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setUser(mapDocToUser(currentUser.uid, snap.data(), currentUser));
        } else {
          const newDoc = {
            id: currentUser.uid,
            name: currentUser.displayName || (currentUser.isAnonymous ? "Guest User" : "PaikarMart User"),
            email: currentUser.email || "",
            phone: currentUser.phoneNumber || "",
            role: "buyer",
            roles: ["buyer"],
            avatarUrl: currentUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, newDoc);
          setUser(mapDocToUser(currentUser.uid, newDoc, currentUser));
        }
        const syncResult = await syncUserWithBackend({
          fullName: currentUser.displayName || undefined,
          phone: currentUser.phoneNumber || undefined,
          avatarUrl: currentUser.photoURL || undefined,
        });
        setSyncStatus(syncResult ? "synced" : "failed");
        if (syncResult?.user?.role) {
          setUser((prev) => (prev ? { ...prev, role: syncResult.user.role as AppRole } : prev));
        }
      } catch (e) {
        console.error("Auth sync error", e);
        setSyncStatus("failed");
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const u = cred.user;
    if (!u.emailVerified) {
      try {
        await sendEmailVerification(u);
      } catch {}
      try {
        await firebaseLogout();
      } catch {}
      persistToken(null);
      setUser(null);
      toast.error("ইমেইল ভেরিফাই করুন।");
      const err = new Error("EMAIL_NOT_VERIFIED");
      (err as any).code = "EMAIL_NOT_VERIFIED";
      throw err;
    }
    const token = await u.getIdToken();
    persistToken(token);
    toast.success("Logged in successfully!");
    return mapDocToUser(u.uid, {}, u);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        persistToken(await result.user.getIdToken());
        toast.success("Successfully logged in with Google!");
      }
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request")) return;
      toast.error("Google Login failed");
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseLogout();
    setUser(null);
    persistToken(null);
  }, []);

  const sendPhoneOtp = useCallback(async (phone: string) => {
    const e164 = firebaseAuthService.normalizePhoneE164(phone);
    const confirmation = await firebaseAuthService.sendOtp(e164);
    phoneConfirmationRef.current = confirmation;
    toast.success("OTP পাঠানো হয়েছে");
    return { success: true, phone: e164 };
  }, []);

  const verifyPhoneOtp = useCallback(async (code: string) => {
    const confirmation = phoneConfirmationRef.current;
    if (!confirmation) throw new Error("OTP_SESSION_EXPIRED");
    await firebaseAuthService.verifyOtp(confirmation, code);
    const u = auth.currentUser;
    if (!u) throw new Error("PHONE_AUTH_FAILED");
    persistToken(await u.getIdToken(true));
    phoneConfirmationRef.current = null;
    toast.success("মোবাইল OTP দিয়ে লগইন সফল");
    return mapDocToUser(u.uid, { phone: u.phoneNumber }, u);
  }, []);

  const registerUser = useCallback(async (input: any) => {
    const email = (input.email || "").trim().toLowerCase();
    const password = input.password;
    if (!email) throw new Error("EMAIL_REQUIRED");
    if (!password || String(password).length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের দিতে হবে");
      throw new Error("PASSWORD_REQUIRED");
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    try {
      await sendEmailVerification(cred.user);
    } catch {}
    try {
      await firebaseLogout();
    } catch {}
    toast.message("ইমেইল ভেরিফিকেশন লিংক পাঠানো হয়েছে");
    return mapDocToUser(cred.user.uid, { name: input.fullName, email }, cred.user);
  }, []);

  const switchPersonaRole = useCallback(
    (targetRole: AppRole) => {
      if (!user) return;
      const granted = new Set([user.role, ...(user.roles || [])]);
      if (!granted.has(targetRole)) {
        toast.error("এই রোল এখনো unlock হয়নি। Seller/Creator হতে KYC সম্পন্ন করুন।");
        return;
      }
      setUser({
        ...user,
        role: targetRole,
        roleGroup: getRoleGroup(targetRole),
        permissions: getPermissionsForRole(targetRole, user.verification?.status === "verified"),
      });
    },
    [user]
  );

  const promoteToSeller = useCallback(
    (shopName: string, type: "retail" | "wholesale" | "service", address: string) => {
      if (!user) return;
      const draftSeller = { shopName, type, address };
      setUser({ ...user, seller: draftSeller });
      (async () => {
        try {
          const idToken = await getFirebaseToken(true);
          if (!idToken) {
            toast.message("Seller প্রোফাইল ড্রাফট — KYC পর অ্যাকটিভ হবে");
            return;
          }
          const res = await fetch(buildApiUrl("/auth/promote-seller"), {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
            body: JSON.stringify(draftSeller),
          });
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const nextRole = (data?.user?.role || "seller") as AppRole;
            setUser((prev) =>
              prev
                ? {
                    ...prev,
                    role: nextRole,
                    roles: Array.from(new Set([...(prev.roles || []), nextRole])),
                    roleGroup: getRoleGroup(nextRole),
                    seller: draftSeller,
                  }
                : prev
            );
            toast.success("Seller রোল অ্যাকটিভ হয়েছে");
          } else {
            toast.message("Seller প্রোফাইল ড্রাফট — অ্যাডমিন অনুমোদনের পর রোল অ্যাকটিভ হবে");
          }
        } catch {
          toast.message("Seller প্রোফাইল ড্রাফট — ব্যাকএন্ড অনুমোদন প্রয়োজন");
        }
      })();
    },
    [user]
  );

  const promoteToCreator = useCallback(async () => {
    if (!user) return;
    toast.message("Creator রোল ব্যাকএন্ড অনুমোদন ছাড়া অ্যাকটিভ হবে না");
  }, [user]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      firebaseUser,
      isAuthenticated: !!user && !!firebaseUser,
      isLoading: loading,
      loading,
      role: user?.role || ("buyer" as AppRole),
      roles: user?.roles || [],
      roleGroup: user?.roleGroup || getRoleGroup("buyer"),
      isCustomer: user?.roleGroup === "customer" || user?.role === "buyer",
      isVendor: !!user?.roles?.some((r) => ["seller", "wholesale", "factory"].includes(r)),
      isAdmin: user?.role === "admin",
      isSeller: !!user?.roles?.includes("seller" as AppRole) || user?.role === "seller",
      loginWithPhone: async (phone, otp) => {
        await sendPhoneOtp(phone);
        return verifyPhoneOtp(otp);
      },
      sendPhoneOtp,
      verifyPhoneOtp,
      login,
      loginWithGoogle,
      signInWithGoogle: loginWithGoogle,
      loginWithFacebook: async () => {
        toast.error("Facebook login temporarily unavailable");
      },
      loginAsGuest: async () => {
        await signInAnonymously(auth);
        toast.info("Logged in as Guest");
      },
      logout,
      signOut: logout,
      sendPasswordReset: async (email: string) => {
        await firebaseSendPasswordResetEmail(auth, email);
        toast.success("Password reset email sent");
      },
      sendVerification: async (id: string) => (id.includes("@") ? null : sendPhoneOtp(id)),
      verifyVerification: async (id: string, code: string) => (id.includes("@") ? null : verifyPhoneOtp(code)),
      reloadUser: async () => {},
      resendEmailVerification: async () => {
        if (auth.currentUser) await sendEmailVerification(auth.currentUser);
        return { sent: true };
      },
      submitVerification: async (data) => {
        if (user) setUser({ ...user, verification: { ...data, status: "pending" } });
      },
      registerUser,
      registerSeller: async (input) => registerUser({ ...input, fullName: input.fullName }),
      registerFactory: async (input) => {
        toast.success("Factory registration received");
        return mapDocToUser(`factory_${Date.now()}`, input, { uid: `factory_${Date.now()}` } as any);
      },
      hasRole: (roles) => {
        if (!user) return false;
        const list = Array.isArray(roles) ? roles : [roles];
        return list.some((r) => user.roles?.includes(r as AppRole) || user.role === r);
      },
      hasRoleGroup: (groups) => {
        if (!user) return false;
        const list = Array.isArray(groups) ? groups : [groups];
        return list.includes(user.roleGroup);
      },
      hasPermission: (p) => !!user?.permissions?.includes(p),
      switchPersonaRole,
      promoteToSeller,
      promoteToCreator,
      syncStatus,
    }),
    [user, firebaseUser, loading, syncStatus, login, loginWithGoogle, logout, sendPhoneOtp, verifyPhoneOtp, registerUser, switchPersonaRole, promoteToSeller, promoteToCreator]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
