import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  User as FirebaseUser, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInAnonymously
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { safeStorage } from "@/modules/app/utils/storage";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "@/config/roles.config";
import { toast } from "sonner";

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
  
  // Auth Operations
  loginWithPhone: (phone: string, password: string) => Promise<AppUser>;
  login: (email: string, password: string) => Promise<AppUser>;
  loginWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  
  // Password & Verification
  sendPasswordReset: (email: string) => Promise<void>;
  reloadUser: () => Promise<void>;
  submitVerification: (data: VerificationData) => Promise<void>;
  
  // Registration
  registerUser: (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string }) => Promise<AppUser>;
  registerSeller: (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string; seller: SellerProfileData }) => Promise<AppUser>;
  registerFactory: (input: { fullName: string; phone: string; email: string; password?: string; factory: Record<string, any> }) => Promise<AppUser>;
  
  // Role & Permission Checks
  hasRole: (roles: AppRole | AppRole[] | string | string[]) => boolean;
  hasRoleGroup: (groups: RoleGroup | RoleGroup[]) => boolean;
  hasPermission: (permission: string) => boolean;
  switchPersonaRole: (targetRole: AppRole) => void;
  promoteToSeller: (shopName: string, type: "retail" | "wholesale" | "service", address: string) => void;
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
    safeStorage.removeItem(TOKEN_KEY);
    safeStorage.removeItem("pm_token");
    safeStorage.removeItem("accessToken");
    safeStorage.removeItem("refreshToken");
  }
}

