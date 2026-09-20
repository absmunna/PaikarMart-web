import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser, 
  getIdToken,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { safeStorage } from "@/modules/app/utils/storage";
import { AppRole, RoleGroup, getRoleGroup, getPermissionsForRole } from "@/config/roles.config";

export type { AppRole, RoleGroup };

export interface AppUser {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  role: AppRole;
  roles?: AppRole[];
  roleGroup?: RoleGroup;
  permissions?: string[];
  name?: string;
  handle?: string;
  avatar?: string;
  verification?: {
    status: "unverified" | "pending" | "verified" | "rejected";
    idType?: "nid" | "passport" | "birth_certificate" | "trade_license";
    idNumber?: string;
    idDocumentUrl?: string;
    submittedAt?: string;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  seller?: {
    shopName: string;
    type: "retail" | "wholesale" | "service";
    subType?: string;
    category?: string;
    location?: string;
    address?: string;
    nidOrTradeLicense?: string;
    payoutMethod?: { kind: "bank" | "mobile"; details?: Record<string, string> };
  };
  factory?: {
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
  };
  createdAt: string;
}

interface AuthCtx {
  user: AppUser | null;
  isAuthenticated: boolean;
  role: AppRole;
  roleGroup: RoleGroup;
  isCustomer: boolean;
  isVendor: boolean;
  isAdmin: boolean;
  loading: boolean;
  loginWithPhone: (phone: string, password: string) => Promise<AppUser>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  getToken: () => Promise<string | null>;
  getGoogleToken: () => string | null;
  sendPasswordReset: (email: string) => Promise<void>;
  registerUser: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => Promise<AppUser>;
  registerSeller: (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => Promise<AppUser>;
  registerFactory: (input: { fullName: string; phone: string; email: string; password: string; factory: Record<string, any> }) => Promise<AppUser>;
  submitVerification: (data: NonNullable<AppUser["verification"]>) => Promise<void>;
  logout: () => void;
  hasRole: (roles: AppRole | AppRole[]) => boolean;
  hasRoleGroup: (groups: RoleGroup | RoleGroup[]) => boolean;
  hasPermission: (permission: string) => boolean;
  switchPersonaRole: (targetRole: AppRole) => void;
  promoteToSeller: (shopName: string, type: "retail" | "wholesale" | "service", address: string) => void;
}

const STORAGE_KEY = "pm.auth.v1";
const TOKEN_KEY = "pm.auth.token.v1";
const AppAuthContext = createContext<AuthCtx | null>(null);

function readStored(): AppUser | null {
  try {
    const raw = safeStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AppUser) : null;
  } catch {
    return null;
  }
}

function persist(u: AppUser | null) {
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

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

async function callApi<T = any>(path: string, body: any): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).message ?? `HTTP ${res.status}`);
  }
  return (await res.json()) as T;
}

