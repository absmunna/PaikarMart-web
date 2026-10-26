import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Calendar, MapPin, CheckCircle, Award, 
  ChevronRight, Users, MessageSquare, Plus, CheckCircle2, DollarSign, Clock
} from 'lucide-react';
import { RFQ, RFQuote } from '@/modules/b2b/types/b2bTypes';
import { MOCK_B2B_RFQS } from '@/modules/b2b/store/useB2BRFQStore';

interface RFQDetailViewProps {
  rfqId: string;
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export const RFQDetailView: React.FC<RFQDetailViewProps> = ({ 
  rfqId, 
  onNavigate, 
  onBack,
  onNotify
}) => {
  const [rfq, setRfq] = useState<RFQ>(
    MOCK_B2B_RFQS.find(r => r.id === rfqId) || MOCK_B2B_RFQS[0]
  );

  // Quote form state
  const [quotePrice, setQuotePrice] = useState<number>(150);
  const [deliveryDays, setDeliveryDays] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [bidSubmitted, setBidSubmitted] = useState(false);

  const handleBidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliveryDays.trim() || !quoteNotes.trim()) {
      onNotify('দয়া করে ডেলিভারি সময় এবং বিড নোট সম্পূর্ণ করুন!', 'warning');
      return;
    }

    const newQuote: RFQuote = {
      id: `q-custom-${Date.now()}`,
      companyName: 'মেসার্স ডেনিম সোর্সিং (Self Pro Team)',
      quotePrice: quotePrice,
      deliveryTime: `${deliveryDays} দিন`,
      message: quoteNotes,
      date: 'আজকে'
    };

    // Update rfq quotes locally
    const updatedQuotes = rfq.quotes ? [newQuote, ...rfq.quotes] : [newQuote];
    setRfq({ ...rfq, quotes: updatedQuotes });