function uid(prefix = "u") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(() => readStoredUser());

  // Sync state to storage
  useEffect(() => {
    persistUser(user);
  }, [user]);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        // Map firebase user to AppUser if not present
        setUser((prev) => {
          if (prev && prev.id === currentUser.uid) {
            return { ...prev, emailVerified: currentUser.emailVerified };
          }
          const primaryRole: AppRole = "buyer";
          return {
            id: currentUser.uid,
            fullName: currentUser.displayName || (currentUser.isAnonymous ? "Guest User" : "PaikarMart User"),
            name: currentUser.displayName || "PaikarMart User",
            email: currentUser.email || "",
            phone: currentUser.phoneNumber || "",
            avatarUrl: currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            avatar: currentUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
            role: primaryRole,
            roles: ["buyer"],
            roleGroup: getRoleGroup(primaryRole),
            permissions: getPermissionsForRole(primaryRole, false),
            emailVerified: currentUser.emailVerified,
            verification: { status: "unverified" },
            createdAt: new Date().toISOString(),
          };
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const u = result.user;
        const next: AppUser = {
          id: u.uid,
          fullName: u.displayName || "Google User",
          name: u.displayName || "Google User",
          email: u.email || "",
          phone: u.phoneNumber || "",
          avatarUrl: u.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          avatar: u.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          role: "buyer",
          roles: ["buyer"],
          roleGroup: getRoleGroup("buyer"),
          permissions: getPermissionsForRole("buyer", true),
          emailVerified: u.emailVerified,
          verification: { status: "verified" },
          createdAt: new Date().toISOString(),
        };
        setUser(next);
        toast.success("Successfully logged in with Google!");
      }
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) {
        console.info("Google login popup closed by user");
        return;
      }
      console.warn("Google popup login failed/blocked, using dev fallback user:", error);
      const mockUser: AppUser = {
        id: `google_${Date.now()}`,
        fullName: "Google Test User",
        name: "Google Test User",
        email: "google.user@paikarmart.com",
        phone: "01700000000",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: "buyer",
        roles: ["buyer"],
        roleGroup: getRoleGroup("buyer"),
        permissions: getPermissionsForRole("buyer", true),
        emailVerified: true,
        verification: { status: "verified" },
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      toast.success("Logged in with Google (Dev Mode)");
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      if (result.user) {
        toast.success("Successfully logged in with Facebook!");
      }
    } catch (error) {
      if (error instanceof FirebaseError && error.code === 'auth/popup-closed-by-user') return;
      console.error("Facebook Login Error:", error);
      toast.error("Facebook Login failed");
    }
  }, []);

  const loginAsGuest = useCallback(async () => {
    try {
      await signInAnonymously(auth);
      const guestUser: AppUser = {
        id: `guest_${Date.now()}`,
        fullName: "Guest Visitor",
        name: "Guest Visitor",
        phone: "",
        role: "guest" as AppRole,
        roles: ["guest" as AppRole],
        roleGroup: getRoleGroup("buyer"),
        permissions: [],
        createdAt: new Date().toISOString(),
      };
      setUser(guestUser);
      toast.info("Logged in as Guest");
    } catch (err) {
      console.error("Guest login error:", err);
    }
  }, []);

  const loginWithPhone = useCallback(async (phone: string, password: string): Promise<AppUser> => {
    const role: AppRole = "buyer";
    const next: AppUser = {
      id: uid("u"),
      fullName: phone,
      name: phone,
      phone,
      role,
      roles: ["buyer", role],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      verification: { status: "unverified" },
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    persistToken(`token_${Date.now()}`);
    toast.success(`Welcome back ${phone}!`);
    return next;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    const role: AppRole = "buyer";
    const next: AppUser = {
      id: uid("u"),
      fullName: email.split("@")[0],
      name: email.split("@")[0],
      email,
      phone: "",
      role,
      roles: ["buyer"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      verification: { status: "unverified" },
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    persistToken(`token_${Date.now()}`);
    toast.success("Logged in successfully!");
    return next;
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    setFirebaseUser(null);
    persistToken(null);
    safeStorage.removeItem(STORAGE_KEY);
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
      if (user) {
        setUser({ ...user, emailVerified: auth.currentUser.emailVerified });
      }
    }
  }, [user]);

  const submitVerification = useCallback(async (data: VerificationData) => {
    if (user) {
      const updatedUser: AppUser = {
        ...user,
        verification: { ...data, status: "pending", submittedAt: new Date().toISOString() }
      };
      setUser(updatedUser);
      toast.success("Verification documents submitted successfully!");
    }
  }, [user]);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt">): Promise<AppUser> => {
    const role: AppRole = "buyer";
    const next: AppUser = {
      ...input,
      id: uid("u"),
      role,
      roles: ["buyer"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    toast.success("Account registered successfully!");
    return next;
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { seller: SellerProfileData }): Promise<AppUser> => {
    const role: AppRole = "seller";
    const next: AppUser = {
      ...input,
      id: uid("s"),
      role,
      roles: ["buyer", "seller"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    toast.success("Seller store registered successfully!");
    return next;
  }, []);

  const registerFactory = useCallback(async (input: { fullName: string; phone: string; email: string; factory: Record<string, any> }): Promise<AppUser> => {
    const role: AppRole = "factory";
    const next: AppUser = {
      id: uid("f"),
      fullName: input.fullName,
      name: input.fullName,
      phone: input.phone,
      email: input.email,
      role,
      roles: ["buyer", "factory"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      factory: input.factory as FactoryProfileData,
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    toast.success("Factory account registered successfully!");
    return next;
  }, []);

  const hasRole = useCallback((targetRoles: AppRole | AppRole[] | string | string[]) => {
    if (!user) return false;
    const targets = Array.isArray(targetRoles) ? targetRoles : [targetRoles];
    return targets.some((r) => user.roles.includes(r as AppRole) || user.role === r);
  }, [user]);

  const hasRoleGroup = useCallback((targetGroups: RoleGroup | RoleGroup[]) => {
    if (!user) return false;
    const groups = Array.isArray(targetGroups) ? targetGroups : [targetGroups];
    return groups.includes(user.roleGroup);
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    return user.permissions?.includes(permission) ?? false;
  }, [user]);

  const switchPersonaRole = useCallback((targetRole: AppRole) => {
    if (user) {
      setUser({
        ...user,
        role: targetRole,
        roleGroup: getRoleGroup(targetRole),
        permissions: getPermissionsForRole(targetRole, user.verification?.status === "verified")
      });
      toast.info(`Switched role persona to ${targetRole}`);
    }
  }, [user]);

  const promoteToSeller = useCallback((shopName: string, type: "retail" | "wholesale" | "service", address: string) => {
    if (user) {
      const sellerData: SellerProfileData = { shopName, type, address };
      const updated: AppUser = {
        ...user,
        role: "seller",
        roles: Array.from(new Set([...user.roles, "seller" as AppRole])),
        seller: sellerData,
        roleGroup: getRoleGroup("seller"),
        permissions: getPermissionsForRole("seller", false)
      };
      setUser(updated);
      toast.success("Promoted to Seller!");
    }
  }, [user]);

  const value: AuthContextValue = useMemo(() => ({
    user,
    firebaseUser,
    isAuthenticated: !!user || !!firebaseUser,
    isLoading: loading,
    loading,
    role: user?.role ?? "buyer",
    roles: user?.roles ?? ["buyer"],
    roleGroup: user?.roleGroup ?? getRoleGroup("buyer"),
    isCustomer: (user?.roleGroup ?? getRoleGroup("buyer")) === "customer",
    isVendor: (user?.roleGroup ?? getRoleGroup("buyer")) === "vendor" || user?.role === "factory",
    isAdmin: user?.role === "admin" || user?.role === "super_admin",
    isSeller: user?.role === "seller" || user?.roles?.includes("seller"),
    
    loginWithPhone,
    login,
    loginWithGoogle,
    signInWithGoogle: loginWithGoogle,
    loginWithFacebook,
    loginAsGuest,
    logout,
    signOut: logout,
    
    sendPasswordReset,
    reloadUser,
    submitVerification,
    
    registerUser,
    registerSeller,
    registerFactory,
    
    hasRole,
    hasRoleGroup,
    hasPermission,
    switchPersonaRole,
    promoteToSeller
  }), [
    user, firebaseUser, loading,
    loginWithPhone, login, loginWithGoogle, loginWithFacebook, loginAsGuest, logout,
    sendPasswordReset, reloadUser, submitVerification,
    registerUser, registerSeller, registerFactory,
    hasRole, hasRoleGroup, hasPermission, switchPersonaRole, promoteToSeller
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export const AppAuthProvider = AuthProvider;
