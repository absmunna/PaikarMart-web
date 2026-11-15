import React, { useEffect, useState } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Users,
  Check,
  AlertTriangle,
  UserCheck,
  Clock,
  Lock
} from 'lucide-react';
import { UserRole } from '@/types';
import { isGovernanceRole } from '@paikarmart/shared';
import { useAuth } from '@/features/auth';
import { vendorApiClient, KycApplicationItem } from '@/features/vendors';
import { useLanguage } from '@/contexts/LanguageContext';

interface SuperAdminControlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
}

const INITIAL_MANAGED_ADMINS = [
  {
    id: 'user_dev_1',
    name: 'ABS Munna (Lead Developer)',
    email: 'abs.munna1@gmail.com',
    handle: '@absmunna',
    role: 'super_admin' as UserRole,
    grantedAt: 'Project Initialization',
    grantedBy: 'Developer Key'
  },
  {
    id: 'user_admin_2',
    name: 'PaikarMart Ops Head',
    email: 'admin.ops@paikarmart.com',
    handle: '@paikar_ops',
    role: 'admin' as UserRole,
    grantedAt: '2026-02-01',
    grantedBy: 'abs.munna1@gmail.com'
  },
  {
    id: 'user_admin_3',
    name: 'Catalog Quality Auditor',
    email: 'qa.catalog@paikarmart.com',
    handle: '@catalog_qa',
    role: 'moderator' as UserRole,
    grantedAt: '2026-02-10',
    grantedBy: 'abs.munna1@gmail.com'
  }
];