    setBidSubmitted(true);
    onNotify('আপনার কোম্পানির বিড সফলভাবে বায়ার ড্যাশবোর্ডে সাবমিট হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 text-[#c5c6c7]">
      {/* Back and navigation */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">List of RFQs</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Demand Specifications</span>
      </div>

      {/* A. Direct visual header of single RFQ */}
      <div className="p-5.5 rounded-3xl border space-y-3.5 bg-gradient-to-br from-[#0b0c10] via-[#1f2833]/30 to-[#0b0c10]" style={{ borderColor: 'var(--pm-border)' }}>
        <div className="flex justify-between items-center gap-2">
          <span className="text-[8.5px] bg-teal-500/10 text-teal-400 border border-teal-500/15 px-2.5 py-0.5 rounded font-black uppercase">
            {rfq.category.toUpperCase()}
          </span>
          <span className="text-[10px] text-[var(--pm-text-secondary)] font-extrabold flex items-center gap-1">
            <MapPin className="w-4 h-4 text-rose-400" /> {rfq.buyerRegion}
          </span>
        </div>

        <h1 className="text-sm sm:text-base font-black text-white leading-snug">{rfq.title}</h1>

        <div className="flex flex-wrap gap-2 text-[10px] text-[var(--pm-text-secondary)] border-b border-white/5 pb-2.5">
          <span>Buyer: <span className="text-white font-black">{rfq.buyerName}</span></span>
          <span className="w-1 h-1 rounded-full bg-white/20 align-middle self-center" />
          <span>Deadline: <span className="text-white font-bold">{rfq.deadline}</span></span>
        </div>

        {/* Quantity and Target Prices */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase block mb-0.5">Quantity Demanded</span>
            <span className="text-white font-black">{rfq.quantity} {rfq.unit}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <span className="text-[10px] text-[var(--pm-text-secondary)] uppercase block mb-0.5">Buyer Target Price</span>
            <span className="text-white font-extrabold text-[var(--pm-accent)]">{rfq.budget}</span>
          </div>
        </div>
      </div>

      {/* B. Specifications detailed description */}
      <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-2.5">
        <h3 className="text-xs font-black tracking-wider text-white uppercase">Wholesale Detailed Spec sheet</h3>
        <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed white-space-pre-line">
          {rfq.description}
        </p>
      </div>

      {/* C. Interactive Quotation Bid Form Sheet */}
      <div className="p-5 rounded-3xl border bg-black/40" style={{ borderColor: 'var(--pm-border)' }}>
        <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-[var(--pm-accent)]" /> Submit Custom Factory Bid
        </h3>
        <p className="text-[9.5px] text-[var(--pm-text-secondary)] mb-4">
          আপনার কারখানার বেস্ট রেডি সুতা বা ম্যানুফ্যাকচারিং প্ল্যান্টের সামর্থ্য অনুযায়ী পাইকারি প্রাইস কোটেশন সরাসরি কাস্টমারকে পাঠান।
        </p>

        {bidSubmitted ? (
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center text-xs font-extrabold text-cyan-400 flex flex-col items-center gap-1.5">
            <CheckCircle2 className="w-6 h-6 animate-pulse" />
            <span>আপনার বিডটি সম্পূর্ণ হয়েছে! বায়ার টীম সরাসরি চ্যাটে আপনার সাথে যোগাযোগ করবেন।</span>
          </div>
        ) : (
          <form onSubmit={handleBidSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-white/60 font-black uppercase">Your Price (Unit Rate) ৳ *</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-white/50 font-bold">৳</span>
                  <input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(parseInt(e.target.value) || 0)}
                    className="w-full text-xs p-3.5 pl-7 rounded-xl border border-white/5 bg-black/30 outline-none text-white focus:border-[var(--pm-accent)]/40 font-mono font-black"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-white/60 font-black uppercase">Delivery Timeline (Days) *</label>
                <input
                  type="text"
                  placeholder="যেমন: ২৫ দিন"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/30 outline-none text-white focus:border-[var(--pm-accent)]/40 font-bold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-white/60 font-black uppercase">Bidding Description / Terms notes *</label>
              <textarea
                placeholder="আপনার কাপড়ের গুণমান, জিএসএম সূচক, কিংবা অ্যাডভান্সড পেমেন্ট টার্মস (যেমন: 50% LC, 50% Cash) বিস্তারিত উল্লেখ করুন..."
                rows={3}
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                className="w-full text-xs p-3.5 rounded-xl border border-white/5 bg-black/30 outline-none text-white focus:border-[var(--pm-accent)]/40 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 text-white font-extrabold text-xs tracking-wider rounded-xl transition active:scale-95 shadow-md"
            >
              SUBMIT CORPORATE PROPOSALS CERTIFICATE
            </button>
          </form>
        )}
      </div>

      {/* D. Previously Placed active quotes feed */}
      <div className="space-y-3">
        <h3 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase">Currently Placed Bids ({rfq.quotes ? rfq.quotes.length : 0})</h3>
        
        {(!rfq.quotes || rfq.quotes.length === 0) ? (
          <div className="p-4 text-center rounded-2xl bg-[var(--pm-surface)] col border border-white/5 text-xs text-white/55">
            বর্তমানে এই ডিমান্ডে কোনো কারখানা বিড করে নি। আপনার বিড প্রথম হবে!
          </div>
        ) : (
          <div className="space-y-3">
            {rfq.quotes.map((qt, i) => (
              <div key={qt.id || i} className="p-3.5 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Award className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="font-extrabold text-white truncate leading-normal">{qt.companyName}</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-extrabold bg-cyan-500/10 border border-cyan-500/15 px-1.5 py-0.2 rounded shrink-0">
                    ৳ {qt.quotePrice} / unit
                  </span>
                </div>
                
                <p className="text-[11px] text-[var(--pm-text-secondary)] whitespace-pre-line leading-relaxed">
                  {qt.message}
                </p>

                <div className="flex justify-between text-[9.5px] text-[var(--pm-text-secondary)] font-bold pt-1.5 border-t border-white/5">
                  <span className="flex items-center gap-0.5"><Clock className="w-3.5 h-3.5 text-cyan-400" /> Delivery: {qt.deliveryTime}</span>
                  <span>Submitted: {qt.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
