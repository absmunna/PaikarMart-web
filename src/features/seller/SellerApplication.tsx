import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { 
  User, Briefcase, FileText, Landmark, CheckCircle, 
  ChevronRight, ChevronLeft, ShieldAlert, FileCheck, Check
} from 'lucide-react';

const BUSINESS_CATEGORIES = [
  "Electronics & Gadgets",
  "Fashion & Clothing",
  "Grocery & Food Items",
  "Software & Digital Goods",
  "Home Services & Repair",
  "Media, Content & Advertising",
  "Agriculture & Bulk Crops",
  "Healthcare & Pharmacy",
  "Construction & Raw Materials",
  "Consulting & Business Service",
  "Other Retail / Wholesale"
];

const OFFERING_TYPES = [
  { id: 'physical', title: 'Physical Products', desc: 'Wholesale, retail, or local shop listings' },
  { id: 'digital', title: 'Digital Products', desc: 'Software, templates, books, or courses' },
  { id: 'service', title: 'Services Hub', desc: 'Professional, home, beauty, or repair services' },
  { id: 'creator', title: 'Professional Creator', desc: 'Content creation, video reviews, and commerce feeds' }
];

export const SellerApplication: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Unified Multi-Step Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal Info
    legalName: user?.name || '',
    phone: user?.phone || '',
    contactEmail: user?.email || '',
    nidNumber: '',
    dob: '',

    // Step 2: Business Info
    shopName: '',
    shopDescription: '',
    primaryOffering: 'physical',
    businessCategory: '',
    sellerType: 'Individual', // Individual | Registered Business | Brand Seller
    operatingArea: 'Dhaka', // Dhaka | Chattogram | Sylhet | Rajshahi | National
    physicalAddress: '',

    // Step 3: Legal & Verification
    tradeLicenseNo: '',
    tinNumber: '',
    dbidNumber: '', // Digital Business Identification Number BD
    documentsUploaded: [] as Array<{ name: string; size: string; type: string; url: string }>,

    // Step 4: Payout & Bank Account Details
    bankName: '',
    bankBranch: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    bkashNumber: '',
    nagadNumber: '',

    // Step 5: Review & Declarations
    agreeToPolicies: false,
    agreeToCompliance: false
  });

  // Step names
  const steps = [
    { num: 1, label: 'Personal details', icon: User },
    { num: 2, label: 'Business Profile', icon: Briefcase },
    { num: 3, label: 'Legal & KYC', icon: FileText },
    { num: 4, label: 'Payout Details', icon: Landmark },
    { num: 5, label: 'Agreement', icon: CheckCircle }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    // Basic validation
    if (currentStep === 1) {
      if (!formData.legalName || !formData.phone || !formData.nidNumber || !formData.dob) {
        toast.error('Please fill in all personal information fields.');
        return;
      }
    }
    if (currentStep === 2) {
      if (!formData.shopName || !formData.businessCategory || !formData.physicalAddress) {
        toast.error('Please fill in required business details.');
        return;
      }
    }
    if (currentStep === 3) {
      if (formData.sellerType === 'Registered Business' && !formData.tradeLicenseNo) {
        toast.error('Trade License number is required for registered businesses.');
        return;
      }
    }
    if (currentStep === 4) {
      if (!formData.bankName && !formData.bkashNumber && !formData.nagadNumber) {
        toast.error('Please provide at least one payout method (Bank Account or Mobile Banking).');
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Document simulation helper
  const simulateDocUpload = (docType: string) => {
    const simulatedFiles: Record<string, { name: string; url: string }> = {
      trade: { name: 'Trade_License_2026.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/paikarmart/o/trade_license_simulated.pdf' },
      nid: { name: 'NID_Card_Front_Back.jpg', url: 'https://firebasestorage.googleapis.com/v0/b/paikarmart/o/nid_simulated.jpg' },
      tin: { name: 'TIN_Certificate.pdf', url: 'https://firebasestorage.googleapis.com/v0/b/paikarmart/o/tin_simulated.pdf' }
    };

    const target = simulatedFiles[docType];
    if (!target) return;

    if (formData.documentsUploaded.some(d => d.name === target.name)) {
      toast.info('This file is already selected.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      documentsUploaded: [
        ...prev.documentsUploaded,
        {
          name: target.name,
          size: '1.2 MB',
          type: docType,
          url: target.url
        }
      ]
    }));
    toast.success(`${target.name} attached successfully!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be signed in to apply.');
      return;
    }

    if (!formData.agreeToPolicies || !formData.agreeToCompliance) {
      toast.error('You must agree to all policies and compliance regulations to proceed.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = user.id || (user as any).uid;
      const userAvatar = user.avatarUrl || user.avatar || '';
      const userRef = doc(db, 'users', userId);

      // 1. Save main unified seller application on user document
      await updateDoc(userRef, {
        sellerApplicationStatus: 'submitted',
        sellerVerificationStatus: 'pending',
        sellerProfile: {
          shopName: formData.shopName,
          tagline: formData.shopDescription.substring(0, 80),
          type: formData.sellerType,
          category: formData.businessCategory,
          location: formData.operatingArea,
          contactEmail: formData.contactEmail,
          contactPhone: formData.phone,
          verified: false,
          verificationStatus: 'pending',
          avatarUrl: userAvatar,
          coverUrl: '',
          physicalAddress: formData.physicalAddress,
          businessInfo: {
            legalName: formData.legalName,
            nidNumber: formData.nidNumber,
            dob: formData.dob,
            primaryOffering: formData.primaryOffering,
            operatingArea: formData.operatingArea
          },
          legalInfo: {
            tradeLicenseNo: formData.tradeLicenseNo,
            tinNumber: formData.tinNumber,
            dbidNumber: formData.dbidNumber
          },
          payoutInfo: {
            bankName: formData.bankName,
            bankBranch: formData.bankBranch,
            accountHolderName: formData.accountHolderName,
            accountNumber: formData.accountNumber,
            routingNumber: formData.routingNumber,
            bkashNumber: formData.bkashNumber,
            nagadNumber: formData.nagadNumber
          }
        },
        updatedAt: serverTimestamp()
      });

      // 2. Add verification entries to kyc_documents
      if (formData.nidNumber) {
        await setDoc(doc(db, 'kyc_documents', `nid_${userId}`), {
          userId: userId,
          documentType: 'NID Card',
          documentNumber: formData.nidNumber,
          status: 'pending',
          documentUrl: formData.documentsUploaded.find(d => d.type === 'nid')?.url || 'https://firebasestorage.googleapis.com/...',
          createdAt: serverTimestamp()
        });
      }

      if (formData.tradeLicenseNo) {
        await setDoc(doc(db, 'kyc_documents', `trade_${userId}`), {
          userId: userId,
          documentType: 'Trade License',
          documentNumber: formData.tradeLicenseNo,
          dbidNumber: formData.dbidNumber || '',
          status: 'pending',
          documentUrl: formData.documentsUploaded.find(d => d.type === 'trade')?.url || 'https://firebasestorage.googleapis.com/...',
          createdAt: serverTimestamp()
        });
      }

      // 3. Create Audit Log Entry
      const logId = `log_${Date.now()}_${userId}`;
      await setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        userId: userId,
        action: 'SUBMIT_SELLER_APPLICATION',
        details: `User applied for Unified Seller. Type: ${formData.sellerType}, Primary Offering: ${formData.primaryOffering}`,
        targetUserId: userId,
        createdAt: serverTimestamp()
      });

      toast.success('আপনার ইউনিফাইড সেলার আবেদনটি সফলভাবে জমা হয়েছে। আমাদের টিম এটি যাচাই করবে।');
      navigate('/profile');
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('আবেদন জমা দিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-[#0f111a] text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Banner/Notice */}
        <div className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/10 flex items-start gap-3.5">
          <ShieldAlert className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300">
            <span className="font-bold text-white">Unified Account Notice:</span> Your existing buyer account, order history, addresses, and Firebase credentials will remain unchanged. Becoming a seller adds merchant capabilities to your single, unified PaikarMart profile.
          </div>
        </div>

        {/* Steps Progress Header */}
        <div className="bg-[#141624] border border-white/5 rounded-3xl p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-black">Become a Seller & Creator</h1>
              <p className="text-xs text-zinc-400">Unlock wholesale & retail capabilities, service listings, digital goods and creator feed posts.</p>
            </div>
            <div className="text-xs font-black text-[#FF7A00] bg-[#FF7A00]/10 px-3 py-1.5 rounded-xl uppercase tracking-widest self-start md:self-center">
              Step {currentStep} of 5
            </div>
          </div>

          {/* Graphical Progress Bar */}
          <div className="grid grid-cols-5 gap-2 mt-6">
            {steps.map((s) => {
              const Icon = s.icon;
              const isCompleted = currentStep > s.num;
              const isActive = currentStep === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 border",
                    isCompleted 
                      ? "bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/20" 
                      : isActive 
                        ? "bg-[#FF7A00] border-[#FF7A00] text-white shadow-lg shadow-orange-500/20 scale-110" 
                        : "bg-zinc-900 border-white/5 text-zinc-500"
                  )}>
                    {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className={cn(
                    "hidden sm:inline text-[10px] font-bold uppercase tracking-wider text-center",
                    isActive ? "text-[#FF7A00]" : "text-zinc-500"
                  )}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Step Panel */}
        <div className="bg-[#141624] border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STEP 1: Personal Details */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white">Step 1: Account Holder Personal Verification</h3>
                  <p className="text-xs text-zinc-400">Please provide your authentic personal details matching your NID or passport for KYC compliance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Full Legal Name</label>
                    <Input 
                      placeholder="e.g. Md Munna" 
                      value={formData.legalName}
                      onChange={(e) => handleInputChange('legalName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact Phone Number</label>
                    <Input 
                      placeholder="e.g. +88017XXXXXXXX" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Contact Email (Merchant Account)</label>
                    <Input 
                      type="email"
                      placeholder="e.g. support@paikarmart.com" 
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">National ID (NID) or Passport No</label>
                    <Input 
                      placeholder="e.g. 199XXXXXXXXXXXXXX" 
                      value={formData.nidNumber}
                      onChange={(e) => handleInputChange('nidNumber', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 max-w-sm">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Date of Birth</label>
                  <Input 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    required
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Business Info */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white">Step 2: Business & Shop Profile Setup</h3>
                  <p className="text-xs text-zinc-400">Describe what you offer. You can choose to list physical goods, digital assets, or professional services.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Primary Category of Trade</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {OFFERING_TYPES.map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => handleInputChange('primaryOffering', o.id)}
                        className={cn(
                          "p-4 rounded-2xl border text-left flex items-start gap-3 transition-all",
                          formData.primaryOffering === o.id 
                            ? "bg-[#FF7A00]/10 border-[#FF7A00] text-white shadow-lg" 
                            : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:bg-white/5"
                        )}
                      >
                        <div className={cn(
                          "p-2 rounded-xl border shrink-0 mt-0.5",
                          formData.primaryOffering === o.id ? "bg-[#FF7A00] text-white border-transparent" : "bg-zinc-900 border-white/5"
                        )}>
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-white">{o.title}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5 leading-relaxed">{o.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shop or Brand Name</label>
                    <Input 
                      placeholder="e.g. Munna Fashion & Wholesales" 
                      value={formData.shopName}
                      onChange={(e) => handleInputChange('shopName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Seller Entity Type</label>
                    <select 
                      className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                      value={formData.sellerType}
                      onChange={(e) => handleInputChange('sellerType', e.target.value)}
                    >
                      <option value="Individual">Individual Merchant (একক বিক্রেতা)</option>
                      <option value="Registered Business">Registered Enterprise (নিবন্ধিত ব্যবসা)</option>
                      <option value="Brand Seller">Manufacturer / Brand Owner (ব্র্যান্ড বিক্রেতা)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Niche / Category</label>
                    <select 
                      className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                      value={formData.businessCategory}
                      onChange={(e) => handleInputChange('businessCategory', e.target.value)}
                      required
                    >
                      <option value="">Select Category...</option>
                      {BUSINESS_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Primary Operating Area</label>
                    <select 
                      className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                      value={formData.operatingArea}
                      onChange={(e) => handleInputChange('operatingArea', e.target.value)}
                    >
                      <option value="Dhaka">Dhaka (ঢাকা)</option>
                      <option value="Chattogram">Chattogram (চট্টগ্রাম)</option>
                      <option value="Sylhet">Sylhet (সিলেট)</option>
                      <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                      <option value="National">National - All Bangladesh (সারাদেশ)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Business Address (Warehouse/Retail/Headquarters)</label>
                  <Input 
                    placeholder="Provide full location details" 
                    value={formData.physicalAddress}
                    onChange={(e) => handleInputChange('physicalAddress', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Shop Bio & Merchant Tagline</label>
                  <textarea 
                    className="w-full bg-zinc-950 border border-white/5 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF7A00] min-h-[90px]"
                    placeholder="Explain your products, MOQ requirements, service values, or shipping speed to potential buyers..."
                    value={formData.shopDescription}
                    onChange={(e) => handleInputChange('shopDescription', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Legal & Verification */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white">Step 3: Business License & KYC Documents</h3>
                  <p className="text-xs text-zinc-400">Bangladesh regulatory compliance mandates verification of trade licences or national identity documents.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trade License Number (Option/Req for Registered Business)</label>
                    <Input 
                      placeholder="e.g. TRAD/DNCC/XXXXXX" 
                      value={formData.tradeLicenseNo}
                      onChange={(e) => handleInputChange('tradeLicenseNo', e.target.value)}
                      required={formData.sellerType === 'Registered Business'}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">E-TIN Registration Number (Optional)</label>
                    <Input 
                      placeholder="e.g. XXXXXXXXXXXX" 
                      value={formData.tinNumber}
                      onChange={(e) => handleInputChange('tinNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1 max-w-md">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">DBID (Digital Business ID No - Optional)</label>
                  <Input 
                    placeholder="Enter Bangladesh government DBID number" 
                    value={formData.dbidNumber}
                    onChange={(e) => handleInputChange('dbidNumber', e.target.value)}
                  />
                </div>

                {/* Upload Verification Files */}
                <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF7A00]">Upload Supporting Documents</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => simulateDocUpload('nid')}
                      className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5 transition-colors group"
                    >
                      <FileCheck className="h-5 w-5 text-zinc-400 group-hover:text-[#FF7A00]" />
                      <span className="text-[10px] font-black uppercase text-zinc-300">Attach NID Copy</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => simulateDocUpload('trade')}
                      className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5 transition-colors group"
                    >
                      <FileCheck className="h-5 w-5 text-zinc-400 group-hover:text-[#FF7A00]" />
                      <span className="text-[10px] font-black uppercase text-zinc-300">Attach Trade License</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => simulateDocUpload('tin')}
                      className="p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-1.5 transition-colors group"
                    >
                      <FileCheck className="h-5 w-5 text-zinc-400 group-hover:text-[#FF7A00]" />
                      <span className="text-[10px] font-black uppercase text-zinc-300">Attach TIN Certificate</span>
                    </button>
                  </div>

                  {/* Upload List */}
                  {formData.documentsUploaded.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-white/5">
                      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-wider">Attached files ({formData.documentsUploaded.length})</p>
                      {formData.documentsUploaded.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-[#141624] rounded-lg border border-white/5 text-[10px]">
                          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                            <Check className="h-3 w-3" /> {doc.name}
                          </span>
                          <span className="text-zinc-500 font-bold">{doc.size}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: Banking & Payout */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white">Step 4: Payout Details & Bank Account Configuration</h3>
                  <p className="text-xs text-zinc-400">Configure how you receive payments for successful wholesale and retail sales. Bank account or Mobile financial services can be connected.</p>
                </div>

                <div className="bg-[#141624] border border-white/5 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Commercial Bank Settlement</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Name</label>
                      <Input 
                        placeholder="e.g. Islami Bank Bangladesh PLC" 
                        value={formData.bankName}
                        onChange={(e) => handleInputChange('bankName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Branch Name</label>
                      <Input 
                        placeholder="e.g. Motijheel Branch, Dhaka" 
                        value={formData.bankBranch}
                        onChange={(e) => handleInputChange('bankBranch', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Account Name (Full Holder Name)</label>
                      <Input 
                        placeholder="e.g. Md Munna" 
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Routing Number</label>
                      <Input 
                        placeholder="e.g. 125273389" 
                        value={formData.routingNumber}
                        onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 max-w-md">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Bank Account Number</label>
                    <Input 
                      placeholder="e.g. 2050XXXXXXXXXXXXXXXX" 
                      value={formData.accountNumber}
                      onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-[#141624] border border-white/5 rounded-2xl p-4 space-y-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#FF7A00]">Mobile Payout Wallet (Optional)</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">bKash Merchant/Personal Number</label>
                      <Input 
                        placeholder="e.g. 017XXXXXXXX" 
                        value={formData.bkashNumber}
                        onChange={(e) => handleInputChange('bkashNumber', e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Nagad Merchant/Personal Number</label>
                      <Input 
                        placeholder="e.g. 019XXXXXXXX" 
                        value={formData.nagadNumber}
                        onChange={(e) => handleInputChange('nagadNumber', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Review & Declarations */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="border-b border-white/5 pb-4">
                  <h3 className="text-base font-bold text-white">Step 5: Review & Bangladesh Regulatory Declarations</h3>
                  <p className="text-xs text-zinc-400">Review all details before submitting. False information can result in automatic exclusion from PaikarMart.</p>
                </div>

                {/* Review Grid */}
                <div className="p-5 rounded-2xl bg-zinc-950/40 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Applicant</p>
                    <p className="font-bold text-white mt-0.5">{formData.legalName}</p>
                    <p className="text-zinc-400 mt-0.5">{formData.phone}</p>
                    <p className="text-zinc-400 mt-0.5">NID: {formData.nidNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Shop & Category</p>
                    <p className="font-bold text-[#FF7A00] mt-0.5">{formData.shopName}</p>
                    <p className="text-zinc-400 mt-0.5">{formData.sellerType} | {formData.businessCategory}</p>
                    <p className="text-zinc-400 mt-0.5">Coverage: {formData.operatingArea}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="agreeToPolicies" 
                      checked={formData.agreeToPolicies}
                      onChange={(e) => handleInputChange('agreeToPolicies', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-[#FF7A00] focus:ring-[#FF7A00]"
                      required
                    />
                    <label htmlFor="agreeToPolicies" className="text-xs text-zinc-300 leading-relaxed cursor-pointer select-none">
                      আমি পাইকারমার্টের বিক্রেতা শর্তাবলী, রিফান্ড পলিসি এবং ই-কমার্স পরিচালনা নির্দেশিকা সম্পূর্ণভাবে পড়েছি এবং এর সাথে একমত পোষণ করছি।
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <input 
                      type="checkbox" 
                      id="agreeToCompliance" 
                      checked={formData.agreeToCompliance}
                      onChange={(e) => handleInputChange('agreeToCompliance', e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-zinc-700 bg-zinc-950 text-[#FF7A00] focus:ring-[#FF7A00]"
                      required
                    />
                    <label htmlFor="agreeToCompliance" className="text-xs text-zinc-300 leading-relaxed cursor-pointer select-none">
                      বাংলাদেশ ডিজিটাল কমার্স অ্যাক্ট এবং সংশ্লিষ্ট সকল বাণিজ্য বিধি অনুসারে আমি কোনো অবৈধ বা নকল পণ্য বিক্রয় করবো না। আবেদনের প্রতিটি তথ্য সত্য।
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Form Footer Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  onClick={prevStep}
                  className="bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 text-xs transition-all active:scale-95 border border-white/5"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </Button>
              ) : (
                <div />
              )}

              {currentStep < steps.length ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  className="bg-[#FF7A00] hover:bg-[#e06b00] text-white font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-orange-500/15 transition-all active:scale-95"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={isSubmitting || !formData.agreeToPolicies || !formData.agreeToCompliance}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
                >
                  {isSubmitting ? 'প্রক্রিয়াধীন...' : 'ইউনিফাইড আবেদন জমা দিন'}
                </Button>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
};
