import React, { useMemo, useState } from 'react';
import { Calculator, FileText, Globe, Printer, Ship } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HsCodePreset {
  code: string;
  labelEn: string;
  labelBn: string;
  defaultUnitWeightKg: number;
  exportIncentivePct: number;
}

interface DestinationPreset {
  id: string;
  labelEn: string;
  labelBn: string;
  tariffPct: number;
  vatOrGstPct: number;
  transitDays: string;
}

const HS_CODE_PRESETS: HsCodePreset[] = [
  {
    code: '6109.10',
    labelEn: 'RMG Cotton T-Shirts & Knitwear',
    labelBn: 'তৈরি পোশাক (টি-শার্ট ও নিটওয়্যার)',
    defaultUnitWeightKg: 0.24,
    exportIncentivePct: 4.0,
  },
  {
    code: '6203.42',
    labelEn: 'Woven Denim & Trousers',
    labelBn: 'ডেনিম ও ওভেন ট্রাউজার্স',
    defaultUnitWeightKg: 0.48,
    exportIncentivePct: 4.0,
  },
  {
    code: '5307.10',
    labelEn: 'Jute Yarn, Bags & Handicrafts',
    labelBn: 'পাটজাত পণ্য ও হস্তশিল্প',
    defaultUnitWeightKg: 0.35,
    exportIncentivePct: 7.5,
  },
  {
    code: '6403.99',
    labelEn: 'Leather Footwear & Goods',
    labelBn: 'চামড়াজাত জুতা ও পণ্য',
    defaultUnitWeightKg: 0.65,
    exportIncentivePct: 6.0,
  },
  {
    code: '0902.30',
    labelEn: 'Agro, Tea & Dry Food Lots',
    labelBn: 'কৃষি পণ্য, চা ও ড্রাই ফুড',
    defaultUnitWeightKg: 1.0,
    exportIncentivePct: 4.0,
  },
  {
    code: '8517.62',
    labelEn: 'Consumer Electronics & Cables',
    labelBn: 'ইলেকট্রনিক্স ও অ্যাক্সেসরিজ',
    defaultUnitWeightKg: 0.18,
    exportIncentivePct: 0,
  },
];

const DESTINATION_PRESETS: DestinationPreset[] = [
  {
    id: 'eu-gsp',
    labelEn: 'European Union (EBA / GSP)',
    labelBn: 'ইউরোপীয় ইউনিয়ন (EU GSP)',
    tariffPct: 0,
    vatOrGstPct: 19,
    transitDays: '22–28 Days (Sea)',
  },
  {
    id: 'uk-dcts',
    labelEn: 'United Kingdom (DCTS)',
    labelBn: 'যুক্তরাজ্য (UK DCTS)',
    tariffPct: 0,
    vatOrGstPct: 20,
    transitDays: '20–26 Days (Sea)',
  },
  {
    id: 'usa',
    labelEn: 'United States (MFN)',
    labelBn: 'যুক্তরাষ্ট্র (USA)',
    tariffPct: 14.5,
    vatOrGstPct: 0,
    transitDays: '26–34 Days (Sea)',
  },
  {
    id: 'uae-gcc',
    labelEn: 'UAE / GCC Hub (Jebel Ali)',
    labelBn: 'সংযুক্ত আরব আমিরাত / GCC',
    tariffPct: 5.0,
    vatOrGstPct: 5,
    transitDays: '9–14 Days (Sea)',
  },
  {
    id: 'japan',
    labelEn: 'Japan (Preferential LDC)',
    labelBn: 'জাপান (পছন্দসই শুল্ক)',
    tariffPct: 0,
    vatOrGstPct: 10,
    transitDays: '16–22 Days (Sea)',
  },
  {
    id: 'domestic',
    labelEn: 'Domestic Bangladesh B2B',
    labelBn: 'বাংলাদেশ অভ্যন্তরীণ B2B',
    tariffPct: 0,
    vatOrGstPct: 5,
    transitDays: '1–3 Days (Truck)',
  },
];

type Incoterm = 'FOB Chattogram' | 'CIF Destination' | 'EXW Factory';
type Currency = 'BDT' | 'USD' | 'EUR';

const FX_RATES: Record<Currency, { symbol: string; perBdt: number }> = {
  BDT: { symbol: '৳', perBdt: 1 },
  USD: { symbol: '$', perBdt: 1 / 120 },
  EUR: { symbol: '€', perBdt: 1 / 130 },
};

