/**
 * Canonical AuthContext re-export.
 *
 * Source of truth: @/modules/auth/context/AuthContext
 *
 * Preferred imports outside the auth module:
 *   import { useAuth, AuthProvider } from '@/context/AuthContext'
 *   import { useAuth, AuthProvider } from '@/app/context/AuthContext'
 *   import { useAuth, AuthProvider } from '@/modules/auth'
 *
 * Inside modules/auth/* always use relative imports (../context/AuthContext)
 * to avoid circular dependency: modules → app/context → modules.
 */

export {
  AuthProvider,
  useAuth,
  type AuthContextValue,
  type AppUser,
  type VerificationData,
  type SellerProfileData,
  type FactoryProfileData,
  type AppRole,
  type RoleGroup,
} from '@/modules/auth';

// Legacy aliases used by older consumers
export type { AuthContextValue as AuthContextType, AppUser as User } from '@/modules/auth';

// Role enum from core permissions (used by guards / shared types)
export { UserRole } from '@/permissions/roles';
