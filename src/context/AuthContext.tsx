// Barrel re-export enforcing Golden Rule 2 (Single Source of Truth: src/features/auth/AuthContext)
export { AuthProvider, AppAuthProvider, useAuth } from "@/features/auth/AuthContext";
export type { AppUser, AppRole, RoleGroup, AuthContextValue, VerificationData, SellerProfileData, FactoryProfileData } from "@/features/auth/AuthContext";
export type UserRole = AppRole;
export type User = AppUser;
