import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  GoogleAuthProvider,
  FacebookAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  signInAnonymously
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db, googleProvider, facebookProvider } from "@/lib/firebase";
import { safeStorage } from "@/modules/app";
import { AppRole, RoleGroup, ROLE_HIERARCHY, getRoleGroup, getPermissionsForRole } from "@/config/roles.config";
import { useAuthStore, type UserRole } from "@/modules/auth/store/authStore";
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

const TOKEN_KEY = "pm.auth.token.v2";

const AuthContext = createContext<AuthContextValue | null>(null);

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

async function getTrustedRoles(firebaseUser: FirebaseUser): Promise<AppRole[]> {
  const { claims } = await firebaseUser.getIdTokenResult();
  const claimRoles = Array.isArray(claims.roles) ? claims.roles : [claims.role];
  const roles = claimRoles.filter(
    (role): role is AppRole => typeof role === "string" && role in ROLE_HIERARCHY
  );
  return roles.length > 0 ? Array.from(new Set(roles)) : ["buyer"];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!firebaseUser || !user) {
      useAuthStore.getState().logout();
      return;
    }

    let active = true;
    const syncStore = async () => {
      try {
        const token = await firebaseUser.getIdToken();
        if (!active) return;
        const supportedRoles: UserRole[] = [
          "buyer", "seller", "admin", "super_admin", "moderator", "nearby_shop", "service_provider"
        ];
        const role = supportedRoles.includes(user.role as UserRole) ? user.role as UserRole : "buyer";
        useAuthStore.getState().login({
          id: user.id,
          name: user.fullName,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          avatarUrl: user.avatarUrl,
          role,
        }, token);
      } catch (error) {
        if (active) {
          useAuthStore.getState().logout();
          console.warn("Auth store sync failed:", error);
        }
      }
    };
    void syncStore();

    return () => {
      active = false;
    };
  }, [firebaseUser, user]);

  // Sync Firebase Auth State with real Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const roles = await getTrustedRoles(currentUser);
          const primaryRole = roles[0];
          const userRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data();
            const appUser: AppUser = {
              id: currentUser.uid,
              fullName: data.name || currentUser.displayName || "PaikarMart User",
              name: data.name || currentUser.displayName || "PaikarMart User",
              email: currentUser.email || data.email || "",
              phone: data.phone || currentUser.phoneNumber || "",
              avatarUrl: currentUser.photoURL || data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || currentUser.uid}`,
              avatar: currentUser.photoURL || data.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name || currentUser.uid}`,
              role: primaryRole,
              roles,
              roleGroup: getRoleGroup(primaryRole),
              permissions: getPermissionsForRole(primaryRole, data.verification?.status === "verified"),
              emailVerified: currentUser.emailVerified,
              verification: data.verification || { status: "unverified" },
              seller: data.seller,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUser(appUser);
            return;
          } else {
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
            setUser({
              ...newDoc,
              fullName: newDoc.name,
              roleGroup: getRoleGroup(primaryRole),
              permissions: getPermissionsForRole(primaryRole, false),
              verification: { status: "unverified" },
            } as AppUser);
            return;
          }
        } catch (err) {
          console.warn("Firestore user sync info:", err);
        }
      } else {
        setUser(null);
        persistToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const u = result.user;
        const roles = await getTrustedRoles(u);
        const role = roles[0];
        const userRef = doc(db, "users", u.uid);
        const snap = await getDoc(userRef);
        let userData: any = null;
        if (snap.exists()) {
          userData = snap.data();
        } else {
          userData = {
            id: u.uid,
            name: u.displayName || "Google User",
            email: u.email || "",
            phone: u.phoneNumber || "",
            role: "buyer",
            roles: ["buyer"],
            avatarUrl: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, userData);
        }
        const next: AppUser = {
          id: u.uid,
          fullName: userData.name || u.displayName || "Google User",
          name: userData.name || u.displayName || "Google User",
          email: u.email || "",
          phone: u.phoneNumber || "",
          avatarUrl: u.photoURL || userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
          avatar: u.photoURL || userData.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.uid}`,
          role,
          roles,
          roleGroup: getRoleGroup(role),
          permissions: getPermissionsForRole(role, true),
          emailVerified: u.emailVerified,
          verification: userData.verification || { status: "verified" },
          seller: userData.seller,
          createdAt: userData.createdAt || new Date().toISOString(),
        };
        setUser(next);
        const token = await u.getIdToken();
        persistToken(token);
        toast.success("Successfully logged in with Google (Firebase Connected)!");
      }
    } catch (error) {
      if (error instanceof FirebaseError && (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request')) {
        throw new Error("Google sign-in was cancelled.");
      }
      throw error;
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
    void phone;
    void password;
    throw new Error("Phone/password login is not configured. Use email/password or a verified phone OTP.");
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const u = cred.user;
      const roles = await getTrustedRoles(u);
      const primaryRole = roles[0];
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
      const appUser: AppUser = {
        id: u.uid,
        fullName: userData.name || u.displayName || email.split("@")[0],
        name: userData.name || u.displayName || email.split("@")[0],
        email: userData.email || email,
        phone: userData.phone || "",
        avatarUrl: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || u.uid}`,
        avatar: u.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name || u.uid}`,
        role: primaryRole,
        roles,
        roleGroup: getRoleGroup(primaryRole),
        permissions: getPermissionsForRole(primaryRole, userData.verification?.status === "verified"),
        emailVerified: u.emailVerified,
        verification: userData.verification || { status: "unverified" },
        seller: userData.seller,
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      setUser(appUser);
      toast.success("Logged in successfully (Firebase DB Connected)!");
      return appUser;
    } catch (err: any) {
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch {}
    setUser(null);
    setFirebaseUser(null);
    persistToken(null);
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

  const registerUser = useCallback(async (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { password?: string }): Promise<AppUser> => {
    if (!input.password) {
      throw new Error("A password is required to register.");
    }
    const role: AppRole = "buyer";
    const userEmail = input.email || `${input.phone || Date.now()}@paikarmart.com`;
    const cred = await createUserWithEmailAndPassword(auth, userEmail, input.password);
    const userId = cred.user.uid;
    persistToken(await cred.user.getIdToken());

    const profileDoc = {
      id: userId,
      name: input.fullName || input.name || userEmail.split("@")[0],
      email: userEmail,
      phone: input.phone || "",
      role,
      roles: ["buyer"],
      avatarUrl: input.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", userId), profileDoc);

    const next: AppUser = {
      ...input,
      id: userId,
      fullName: profileDoc.name,
      name: profileDoc.name,
      email: userEmail,
      role,
      roles: ["buyer"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      createdAt: profileDoc.createdAt,
    };
    setUser(next);
    toast.success("Account registered successfully!");
    return next;
  }, []);

  const registerSeller = useCallback(async (input: Omit<AppUser, "id" | "role" | "roles" | "roleGroup" | "permissions" | "createdAt"> & { seller: SellerProfileData; password?: string }): Promise<AppUser> => {
    if (!input.password) {
      throw new Error("A password is required to register.");
    }
    const role: AppRole = "buyer";
    const userEmail = input.email || `${input.phone || Date.now()}@paikarmart.com`;
    const cred = await createUserWithEmailAndPassword(auth, userEmail, input.password);
    const userId = cred.user.uid;
    persistToken(await cred.user.getIdToken());

    const profileDoc = {
      id: userId,
      name: input.fullName || input.name || input.seller.shopName || userEmail.split("@")[0],
      email: userEmail,
      phone: input.phone || "",
      role,
      roles: ["buyer"],
      avatarUrl: input.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`,
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, "users", userId), profileDoc);
    await setDoc(doc(db, "sellerApplications", userId), {
      userId,
      shopName: input.seller.shopName,
      type: input.seller.type,
      address: input.seller.address || "",
      status: "pending",
      createdAt: profileDoc.createdAt,
    });

    const next: AppUser = {
      ...input,
      id: userId,
      fullName: profileDoc.name,
      name: profileDoc.name,
      email: userEmail,
      role,
      roles: ["buyer"],
      roleGroup: getRoleGroup(role),
      permissions: getPermissionsForRole(role, false),
      seller: input.seller,
      createdAt: profileDoc.createdAt,
    };
    setUser(next);
    toast.success("Seller application submitted for review.");
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
    if (!user || !user.roles.includes(targetRole)) {
      toast.error("This account is not authorized for that role.");
      return;
    }

    if (user.role !== targetRole) {
      setUser({
        ...user,
        role: targetRole,
        roleGroup: getRoleGroup(targetRole),
        permissions: getPermissionsForRole(targetRole, user.verification?.status === "verified")
      });
      toast.info(`Switched role persona to ${targetRole}`);
    }
  }, [user]);

  const promoteToSeller = useCallback(async (shopName: string, type: "retail" | "wholesale" | "service", address: string) => {
    if (!user || !firebaseUser || user.id !== firebaseUser.uid) {
      throw new Error("Sign in with a verified account before applying to become a seller.");
    }

    const applicationRef = doc(db, "sellerApplications", firebaseUser.uid);
    const existingApplication = await getDoc(applicationRef);
    if (existingApplication.exists()) {
      toast.info("Your seller application is already under review.");
      return;
    }

    const sellerData: SellerProfileData = { shopName, type, address };
    await setDoc(applicationRef, {
      userId: firebaseUser.uid,
      shopName,
      type,
      address,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setUser({ ...user, seller: sellerData });
    toast.success("Seller application submitted for review.");
  }, [user, firebaseUser]);

  const value: AuthContextValue = useMemo(() => ({
    user,
    firebaseUser,
    isAuthenticated: !!firebaseUser,
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
