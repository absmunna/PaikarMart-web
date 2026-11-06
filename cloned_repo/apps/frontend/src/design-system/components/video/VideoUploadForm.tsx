import React, { useState } from 'react';
import { 
  Film, Plus, Sparkles, Upload, X, ShoppingBag, 
  Clock, Lock, CheckCircle2, AlertCircle, FileVideo,
  Video, Link2, ExternalLink, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useVideoStore } from '@/modules/video/store/useVideoStore';
import { VideoCategoryType, ProductLinkConfig } from '@/modules/video/types';
import { validateVideoFile, validateVideoDuration } from '@/modules/video/utils/videoValidator';
import { ECOMMERCE_PRODUCTS } from '@/modules/product';

export interface VideoUploadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  variant?: 'iconic-button' | 'inline' | 'floating';
  className?: string;
}

export const VideoUploadForm: React.FC<VideoUploadFormProps> = ({
  onSuccess,
  buttonText = 'ভিডিও আপলোড করুন',
  variant = 'iconic-button',
  className = ''
}) => {
  const { addVideo } = useVideoStore();
  const [isOpen, setIsOpen] = useState(false);

  // 3 Category System
  const [categoryType, setCategoryType] = useState<VideoCategoryType>('creator');

  // Basic Form States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category 2: Product Link States
  const [linkType, setLinkType] = useState<'paikarmart' | 'daraz' | 'amazon' | 'website'>('paikarmart');
  const [selectedPaikarmartProductId, setSelectedPaikarmartProductId] = useState(ECOMMERCE_PRODUCTS[0]?.id.toString() || '1');
  const [externalProductUrl, setExternalProductUrl] = useState('');
  const [externalProductTitle, setExternalProductTitle] = useState('');
  const [externalProductPrice, setExternalProductPrice] = useState('');

  // Category 3: Paid Vlog States
  const [isPaidContent, setIsPaidContent] = useState(false);
  const [priceAmount, setPriceAmount] = useState('20');

  // Video duration state & validation
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [durationFormatted, setDurationFormatted] = useState<string>('');
  const [durationError, setDurationError] = useState<string | null>(null);
  const [aspectRatioWarning, setAspectRatioWarning] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isExternalLink = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch');

  // Handle local file selection with videoValidator utility
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setVideoUrl(fileUrl);

      const result = await validateVideoFile(file, categoryType);
      setDurationSeconds(result.durationSeconds);
      setDurationFormatted(result.formattedDuration);

      if (result.error) {
        setDurationError(result.error);
        toast.error(result.error);
      } else {
        setDurationError(null);
        if (result.warning) {
          setAspectRatioWarning(result.warning);
          toast.info(result.warning);
        } else {
          setAspectRatioWarning(null);
        }
      }
    }
  };

  const handleUrlChange = (urlVal: string) => {
    setVideoUrl(urlVal);
    if (!urlVal) {
      setDurationSeconds(null);
      setDurationError(null);
      return;
    }

    if (urlVal.includes('youtube.com') || urlVal.includes('youtu.be') || urlVal.includes('facebook.com') || urlVal.includes('fb.watch')) {
      const defaultSecs = categoryType === 'creator' ? 120 : categoryType === 'seller_product' ? 45 : 300;
      setDurationSeconds(defaultSecs);
      const check = validateVideoDuration(defaultSecs, categoryType);
      setDurationFormatted(check.formattedDuration);
      setDurationError(check.isValid ? null : check.error || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('ভিডিওর শিরোনাম প্রদান করুন');
      return;
    }

    if (durationError) {
      toast.error(durationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      let productConfig: ProductLinkConfig | undefined;
      let categoryName = 'কনটেন্ট ক্রিয়েটর (৩ মি:)';

      if (categoryType === 'creator') {
        categoryName = 'কনটেন্ট ক্রিয়েটর (৩ মি:)';
      } else if (categoryType === 'seller_product') {
        categoryName = 'প্রোডাক্ট সেলিং (৩০-৬০ সে:)';
        if (linkType === 'paikarmart') {
          const selectedProd = ECOMMERCE_PRODUCTS.find(p => p.id.toString() === selectedPaikarmartProductId);
          productConfig = {
            type: 'paikarmart',
            productId: selectedPaikarmartProductId,
            title: selectedProd?.name || 'পাইকারমার্ট অফিশিয়াল প্রোডাক্ট',
            price: selectedProd?.price || 500,
            image: selectedProd?.image,
            storeName: selectedProd?.sellerName || 'পাইকারমার্ট সেলার'
          };
        } else {
          productConfig = {
            type: linkType,
            url: externalProductUrl || `https://www.${linkType}.com`,
            title: externalProductTitle || `${linkType.toUpperCase()} প্রোডাক্ট`,
            price: externalProductPrice ? Number(externalProductPrice) : 990
          };
        }
      } else if (categoryType === 'vlog_premium') {
        categoryName = 'পার্সোনাল ব্লগ ও পেড শো';
      }

      await addVideo({
        title,
        description: description || 'পাইকারমার্ট স্পেশাল কমার্স ভিডিও',
        categoryType,
        category: categoryName,
        videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800',
        durationSeconds: durationSeconds || 120,
        productLinkConfig: productConfig,
        linkedProductId: linkType === 'paikarmart' ? selectedPaikarmartProductId : undefined,
        isPaidContent: categoryType === 'vlog_premium' ? isPaidContent : false,
        priceAmount: categoryType === 'vlog_premium' && isPaidContent ? Number(priceAmount) : 0,
        tags
      });

      toast.success('ভিডিও সফলভাবে পাইকারমার্ট হাবে আপলোড হয়েছে!');
      setIsOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error('ভিডিও আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {/* ─── MODERN ICONIC BUTTON TRIGGER ─── */}
      {variant === 'iconic-button' && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF7A00] via-rose-500 to-amber-500 text-white font-black text-xs shadow-xl shadow-[#FF7A00]/25 hover:shadow-2xl hover:shadow-[#FF7A00]/40 transition-all cursor-pointer border border-white/20 group overflow-hidden"
        >
          {/* Ambient Glow & Shimmer */}
          <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <span className="p-1 rounded-xl bg-black/20 border border-white/20 text-white group-hover:rotate-12 transition-transform">
            <Film className="w-4 h-4" />
          </span>
          <span className="tracking-tight">{buttonText}</span>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
        </motion.button>
      )}

      {variant === 'floating' && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF7A00] to-rose-600 text-white flex items-center justify-center shadow-2xl shadow-[#FF7A00]/40 border-2 border-white/20 cursor-pointer"
          title="ভিডিও আপলোড করুন"
        >
          <Film className="w-6 h-6" />
        </motion.button>
      )}

      {variant === 'inline' && (
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-bold transition-all cursor-pointer"
        >
          {buttonText}
        </button>
      )}

      {/* ─── UPLOAD MODAL DIALOG ─── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#121424] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar text-white"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="p-3 rounded-2xl bg-gradient-to-tr from-[#FF7A00] to-rose-600 text-white shadow-md border border-white/20">
                    <Film className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>ইনক্লুসিভ কমার্স ভিডিও আপলোড হাব</span>
                      <Sparkles className="w-4 h-4 text-[#FF7A00]" />
                    </h3>
                    <p className="text-xs text-zinc-400">৩টি ক্যাটাগরি মোড ও অটোমেটেড ভিডিও ভ্যালিডেশন</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Category Selector Tabs */}
              <div className="mt-4 space-y-2">
                <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
                  ভিডিও ক্যাটাগরি অপশন নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCategoryType('creator')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      categoryType === 'creator'
                        ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white font-black shadow-lg shadow-[#FF7A00]/15'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-white">🎬 ক্রিয়েটর</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">৩ মিনিট</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">ইউটিউব/ফেসবুক বা ডিরেক্ট ৩ মিনিটের ভিডিও</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryType('seller_product')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      categoryType === 'seller_product'
                        ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white font-black shadow-lg shadow-[#FF7A00]/15'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-white">🛍️ সেলিং</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">৩০-৬০ সে:</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">দারাজ, অ্যামাজন, নিজস্ব ওয়েবসাইট বা পাইকারমার্ট লিংক</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCategoryType('vlog_premium')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      categoryType === 'vlog_premium'
                        ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white font-black shadow-lg shadow-[#FF7A00]/15'
                        : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-black text-xs text-white">⭐ ব্লগ/পেড</span>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">৩-১০ মিনিট</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 leading-tight">ফ্রি বা পেড ব্লগ (৩০ সেকেন্ড ফ্রি প্রিভিউ)</p>
                  </button>
                </div>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">

                {/* CATEGORY 2 CONFIG: Product Links */}
                {categoryType === 'seller_product' && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                    <label className="block text-amber-400 font-black flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4" /> প্রোডাক্ট লিংক নির্বাচন করুন:
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'paikarmart', label: 'পাইকারমার্ট', desc: 'মাই সেলার প্রোডাক্ট' },
                        { id: 'daraz', label: 'Daraz', desc: 'অ্যাফিলিয়েট লিংক' },
                        { id: 'amazon', label: 'Amazon', desc: 'অ্যাফিলিয়েট লিংক' },
                        { id: 'website', label: 'ওয়েবসাইট', desc: 'কাস্টম অনলাইন শপ' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setLinkType(item.id as any)}
                          className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                            linkType === item.id
                              ? 'border-amber-400 bg-amber-400/20 text-white font-black'
                              : 'border-white/10 bg-zinc-900 text-zinc-400'
                          }`}
                        >
                          <span className="block text-xs font-bold">{item.label}</span>
                          <span className="text-[9px] text-zinc-400 block">{item.desc}</span>
                        </button>
                      ))}
                    </div>

                    {linkType === 'paikarmart' ? (
                      <div>
                        <label className="block text-zinc-300 font-bold mb-1">আপনার সেলার একাউন্টের প্রোডাক্ট বাছুন:</label>
                        <select
                          value={selectedPaikarmartProductId}
                          onChange={(e) => setSelectedPaikarmartProductId(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                        >
                          {ECOMMERCE_PRODUCTS.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} - ৳{prod.price} ({prod.sellerName})
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input 
                          type="url"
                          required
                          value={externalProductUrl}
                          onChange={(e) => setExternalProductUrl(e.target.value)}
                          placeholder={`https://www.${linkType}.com/product-link...`}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="text"
                            value={externalProductTitle}
                            onChange={(e) => setExternalProductTitle(e.target.value)}
                            placeholder="প্রোডাক্ট টাইটেল (ঐচ্ছিক)"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                          />
                          <input 
                            type="number"
                            value={externalProductPrice}
                            onChange={(e) => setExternalProductPrice(e.target.value)}
                            placeholder="দাম ৳ (ঐচ্ছিক)"
                            className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CATEGORY 3 CONFIG: Paid Content */}
                {categoryType === 'vlog_premium' && (
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-rose-300 font-black flex items-center gap-1.5">
                        <Lock className="w-4 h-4 text-rose-400" /> ভিডিও প্রাইসিং মোড:
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPaidContent(false)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            !isPaidContent ? 'bg-emerald-500 text-white font-black' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          ফ্রি
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsPaidContent(true)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            isPaidContent ? 'bg-rose-500 text-white font-black' : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          পেড (Pay-to-Watch)
                        </button>
                      </div>
                    </div>

                    {isPaidContent && (
                      <div className="flex items-center justify-between pt-1 border-t border-rose-500/20">
                        <span className="text-zinc-300 font-bold">ভিডিও আনলক ফি (টাকা):</span>
                        <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5">
                          <span className="text-amber-400 font-black">৳</span>
                          <input 
                            type="number"
                            min="5"
                            max="500"
                            value={priceAmount}
                            onChange={(e) => setPriceAmount(e.target.value)}
                            className="w-16 bg-transparent text-white font-black text-xs outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Video Link & File Upload */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-zinc-400 font-bold mb-1">
                      ভিডিও লিংক (ইউটিউব, ফেসবুক বা ডিরেক্ট লিঙ্ক) *
                    </label>
                    <input 
                      type="url" 
                      value={videoUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... বা https://www.facebook.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>

                  <div className="relative text-center my-1">
                    <span className="px-2 text-[10px] font-bold text-zinc-500 bg-[#121424] relative z-10">অথবা সরাসরি আপলোড করুন</span>
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                  </div>

                  <div>
                    <label className="border-2 border-dashed border-white/15 rounded-2xl p-3 text-center bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors cursor-pointer block">
                      <FileVideo className="w-6 h-6 text-[#FF7A00] mx-auto mb-1" />
                      <span className="text-xs font-bold text-white block">
                        {selectedFile ? selectedFile.name : "গ্যালারি/ডিভাইস থেকে ফাইল বাছুন"}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold block mt-0.5">
                        * অ্যাপে সরাসরি ভিডিও ফাইল ১:১ (Square Ratio) স্ক্রিন সাইজে সংরক্ষিত হবে
                      </span>
                      <input 
                        type="file" 
                        accept="video/mp4,video/webm"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">ভিডিওর শিরোনাম (Title) *</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="উদাঃ ইসলামপুর পাইকারি টেক্সটাইলের ঈদ কালেকশন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">বিবরণ (Description)</label>
                  <textarea 
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="ভিডিও কন্টেন্ট ও প্রোডাক্ট পরিচিতি..."
                    className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] resize-none"
                  />
                </div>

                {/* Duration Error Warning */}
                {durationError && (
                  <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{durationError}</span>
                  </div>
                )}

                {/* Action Controls */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold cursor-pointer transition-colors"
                  >
                    বাতিল
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || Boolean(durationError)}
                    className="px-6 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isSubmitting ? 'আপলোড হচ্ছে...' : 'পাবলিশ করুন'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoUploadForm;
