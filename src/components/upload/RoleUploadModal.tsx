import React, { useState } from 'react';
import { X, Upload, Video, Package, Briefcase, FileText, CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { uploadService, UploadRoleType, UploadMetadata } from '../../services/uploadService';
import { useAuth } from '../../context/AuthContext';

interface RoleUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UploadRoleType;
  onSuccess?: () => void;
}

export const RoleUploadModal: React.FC<RoleUploadModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'product',
  onSuccess
}) => {
  const { user, hasRole } = useAuth();

  const isSellerOrHigher = hasRole("seller") || hasRole("wholesaler") || hasRole("factory") || hasRole("admin") || hasRole("super_admin");
  const isServiceProvider = hasRole("service_provider") || hasRole("admin") || hasRole("super_admin");
  const isContentCreator = hasRole("content_creator") || isSellerOrHigher;

  // Determine initial valid role
  let initialRole = defaultRole;
  if (initialRole === 'product' && !isSellerOrHigher) initialRole = 'demand';
  if (initialRole === 'reel' && !isContentCreator) initialRole = 'demand';
  if (initialRole === 'service' && !isServiceProvider) initialRole = 'demand';

  const [activeTab, setActiveTab] = useState<UploadRoleType>(initialRole);

  React.useEffect(() => {
    if (isOpen) {
      let validRole = defaultRole;
      if (validRole === 'product' && !isSellerOrHigher) validRole = 'demand';
      if (validRole === 'reel' && !isContentCreator) validRole = 'demand';
      if (validRole === 'service' && !isServiceProvider) validRole = 'demand';
      setActiveTab(validRole);
    }
  }, [isOpen, defaultRole, isSellerOrHigher, isContentCreator, isServiceProvider]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [moq, setMoq] = useState('1');
  const [category, setCategory] = useState('General');
  const [location, setLocation] = useState('Dhaka, Bangladesh');
  const [productLink, setProductLink] = useState('');

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg('অনুগ্রহ করে একটি ফাইল বা ভিডিও নির্বাচন করুন / Please select a file or video');
      return;
    }
    if (!title.trim()) {
      setErrorMsg('শিরোনাম লিখুন / Please provide a title');
      return;
    }

    setUploading(true);
    setErrorMsg('');
    setProgress(5);

    try {
      const metadata: UploadMetadata = {
        title: title.trim(),
        description: description.trim(),
        price: price ? parseFloat(price) : undefined,
        moq: moq ? parseInt(moq) : 1,
        category,
        location,
        productLink
      };

      await uploadService.uploadContent(
        selectedFile,
        activeTab,
        metadata,
        (prog) => {
          setProgress(Math.max(10, Math.min(99, Math.round(prog))));
        }
      );

      setProgress(100);
      setCompleted(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        handleReset();
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setTitle('');
    setDescription('');
    setPrice('');
    setMoq('1');
    setUploading(false);
    setProgress(0);
    setCompleted(false);
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Role Content & File Studio
              </h3>
              <p className="text-xs text-zinc-400">
                Firebase Storage & Firestore Sync
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Category Tabs */}
        <div className="flex border-b border-white/10 bg-black/30 px-4 pt-3 gap-2 overflow-x-auto no-scrollbar">
          {isSellerOrHigher && (
            <button
              onClick={() => { setActiveTab('product'); handleReset(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeTab === 'product'
                  ? 'border-[#FF7A00] text-[#FF7A00] bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Package className="w-4 h-4" />
              পণ্য (Product)
            </button>
          )}

          {isContentCreator && (
            <button
              onClick={() => { setActiveTab('reel'); handleReset(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeTab === 'reel'
                  ? 'border-pink-500 text-pink-400 bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Video className="w-4 h-4" />
              ভিডিও / রিলস (Reel)
            </button>
          )}

          {isServiceProvider && (
            <button
              onClick={() => { setActiveTab('service'); handleReset(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
                activeTab === 'service'
                  ? 'border-cyan-400 text-cyan-400 bg-white/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              সার্ভিস পোর্টফোলিও (Service)
            </button>
          )}

          <button
            onClick={() => { setActiveTab('demand'); handleReset(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'demand'
                ? 'border-indigo-400 text-indigo-400 bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            ডিমান্ড পোস্ট (Demand)
          </button>

          <button
            onClick={() => { setActiveTab('vault'); handleReset(); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
              activeTab === 'vault'
                ? 'border-emerald-400 text-emerald-400 bg-white/5'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            ভল্ট ফাইল (Vault File)
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {errorMsg}
            </div>
          )}

          {/* File Drag & Drop Zone */}
          <div className="border-2 border-dashed border-white/15 hover:border-[#FF7A00]/50 rounded-2xl p-6 text-center bg-white/[0.01] hover:bg-white/[0.03] transition-all relative">
            <input 
              type="file" 
              accept={
                activeTab === 'reel' ? 'video/*' : 
                activeTab === 'product' || activeTab === 'service' ? 'image/*,video/*' : 
                '*/*'
              }
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
            />

            {selectedFile ? (
              <div className="space-y-3">
                {activeTab === 'reel' && previewUrl ? (
                  <video src={previewUrl} controls className="max-h-48 mx-auto rounded-xl border border-white/10" />
                ) : selectedFile.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover border border-white/10" />
                ) : (
                  <div className="p-4 rounded-xl bg-white/5 inline-block">
                    <FileText className="w-12 h-12 text-[#FF7A00] mx-auto mb-1" />
                    <p className="text-xs font-bold text-white">{selectedFile.name}</p>
                    <p className="text-[10px] text-zinc-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                )}
                <p className="text-xs text-emerald-400 font-medium">✓ ফাইল সিলেক্ট করা হয়েছে (ক্লিক করে পরিবর্তন করুন)</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">
                  {activeTab === 'reel' ? 'ভিডিও/রিলস ফাইল আপলোড করুন' : 'ফাইল ব্রাউজ করতে এখানে ক্লিক করুন'}
                </h4>
                <p className="text-xs text-zinc-400">
                  {activeTab === 'reel' ? 'MP4, WebM (Max 50MB)' : 'Images, Videos, PDFs, Documents'}
                </p>
              </div>
            )}
          </div>

          {/* Dynamic Form Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                {activeTab === 'reel' ? 'ভিডিও শিরোনাম (Video Title)' : 'শিরোনাম (Title)'} *
              </label>
              <input 
                type="text" 
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="যেমন: প্রিমিয়াম ঢাকাই জামদানি শাড়ি..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF7A00] focus:outline-none"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                বিবরণ (Description)
              </label>
              <textarea 
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="পণ্য বা সার্ভিসের বিস্তারিত..."
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-500 focus:border-[#FF7A00] focus:outline-none resize-none"
              />
            </div>

            {activeTab !== 'vault' && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  মূল্য / রেট (Price ৳)
                </label>
                <input 
                  type="number" 
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="2500"
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
            )}

            {activeTab === 'product' && (
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  সর্বনিম্ন অর্ডার (MOQ)
                </label>
                <input 
                  type="number" 
                  value={moq}
                  onChange={e => setMoq(e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-[#FF7A00] focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                ক্যাটাগরি (Category)
              </label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#FF7A00] focus:outline-none"
              >
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Electronics">Electronics & Gadgets</option>
                <option value="Wholesale">Wholesale & B2B</option>
                <option value="Services">Services & Repairs</option>
                <option value="Grocery">Grocery & Food</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                অবস্থান (Location)
              </label>
              <input 
                type="text" 
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="Dhaka, Bangladesh"
                className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#FF7A00] focus:outline-none"
              />
            </div>
          </div>

          {/* Progress Indicator */}
          {uploading && (
            <div className="space-y-2 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs font-bold text-zinc-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF7A00]" />
                  ফায়ারবেস স্টোরেজে আপলোড হচ্ছে...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FF7A00] to-pink-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          {completed && (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-5 h-5" />
              সফলভাবে আপলোড সম্পন্ন হয়েছে! (Uploaded Successfully)
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              বাতিল (Cancel)
            </button>
            <button
              type="submit"
              disabled={uploading || completed}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              আপলোড ও সেভ করুন
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