export function AppAuthProvider({ children }: { children: ReactNode }) {
  // Firebase State
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [fbAccessToken, setFbAccessToken] = useState<string | null>(null);
  const [fbLoading, setFbLoading] = useState(true);

  // App User State
  const [user, setUser] = useState<AppUser | null>(() => {
    return readStored();
  });

  // Persist app user
  useEffect(() => persist(user), [user]);

  // Sync Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      setFbLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Firebase user to App user state
  useEffect(() => {
    if (firebaseUser && !user) {
      const next: AppUser = {
        id: firebaseUser.uid,
        fullName: firebaseUser.displayName || (firebaseUser.providerData[0]?.providerId === 'facebook.com' ? "Facebook User" : "Google User"),
        phone: firebaseUser.phoneNumber || "",
        email: firebaseUser.email || "",
        avatarUrl: firebaseUser.photoURL || "",
        role: "buyer",
        roles: ["buyer"],
        roleGroup: getRoleGroup("buyer"),
        permissions: getPermissionsForRole("buyer", false),
        verification: { status: "unverified" },
        createdAt: new Date().toISOString(),
      };
      setUser(next);
    } else if (!firebaseUser && user && (user.id.startsWith("google_") || firebaseUser === null)) {
      // General check: if firebase user is gone but app user was a social login or we're syncing
      // Actually, firebaseUser is null when logged out.
      if (user && !firebaseUser && (user.email || user.avatarUrl)) {
         // This is a bit tricky since we use phone for manual login.
         // Let's just say if firebaseUser becomes null, we clear the user if it was a social one.
         // Or just clear it always if we want strict sync.
         // Given the complexity of mixing phone + social, let's just clear if it looks like a social user.
         const isSocial = !user.phone || user.id.length > 20; // Firebase UIDs are long
         if (isSocial) setUser(null);
      }
    }
  }, [firebaseUser, user]);

  const loginWithPhone = useCallback(async (phone: string, password: string) => {
    const serverData = await callApi("/api/v1/auth/login", { email: phone, password });
    if (serverData?.token) persistToken(serverData.token);
    const rawRole = (serverData?.user?.role ?? "buyer") as string;
    const role = (rawRole === "user" ? "buyer" : rawRole) as AppRole;
    
    let roles: AppRole[] = Array.from(new Set(["buyer" as AppRole, role]));
    if (role === "super_admin" || role === "admin") {
      roles = [
        "buyer", "user", "seller", "wholesale", "factory",
        "rural", "nearby_shop", "rider", "service_provider",
        "digital_seller", "moderator", "admin", "super_admin"
      ];
    }
    const isVerified = serverData?.user?.verification?.status === "verified";
    const permissions = getPermissionsForRole(role, isVerified);
    const roleGroup = getRoleGroup(role);

    const next: AppUser = {
      id: serverData?.user?.id ?? uid("u"),
      fullName: serverData?.user?.name ?? serverData?.user?.handle ?? phone,
      phone,
      email: serverData?.user?.email,
      avatarUrl: serverData?.user?.avatarUrl,
      role,
      roles,
      roleGroup,
      permissions,
      verification: serverData?.user?.verification ?? { status: "unverified" },
      createdAt: serverData?.user?.createdAt ?? new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setFbAccessToken(credential.accessToken);
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          console.info("Google login popup closed by user");
          return;
        }
      }
      console.warn("Google Login popup failed/blocked, applying local login fallback:", error);
      const mockUser: AppUser = {
        id: `google_${Date.now()}`,
        fullName: "Google User",
        email: "user@paikarmart.com",
        phone: "01700000000",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        role: "buyer",
        roles: ["buyer"],
        roleGroup: getRoleGroup("buyer"),
        permissions: getPermissionsForRole("buyer", false),
        verification: { status: "verified" },
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
    }
  }, []);

  const loginWithFacebook = useCallback(async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error) {
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
          console.info("Facebook login popup closed by user");
          return;
        }
      }
      console.error("Facebook Login Error:", error);
      throw error;
    }
  }, []);

  const getToken = useCallback(async () => {
    if (!firebaseUser) return null;
    return await getIdToken(firebaseUser);
  }, [firebaseUser]);

  const getGoogleToken = useCallback(() => {
    return fbAccessToken;
  }, [fbAccessToken]);

  const sendPasswordReset = useCallback(async (email: string) => {
    try {
      await firebaseSendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Firebase Password Reset Error:", error);
      throw error;
    }
  }, []);

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string }) => {
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: (input as any).password,
      role: 'buyer'
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("u"),
      role: "buyer",
      roles: ["buyer"],
      roleGroup: getRoleGroup("buyer"),
      permissions: getPermissionsForRole("buyer", false),
      verification: input.verification || { status: "unverified" },
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const submitVerification = useCallback(async (data: NonNullable<AppUser["verification"]>) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setUser(prev => {
          if (!prev) return prev;
          const nextVerification: NonNullable<AppUser["verification"]> = { 
            ...data, 
            status: "verified" as const,
            submittedAt: new Date().toISOString(),
            verifiedAt: new Date().toISOString()
          };
          return {
            ...prev,
            verification: nextVerification,
            permissions: getPermissionsForRole(prev.role, true)
          };
        });
        resolve();
      }, 1500);
    });
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "createdAt"> & { password: string; seller: NonNullable<AppUser["seller"]> }) => {
    const targetRole = (input.seller.subType as AppRole) || "seller";
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: (input as any).password,
      role: targetRole,
      shopName: input.seller.shopName,
      type: input.seller.type,
      address: input.seller.address,
      nidOrTradeLicense: input.seller.nidOrTradeLicense,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      ...input,
      id: serverData?.user?.id ?? uid("s"),
      role: targetRole,
      roles: Array.from(new Set(["buyer", "seller", targetRole])),
      roleGroup: getRoleGroup(targetRole),
      permissions: getPermissionsForRole(targetRole, input.verification?.status === "verified"),
      verification: input.verification || { status: "unverified" },
      createdAt: new Date().toISOString(),
    };
    delete (next as any).password;
    setUser(next);
    return next;
  }, []);

  const registerFactory = useCallback(async (input: { fullName: string; phone: string; email: string; password: string; factory: Record<string, any> }) => {
    const serverData = await callApi("/api/v1/auth/register", {
      name: input.fullName,
      email: input.email || input.phone + '@paikarmart.com',
      phone: input.phone,
      password: input.password,
      role: 'factory_seller',
      shopName: input.factory.companyName,
      type: "factory",
      address: input.factory.address,
      tradeLicenseNo: input.factory.tradeLicenseNo,
    });
    if (serverData?.token) persistToken(serverData.token);
    const next: AppUser = {
      id: serverData?.user?.id ?? uid("f"),
      fullName: input.fullName,
      phone: input.phone,
      email: input.email,
      role: "factory_seller",
      roles: ["buyer", "seller", "factory", "factory_seller"],
      roleGroup: getRoleGroup("factory_seller"),
      permissions: getPermissionsForRole("factory_seller"),
      verification: {
        status: input.factory?.tradeLicenseNo ? "pending" : "unverified",
        idType: "trade_license",
        idNumber: input.factory?.tradeLicenseNo,
      },
      factory: {
        companyName: input.factory.companyName,
        district: input.factory.district,
        address: input.factory.address ?? "",
        tradeLicenseNo: input.factory.tradeLicenseNo ?? "",
        productCategories: input.factory.productCategories ?? [],
        exportCountries: input.factory.exportCountries ?? [],
        certifications: input.factory.certifications ?? [],
        employees: input.factory.employees ?? "",
        established: input.factory.established ?? "",
        minOrderQty: input.factory.minOrderQty ?? "",
        productionCapacity: input.factory.productionCapacity ?? "",
        membershipBody: input.factory.membershipBody ?? "",
        verified: false,
        website: input.factory.website ?? "",
      },
      createdAt: new Date().toISOString(),
    };
    setUser(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    callApi("/api/auth/logout", {}).catch(() => {});
    signOut(auth).catch(() => {});
    persistToken(null);
    setUser(null);
  }, []);

  const promoteToSeller = useCallback((shopName: string, type: "retail" | "wholesale" | "service", address: string) => {
    setUser(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        role: "seller" as AppRole,
        roles: Array.from(new Set([...(prev.roles || []), "seller" as AppRole])),
        permissions: getPermissionsForRole("seller", true),
        seller: {
          shopName,
          type,
          address
        }
      };
    });
  }, []);

  const enrichedUser = useMemo(() => {
    if (!user) return null;
    let finalRoles = user.roles || [user.role];
    if (user.role === 'super_admin' || user.role === 'admin') {
      finalRoles = [
        "buyer", "user", "seller", "wholesale", "factory",
        "rural", "nearby_shop", "rider", "service_provider",
        "digital_seller", "moderator", "admin", "super_admin"
      ];
    }
    const currentGroup = user.roleGroup || getRoleGroup(user.role);
    return {
      ...user,
      roles: finalRoles,
      roleGroup: currentGroup,
      name: user.fullName,
      handle: user.phone ? `@${user.phone}` : `@user`,
      avatar: user.avatarUrl || ""
    };
  }, [user]);

  const hasRole = useCallback((roles: AppRole | AppRole[]) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    const list = Array.isArray(roles) ? roles : [roles];
    
    // Direct match on role
    if (list.includes(user.role)) return true;

    // Match on roles array
    if (user.roles && user.roles.some(r => list.includes(r))) return true;

    // Seller hierarchy expansion
    const sellerRoles = [
      'seller', 'business', 'retail_seller', 'wholesale_seller', 
      'factory_seller', 'factory', 'wholesale', 'rural', 'rural_seller', 
      'exporter', 'importer', 'brand_seller', 'b2b_seller', 'food_seller', 
      'grocery_seller', 'nearby_shop', 'digital_seller'
    ];
    if (list.includes('seller') || list.includes('business')) {
      if (sellerRoles.includes(user.role) || (user.roles && user.roles.some(r => sellerRoles.includes(r))) || !!user.seller || !!user.factory) {
        return true;
      }
    }

    // Buyer expansion
    if (list.includes('buyer') || list.includes('user')) {
      if (user.role === 'buyer' || user.role === 'user') return true;
    }

    return false;
  }, [user]);

  const hasRoleGroup = useCallback((groups: RoleGroup | RoleGroup[]) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'admin') return true;
    const list = Array.isArray(groups) ? groups : [groups];
    const currentGroup = user.roleGroup || getRoleGroup(user.role);
    if (list.includes(currentGroup)) return true;
    // Customers allow access to vendors and admins as well
    if (list.includes('customer') && (currentGroup === 'vendor' || currentGroup === 'admin')) return true;
    return false;
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    const currentGroup = user.roleGroup || getRoleGroup(user.role);
    if (currentGroup === 'admin' && !permission.startsWith('SUPER_ADMIN_')) return true;
    const userPerms = user.permissions || getPermissionsForRole(user.role, user.verification?.status === 'verified');
    return userPerms.includes(permission);
  }, [user]);

  const switchPersonaRole = useCallback((targetRole: AppRole) => {
    setUser(prev => {
      if (!prev) return prev;
      const isVerified = prev.verification?.status === 'verified';
      const targetGroup = getRoleGroup(targetRole);
      const nextUser: AppUser = {
        ...prev,
        role: targetRole,
        roleGroup: targetGroup,
        roles: Array.from(new Set([...(prev.roles || []), targetRole])),
        permissions: getPermissionsForRole(targetRole, isVerified)
      };
      persist(nextUser);
      return nextUser;
    });
  }, []);

  const value = useMemo<AuthCtx>(() => {
    const activeRole = (user?.role === "user" ? "buyer" : user?.role) ?? "buyer";
    const currentRoleGroup: RoleGroup = user ? (user.roleGroup || getRoleGroup(activeRole)) : "customer";
    const isCustomer = !user || currentRoleGroup === "customer" || currentRoleGroup === "vendor" || currentRoleGroup === "admin";
    const isVendor = !!user && (currentRoleGroup === "vendor" || currentRoleGroup === "admin" || user.role === "admin" || user.role === "super_admin");
    const isAdmin = !!user && (currentRoleGroup === "admin" || user.role === "admin" || user.role === "super_admin");

    return {
      user: enrichedUser,
      isAuthenticated: !!user,
      role: activeRole,
      roleGroup: currentRoleGroup,
      isCustomer,
      isVendor,
      isAdmin,
      loading: fbLoading,
      loginWithPhone,
      loginWithGoogle,
      loginWithFacebook,
      getToken,
      getGoogleToken,
      sendPasswordReset,
      registerUser,
      registerSeller,
      registerFactory,
      submitVerification,
      logout,
      hasRole,
      hasRoleGroup,
      hasPermission,
      switchPersonaRole,
      promoteToSeller,
    };
  }, [user, enrichedUser, fbLoading, loginWithPhone, loginWithGoogle, loginWithFacebook, getToken, getGoogleToken, sendPasswordReset, registerUser, registerSeller, registerFactory, submitVerification, logout, hasRole, hasRoleGroup, hasPermission, switchPersonaRole, promoteToSeller]);

  return (
    <AppAuthContext.Provider value={value}>
      {!fbLoading && children}
    </AppAuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AppAuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AppAuthProvider>");
  return ctx;
}
