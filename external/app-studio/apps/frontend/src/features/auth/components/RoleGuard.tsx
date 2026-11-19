import React from 'react';
import { Lock, ShieldCheck, Clock, Store } from 'lucide-react';
import { User, UserRole } from '@/types';
import { canAccessSellerCentral, isGovernanceRole } from '@paikarmart/shared';

interface RoleGuardProps {
  currentUser: User;
  requiredMode: 'seller' | 'governance';
  allowedRoles?: UserRole[];
  onOpenVendorModal?: () => void;
  onNavigateHome?: () => void;
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  currentUser,
  requiredMode,
  onOpenVendorModal,
  onNavigateHome,
  children
}) => {
  const isAuthorized =
    requiredMode === 'governance'
      ? isGovernanceRole(currentUser.role)
      : canAccessSellerCentral({
          role: currentUser.role,
          isVendor: currentUser.isVendor,
          kycStatus: currentUser.kycStatus || currentUser.vendorProfile?.kycStatus,
          vendorProfile: currentUser.vendorProfile || null
        });

  if (isAuthorized) {
    return <>{children}</>;
  }

  const kycStatus = currentUser.kycStatus || currentUser.vendorProfile?.kycStatus || 'none';
  const isPendingReview =
    requiredMode === 'seller' &&
    (kycStatus === 'submitted' || kycStatus === 'under_review');

  return (
    <div className="p-8 rounded-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] text-center space-y-5 my-4">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center justify-center text-[var(--pm-accent)]">
        {isPendingReview ? <Clock className="w-6 h-6 text-[var(--pm-warning)]" /> : <Lock className="w-6 h-6" />}
      </div>

      <div className="max-w-md mx-auto space-y-1.5">
        <h2 className="text-lg font-bold text-[var(--pm-text)]">
          {requiredMode === 'governance'
            ? 'Governance Authorization Required'
            : isPendingReview
            ? 'Merchant KYC Under Verification'
            : 'Verified Merchant Account Required'}
        </h2>
        <p className="text-xs text-[var(--pm-muted)] leading-relaxed">
          {requiredMode === 'governance'
            ? 'Platform Catalog Audit and KYC Approvals are restricted exclusively to authorized Moderator, Admin, and Super Admin accounts.'
            : isPendingReview
            ? `Your store application (${currentUser.vendorProfile?.storeName || 'Pending Store'}) is currently in the KYC verification queue. Seller Central activates automatically once approved.`
            : 'Complete your 5-step Merchant KYC onboarding (NID, Trade License, e-TIN, Payout Account) to unlock Seller Central, B2B Wholesale tiers, and inventory management.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {requiredMode === 'seller' && !isPendingReview && onOpenVendorModal && (
          <button
            type="button"
            onClick={onOpenVendorModal}
            className="px-5 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer active-scale"
          >
            <Store className="w-4 h-4" />
            <span>Start 5-Step Merchant KYC</span>
          </button>
        )}

        {onNavigateHome && (
          <button
            type="button"
            onClick={onNavigateHome}
            className="px-5 py-2.5 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Return to Feed</span>
          </button>
        )}
      </div>
    </div>
  );
};