export const SuperAdminControlModal: React.FC<SuperAdminControlModalProps> = ({
  isOpen,
  onClose,
  onUpdateUserRole
}) => {
  const { firebaseUser, currentUser } = useAuth();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [adminsList, setAdminsList] = useState(INITIAL_MANAGED_ADMINS);
  const [kycQueue, setKycQueue] = useState<KycApplicationItem[]>([]);
  const [loadingKyc, setLoadingKyc] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [selectedRoleToGrant, setSelectedRoleToGrant] = useState<'moderator' | 'admin' | 'super_admin'>('admin');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isAuthorizedGovernance =
    isGovernanceRole(currentUser.role) || firebaseUser?.email === 'abs.munna1@gmail.com';

  useEffect(() => {
    if (!isOpen || !isAuthorizedGovernance) return;
    let active = true;
    setLoadingKyc(true);
    const effectiveRole: UserRole = isGovernanceRole(currentUser.role) ? currentUser.role : 'super_admin';
    void vendorApiClient
      .fetchKycQueue(effectiveRole)
      .then((apps) => {
        if (active) setKycQueue(apps);
      })
      .catch(() => {
        if (active) setKycQueue([]);
      })
      .finally(() => {
        if (active) setLoadingKyc(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, isAuthorizedGovernance, currentUser.role]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackMsg({ type, text });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleGrantRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminEmail.includes('@')) {
      showToast('error', isBn ? 'সঠিক ইমেইল এড্রেস লিখুন।' : 'Please enter a valid email address.');
      return;
    }

    const newEntry = {
      id: `usr_${Date.now()}`,
      name: newAdminName.trim() || newAdminEmail.split('@')[0],
      email: newAdminEmail.trim(),
      handle: `@${newAdminEmail.split('@')[0]}`,
      role: selectedRoleToGrant,
      grantedAt: new Date().toISOString().split('T')[0],
      grantedBy: firebaseUser?.email || currentUser.email || 'super_admin'
    };

    setAdminsList((prev) => [newEntry, ...prev]);
    onUpdateUserRole(newEntry.id, selectedRoleToGrant);
    showToast('success', `Assigned ${selectedRoleToGrant.replace('_', ' ')} to ${newEntry.name}.`);
    setNewAdminEmail('');
    setNewAdminName('');
  };

  const handleRevokeRole = (id: string, name: string) => {
    if (id === 'user_dev_1') {
      showToast('error', 'Cannot revoke Lead Developer Super Admin root access.');
      return;
    }
    setAdminsList((prev) => prev.filter((a) => a.id !== id));
    onUpdateUserRole(id, 'consumer');
    showToast('success', `Revoked governance access from ${name}.`);
  };

  const handleKycDecision = async (applicationId: string, decision: 'approved' | 'rejected' | 'suspended') => {
    const effectiveRole: UserRole = isGovernanceRole(currentUser.role) ? currentUser.role : 'super_admin';
    try {
      const updated = await vendorApiClient.decideKycApplication({
        applicationId,
        decision,
        requesterRole: effectiveRole,
        reviewerEmail: firebaseUser?.email || currentUser.email || 'admin@paikarmart.com'
      });
      setKycQueue((prev) => prev.map((a) => (a.id === applicationId ? updated : a)));
      showToast('success', `KYC ${applicationId} marked ${decision.toUpperCase()}.`);
    } catch (err: any) {
      showToast('error', err?.message || 'Unable to process KYC decision.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--pm-border)]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-[var(--pm-text)] truncate">
                {isBn ? 'গভর্ন্যান্স ও কেওয়াইসি (KYC) কন্ট্রোল' : 'Governance & Merchant KYC Control Center'}
              </h2>
              <p className="text-xs text-[var(--pm-muted)] mt-0.5 truncate">
                Role-verified administration · Merchant KYC verification · Admin & Moderator access control
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] hover:bg-[var(--pm-surface)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthorizedGovernance ? (
          <div className="p-8 text-center space-y-3">
            <Lock className="w-8 h-8 text-[var(--pm-danger)] mx-auto" />
            <h3 className="text-base font-bold text-[var(--pm-text)]">
              Governance Authorization Required
            </h3>
            <p className="text-xs text-[var(--pm-muted)] max-w-md mx-auto">
              Only verified Moderator, Admin, or Super Admin accounts can view KYC queues or modify admin privileges. Client-side role switching is disabled.
            </p>
          </div>
        ) : (
          <>
            {feedbackMsg && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  feedbackMsg.type === 'success'
                    ? 'bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-[var(--pm-success)]'
                    : 'bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)]'
                }`}
              >
                {feedbackMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                )}
                <span>{feedbackMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 cols: Live Backend KYC Verification Queue */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[var(--pm-text)] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[var(--pm-success)]" />
                    <span>Merchant KYC Verification Queue</span>
                  </h3>
                  <span className="text-xs font-mono text-[var(--pm-muted)]">{kycQueue.length} applications</span>
                </div>

                {loadingKyc ? (
                  <div className="p-6 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] text-xs text-[var(--pm-muted)] text-center">
                    Loading KYC verification queue...
                  </div>
                ) : kycQueue.length === 0 ? (
                  <div className="p-6 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] text-xs text-[var(--pm-muted)] text-center">
                    No KYC applications pending review right now.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {kycQueue.map((app) => (
                      <div
                        key={app.id}
                        className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-mono text-[var(--pm-muted)]">
                              {app.id} · {app.sellerTier.replace(/_/g, ' ')} · {app.status.toUpperCase()}
                            </p>
                            <h4 className="text-sm font-bold text-[var(--pm-text)] truncate">
                              {app.storeName}
                            </h4>
                            <p className="text-xs text-[var(--pm-muted)] truncate">
                              {app.legalEntityName} · NID {app.nidNumber} · License {app.businessRegNumber}
                            </p>
                          </div>

                          <span
                            className={`text-xs font-bold shrink-0 flex items-center gap-1 ${
                              app.status === 'approved'
                                ? 'text-[var(--pm-success)]'
                                : app.status === 'rejected' || app.status === 'suspended'
                                ? 'text-[var(--pm-danger)]'
                                : 'text-[var(--pm-warning)]'
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{app.status.replace(/_/g, ' ')}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--pm-border)] text-xs">
                          <span className="text-[var(--pm-muted)] font-mono truncate">
                            {app.payoutProvider} · {app.payoutNumber}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleKycDecision(app.id, 'approved')}
                              className="px-3 py-1.5 rounded-lg bg-[var(--pm-success)] hover:opacity-90 text-white font-bold text-xs cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleKycDecision(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-lg bg-[var(--pm-danger-soft)] hover:opacity-90 border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] font-bold text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right 5 cols: Authorized Admin Roster & Role Assignment */}
              <div className="lg:col-span-5 space-y-4">
                <form
                  onSubmit={handleGrantRole}
                  className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3"
                >
                  <h3 className="text-xs font-bold text-[var(--pm-text)] flex items-center gap-1.5">
                    <UserPlus className="w-4 h-4 text-[var(--pm-accent)]" />
                    <span>Assign Governance Role</span>
                  </h3>
                  <input
                    type="text"
                    placeholder="Staff Name"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs outline-none focus:border-[var(--pm-accent)]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="admin@paikarmart.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] text-xs outline-none focus:border-[var(--pm-accent)]"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={selectedRoleToGrant}
                      onChange={(e) => setSelectedRoleToGrant(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs font-bold focus:border-[var(--pm-accent)] outline-none"
                    >
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Grant Role</span>
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--pm-muted)] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Governance Roster ({adminsList.length})</span>
                  </h4>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {adminsList.map((admin) => (
                      <div
                        key={admin.id}
                        className="p-3 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between gap-2"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[var(--pm-text)] truncate">{admin.name}</p>
                          <p className="text-[11px] text-[var(--pm-muted)] font-mono truncate">
                            {admin.email} · {admin.role.replace('_', ' ')}
                          </p>
                        </div>
                        {admin.id !== 'user_dev_1' && (
                          <button
                            type="button"
                            onClick={() => handleRevokeRole(admin.id, admin.name)}
                            className="px-2.5 py-1 rounded-lg bg-[var(--pm-danger-soft)] border border-[var(--pm-danger)]/30 text-[var(--pm-danger)] text-[11px] font-bold shrink-0 cursor-pointer"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
