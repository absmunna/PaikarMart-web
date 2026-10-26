import React, { useState } from 'react';
import { 
  Building2, ArrowLeft, Star, MapPin, Calendar, Users, Globe, Award,
  ShieldCheck, Phone, Mail, FileText, CheckCircle2, MessageSquare, AlertCircle
} from 'lucide-react';
import { B2BVendor, B2BProduct } from '@/modules/b2b/types/b2bTypes';
import { MOCK_B2B_VENDORS } from '@/modules/b2b/store/useB2BVendorStore';
import { MOCK_B2B_PRODUCTS } from '@/modules/b2b/store/useB2BProductDataStore';

interface FactoryProfileViewProps {
  factoryId: string;
  onNavigate: (view: string, id?: string) => void;
  onBack: () => void;
  onNotify: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

export const FactoryProfileView: React.FC<FactoryProfileViewProps> = ({ 
  factoryId, 
  onNavigate, 
  onBack,
  onNotify
}) => {
  const factory = MOCK_B2B_VENDORS.find(v => v.id === factoryId) || MOCK_B2B_VENDORS[0];
  const factoryProducts = MOCK_B2B_PRODUCTS.filter(p => p.vendorId === factory.id);

  const [activeTab, setActiveTab] = useState<'products' | 'info' | 'certs' | 'contact'>('products');
  
  // Custom cover trigger simulation
  const [coverPhoto, setCoverPhoto] = useState(factory.banner);

  // Inquiry form
  const [inquiryText, setInquiryText] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim()) {
      onNotify('ইনকোয়ারী মেসেজ খালি রাখা যাবে না!', 'error');
      return;
    }
    setInquirySubmitted(true);
    onNotify('আপনার মেসেজটি সফলভাবে ফ্যাক্টরির কাস্টমার রিলেশন ম্যানেজারের কাছে ফরওয়ার্ড করা হয়েছে!', 'success');
  };

  const changeCoverPreset = () => {
    const presets = [
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop'
    ];
    const currentIdx = presets.indexOf(coverPhoto);
    const nextIdx = (currentIdx + 1) % presets.length;
    setCoverPhoto(presets[nextIdx]);
    onNotify('ফ্যাক্টরি থিমকাভার সাকসেসফুলি পরিবর্তন হয়েছে!', 'success');
  };

  return (
    <div className="space-y-6 text-[#c5c6c7]">
      {/* Header Back Button */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 border border-white/5 bg-white/5 rounded-xl text-white/80 hover:text-white flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> <span className="text-xs font-extrabold">List of mills</span>
        </button>
        <span className="text-[11px] text-[var(--pm-text-secondary)] font-bold uppercase tracking-wider">Manufacturer Profile</span>
      </div>

      {/* A. Header Banner & Verification Ring */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/40">
        <div className="h-32 w-full relative">
          <img src={coverPhoto} alt={factory.name} className="w-full h-full object-cover" />
          <button
            onClick={changeCoverPreset}
            className="absolute bottom-2 right-2 px-2.5 py-1 text-[8px] font-black tracking-wider uppercase bg-black/60 hover:bg-black/90 text-white rounded-lg border border-white/10 select-none"
          >
            Change Cover Preset
          </button>
        </div>

        {/* Profile Details overlaid */}
        <div className="p-4 pt-10 relative">
          {/* Logo overlay offset */}
          <div className="absolute -top-10 left-4 w-20 h-20 rounded-2xl overflow-hidden border-2 border-[var(--pm-bg)] bg-black/30 shadow-xl">
            <img src={factory.logo} alt={factory.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between items-start gap-3">
              <div className="pt-2 pl-0.5">
                <h1 className="text-base font-black text-white leading-tight">{factory.name}</h1>
                <p className="text-[11px] text-[var(--pm-text-secondary)] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" /> {factory.location}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[9px] bg-orange-600/25 text-orange-400 border border-orange-500/25 px-2.5 py-0.5 rounded font-black uppercase inline-flex items-center gap-0.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Platinum Pro
                </span>
                <span className="text-[10px] text-amber-400 font-bold block mt-1.5"><Star className="w-3 h-3 fill-amber-400 inline mr-0.5" />{factory.rating} Verified</span>
              </div>
            </div>

            {/* Specialty tag badges */}
            <div className="flex flex-wrap gap-1.5 pt-2.5 border-t border-white/5">
              <span className="text-[8.5px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/15 font-black uppercase rounded">
                Specialty: {factory.industry}
              </span>
              <span className="text-[8.5px] px-2 py-0.5 bg-blue-500/10 text-cyan-400 border border-cyan-500/15 font-black uppercase rounded">
                Established: {factory.establishedYear}
              </span>
              <span className="text-[8.5px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/15 font-black uppercase rounded">
                Exporter
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* B. Tabs Structure */}
      <div className="flex overflow-x-auto hide-scrollbar border-b border-white/5 p-1 bg-white/5 rounded-2xl gap-1">
        {[
          { id: 'products', name: 'Products' },
          { id: 'info', name: 'Company Info' },
          { id: 'certs', name: 'Certifications' },
          { id: 'contact', name: 'Contact' }
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id as any)}
            className={`flex-1 text-center py-2.5 rounded-xl text-xs font-black whitespace-nowrap px-4 ${
              activeTab === tb.id 
                ? 'bg-[#1f2833] text-white shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            {tb.name}
          </button>
        ))}
      </div>

      {/* Tabs panels */}
      <div className="space-y-4">
        {/* TAB 1: Products associated */}
        {activeTab === 'products' && (
          <div className="space-y-3">
            <h3 className="text-xs font-black tracking-widest text-[var(--pm-text)] uppercase">Bulk Sourcing Catalog ({factoryProducts.length} items)</h3>
            {factoryProducts.length === 0 ? (
              <div className="text-center py-10 p-4 rounded-xl bg-[var(--pm-surface)] text-xs text-white/55 border border-[var(--pm-border)]">
                এই কারখানার কোনো পণ্য বর্তমানে শো-রুমে তালিকাভুক্ত নেই।
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {factoryProducts.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => onNavigate('product-detail', prod.id)}
                    className="p-2.5 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl hover:border-[var(--pm-accent)]/30 cursor-pointer transition flex flex-col justify-between space-y-2.5"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black/20">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.2 rounded bg-black/60 text-white text-[8px] font-black uppercase">
                        MOQ: {prod.moq}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-black text-white line-clamp-1 leading-normal">{prod.name}</h4>
                      <p className="text-[11px] font-black text-[var(--pm-accent)] mt-0.5">৳ {prod.tierPrices[prod.tierPrices.length - 1].price} / pc</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Structural profile metrics */}
        {activeTab === 'info' && (
          <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-4">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Corporate Narrative</h3>
              <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed">{factory.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3.5 border-t border-white/5 text-xs">
              <div className="space-y-1 p-2.5 bg-white/5 rounded-xl">
                <span className="text-[9.5px] uppercase font-bold text-[var(--pm-text-secondary)] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Established Year
                </span>
                <p className="font-black text-white pl-4.5">{factory.establishedYear}</p>
              </div>

              <div className="space-y-1 p-2.5 bg-white/5 rounded-xl">
                <span className="text-[9.5px] uppercase font-bold text-[var(--pm-text-secondary)] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-teal-400" /> Employee Capacity
                </span>
                <p className="font-black text-white pl-4.5">{factory.employeeCount} Members</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl text-xs space-y-2">
              <span className="text-[9.5px] uppercase font-black text-[var(--pm-text-secondary)] flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" /> Targeted Export Zones
              </span>
              <div className="flex flex-wrap gap-1.5">
                {factory.exportMarkets.map(m => (
                  <span key={m} className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9.5px] font-extrabold uppercase">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Certifications */}
        {activeTab === 'certs' && (
          <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-4">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-orange-400" /> Certifications & Compliance
            </h3>
            <p className="text-xs text-[var(--pm-text-secondary)] leading-relaxed">
              কারখানাটির ট্রেড লাইসেন্স, ফায়ার এস্টাবলিশমেন্ট পলিসি এবং আন্তর্জাতিক কমপ্লায়েন্স সার্টিফিকেশনসমূহ পাইকার মার্ট কোয়ালিটি কন্ট্রোল টিম দ্বারা ভেরিফাইড।
            </p>

            <div className="space-y-2 pt-2 border-t border-white/5">
              {factory.certifications.map((cert, index) => (
                <div key={index} className="flex gap-2.5 items-start p-2.5 bg-white/5 rounded-xl border border-white/5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-white">{cert}</p>
                    <span className="text-[10px] text-[var(--pm-text-secondary)] block mt-0.5">Status: Verified Approved & Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Contact Form */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl space-y-3.5 text-xs">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Direct Communications Desk</h3>
              
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-bold text-white">+880 (17) 000-00000 (Trade Relations)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span className="font-bold text-white">trade-relations@{factory.name.split(' ')[0].toLowerCase()}.com</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl border" style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
              <h4 className="text-xs font-black text-white uppercase mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[var(--pm-accent)]" /> Leave direct mill inquiry
              </h4>
              <p className="text-[9.5px] text-[var(--pm-text-secondary)] mb-4 leading-normal">
                ফ্যাক্টরি অথরিটির কর্পোরেট ট্রেডিং ডেস্কের কাছে ডিরেক্ট এলসি (L/C), বাল্ক ডিস্ট্রিবিউশন অফার কিংবা প্রাইসিং নেগোশিয়েশন মেসেজ পাঠান।
              </p>

              {inquirySubmitted ? (
                <div className="p-4.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-center text-xs font-extrabold text-cyan-400 flex flex-col items-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>মেসেজটি সফলভাবে ফ্যাক্টরি টীমের কাছে পাঠানো হয়েছে!</span>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <textarea
                    placeholder="আপনার অর্ডার ভলিউম, শিপিং লেটার অব অবজেকশন এবং স্পেসিফিকেশন বিস্তারিত লিখুন..."
                    rows={4}
                    value={inquiryText}
                    onChange={(e) => setInquiryText(e.target.value)}
                    className="w-full text-xs p-3.5 rounded-2xl border border-white/10 bg-black/40 outline-none text-white focus:border-[var(--pm-accent)]/50 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 bg-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/90 text-white font-extrabold text-xs rounded-xl tracking-wider transition active:scale-95 shadow-md"
                  >
                    SEND TRADING DESK MESSAGE
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
