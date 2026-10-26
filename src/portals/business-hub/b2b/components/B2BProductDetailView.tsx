import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, ShieldCheck, Globe, Star, Users, Calculator,
  MessageCircle, FileText, ShoppingCart, ShoppingBag, Terminal, CheckCircle
} from 'lucide-react';
import { B2BProduct } from '@/modules/b2b/types/b2bTypes';
import { MOCK_B2B_PRODUCTS } from '@/modules/b2b/store/useB2BProductDataStore';
import { MOCK_B2B_VENDORS } from '@/modules/b2b/store/useB2BVendorStore';

interface B2BProductDetailViewProps {
  productId: string;
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export const B2BProductDetailView: React.FC<B2BProductDetailViewProps> = ({ 
  productId, 
  onNavigate, 
  onBack,
  onNotify
}) => {
  const product = MOCK_B2B_PRODUCTS.find(p => p.id === productId) || MOCK_B2B_PRODUCTS[0];
  const vendor = MOCK_B2B_VENDORS.find(v => v.id === product.vendorId) || MOCK_B2B_VENDORS[0];

  const [activeTab, setActiveTab] = useState<'info' | 'specs' | 'rules'>('info');
  const [selectedQty, setSelectedQty] = useState<number>(product.moq);
  const [isSaved, setIsSaved] = useState(false);
  
  // RFQ proposal Form State
  const [rfqMessage, setRfqMessage] = useState('');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Calculate price dynamically based on input quantity
  const currentUnitPrice = () => {
    // Find matching tier
    for (let i = product.tierPrices.length - 1; i >= 0; i--) {
      const tier = product.tierPrices[i];
      // extract numbers from tier range
      const match = tier.range.match(/\d+/g);
      if (match) {
        const lowerLimit = parseInt(match[0]);
        if (selectedQty >= lowerLimit) {
          return tier.price;
        }
      }
    }
    return product.tierPrices[0].price;
  };

  const handleInquiryAdd = () => {
    onNotify(`অর্ডার ইনকোয়ারি কার্টে সংযুক্ত হয়েছে! MOQ: ${product.moq} পিস।`, 'success');
  };

  const handleRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfqMessage.trim()) {
      onNotify('কোটের মেসেজ খালি রাখা যাবে না!', 'error');
      return;
    }
    setRfqSubmitted(true);
    onNotify('আপনার RFQ কোটেশন সরাসরি কারখানার সেলস হেডের কাছে পাঠানো হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 text-[#c5c6c7]">
      {/* Back and title */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">Showroom</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Bulk Goods Registry</span>
      </div>

      {/* A. Product Gallery & Cover */}
      <div className="relative aspect-square w-full max-h-[500px] md:max-h-[560px] mx-auto rounded-3xl overflow-hidden border border-white/10 bg-black/40">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="absolute top-4 right-4 p-2.5 rounded-2xl bg-black/60 hover:bg-black/90 text-white backdrop-blur border border-white/10 transition"
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 text-white text-[10px] font-black tracking-wider uppercase">
          STRICT MOQ: {product.moq} PIECES
        </div>
      </div>

      {/* B. Title + Factory Info */}
      <div className="space-y-3.5">
        <div className="flex flex-wrap gap-2">
          {product.isVerified && (
            <span className="text-[9px] px-2 py-0.5 rounded bg-orange-600/25 text-orange-400 border border-orange-500/25 font-black uppercase flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Direct Factory Certified
            </span>
          )}
          {product.isExport && (
            <span className="text-[9px] px-2 py-0.5 rounded bg-cyan-500/25 text-cyan-400 border border-cyan-500/25 font-black uppercase flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Bangladesh Export Ready
            </span>
          )}
        </div>

        <h1 className="text-base sm:text-lg font-black text-white leading-snug">{product.name}</h1>

        <div 
          onClick={() => onNavigate('factory-profile', vendor.id)}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 cursor-pointer transition flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <img src={vendor.logo} alt={vendor.name} className="w-10 h-10 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white leading-normal truncate">{vendor.name}</p>
              <div className="flex items-center gap-2 text-[10px] text-[var(--pm-text-secondary)] font-semibold mt-0.5">
                <span>{vendor.location.split(',').pop()}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="text-amber-400 flex items-center gap-0.5"><Star className="w-3 h-3 fill-amber-400 shrink-0" /> {vendor.rating}</span>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[var(--pm-accent)] font-extrabold select-none">Visit Factory Profile →</span>
        </div>
      </div>

      {/* C. MOQ Display & Price Estimator Callout */}
      <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase font-semibold">Bulk Price Calculator</span>
            <p className="text-sm font-black text-white">Tier Evaluation Panel</p>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-[var(--pm-text-secondary)] uppercase block">Selected Qty Unit</span>
            <span className="text-xs font-black text-[var(--pm-accent)]">{selectedQty} Pcs</span>
          </div>
        </div>

        {/* Sliders for Quantity adjustments */}
        <div className="space-y-2">
          <input
            type="range"
            min={product.moq}
            max={product.moq * 10}
            step="10"
            value={selectedQty}
            onChange={(e) => setSelectedQty(parseInt(e.target.value))}
            className="w-full bg-black/40 accent-[var(--pm-accent)] h-1.5 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-[var(--pm-text-secondary)] font-bold">
            <span>Minimum MOQ: {product.moq}</span>
            <span>Bulk Lot Limit: {product.moq * 10}</span>
          </div>
        </div>

        {/* Real-time calculated quote */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center">
          <div>
            <span className="text-[9.5px] text-white/50 font-bold block">Estimated Unit Price (Unit Rate):</span>
            <span className="text-sm font-black text-white">৳ {currentUnitPrice()} <span className="text-xs text-white/50 font-normal">/ piece</span></span>
          </div>
          <div className="text-right">
            <span className="text-[9.5px] text-white/50 font-bold block">Consolidated Order Volume Total:</span>
            <span className="text-base font-black text-[var(--pm-accent)]">৳ {(currentUnitPrice() * selectedQty).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* D. Tier Pricing Table */}
      <div className="space-y-2">
        <h4 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase">MOQ Price Brackets (বাংলাদেশ পাইকারি রেট)</h4>
        <div className="border border-[var(--pm-border)] rounded-2xl overflow-hidden bg-[var(--pm-surface)]">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/5 text-[10px] uppercase font-black text-[var(--pm-text-secondary)] border-b border-white/5">
              <tr>
                <th className="p-3">Order Volume (MOQ Range)</th>
                <th className="p-3 text-right">Wholesale Price (Unit)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {product.tierPrices.map((tier, i) => (
                <tr key={i} className="hover:bg-white/5">
                  <td className="p-3 font-bold text-white">{tier.range}</td>
                  <td className="p-3 text-right font-black text-[var(--pm-accent)]">৳ {tier.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/5 p-1 bg-white/5 rounded-2xl gap-1">
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black ${activeTab === 'info' ? 'bg-[#1f2833] text-white' : 'text-white/60 hover:text-white'}`}
        >
          Product Specs
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black ${activeTab === 'specs' ? 'bg-[#1f2833] text-white' : 'text-white/60 hover:text-white'}`}
        >
          Factory Parameters
        </button>
      </div>

      <div className="bg-[#1f2833]/20 border border-white/5 rounded-3xl p-5 space-y-3 shadow-md">
        {activeTab === 'info' && (
          <div className="space-y-4">
            <p className="text-xs text-var(--pm-text-secondary) leading-relaxed">{product.description}</p>
            {product.specs && (
              <div className="space-y-2.5 pt-2 border-t border-white/5">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center text-xs">
                    <span className="text-[var(--pm-text-secondary)] font-semibold">{k}:</span>
                    <span className="text-white font-extrabold text-right ml-4">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="space-y-3 text-xs leading-relaxed">
            <div className="flex justify-between">
              <span className="text-[var(--pm-text-secondary)]">Established Year</span>
              <span className="text-white font-bold">{vendor.establishedYear}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--pm-text-secondary)]">Employee Count</span>
              <span className="text-white font-bold">{vendor.employeeCount} Workers</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--pm-text-secondary)]">Primary Industry</span>
              <span className="text-white font-bold">{vendor.industry}</span>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-white/5">
              <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase font-extrabold block">International Standards Certifications</span>
              <div className="flex flex-wrap gap-1">
                {vendor.certifications.map(c => (
                  <span key={c} className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 px-2 py-0.5 rounded font-black">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* E. Action Buttons Panel */}
      <div className="grid grid-cols-2 gap-3.5">
        <button
          onClick={handleInquiryAdd}
          className="py-3 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" /> Add to Inquiry Cart
        </button>
        <button
          onClick={() => onNavigate('factory-profile', vendor.id)}
          className="py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 text-white font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/10 transition-all active:scale-95"
        >
          <MessageCircle className="w-4 h-4" /> Chat With Manufacturer
        </button>
      </div>

      {/* Direct RFQ form builder block for quick factory bidding */}
      <div className="p-4 rounded-3xl border" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
        <h4 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase mb-2 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[var(--pm-accent)]" /> Instant Custom RFQ Quote Request
        </h4>
        <p className="text-[9px] text-[var(--pm-text-secondary)] mb-4">
          ফ্যাক্টরি সেলস টীমের কাছে কাস্টম প্যাটার্ন, নিজস্ব ব্র্যান্ডিং লোগো ডিজাইন প্রিন্ট বা স্পেশাল প্যাকিং সাইজ কোটেশন রিকোয়েস্ট পাঠান।
        </p>

        {rfqSubmitted ? (
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl text-center text-xs font-extrabold text-cyan-400 flex flex-col items-center gap-1.5">
            <CheckCircle className="w-6 h-6 shrink-0 animate-bounce" />
            <span>RFQ বায়ার রিকুয়েস্ট সফলভাবে সাবমিট হয়েছে! ২৪ ঘণ্টার মধ্যে রেসপন্স দেওয়া হবে।</span>
          </div>
        ) : (
          <form onSubmit={handleRFQSubmit} className="space-y-3">
            <textarea
              placeholder="পণ্যটির জন্য আপনার কাস্টম লোগো, স্পেসিফিকেশন, সাইজ, কালার চয়েস এবং শিপমেন্ট রিকোয়ারমেন্ট বিস্তারিত লিখুন..."
              rows={3}
              value={rfqMessage}
              onChange={(e) => setRfqMessage(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-white/10 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/50 resize-none placeholder-white/30"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold text-xs rounded-xl tracking-wider transition-all active:scale-95"
            >
              SUBMIT DIRECT BID PROPOSAL
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
