import React, { useEffect, useState } from 'react';
import { Tag, Check, Copy, FileText, X } from 'lucide-react';
import { retailApiClient, RetailVoucher } from '@/features/marketplace/services/retailApiClient';

interface VoucherDealsStripProps {
  isBn: boolean;
  appliedVoucherCode?: string;
  onSelectVoucher: (code: string) => void;
  onOpenPrescriptionModal: () => void;
  showPrescriptionShortcut?: boolean;
}

export const VoucherDealsStrip: React.FC<VoucherDealsStripProps> = ({
  isBn,
  appliedVoucherCode,
  onSelectVoucher,
  onOpenPrescriptionModal,
  showPrescriptionShortcut = true,
}) => {
  const [vouchers, setVouchers] = useState<RetailVoucher[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let active = true;
    retailApiClient.fetchDeals().then((list) => {
      if (active && list.length > 0) {
        setVouchers(list.slice(0, 3));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (dismissed) return null;

  const handleApplyCode = (code: string) => {
    navigator.clipboard?.writeText(code).catch(() => {});
    setCopiedCode(code);
    onSelectVoucher(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section
      aria-label="Retail promotions and prescription shortcuts"
      className="px-4 py-2.5 rounded-2xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] flex flex-wrap items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--pm-text)] whitespace-nowrap shrink-0">
          <Tag className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>{isBn ? 'ভেরিফাইড ভাউচার:' : 'Verified Vouchers:'}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {vouchers.length > 0 ? (
            vouchers.map((v, idx) => {
              const isSelected = appliedVoucherCode === v.code || copiedCode === v.code;
              return (
                <React.Fragment key={v.code}>
                  {idx > 0 && <span className="text-[var(--pm-border-strong)] text-xs" aria-hidden="true">·</span>}
                  <button
                    type="button"
                    onClick={() => handleApplyCode(v.code)}
                    title={isBn ? v.descriptionBn : v.descriptionEn}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap shrink-0 border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-transparent'
                        : 'bg-[var(--pm-surface)] text-[var(--pm-text)] border-[var(--pm-border)] hover:border-[var(--pm-accent)]'
                    }`}
                  >
                    <span>{v.code}</span>
                    {isSelected ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-[var(--pm-muted)]" />}
                  </button>
                </React.Fragment>
              );
            })
          ) : (
            <button
              type="button"
              onClick={() => handleApplyCode('SUPER10')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold whitespace-nowrap shrink-0 bg-[var(--pm-surface)] text-[var(--pm-text)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] cursor-pointer"
            >
              <span>SUPER10</span>
              <Copy className="w-3 h-3 text-[var(--pm-muted)]" />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {showPrescriptionShortcut && (
          <button
            type="button"
            onClick={onOpenPrescriptionModal}
            className="px-3 py-1.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isBn ? 'প্রেসক্রিপশন / বাজার লিস্ট' : 'Upload Rx / Bazar List'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={isBn ? 'বন্ধ করুন' : 'Dismiss banner'}
          className="p-1.5 rounded-lg text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
