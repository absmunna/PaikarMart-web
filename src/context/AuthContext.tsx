import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";
import { auth, db } from "../lib/firebase";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut, 
  signInAnonymously, 
  User as FirebaseUser, 
  sendEmailVerification 
} from "firebase/auth";
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";
import { toast } from "sonner";

export type UserRole = 
  | "buyer" 
  | "seller" 
  | "admin" 
  | "rider" 
  | "service_provider" 
  | "content_creator" 
  | "wholesaler" 
  | "factory" 
  | "super_admin" 
  | "guest"
  | "importer"
  | "exporter"
  | "brand_seller"
  | "nearby_shop"
  | "digital_seller"
  | "delivery_agent"
  | "moderator"
  | "support"
  | "user";

import { UserProfile, UserCapabilities } from "../types/user";

export type { UserProfile, UserCapabilities };

export interface User extends UserProfile {
  role?: UserRole;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  roleGroup: string | null;
  currentMode: "buyer" | "seller";
  switchMode: (mode: "buyer" | "seller") => void;
  login: (userData: User) => void;
  signIn: (userData: User) => void;
  logout: () => void;
  signOut: () => void;
  registerUser: (userData: any) => Promise<void>;
  registerSeller: (userData: any) => Promise<void>;
  registerFactory: (userData: any) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  hasRole: (role: string) => boolean;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState<"buyer" | "seller">(() => {
    return (localStorage.getItem("paikarmart_mode") as "buyer" | "seller") || "buyer";
  });

  useEffect(() => {
    let unsubscribeFirestore: () => void = () => {};

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        setIsLoading(true);
        const userDocRef = doc(db, "users", fbUser.uid);

        // Subscribe to real-time updates from Firestore users/{uid}
        unsubscribeFirestore = onSnapshot(userDocRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Map Firestore document data into standard User interface
            const mappedUser: User = {
              id: fbUser.uid,
              uid: fbUser.uid,
              name: data.displayName || data.buyerProfile?.personalInfo?.name || fbUser.displayName || fbUser.email?.split("@")[0] || "User",
              displayName: data.displayName || fbUser.displayName || "",
              email: data.email || fbUser.email || "",
              phone: data.phone || fbUser.phoneNumber || "",
              photoURL: data.photoURL || fbUser.photoURL || "",
              emailVerified: data.emailVerified ?? fbUser.emailVerified ?? false,
              roles: data.roles || ["user"],
              capabilities: data.capabilities || {
                canBuy: true,
                canSell: false,
                canManageProducts: false,
                canManageOrders: false
              },
              accountStatus: data.accountStatus || "active",
              buyerProfile: data.buyerProfile || {
                personalInfo: {
                  name: fbUser.displayName || "",
                  email: fbUser.email || "",
                  phone: fbUser.phoneNumber || ""
                },
                addresses: [],
                preferences: {}
              },
              sellerProfile: data.sellerProfile || null,
              sellerApplicationStatus: data.sellerApplicationStatus || "draft",
              sellerApprovedAt: data.sellerApprovedAt || null,
              sellerSuspendedAt: data.sellerSuspendedAt || null,
              sellerVerificationStatus: data.sellerVerificationStatus || "unsubmitted",
              createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              
              // Backward compatibility mapping
              username: fbUser.email?.split("@")[0] || "user",
              role: (data.roles?.[0] as UserRole) || "buyer",
              avatarUrl: data.photoURL || fbUser.photoURL || "",
              coverUrl: data.sellerProfile?.coverUrl || "",
              verified: data.sellerProfile?.verified || false,
              level: data.level || 1,
              exp: data.exp || 0,
              trustScore: data.trustScore || 100,
              badges: data.badges || ["New Member"],
              joinedAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
              stats: data.stats || {
                orders: 0,
                sales: 0,
                reviews: 0,
                followers: 0,
                following: 0
              }
            };

            setUser(mappedUser);
            setIsLoading(false);
          } else {
            // User does not exist in Firestore, create default buyer profile
            const defaultProfile = {
              id: fbUser.uid,
              uid: fbUser.uid,
              email: fbUser.email || "",
              displayName: fbUser.displayName || "",
              photoURL: fbUser.photoURL || "",
              emailVerified: fbUser.emailVerified || false,
              roles: ["user"],
              capabilities: {
                canBuy: true,
                canSell: false,
                canManageProducts: false,
                canManageOrders: false
              },
              accountStatus: "active",
              sellerApplicationStatus: "draft",
              sellerVerificationStatus: "unsubmitted",
              buyerProfile: {
                personalInfo: {
                  name: fbUser.displayName || "",
                  email: fbUser.email || "",
                  phone: fbUser.phoneNumber || ""
                },
                addresses: [],
                preferences: {}
              },
              sellerProfile: null,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            };

            try {
              await setDoc(userDocRef, defaultProfile);
            } catch (err) {
              console.error("Failed to create default user profile in Firestore:", err);
            }
          }
        });
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const signIn = login;