export const ExportDutyCalculator: React.FC = () => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedHsCode, setSelectedHsCode] = useState<string>(HS_CODE_PRESETS[0].code);
  const [selectedDestId, setSelectedDestId] = useState<string>(DESTINATION_PRESETS[0].id);
  const [incoterm, setIncoterm] = useState<Incoterm>('FOB Chattogram');
  const [currency, setCurrency] = useState<Currency>('BDT');
  const [quantity, setQuantity] = useState<number>(1000);
  const [unitPriceBdt, setUnitPriceBdt] = useState<number>(420);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  const hsPreset = useMemo(
    () => HS_CODE_PRESETS.find((item) => item.code === selectedHsCode) || HS_CODE_PRESETS[0],
    [selectedHsCode]
  );

  const destPreset = useMemo(
    () => DESTINATION_PRESETS.find((item) => item.id === selectedDestId) || DESTINATION_PRESETS[0],
    [selectedDestId]
  );

  const summary = useMemo(() => {
    const safeQty = Math.max(1, quantity || 0);
    const safeUnitBdt = Math.max(1, unitPriceBdt || 0);
    const exwValueBdt = safeQty * safeUnitBdt;
    const grossWeightKg = Number((safeQty * hsPreset.defaultUnitWeightKg).toFixed(1));
    const portHandlingBdt = destPreset.id === 'domestic' ? 2500 : 18500;
    const freightBdt =
      incoterm === 'EXW Factory'
        ? 0
        : incoterm === 'FOB Chattogram'
        ? destPreset.id === 'domestic'
          ? 4500
          : 12000
        : destPreset.id === 'domestic'
        ? 6500
        : 145000;

    const cifBaseBdt = exwValueBdt + portHandlingBdt + freightBdt;
    const estimatedDutyBdt = Math.round((cifBaseBdt * destPreset.tariffPct) / 100);
    const estimatedVatBdt = Math.round(((cifBaseBdt + estimatedDutyBdt) * destPreset.vatOrGstPct) / 100);
    const landedEstimateBdt = cifBaseBdt + estimatedDutyBdt + estimatedVatBdt;
    const exportIncentiveBdt =
      destPreset.id === 'domestic' ? 0 : Math.round((exwValueBdt * hsPreset.exportIncentivePct) / 100);

    return {
      safeQty,
      exwValueBdt,
      grossWeightKg,
      freightBdt: freightBdt + portHandlingBdt,
      estimatedDutyBdt,
      estimatedVatBdt,
      landedEstimateBdt,
      exportIncentiveBdt,
    };
  }, [quantity, unitPriceBdt, hsPreset, destPreset, incoterm]);

  const formatMoney = (amountBdt: number) => {
    const fx = FX_RATES[currency];
    const converted = amountBdt * fx.perBdt;
    return `${fx.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: currency === 'BDT' ? 0 : 2,
      maximumFractionDigits: currency === 'BDT' ? 0 : 2,
    })}`;
  };

  return (
    <section className="rounded-[2rem] bg-[var(--pm-card)] border border-[var(--pm-border)] p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-[var(--pm-text)]">
              {isBn
                ? 'ক্রস-বর্ডার এক্সপোর্ট ডিউটি ও ইনভয়েস ক্যালকুলেটর'
                : 'Cross-Border B2B Export, HS Tariff & Invoice Calculator'}
            </h2>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn
                ? 'HS কোড, গন্তব্য শুল্ক, ইনকোটার্মস (FOB/CIF/EXW), এবং BDT/USD/EUR কনভার্শন হিসাব করুন।'
                : 'Calculate HS code duties, FOB/CIF/EXW logistics costs, BD export incentives & multi-currency totals.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] border border-[var(--pm-border)] text-xs font-bold text-[var(--pm-text)] transition-colors cursor-pointer"
        >
          <Calculator className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
          <span>{isExpanded ? (isBn ? 'বন্ধ করুন' : 'Hide Calculator') : (isBn ? 'হিসাব খুলুন' : 'Open Calculator')}</span>
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4 pt-3 border-t border-[var(--pm-border)] animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <label className="space-y-1 text-xs">
              <span className="font-bold text-[var(--pm-muted)] block">
                {isBn ? 'HS কোড ও ক্যাটাগরি' : 'HS Code & Commodity'}
              </span>
              <select
                value={selectedHsCode}
                onChange={(e) => setSelectedHsCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-semibold"
              >
                {HS_CODE_PRESETS.map((hs) => (
                  <option key={hs.code} value={hs.code}>
                    {hs.code} · {isBn ? hs.labelBn : hs.labelEn}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-xs">
              <span className="font-bold text-[var(--pm-muted)] block">
                {isBn ? 'গন্তব্য মার্কেট / রিজিওন' : 'Destination Market'}
              </span>
              <select
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-semibold"
              >
                {DESTINATION_PRESETS.map((dest) => (
                  <option key={dest.id} value={dest.id}>
                    {isBn ? dest.labelBn : dest.labelEn} ({dest.tariffPct}% Duty)
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-xs">
              <span className="font-bold text-[var(--pm-muted)] block">
                {isBn ? 'ইনকোটার্মস ও কারেন্সি' : 'Incoterm & Display Currency'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={incoterm}
                  onChange={(e) => setIncoterm(e.target.value as Incoterm)}
                  className="px-2.5 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-semibold"
                >
                  <option value="FOB Chattogram">FOB Chattogram</option>
                  <option value="CIF Destination">CIF Destination</option>
                  <option value="EXW Factory">EXW Factory</option>
                </select>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                  className="px-2.5 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono font-bold"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </label>

            <label className="space-y-1 text-xs">
              <span className="font-bold text-[var(--pm-muted)] block">
                {isBn ? 'মোট ইউনিট (সংখ্যা)' : 'Order Quantity (Units)'}
              </span>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono font-bold"
              />
            </label>

            <label className="space-y-1 text-xs">
              <span className="font-bold text-[var(--pm-muted)] block">
                {isBn ? 'ইউনিট মূল্য (BDT ৳)' : 'Factory Unit Price (BDT ৳)'}
              </span>
              <input
                type="number"
                min={1}
                value={unitPriceBdt}
                onChange={(e) => setUnitPriceBdt(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-mono font-bold"
              />
            </label>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => setShowInvoicePreview((prev) => !prev)}
                className="w-full py-2 px-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>
                  {showInvoicePreview
                    ? isBn
                      ? 'ইনভয়েস হাইড করুন'
                      : 'Hide Commercial Invoice'
                    : isBn
                    ? 'কমার্শিয়াল ইনভয়েস দেখুন'
                    : 'Preview Commercial Invoice'}
                </span>
              </button>
            </div>
          </div>

          {/* Calculation Readout */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                {isBn ? 'ফ্যাক্টরি ভ্যালু' : 'Goods Value'}
              </span>
              <span className="text-sm font-mono font-black text-[var(--pm-text)]">
                {formatMoney(summary.exwValueBdt)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                {isBn ? 'পোর্ট ও ফ্রেইট' : `Port & Freight (${incoterm.split(' ')[0]})`}
              </span>
              <span className="text-sm font-mono font-black text-[var(--pm-text)]">
                {formatMoney(summary.freightBdt)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
              <span className="text-[10px] font-bold text-[var(--pm-muted)] block">
                {isBn ? 'শুল্ক ও ভ্যাট' : `Est. Duty (${destPreset.tariffPct}%) + VAT (${destPreset.vatOrGstPct}%)`}
              </span>
              <span className="text-sm font-mono font-black text-[var(--pm-text)]">
                {formatMoney(summary.estimatedDutyBdt + summary.estimatedVatBdt)}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-[var(--pm-success-soft)] border border-[var(--pm-success)]/30">
              <span className="text-[10px] font-bold text-[var(--pm-success)] block">
                {isBn ? 'আনুমানিক মোট খরচ' : 'Estimated Landed Total'}
              </span>
              <span className="text-sm font-mono font-black text-[var(--pm-success)]">
                {formatMoney(summary.landedEstimateBdt)}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--pm-muted)] px-1">
            <span className="inline-flex items-center gap-1.5">
              <Ship className="w-3.5 h-3.5 text-[var(--pm-accent)]" />
              <span>
                Est. Weight: <strong className="font-mono text-[var(--pm-text)]">{summary.grossWeightKg} kg</strong> · Transit:{' '}
                <strong className="text-[var(--pm-text)]">{destPreset.transitDays}</strong>
              </span>
            </span>
            {summary.exportIncentiveBdt > 0 && (
              <span className="font-semibold text-[var(--pm-success)]">
                BD Cash Incentive Reference ({hsPreset.exportIncentivePct}%): {formatMoney(summary.exportIncentiveBdt)}
              </span>
            )}
          </div>

          {showInvoicePreview && (
            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-dashed border-[var(--pm-border)] space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-2">
                <span className="font-bold text-[var(--pm-text)]">
                  COMMERCIAL INVOICE / PACKING LIST PREVIEW
                </span>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[var(--pm-card)] border border-[var(--pm-border)] text-[11px] font-sans font-bold text-[var(--pm-text)] cursor-pointer hover:border-[var(--pm-accent)]"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[var(--pm-muted)]">
                <div>HS Code: <span className="text-[var(--pm-text)]">{hsPreset.code}</span></div>
                <div>Incoterm: <span className="text-[var(--pm-text)]">{incoterm}</span></div>
                <div>Destination: <span className="text-[var(--pm-text)]">{destPreset.labelEn}</span></div>
                <div>Packing: <span className="text-[var(--pm-text)]">{summary.safeQty} units · {summary.grossWeightKg} kg gross</span></div>
                <div>FOB/Goods Subtotal: <span className="text-[var(--pm-text)]">{formatMoney(summary.exwValueBdt)}</span></div>
                <div>Landed Estimate ({currency}): <span className="font-bold text-[var(--pm-text)]">{formatMoney(summary.landedEstimateBdt)}</span></div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
