import React, { useEffect, useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Layers, 
  Building2, 
  Search,
  Check,
  AlertTriangle
} from 'lucide-react';
import { MasterCatalogSubmission, MasterProduct } from '@/types';
import {
  fetchCatalogSubmissions,
  fetchMasterCatalogProducts,
  INITIAL_CATALOG_SUBMISSIONS,
  INITIAL_MASTER_PRODUCTS,
  reviewCatalogProposal
} from '@/features/marketplace';
import { auth } from '@/lib/firebase';

interface AdminCatalogGovernanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminCatalogGovernanceModal: React.FC<AdminCatalogGovernanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'catalog'>('pending');
  const [submissions, setSubmissions] = useState<MasterCatalogSubmission[]>([]);
  const [masterProducts, setMasterProducts] = useState<MasterProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState<string | null>(null);
  const [isLiveCatalog, setIsLiveCatalog] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();

    fetchMasterCatalogProducts(controller.signal).then((res) => {
      if (res.source === 'unconfigured') {
        setIsLiveCatalog(false);
        setMasterProducts(INITIAL_MASTER_PRODUCTS);
      } else {
        setIsLiveCatalog(true);
        setMasterProducts(res.masterProducts);
      }
    });

    (async () => {
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      if (!token) {
        setSubmissions([]);
        return;
      }
      const res = await fetchCatalogSubmissions(token, controller.signal);
      if (res.source === 'unconfigured') {
        setSubmissions(INITIAL_CATALOG_SUBMISSIONS);
      } else {
        setSubmissions(res.submissions.filter((s) => s.status === 'pending_review'));
      }
    })();

    return () => controller.abort();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = async (id: string) => {
    const item = submissions.find(s => s.id === id);
    if (!item) return;

    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token && isLiveCatalog) {
      const res = await reviewCatalogProposal(token, id, 'approved');
      if (res.ok && res.masterProduct) {
        setMasterProducts(prev => [res.masterProduct!, ...prev]);
        setSubmissions(prev => prev.filter(s => s.id !== id));
        setNotification(`SKU "${item.proposedTitle}" approved and saved to Supabase Master Catalog.`);
        setTimeout(() => setNotification(null), 4000);
        return;
      }
    }

    const newMaster: MasterProduct = {
      id: `master_${Date.now()}`,
      titleEn: item.proposedTitle,
      titleBn: item.proposedTitle,
      brand: item.proposedBrand || 'Generic',
      category: item.proposedCategory,
      description: item.proposedDescription,
      canonicalImages: item.proposedImages,
      specifications: { 'Approval': 'Verified by Admin & Gemini AI' },
      isVerified: true,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMasterProducts(prev => [newMaster, ...prev]);
    setSubmissions(prev => prev.filter(s => s.id !== id));
    setNotification(`SKU "${item.proposedTitle}" approved and added to Master Catalog.`);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReject = async (id: string) => {
    const item = submissions.find(s => s.id === id);
    const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
    if (token && isLiveCatalog) {
      await reviewCatalogProposal(token, id, 'rejected');
    }
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (item) {
      setNotification(`Submission for "${item.proposedTitle}" rejected.`);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl bg-[var(--pm-card)] text-[var(--pm-text)] rounded-3xl shadow-2xl border border-[var(--pm-border)] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--pm-border)] bg-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--pm-warning)] text-slate-950 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  PaikarMart Master Catalog Governance
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/30">
                  Admin Console
                </span>
              </div>
              <p className="text-xs text-slate-300">
                RBAC Catalog Quality Audit & Gemini AI Verification Queue
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--pm-border)] bg-[var(--pm-surface)] shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                  : 'text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Pending Vendor Submissions ({submissions.length})
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                  : 'text-[var(--pm-muted)] hover:bg-[var(--pm-card-hover)] hover:text-[var(--pm-text)]'
              }`}
            >
              <Layers className="w-4 h-4" />
              Master Catalog SKUs ({masterProducts.length})
            </button>
          </div>

          <div className="text-[11px] font-mono text-[var(--pm-muted)]">
            Role: Platform Super Admin
          </div>
        </div>

        {/* Notification Toast */}
        {notification && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30 text-xs text-[var(--pm-success)] flex items-center justify-between animate-fade-in shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--pm-success)]" />
              <span>{notification}</span>
            </div>
          </div>
        )}

        {/* Main Viewport */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: Pending Queue */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {submissions.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[var(--pm-success-soft)] text-[var(--pm-success)] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[var(--pm-text)]">
                    No Pending Catalog Submissions
                  </h4>
                  <p className="text-xs text-[var(--pm-muted)] max-w-sm mx-auto">
                    All vendor requested catalog items have been verified by Gemini AI and platform admins.
                  </p>
                </div>
              ) : (
                submissions.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.proposedImages[0]}
                          alt={item.proposedTitle}
                          className="w-14 h-14 rounded-xl object-cover border border-[var(--pm-border)] shrink-0 bg-[var(--pm-card)]"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase text-[var(--pm-accent)]">
                              {item.proposedBrand} · {item.proposedCategory}
                            </span>
                            <span className="text-[10px] text-[var(--pm-muted)]">by {item.sellerName}</span>
                          </div>
                          <h4 className="text-sm font-bold text-[var(--pm-text)]">
                            {item.proposedTitle}
                          </h4>
                          <p className="text-xs text-[var(--pm-muted)] line-clamp-1 mt-0.5">
                            {item.proposedDescription}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-[var(--pm-muted)] block font-medium">Proposed Rate</span>
                        <span className="text-base font-mono font-bold text-[var(--pm-text)]">
                          ৳{item.proposedPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* AI Audit Insight Pill */}
                    <div className="p-3 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--pm-success)] shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-[var(--pm-success)] uppercase block">
                            Gemini AI Audit ({item.aiConfidenceScore}% Confidence)
                          </span>
                          <p className="text-[11px] text-[var(--pm-muted)]">
                            {item.aiAuditNotes}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReject(item.id)}
                          className="px-3 py-1.5 rounded-xl border border-[var(--pm-danger)]/30 bg-[var(--pm-danger-soft)] hover:opacity-90 text-[var(--pm-danger)] text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprove(item.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-[var(--pm-success)] hover:opacity-90 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve & Publish
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: Master Catalog View */}
          {activeTab === 'catalog' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[var(--pm-muted)]" />
                <input
                  type="text"
                  placeholder="Filter master SKUs by brand or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[var(--pm-border)] bg-[var(--pm-input)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {masterProducts
                  .filter(mp => !searchQuery || mp.titleEn.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(mp => (
                    <div
                      key={mp.id}
                      className="p-3.5 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center gap-3"
                    >
                      <img
                        src={mp.canonicalImages[0]}
                        alt={mp.titleEn}
                        className="w-12 h-12 rounded-xl object-cover bg-[var(--pm-card)] border border-[var(--pm-border)] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-[var(--pm-warning)] uppercase block">
                          {mp.brand} · {mp.category}
                        </span>
                        <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">
                          {mp.titleEn}
                        </h4>
                        <p className="text-[10px] text-[var(--pm-muted)] font-mono">
                          ID: {mp.id}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