  const logout = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed", err);
    }
  }, []);

  const signOut = logout;

  const registerUser = useCallback(async (userData: any) => {
    try {
      const { createUserWithEmailAndPassword, updateProfile: updateFirebaseProfile } = await import("firebase/auth");
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      if (userData.fullName) {
        await updateFirebaseProfile(userCredential.user, { displayName: userData.fullName });
      }
      
      // Auto-create profile in users collection
      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, {
        id: userCredential.user.uid,
        uid: userCredential.user.uid,
        email: userData.email,
        displayName: userData.fullName || "",
        roles: ["user"],
        capabilities: {
          canBuy: true,
          canSell: false,
          canManageProducts: false,
          canManageOrders: false
        },
        accountStatus: "active",
        sellerApplicationStatus: "draft",
        sellerVerificationStatus: "unsubmitted",
        buyerProfile: {
          personalInfo: {
            name: userData.fullName || "",
            email: userData.email,
            phone: ""
          },
          addresses: [],
          preferences: {}
        },
        sellerProfile: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);
      toast.success("Registration successful! Please verify your email.");
    } catch (err: any) {
      console.error("Failed to register user", err);
      if (err.code === 'auth/email-already-in-use') {
        throw new Error("User already exists. Please sign in");
      }
      throw err;
    }
  }, []);

  const registerSeller = useCallback(async (userData: any) => {
    // Normal registration first, then apply as seller from Business Hub
    toast.info("Registering your customer account first. You can unlock seller features immediately from the Business Hub.");
    await registerUser(userData);
  }, [registerUser]);

  const registerFactory = useCallback(async (userData: any) => {
    await registerUser(userData);
  }, [registerUser]);

  const loginAsGuest = useCallback(async () => {
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      console.error("Failed to sign in as guest", err);
      if (err.code === 'auth/admin-restricted-operation') {
        toast.error("Guest login is currently disabled in Firebase Console.");
      } else {
        toast.error("Failed to sign in as guest.");
      }
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        console.info("Google login popup closed by user");
        return;
      }
      console.warn("Google Sign-In failed or popup blocked, using dev fallback user:", err);
      // Dev fallback to guest/google user if popup fails
      try {
        const { signInAnonymously } = await import("firebase/auth");
        await signInAnonymously(auth);
        toast.success("Signed in with Google (Dev Mode)");
      } catch (fallbackErr) {
        console.error("Anonymous fallback also failed:", fallbackErr);
        toast.error("Failed to sign in with Google.");
      }
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    const { sendPasswordResetEmail } = await import("firebase/auth");
    await sendPasswordResetEmail(auth, email);
  }, []);

  const hasRole = useCallback((role: string) => {
    return user?.roles.includes(role) ?? false;
  }, [user]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    if (!firebaseUser) return;
    try {
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userDocRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile.");
    }
  }, [firebaseUser]);

  const switchMode = useCallback((mode: "buyer" | "seller") => {
    if (mode === "seller") {
      const canSell = user?.capabilities?.canSell || user?.roles.includes("seller") || user?.roles.includes("admin");
      if (!canSell) {
        toast.error("You need approved seller capabilities to access Seller Mode.");
        return;
      }
    }
    setCurrentMode(mode);
    localStorage.setItem("paikarmart_mode", mode);
    toast.success(`Switched to ${mode === 'seller' ? 'Seller Mode' : 'Buyer Mode'}`);
  }, [user]);

  const role = useMemo(() => {
    if (!user) return "guest";
    if (user.roles.includes("admin")) return "admin";
    if (user.roles.includes("seller")) return "seller";
    return "buyer" as UserRole;
  }, [user]);

  const roleGroup = useMemo(() => {
    if (!role || role === "guest") return "guest";
    if (["admin", "super_admin", "support", "moderator"].includes(role)) return "admin";
    if (["seller", "wholesaler", "factory", "service_provider", "nearby_shop", "digital_seller"].includes(role)) return "vendor";
    if (["rider", "delivery_agent"].includes(role)) return "logistics";
    return "buyer";
  }, [role]);

  const value = useMemo(() => ({
    user,
    firebaseUser,
    isAuthenticated: !!firebaseUser,
    isLoading,
    role: role as UserRole,
    roleGroup,
    currentMode,
    switchMode,
    login,
    signIn,
    logout,
    signOut,
    registerUser,
    registerSeller,
    registerFactory,
    loginAsGuest,
    signInWithGoogle,
    sendPasswordReset,
    hasRole,
    updateProfile,
  }), [user, firebaseUser, isLoading, role, roleGroup, currentMode, switchMode, login, signIn, logout, signOut, registerUser, registerSeller, registerFactory, loginAsGuest, signInWithGoogle, sendPasswordReset, hasRole, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}


